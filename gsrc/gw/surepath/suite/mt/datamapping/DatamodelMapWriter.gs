package gw.surepath.suite.mt.datamapping

uses com.google.common.collect.Lists
uses com.guidewire.commons.entity.type.EntityUtil
uses com.guidewire.commons.entity.type2.IEntityPropInfoInternal
uses com.guidewire.commons.metadata.MetadataDependencies
uses com.guidewire.pl.config.PLConfigResourceKeys
uses com.guidewire.pl.system.database.DatabaseDependencies
uses com.guidewire.pl.system.database.datamodel.AbstractStagingColumn
uses com.guidewire.pl.system.database.datamodel.DBStagingTable
uses com.guidewire.pl.system.database.datamodel.DBTable
uses com.guidewire.pl.system.database.datamodel.ForeignKeyStagingColumn
uses com.guidewire.pl.system.database.metadata.DBColumnMetadata
uses com.guidewire.pl.system.database.metadata.TableMetadata
uses com.guidewire.pl.system.internal.InternalMethods
uses com.guidewire.pl.system.util.XMLStringBuilder
uses com.guidewire.pl.system.util.XMLUtil
uses gw.datatype.IDataType
uses gw.entity.IEntityPropertyInfo
uses gw.entity.IEntityType
uses gw.internal.ext.org.apache.commons.collections.CollectionUtils
uses org.apache.commons.lang.ClassUtils

uses java.io.File
uses java.io.StringReader
uses java.io.StringWriter

@SuppressWarnings("HiddenPackageReference")
class DatamodelMapWriter extends AbstractMapWriter {

  private static final var TOP_LEVEL_NODE = "Datamodel"
  private static final var TABLE_NODE = "Table"
  private static final var FIELD_NODE = "Field"
  private var _sequenceNumbers = SequenceNumbers.readFromFileInDir(this.OutputDir)

  public construct(datamappingDir : File) {
    super(datamappingDir)
  }

  public function writeDatamodelMapToXML(outputFile : File) {
    this.writeMappingFile(outputFile, false, false)
  }

  public function writeDatamodelMapToCSV(outputFile : File, split : boolean) {
    this.writeMappingFile(outputFile, true, split)
  }

  private static final var ENTITY_COMPARATOR : Comparator<IEntityType> = \t1, t2 -> t1.getRelativeName().compareTo(t2.getRelativeName())

  private static final var FIELD_COMPARATOR : Comparator<IEntityPropertyInfo> = \fd1, fd2 -> fd1.getName().compareTo(fd2.getName())

  private static final var TABLE_COMPARATOR : Comparator<TableMetadata> = \t1, t2 -> t1.getTableName().compareTo(t2.getTableName())

  private static final var STAGING_COLUMN_COMPARATOR : Comparator<AbstractStagingColumn> = \c1, c2 -> c1.getName().compareTo(c2.getName())

  protected function transformMappingToCSV(mappingString : String) : StringWriter {
    var stringWriter = new StringWriter()
    var sr = new StringReader(mappingString)
    var xsltFile = PLConfigResourceKeys.DATA_MAPPING_TOGETHER.getFile()
    try {
      XMLUtil.applyXSLTTransformation(sr, xsltFile, stringWriter)
    } finally {
      stringWriter.close()
    }
    return stringWriter
  }

  protected function  constructMapXMLString(escapeForCSV : boolean) : String {
    var xmlBuilder = new XMLStringBuilder()
    xmlBuilder.setEscapeForCSV(escapeForCSV)
    xmlBuilder.startXMLNode("Datamodel", true)
    var it : Iterator = this.AndSortClassData
    while(it.hasNext()) {
      this.writeTableData(it.next() as IEntityType, xmlBuilder)
    }
    var it2 : Iterator = this.AndSortTables
    while(it2.hasNext()) {
      var td = it2.next() as TableMetadata
      var dbTable = new DBTable(td)
      if(dbTable.getStagingTable() != null) {
        this.writeStagingTableData(td.getEntityName(), dbTable.getStagingTable(), xmlBuilder)
      }
    }

    xmlBuilder.closeXMLNode("Datamodel")
    return xmlBuilder.toString()
    }


