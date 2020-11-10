package gw.surepath.suite.mt

uses cvmt.ab.configuration.OracleMigrationComponentsConfiguration
uses cvmt.ab.configuration.PostgresMigrationComponentsConfiguration
uses cvmt.ab.configuration.SchemaConfiguration
uses cvmt.ab.configuration.SqlServerMigrationComponentsConfiguration
uses gw.surepath.ab.cvmt.expimp.cvmt.ConverterWithReservedKeywords
uses gw.expimp.common.datamodel.schema.Schema
uses gw.expimp.configuration.factories.BaseMigrationDbApiFactory
uses gw.expimp.datafeed.dbmeta.NameShortener
uses gw.expimp.datafeed.dbmeta.nameshorteners.NoopNameShortener
uses gw.expimp.datafeed.dbmeta.nameshorteners.TrimLongestWordsShortener
uses gw.surepath.suite.mt.csvgenerator.dbimpl.csv.meta.CSVMetadata
uses gw.surepath.suite.mt.csvgenerator.dbimpl.csv.meta.SchemaToCSVMetaConverter


/**
 *  contains common functions for PMT migration tools
 */
class CommonUtil {

  enum DBFlavor {_ORACLE, _POSTGRES, _SQLSERVER}


  /**
   * Get either OOB Schema or cutomized schema.
   *
   * @return gw.expimp.common.datamodel.schema.Schema
   */
  static property get Schema() : Schema {
    var schema = new SchemaConfiguration().schema()
    return schema
  }


  static property get CSVMetadata() : List<CSVMetadata> {

    switch (whichDB()) {
      case _ORACLE:
        return new SchemaToCSVMetaConverter(tableNameMapper(new TrimLongestWordsShortener(30)),
            tableNameMapper(new TrimLongestWordsShortener(25))).create(Schema)
      case _SQLSERVER:
        return new SchemaToCSVMetaConverter(tableNameMapper(new NoopNameShortener()),
            tableNameMapper(new NoopNameShortener())).create(Schema)
      case _POSTGRES:
        return new SchemaToCSVMetaConverter(tableNameMapper(new TrimLongestWordsShortener(63)),
            tableNameMapper(new TrimLongestWordsShortener(58))).create(Schema)
    }

  }

  protected static function tableNameMapper(nameShortener: NameShortener): ConverterWithReservedKeywords {
    return new ConverterWithReservedKeywords(nameShortener, { "Group", "User"});

  }

  /**
   * Determines the RDBMS that this PMT is configured against.
   * @return DBFlavor - a custom Enum value
   */
  static function whichDB() : DBFlavor {
    var className = gw.expimp.properties.PropertiesProviderHolder.INSTANCE.getPropertiesProvider().getProperty("gw.cvmt.migration_components_configuration.classname")

    if(className.contains("SqlServer")) {
      return DBFlavor._SQLSERVER
    }
    else if (className.contains("Oracle")) {
      return DBFlavor._ORACLE
    }
    else if (className.contains("Postgres")) {
      return DBFlavor._POSTGRES
    }
    else {
      return  null
    }
  }

  /**
   * Based on currently configured RDBMS, gets the appropriate MigrationDbApiFactory
   *
   * @return MigrationDbApiFactory
   */
  static property get DbApiFactory() : BaseMigrationDbApiFactory {
    switch (whichDB()) {
      case _POSTGRES:
        return new PostgresMigrationComponentsConfiguration().dbApiFactory()
      case _SQLSERVER:
        return new SqlServerMigrationComponentsConfiguration().dbApiFactory()
      case _ORACLE:
        return new OracleMigrationComponentsConfiguration().dbApiFactory()
      default:
        return null
    }
  }

}