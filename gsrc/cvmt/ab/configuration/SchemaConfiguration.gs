package cvmt.ab.configuration;

uses cvmt.ab.configuration.expimp.ExportConfiguration
uses gw.entity.IEntityType
uses gw.expimp.common.datamodel.schema.Schema
uses gw.expimp.common.exporter.schema.DiscoverableSchemaExporter
uses gw.lang.reflect.TypeSystem

class SchemaConfiguration {
  private final var discoverableExporter: DiscoverableSchemaExporter;

  construct() {
    var schemaExporter = new ExportConfiguration().schemaExporter();
    discoverableExporter = new DiscoverableSchemaExporter(schemaExporter);
  }

  public function schema(): Schema {
    var listOfRoots = new ArrayList<IEntityType>()
    typekey.ABContact.AllTypeKeys.each(\elt -> listOfRoots.add(TypeSystem.getByFullName("entity." + elt.Code) as IEntityType))
    // Adding ABContactContact as a root and will process by itself as post migration process
    listOfRoots.add(ABContactContact)
    return discoverableExporter.export(listOfRoots.toTypedArray())
  }
}