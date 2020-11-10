package gw.surepath.ab.cvmt.expimp.cvmt.migration

uses com.google.common.collect.ImmutableList
uses com.guidewire.pl.system.bundle.EntityBundleImpl
uses gw.expimp.pmt.datamodel.IdentifiablePayload
uses gw.expimp.pmt.migration.Migration
uses gw.expimp.pmt.migration.MigrationStep
uses gw.expimp.pmt.migration.StepContext

@SuppressWarnings("HiddenPackageReference")
public class ContactMigration implements Migration {

    private final var stepsBeforeCommit : List<MigrationStep<StepContext>>
    private final var stepsAfterCommit : List<MigrationStep<StepContext>>
    construct(_stepsBeforeCommit : List<MigrationStep<StepContext>>, _stepsAfterCommit : List<MigrationStep<StepContext>>) {
        this.stepsBeforeCommit = ImmutableList.copyOf(_stepsBeforeCommit)
        this.stepsAfterCommit = ImmutableList.copyOf(_stepsAfterCommit)
    }

    override  function executeSteps<S>(inputContext : S, steps : List<MigrationStep<S>>) : S {
        var outputContext = inputContext
        for (step in steps) {
            outputContext = step.execute(outputContext)
        }
        return outputContext
    }

    @SuppressWarnings("NewEntityBundleImpl")
    override public function execute(identifiablePayload : IdentifiablePayload) {
        var executionBundle = new EntityBundleImpl()
        var context = new StepContext(identifiablePayload, executionBundle)
        context = this.executeSteps(context, stepsBeforeCommit)
        executionBundle.commit()
        this.executeSteps(context, stepsAfterCommit)
    }

}