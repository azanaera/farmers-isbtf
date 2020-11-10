package cvmt.ab.configuration;

uses gw.expimp.configuration.factories.*;
uses gw.expimp.datafeed.dbmeta.nameshorteners.*;
uses gw.expimp.dbimpl.oracle.*;
uses gw.expimp.dbimpl.util.*;


class OracleMigrationComponentsConfiguration extends DatabaseMigrationComponentsConfiguration
{
    private final var dbAccessGeneratorsFactory: OracleDbAccessGeneratorsFactory;
    private final var migrationDbApiFactory: BaseMigrationDbApiFactory;

    public construct()
    {
        dbAccessGeneratorsFactory = new OracleDbAccessGeneratorsFactory(
            new UuidConstraintNameGenerator(),
            new UuidIndexNameGenerator());
        migrationDbApiFactory = new BaseMigrationDbApiFactory(
            dbAccessGeneratorsFactory,
            tableNameMapper(new TrimLongestWordsShortener(30)),
            tableNameMapper(new TrimLongestWordsShortener(25)),
            \selectMeta -> new OracleRowMapper(selectMeta),
            DbFieldsRepresentationConfiguration.dbToEntityConvertersRegistry(),
            DbFieldsRepresentationConfiguration.entityToDbFieldParsersRegistry(),
            DbFieldsRepresentationConfiguration.entityToDbTypeCustomMapping());
    }

    public override function dbApiFactory(): BaseMigrationDbApiFactory
    {
        return migrationDbApiFactory;
    }

    public override function dbAccessGeneratorsFactory(): OracleDbAccessGeneratorsFactory
    {
        return dbAccessGeneratorsFactory;
    }
}