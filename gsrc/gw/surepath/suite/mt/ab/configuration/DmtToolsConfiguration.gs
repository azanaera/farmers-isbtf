package gw.surepath.suite.mt.ab.configuration

uses cvmt.ab.configuration.SchemaConfiguration
uses cvmt.ab.configuration.expimp.ImportConfiguration
uses gw.surepath.ab.cvmt.expimp.cvmt.migration.ContactMigrationBuilder
uses gw.expimp.common.importer.EntityImporter

uses gw.expimp.pmt.migration.Migration


class DmtToolsConfiguration {

  function migration(): Migration {
    return new ContactMigrationBuilder(importer(), new SchemaConfiguration().schema())
         .build();
  }

  function importer(): EntityImporter {
    return new ImportConfiguration().entityImporter()
  }


}
