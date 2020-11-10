package gw.surepath.ab.cvmt.expimp.cvmt.migration

uses gw.surepath.ab.cvmt.expimp.cvmt.migration.step.ImportABContact
uses gw.surepath.ab.cvmt.expimp.cvmt.migration.step.ScoreABContact
uses gw.expimp.common.datamodel.schema.Schema
uses gw.expimp.common.importer.EntityImporter
uses gw.expimp.pmt.migration.MigrationStep
uses gw.expimp.pmt.migration.StepContext
uses gw.expimp.pmt.migration.step.ValidateFKsAndParents
uses gw.expimp.pmt.migration.step.ValidateTypeKeys
uses gw.expimp.utils.CollectionUtils

uses java.util.function.Consumer

public class ContactMigrationBuilder  {

    private final var entityImporter : EntityImporter
    private final var schema : Schema
    private final var configurableStepsBeforeCommit : List<MigrationStep<StepContext>> = new LinkedList<MigrationStep<StepContext>>()
    private final var configurableStepsAfterCommit : List<MigrationStep<StepContext>> = new LinkedList<MigrationStep<StepContext>>()
    public construct(_entityImporter : EntityImporter, _schema : Schema) {
        if (_entityImporter == null) {
            throw new IllegalStateException("EntityImporter must be configured")
        }
        if (_schema == null) {
            throw new IllegalStateException("Schema must be configured")
        }
        entityImporter = _entityImporter
        schema = _schema
    }

    public function addStepBeforeCommit(step : MigrationStep<StepContext>) : ContactMigrationBuilder {
        this.configurableStepsBeforeCommit.add(step)
        return this
    }

    public function addStepAfterCommit(step : MigrationStep<StepContext>) : ContactMigrationBuilder {
        this.configurableStepsAfterCommit.add(step)
        return this
    }

    public function build() : ContactMigration {
        var stepsBeforeCommit : List<MigrationStep<StepContext>> = new LinkedList<MigrationStep<StepContext>>()
        stepsBeforeCommit.addAll(preconfiguredMigrationSteps())
        stepsBeforeCommit.addAll(configurableStepsBeforeCommit)
        stepsBeforeCommit.addAll(preconfiguredStepsBeforeCommit())
        var stepsAfterCommit : List<MigrationStep<StepContext>> = new LinkedList<MigrationStep<StepContext>>()
        stepsAfterCommit.addAll(configurableStepsAfterCommit)
        return new ContactMigration(stepsBeforeCommit, stepsAfterCommit)
    }

    private function preconfiguredMigrationSteps() : ArrayList<MigrationStep<StepContext>> {
        return {
            new ValidateFKsAndParents<StepContext>(),
            new ValidateTypeKeys<StepContext>(schema),
            new ImportABContact(entityImporter),
            new PopulatePayloadId()}
    }

    private function preconfiguredStepsBeforeCommit() : List<MigrationStep<StepContext>> {
        return {
            new ScoreABContact()
        }
    }


    @SuppressWarnings("HiddenPackageReference")
    private static class PopulatePayloadId implements MigrationStep<StepContext> {

        override public function execute(context : StepContext) : StepContext {
            var roots = context.getCreatedRootEntities()
            CollectionUtils.whereTypeIs(roots, ABContact).forEach(initPmtClaimInfo(context))
            return context
        }

        private function initPmtClaimInfo(context : StepContext) : Consumer<ABContact> {
            return \ abContact -> {  {
                var cvmtAccountInfo = new CvmtABContactInfo_SP(context.getExecutionBundle())
                cvmtAccountInfo.setPayloadID(context.getPayloadId())
                abContact.setCvmtABContact_SP(cvmtAccountInfo)
            }
            }
        }

    }

}
