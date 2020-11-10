package gw.surepath.ab.cvmt.expimp.cvmt.migration.step


uses gw.expimp.common.importer.EntityImporter
uses gw.expimp.pmt.migration.MigrationStep
uses gw.expimp.pmt.migration.StepContext

@SuppressWarnings("HiddenPackageReference")
class ImportABContact implements MigrationStep<StepContext> {

  private final var importer : EntityImporter

  construct(_importer : EntityImporter) {
    importer = _importer
  }

  override function execute(context : StepContext) : StepContext {
    var importedEntities = importer.doImport(context.getEntityPayload(), context.getExecutionBundle())
    return new StepContext(
        context.getIdentifiablePayload(),
        importedEntities.allRootBeans(),
        importedEntities.createdBeansByReference(),
        context.getExecutionBundle())
  }

}