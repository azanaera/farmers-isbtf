package gw.surepath.suite.mt.csvgenerator.dbimpl.csv.meta

uses gw.datatype.GWJdbcType
uses gw.expimp.common.datamodel.schema.Dictionary
uses gw.expimp.common.datamodel.schema.EntityDefinition
uses gw.expimp.common.datamodel.schema.FieldDefinition
uses gw.expimp.common.datamodel.schema.ForeignKeyDefinition
uses gw.expimp.common.datamodel.schema.Schema
uses gw.expimp.datafeed.dbmeta.NameShortener
uses gw.expimp.datafeed.dbmeta.SchemaColumns
uses gw.expimp.dbaccess.query.Column
uses gw.expimp.dbaccess.query.CommonColumns
uses gw.surepath.suite.mt.csvgenerator.dbimpl.csv.CSVColumn
uses gw.surepath.suite.mt.csvgenerator.dbimpl.csv.EntityDefinitionComparator

class SchemaToCSVMetaConverter {

  private static final var TYPE_SUFIX = "_Type"

  private final var nameShortener: NameShortener
  private final var fkNameShortener: NameShortener

  construct(_nameShortener: NameShortener,
            _fkNameShortener: NameShortener) {
    nameShortener = _nameShortener
    fkNameShortener = _fkNameShortener
  }

  function create(schema: Schema): List<CSVMetadata> {
    var tables = new LinkedList<CSVMetadata>()

    var multiParentEntitiesByType = groupEntitiesWithMiltipleParents(schema.Entities)
    var sortedDistinctEntities = sortedEntities(skipSameEntityTypes(schema.Entities))
    for (var entity in sortedDistinctEntities) {
      tables.add(createTableMeta(entity, multiParentEntitiesByType.get(entity.RelativeType), schema))
    }

    return tables
  }

  private function groupEntitiesWithMiltipleParents(entities : Set<EntityDefinition>): Map<String, Set<EntityDefinition>> {
    var multiParentEntitiesByType = entities.partition(\entity -> entity.RelativeType)
    multiParentEntitiesByType.retainWhereValues(\_entities -> _entities.size() > 1)
    return multiParentEntitiesByType
  }

  private function createTableMeta(entity: EntityDefinition, definitionsOfSameType: Set<EntityDefinition>, schema: Schema): CSVMetadata {
    var columns = columnsWithIdColumn()
    columns.addAll(tableMetaForParent(entity, definitionsOfSameType))
    columns.addAll(tableMetaForFields(entity, schema))
    columns.addAll(tableMetaForFks(entity))
    columns.add(payloadIdColumn())

    return new CSVMetadata(shorten(entity.RelativeType), columns)
  }

  private function shorten(string: String): String {
    return nameShortener.generate(string)
  }

  private function columnsWithIdColumn(): List<CSVColumn> {
    var fields = new LinkedList<CSVColumn>()
    fields.add(primaryKeyColumn())
    return fields
  }

  private function tableMetaForParent(entity: EntityDefinition, definitionsOfSameType: Set<EntityDefinition>): List<CSVColumn> {
    var columns = new LinkedList<CSVColumn>()
    if (entity.ParentRelativeType != null) {
      if (definitionsOfSameType != null) {
        columns.add(parentColumn())
        columns.add(parentTypeColumn(allowedValuesForParentType(definitionsOfSameType)))
      } else {
        columns.add(parentColumn(shorten(entity.ParentRelativeType)))
      }
    }
    return columns
  }

  private function tableMetaForFields(entity: EntityDefinition, schema: Schema): List<CSVColumn> {
    return entity.Fields.map(fieldToColumn(schema))
  }

  private function tableMetaForFks(entity: EntityDefinition): List<CSVColumn> {
    var columns = entity.ForeignKeys.map(fkToColumn())
    columns.addAll(entity.ForeignKeys
        .where(\fk -> fk.Types.size() > 1)
        .map(fkTypeToColumn())
    )
    return columns
  }

  private function allowedValuesForParentType(definitionsOfSameType: Set<EntityDefinition>): List<String> {
    return definitionsOfSameType.map(\definition -> definition.ParentRelativeType)
  }

