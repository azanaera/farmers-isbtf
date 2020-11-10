package cvmt.ab.configuration;

uses gw.expimp.configuration.factories.BaseMigrationDbApiFactory
uses gw.expimp.datafeed.dbmeta.nameshorteners.TrimLongestWordsShortener
uses gw.expimp.dbimpl.postgres.PostgresDbAccessGeneratorsFactory
uses gw.expimp.dbimpl.postgres.PostgresRowMapper
uses gw.expimp.dbimpl.util.UuidConstraintNameGenerator
uses gw.expimp.dbimpl.util.UuidIndexNameGenerator

class PostgresMigrationComponentsConfiguration extends DatabaseMigrationComponentsConfiguration {

  private final var migrationDbApiFactory: BaseMigrationDbApiFactory
  private final var dbAccessGeneratorsFactory: PostgresDbAccessGeneratorsFactory

  public construct() {
    dbAccessGeneratorsFactory = new PostgresDbAccessGeneratorsFactory(
        new UuidConstraintNameGenerator(),
        new UuidIndexNameGenerator());
    migrationDbApiFactory = new BaseMigrationDbApiFactory(
        dbAccessGeneratorsFactory,
        tableNameMapper(new TrimLongestWordsShortener(63)),
        tableNameMapper(new TrimLongestWordsShortener(58)),
        \selectMeta -> new PostgresRowMapper(selectMeta),
        DbFieldsRepresentationConfiguration.dbToEntityConvertersRegistry(),
        DbFieldsRepresentationConfiguration.entityToDbFieldParsersRegistry(),
        DbFieldsRepresentationConfiguration.entityToDbTypeCustomMapping());
  }

  public override function dbApiFactory(): BaseMigrationDbApiFactory {
    return migrationDbApiFactory;
  }

  public override function dbAccessGeneratorsFactory(): PostgresDbAccessGeneratorsFactory {
    return dbAccessGeneratorsFactory;
  }
}