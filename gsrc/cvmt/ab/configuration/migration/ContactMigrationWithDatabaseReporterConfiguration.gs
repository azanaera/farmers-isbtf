package cvmt.ab.configuration.migration;

uses cvmt.ab.configuration.SchemaConfiguration
uses cvmt.ab.configuration.expimp.ExportConfiguration
uses cvmt.ab.configuration.expimp.ImportConfiguration
uses gw.surepath.ab.cvmt.expimp.cvmt.migration.ContactMigrationBuilder
uses gw.surepath.ab.cvmt.expimp.cvmt.migration.ContactMigration
uses gw.expimp.common.exporter.entity.EntityExporter
uses gw.expimp.common.importer.EntityImporter
uses gw.expimp.interfaceaccess.Writer
uses gw.expimp.pmt.migration.MigrationStep
uses gw.expimp.pmt.migration.StepContext
uses gw.expimp.pmt.migration.reporter.DatabasePayloadReporter
uses gw.expimp.pmt.migration.step.ExportBeans

class ContactMigrationWithDatabaseReporterConfiguration {
  private final var outputWriter: Writer;

  construct(_outputWriter: Writer) {
    this.outputWriter = _outputWriter;
  }

  public function migration(): ContactMigration {
    return new ContactMigrationBuilder(importer(), new SchemaConfiguration().schema())
        .addStepAfterCommit(exportBeans())
        .build();
  }

  private function importer(): EntityImporter {
    return new ImportConfiguration().entityImporter();
  }

  private function exportBeans(): MigrationStep<StepContext> {
    return new ExportBeans(new DatabasePayloadReporter(outputWriter), entityExporter());
  }

  private function entityExporter(): EntityExporter {
    return new ExportConfiguration().entityExporter();
  }
}