  private function fieldToColumn(schema: Schema): block(FieldDefinition): CSVColumn {
    return \field ->
        {
          var dbType = field.DbType
          var lenght = field.Length
          if (field.TypeKey) {
            // BB:debug here to see typekey
            dbType = GWJdbcType.VARCHAR.toJDBCType().Name
            lenght = maxLengthOfTypekeyCode(findDictionaryForType(schema, field.RelativeType))
          }

          var columnBuilder = Column.newColumn(shorten(field.Name))
              .withType(dbType)
              .withLength(lenght)
              .withPrecisionAndScale(field.Precision, field.Scale)
          if (!field.Nullable) {
            columnBuilder.notNull()
          }

          var _CSVColumnBuilder = CSVColumn.newColumn(columnBuilder.create())
          if (field.TypeKey) {
            _CSVColumnBuilder.withTypekeyName(field.RelativeType)
          }
          return _CSVColumnBuilder.create()
        }
  }

  private function fkToColumn(): block(ForeignKeyDefinition): CSVColumn {
    return \fk -> {

      var columnBuilder = Column.newColumn(shortenFk(fk.Name))
          .withType(GWJdbcType.VARCHAR.toJDBCType())
          .withLength(100)

      return CSVColumn.newColumn(columnBuilder.create()).withSingleFK(fk.Types.size() == 1 ? shorten(fk.RelativeTypes.first())
          : "FK to the table specified in the ${shortenFk(fk.Name)}_Type column").create()
    }
  }

  private function fkTypeToColumn(): block(ForeignKeyDefinition): CSVColumn {
    return \fk -> {

      var columnBuilder = Column.newColumn(shortenFk(fk.Name) + TYPE_SUFIX)
          .withType(GWJdbcType.VARCHAR.toJDBCType())
          .withLength(30)
          .withAllowedValues(fk.RelativeTypes.map(\type -> shorten(type)).sort())
      return CSVColumn.newColumn(columnBuilder.create()).withMultipleFK(fk.RelativeTypes.map(\type -> shorten(type)).sort().join(" , ")).create()
    }
  }

  private function shortenFk(string: String): String {
    return fkNameShortener.generate(string)
  }

  private function findDictionaryForType(schema: Schema, type: String): Dictionary {
    return schema.Dictionaries.firstWhere(\dictionary -> dictionary.RelativeType == type)
  }

  private function maxLengthOfTypekeyCode(dictionary: Dictionary): int {
    return dictionary.Values.HasElements
        ? dictionary.Values.map(\val -> val.length()).max()
        : 1
  }

  private function skipSameEntityTypes(entities: Set<EntityDefinition>): Set<EntityDefinition> {
    return entities
        .partition(\entity -> entity.RelativeType)
        .mapValues(\value -> value.first())
        .values()
        .toSet()
  }

  private function sortedEntities(entityDefinitions: Collection<EntityDefinition>): Collection<EntityDefinition> {
    var sorted = new TreeSet<EntityDefinition>(entityDefinitionComparator())
    sorted.addAll(entityDefinitions)
    return sorted
  }

  private function entityDefinitionComparator(): Comparator<EntityDefinition> {
    return new EntityDefinitionComparator();
  }

  private function primaryKeyColumn(): CSVColumn {
    var columnBuilder = Column.newColumn(SchemaColumns.ID)
        .primaryKey()
        .withType(GWJdbcType.VARCHAR.toJDBCType())
        .withLength(100)
    return CSVColumn.newColumn(columnBuilder.create()).create()
  }

  private function parentColumn(): CSVColumn {
    var columnBuilder = Column.newColumn(SchemaColumns.PARENT)
        .withType(GWJdbcType.VARCHAR.toJDBCType())
        .withLength(100)

    return CSVColumn.newColumn(columnBuilder.create()).withSingleFK("FK to the table specified in PMT_Parent_Type column").create()
  }

  private function parentColumn(comment: String): CSVColumn {
    var columnBuilder = Column.newColumn(SchemaColumns.PARENT)
        .withType(GWJdbcType.VARCHAR.toJDBCType())
        .withLength(100)

    return CSVColumn.newColumn(columnBuilder.create()).withSingleFK(comment).create()
  }

  private function parentTypeColumn(allowedValues: List<String>): CSVColumn {
    var columnBuilder = Column.newColumn(SchemaColumns.PARENT_TYPE)
        .withType(GWJdbcType.VARCHAR.toJDBCType())
        .withLength(30)
        .withAllowedValues(allowedValues.map(\type -> shorten(type)).sort())

    return CSVColumn.newColumn(columnBuilder.create()).withMultipleFK(allowedValues.map(\type -> shorten(type)).sort().join(", ")).create()
  }

  private function payloadIdColumn(): CSVColumn {
    return CSVColumn.newColumn(Column.newColumn(CommonColumns.PAYLOAD_ID)
        .notNull()
        .withType(GWJdbcType.VARCHAR.toJDBCType())
        .withLength(256).create()).create()
  }
}