  private property get AndSortClassData() : Iterator<IEntityType> {
    var classDataList : ArrayList = new ArrayList()
    var var2 : Iterator = MetadataDependencies.getIntrinsicTypeFactory().getAllEntityTypes().iterator()

    while (var2.hasNext()) {
      var iEntityType = var2.next() as IEntityType
      if (InternalMethods.asIEntityTypeInternal(iEntityType).isPersistent()) {
        classDataList.add(iEntityType)
      }
    }
    Collections.sort(classDataList, ENTITY_COMPARATOR)
    return classDataList.iterator() as Iterator<IEntityType>
  }

  private function writeTableData(cd : IEntityType, xmlBuilder : XMLStringBuilder) {
    var attributes = new HashMap()
    attributes.put("tableName", TableMetadata.getTableName(cd))
    attributes.put("entityName", cd.getRelativeName())
    xmlBuilder.startXMLNode("Table", attributes, true)
    var it : Iterator = this.getAndSortFieldData(cd)

    while(it.hasNext()) {
      var fd = InternalMethods.asIEntityPropInfoInternal(it.next() as IEntityPropertyInfo)
      this.writeFieldData(cd, fd, xmlBuilder)
    }

    xmlBuilder.closeXMLNode("Table")
  }

  private function writeStagingTableData(entityName : String, table : DBStagingTable, xmlBuilder : XMLStringBuilder) {
    var attributes = new HashMap()
    attributes.put("tableName", table.getName())
    attributes.put("entityName", entityName + " Staging Table")
    xmlBuilder.startXMLNode("Table", attributes, true)
    var allColumns = this.sortStagingColumns(table.getAllColumns())
    //var var6 : AbstractStagingColumn[] = allColumns
    //var var7 = allColumns.length
    //for(var var8 = 0, var8 < var7, ++var8) {
    //  var allColumn : AbstractStagingColumn = var6[var8]
    for(allColumn in allColumns) {
      if(allColumn.isPhysicalColumn()) {
        this.writeStagingTableColumn(allColumn, table.getName(), xmlBuilder)
      }
    }
    xmlBuilder.closeXMLNode("Table")
  }

  private function getAndSortFieldData(cd : IEntityType) : Iterator {
      var fieldList = Lists.newArrayList(EntityUtil.getEntityProperties(cd))
      CollectionUtils.filter(fieldList, \o -> InternalMethods.asIEntityPropInfoInternal(o as IEntityPropertyInfo).isColumnInDb())
    Collections.sort(fieldList, FIELD_COMPARATOR)
    return fieldList.iterator()
  }

  private property get AndSortTables() : Iterator<TableMetadata> {
    var classDataList = new ArrayList<TableMetadata>()
    var var2 : Iterator = DatabaseDependencies.getTableMetadataFactory().getPersistentTables().iterator()
    while (var2.hasNext()) {
      var tableMetadata = var2.next() as TableMetadata
      classDataList.add(tableMetadata)
    }
    Collections.sort(classDataList, TABLE_COMPARATOR)
    return classDataList.iterator()
  }

  private function  sortStagingColumns(columns : AbstractStagingColumn[]) : AbstractStagingColumn[] {
    var sortedList = new ArrayList(Arrays.asList(columns))
    Collections.sort(sortedList, STAGING_COLUMN_COMPARATOR)
    return sortedList.toArray(new AbstractStagingColumn[sortedList.size()]) as AbstractStagingColumn[]
  }

