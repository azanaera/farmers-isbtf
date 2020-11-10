package cvmt.ab.configuration.dbinterface;

uses gw.expimp.configuration.DataSourceFactoriesConfiguration
uses gw.expimp.dbaccess.DataSourceFactory
uses gw.expimp.dbaccess.jndidatasource.JndiDataSourceFactory
uses gw.expimp.properties.PropertiesProviderHolder

class JndiDataSourceConfiguration implements DataSourceFactoriesConfiguration
{
    private final var inputDataSourceFactory: DataSourceFactory
  private final var outputDataSourceFactory: DataSourceFactory

  construct() {
    var propertiesProvider = PropertiesProviderHolder.INSTANCE.getPropertiesProvider();

    inputDataSourceFactory = new JndiDataSourceFactory(propertiesProvider.getProperty("gw.cvmt.db.input.jndi"));
    outputDataSourceFactory = new JndiDataSourceFactory(propertiesProvider.getProperty("gw.cvmt.db.output.jndi"));
  }

  override function inputDataSourceFactory(): DataSourceFactory {
    return inputDataSourceFactory
  }

  override function outputDataSourceFactory(): DataSourceFactory {
    return outputDataSourceFactory
  }
}