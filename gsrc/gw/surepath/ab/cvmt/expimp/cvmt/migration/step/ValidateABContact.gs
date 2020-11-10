package gw.surepath.ab.cvmt.expimp.cvmt.migration.step

uses gw.expimp.pmt.migration.MigrationStep
uses gw.expimp.pmt.migration.StepContext


@SuppressWarnings("HiddenPackageReference")
class ValidateABContact implements MigrationStep<StepContext> {

  override function execute(context : StepContext) : StepContext {
    validateABCContact(context);

    return context
  }

  private function validateABCContact(context : StepContext) {
    var abContacts = context.CreatedRootEntities.whereTypeIs(ABContact)
    for (var abContact in abContacts) {
      //TODO: save/print validation result in output interface
      abContact.validateRelationships()

    }
  }

}