  private function writeFieldData(entity : IEntityType, fd : IEntityPropInfoInternal, xmlBuilder : XMLStringBuilder) {
      xmlBuilder.startXMLNode("Field", true)
      var fieldReference = DBFieldReference.createReferenceByField(entity, fd)
      var tableName = TableMetadata.getTableName(entity)
      xmlBuilder.addXMLNode("Table", tableName)
      xmlBuilder.addXMLNode("Name", DBColumnMetadata.getColumn(fd).getColumnName())
      xmlBuilder.addXMLNode("JavaFieldType", fieldReference.JavaFieldTypeName)
      xmlBuilder.addXMLNode("ADTFieldType", fieldReference.getADTFieldTypeName(true))
      xmlBuilder.addXMLNode("ADTFieldTypeShort", fieldReference.getADTFieldTypeName(false))
      xmlBuilder.addXMLNode("ADTFieldLength", fieldReference.ADTFieldLengthString)
      xmlBuilder.addXMLNode("ADTFieldPrecision", fieldReference.ADTFieldPrecisionString)
      xmlBuilder.addXMLNode("ADTFieldScale", fieldReference.ADTFieldScaleString)
      xmlBuilder.addXMLNode("ADTFieldTypeList", fieldReference.ADTFieldTypeListName)
      xmlBuilder.addXMLNode("ADTFieldFKEntity", fieldReference.ADTFieldFKEntity)
      xmlBuilder.addXMLNode("ADTFieldArrayEntity", fieldReference.ADTFieldArrayEntity)
      xmlBuilder.addXMLNode("IsExtension", Boolean.toString(fd.isExtension()))
      xmlBuilder.addXMLNode("IsSubtypeField", Boolean.toString(fd.getOwnersType_Entity().getSupertype_Entity() != null))
      if(fd.getDefaultValue() != null) {
        xmlBuilder.addXMLNode("DefaultValue", fd.getDefaultValue().toString())
      }
      xmlBuilder.addXMLNode("IsNullable", Boolean.toString(fd.allowNullValue()))
      xmlBuilder.addXMLNode("IsImportable", Boolean.toString(fd.isImportable()))
      xmlBuilder.addXMLNode("IsExportable", Boolean.toString(fd.isExportable()))
      xmlBuilder.addXMLNode("Description", fd.getDescription_Entity())
      xmlBuilder.addXMLNode("SequenceNumber", this._sequenceNumbers.getSequenceNumberForField(entity, fd).toString())
      xmlBuilder.closeXMLNode("Field")
    }

  private function writeStagingTableColumn(column : AbstractStagingColumn, tableName : String, xmlBuilder : XMLStringBuilder) {
    xmlBuilder.startXMLNode("Field", true)
    xmlBuilder.addXMLNode("Table", tableName)
    xmlBuilder.addXMLNode("Name", column.getName())
    xmlBuilder.addXMLNode("ADTFieldType", this.getADTFieldTypeName(column.getDataType()))
    xmlBuilder.addXMLNode("ADTFieldTypeShort", this.getADTFieldTypeName(column.getDataType()))
    xmlBuilder.addXMLNode("ADTFieldLength", this.getADTFieldLengthString(column.getDataType()))
    xmlBuilder.addXMLNode("ADTFieldPrecision", this.getADTFieldPrecisionString(column.getDataType()))
    xmlBuilder.addXMLNode("ADTFieldScale", this.getADTFieldScaleString(column.getDataType()))
    var typeListName = column.getAssociatedTypeList() == null?"":column.getAssociatedTypeList().getRelativeName()
    xmlBuilder.addXMLNode("ADTFieldTypeList", typeListName)
    var fkEntityName = column typeis ForeignKeyStagingColumn ? (column as ForeignKeyStagingColumn).getForeignEntityClassData().getRelativeName() : ""
    xmlBuilder.addXMLNode("ADTFieldFKEntity", fkEntityName)
    var isExtension = column.getSourceColumn() != null && column.getSourceColumn().isExtension()
    xmlBuilder.addXMLNode("IsExtension", Boolean.toString(isExtension))
    var isSubtypeField = column.getSourceColumn() != null && column.getSourceColumn().isOnSubtype()
    xmlBuilder.addXMLNode("IsSubtypeField", Boolean.toString(isSubtypeField))
    if(column.getDefaultValue() != null) {
      xmlBuilder.addXMLNode("DefaultValue", column.getDefaultValue().toString())
    }
    xmlBuilder.addXMLNode("IsNullable", Boolean.toString(column.areNullValuesAllowed()))
    xmlBuilder.closeXMLNode("Field")
  }

  private function getADTFieldTypeName(dataType : IDataType) : String {
    var className = ClassUtils.getShortClassName(dataType.getClass())
    if(className.endsWith("DataType")) {
      className = className.substring(0, className.length() - 8)
    }
    if(className.startsWith("ColumnSpecific")) {
      className = className.substring("ColumnSpecific".length())
    }
    return className
  }

  public function getADTFieldLengthString(dataType : IDataType) : String {
    return dataType.asPersistentDataType().isCharacterBased()?"" + dataType.asPersistentDataType().getLength():""
  }

  public function getADTFieldPrecisionString(dataType : IDataType) : String {
    return dataType.asPersistentDataType().isDecimalBased()?"" + dataType.asPersistentDataType().getPrecision():""
  }

  public function getADTFieldScaleString(dataType : IDataType) : String {
    return dataType.asPersistentDataType().isDecimalBased()?"" + dataType.asPersistentDataType().getScale():""
  }

}