package cvmt.ab.configuration.dbinterface;

uses gw.surepath.ab.cvmt.expimp.dbaccess.embededdatasource.CvmtInputDbConnectionProperties
uses gw.surepath.ab.cvmt.expimp.dbaccess.embededdatasource.CvmtOutputDbConnectionProperties
uses gw.expimp.configuration.DataSourceFactoriesConfiguration
uses gw.expimp.configuration.PropertiesConfiguration
uses gw.expimp.dbaccess.DataSourceFactory
uses gw.expimp.dbaccess.embededdatasource.DbConnectionProperties
uses gw.expimp.dbaccess.embededdatasource.EmbeddedDataSourceFactory
uses gw.expimp.properties.PropertiesProvider
uses gw.expimp.properties.PropertiesProviderHolder

class EmbeddedDataSourceConfiguration implements DataSourceFactoriesConfiguration {
  private final var propertiesProvider: PropertiesProvider;

  construct() {
    var propertiesConfiguration = new PropertiesConfiguration();
    propertiesProvider = PropertiesProviderHolder.INSTANCE.getPropertiesProvider();
  }

  override function inputDataSourceFactory(): DataSourceFactory {
    return new EmbeddedDataSourceFactory(inputDbConnectionProperties())
  }

  override function outputDataSourceFactory(): DataSourceFactory {
    return new EmbeddedDataSourceFactory(outputDbConnectionProperties())
  }

  function inputDbConnectionProperties(): DbConnectionProperties {
    return new CvmtInputDbConnectionProperties(propertiesProvider)
  }

  function outputDbConnectionProperties(): DbConnectionProperties {
    return new CvmtOutputDbConnectionProperties(propertiesProvider)
  }
}