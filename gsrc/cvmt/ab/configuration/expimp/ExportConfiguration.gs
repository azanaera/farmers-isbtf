package cvmt.ab.configuration.expimp;

uses gw.expimp.common.configurer.ExportConfigurer
uses gw.expimp.common.exporter.entity.EntityExporter
uses gw.expimp.common.exporter.schema.SchemaExporter

final class ExportConfiguration {
  private final var configurer = new ExportConfigurer();

  construct() {
    BaseExportConfiguration.applyOn(configurer);
  }

  public function schemaExporter(): SchemaExporter {
    return configurer.schemaExporter();
  }

  public function entityExporter(): EntityExporter {
    return configurer.entityExporter();
  }
}