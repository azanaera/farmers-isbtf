package cvmt.ab.configuration;

uses cvmt.ab.configuration.migration.ContactAssociationMigrationWithDatabaseReporterConfiguration
uses cvmt.ab.configuration.migration.ContactMigrationWithDatabaseReporterConfiguration
uses gw.surepath.ab.cvmt.expimp.cvmt.ConverterWithReservedKeywords
uses gw.surepath.ab.cvmt.expimp.cvmt.migration.ContactOrContactAssociation
uses gw.surepath.ab.cvmt.expimp.workorchestration.IsPayloadWithContactMigrated
uses gw.expimp.configuration.DatabaseInterfaceConfiguration
uses gw.expimp.configuration.MigrationComponentsConfiguration
uses gw.expimp.configuration.factories.BaseMigrationDbApiFactory
uses gw.expimp.datafeed.DatabaseInputDbApi
uses gw.expimp.datafeed.DatabaseOutputDbApi
uses gw.expimp.datafeed.dbmeta.NameShortener
uses gw.expimp.dbaccess.DataSourceFactory
uses gw.expimp.dbinterfacefacade.DatabaseInterfaceFacade
uses gw.expimp.interfacemanipulation.Generator
uses gw.expimp.pmt.migration.Migration
uses gw.expimp.schemaconsistency.SchemaConsistencyChecker
uses gw.expimp.workorchestration.MigrationComponents
uses gw.expimp.workorchestration.ShouldRetryWorkItemOnException
uses gw.expimp.workorchestration.dbpayloadprovider.PayloadStatusRepository
uses gw.expimp.workorchestration.statusreporter.DatabaseMigrationStatusRepository

@SuppressWarnings("AbstractClassNaming")
public abstract class DatabaseMigrationComponentsConfiguration implements MigrationComponentsConfiguration, DatabaseInterfaceConfiguration {
  private final var schema = new SchemaConfiguration().schema();

  public final override function migrationComponents(
      inputDataSourceFactory: DataSourceFactory,
      outputDataSourceFactory: DataSourceFactory): MigrationComponents {
    return new MigrationComponents(
        migration(outputDataSourceFactory),
        shouldExceptionRetryWorkItem(),
        payloadStatusRepository(inputDataSourceFactory),
        migrationStatusRepository(outputDataSourceFactory),
        inputDbApi(inputDataSourceFactory),
        schemaConsistencyChecker(inputDataSourceFactory),
        new IsPayloadWithContactMigrated());
  }


  public final override function databaseInterfaceFacade(
      inputDataSourceFactory: DataSourceFactory,
      outputDataSourceFactory: DataSourceFactory): DatabaseInterfaceFacade {
    var dbApiFactory = dbApiFactory();
    var migrationStatusRepository =
        migrationStatusRepository(outputDataSourceFactory);

    var inputMigrationDbApi = inputDbApi(inputDataSourceFactory);
    var outputMigrationDbApi = outputDbApi(outputDataSourceFactory);

    var fullOutputSchema = schema.merge(dbApiFactory.schemaFrom({migrationStatusRepository}));
    var outputFacadeToRead = dbApiFactory.outputMigrationDbApi(outputDataSourceFactory,
        fullOutputSchema);

    return new DatabaseInterfaceFacade(
        inputMigrationDbApi,
        outputFacadeToRead,
        inputMigrationDbApi,
        outputMigrationDbApi,
        payloadStatusRepository(inputDataSourceFactory),
        migrationStatusRepository,
        dbApiFactory.schemaIntegrityChecker(schema),
        inputMigrationDbApi,
        outputMigrationDbApi,
        new Generator[]{
            inputMigrationDbApi,
            outputMigrationDbApi,
            dbApiFactory.schemaRepository(inputDataSourceFactory, schema),
            migrationStatusRepository
        },
        fullOutputSchema,
        schema);
  }

  public abstract function dbApiFactory(): BaseMigrationDbApiFactory;

  private function migration(outputDataSourceFactory: DataSourceFactory): Migration {
    return new ContactOrContactAssociation(new ContactMigrationWithDatabaseReporterConfiguration(outputDbApi(
        outputDataSourceFactory)).migration(), (new ContactAssociationMigrationWithDatabaseReporterConfiguration(outputDbApi(
        outputDataSourceFactory)).migration())) ;
  }

  protected final function outputDbApi(outputDataSourceFactory: DataSourceFactory): DatabaseOutputDbApi {
    return dbApiFactory().outputMigrationDbApi(outputDataSourceFactory, schema);
  }

  private function inputDbApi(inputDataSourceFactory: DataSourceFactory): DatabaseInputDbApi {
    return dbApiFactory().inputMigrationDbApi(inputDataSourceFactory, schema);
  }

  private function shouldExceptionRetryWorkItem(): ShouldRetryWorkItemOnException {
    return new DefaultShouldRetryWorkItemOnExceptionRules() as ShouldRetryWorkItemOnException;
  }

  private function payloadStatusRepository(inputDataSourceFactory: DataSourceFactory): PayloadStatusRepository {
    return dbApiFactory().payloadStatusRepository(inputDataSourceFactory, schema);
  }

  private function migrationStatusRepository(outputDataSourceFactory: DataSourceFactory): DatabaseMigrationStatusRepository {
    return dbApiFactory().migrationStatusRepository(outputDataSourceFactory);
  }

  private function schemaConsistencyChecker(inputDataSourceFactory: DataSourceFactory): SchemaConsistencyChecker {
    return new SchemaConsistencyChecker(
        dbApiFactory().schemaRepository(inputDataSourceFactory, schema),
        \-> new SchemaConfiguration().schema());
  }

  protected function tableNameMapper(nameShortener: NameShortener): ConverterWithReservedKeywords {
    return new ConverterWithReservedKeywords(nameShortener, { "Group", "User"});
  }
}