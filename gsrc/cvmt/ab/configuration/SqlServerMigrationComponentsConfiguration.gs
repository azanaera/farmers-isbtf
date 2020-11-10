package cvmt.ab.configuration;

uses gw.expimp.configuration.factories.BaseMigrationDbApiFactory
uses gw.expimp.datafeed.dbmeta.nameshorteners.NoopNameShortener
uses gw.expimp.dbimpl.sqlserver.SqlServerDbAccessGeneratorsFactory
uses gw.expimp.dbimpl.sqlserver.SqlServerRowMapper
uses gw.expimp.dbimpl.util.FromNamesConstraintNameGenerator
uses gw.expimp.dbimpl.util.FromNamesIndexNameGenerator

class SqlServerMigrationComponentsConfiguration extends DatabaseMigrationComponentsConfiguration {
  private final var dbAccessGeneratorsFactory: SqlServerDbAccessGeneratorsFactory;
  private final var migrationDbApiFactory: BaseMigrationDbApiFactory;

  public construct() {
    dbAccessGeneratorsFactory = new SqlServerDbAccessGeneratorsFactory(
        new FromNamesConstraintNameGenerator(),
        new FromNamesIndexNameGenerator());
    migrationDbApiFactory = new BaseMigrationDbApiFactory(
        dbAccessGeneratorsFactory,
        tableNameMapper(new NoopNameShortener()),
        tableNameMapper(new NoopNameShortener()),
        \selectMeta -> new SqlServerRowMapper(selectMeta),
        DbFieldsRepresentationConfiguration.dbToEntityConvertersRegistry(),
        DbFieldsRepresentationConfiguration.entityToDbFieldParsersRegistry(),
        DbFieldsRepresentationConfiguration.entityToDbTypeCustomMapping());
  }

  public function dbApiFactory(): BaseMigrationDbApiFactory {
    return migrationDbApiFactory;
  }

  public function dbAccessGeneratorsFactory(): SqlServerDbAccessGeneratorsFactory {
    return dbAccessGeneratorsFactory;
  }
}