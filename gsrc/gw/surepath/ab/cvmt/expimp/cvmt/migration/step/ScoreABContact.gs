package gw.surepath.ab.cvmt.expimp.cvmt.migration.step

uses gw.expimp.pmt.migration.MigrationStep
uses gw.expimp.pmt.migration.StepContext
uses entity.ABContact

class ScoreABContact implements MigrationStep<StepContext> {

  override function execute(context : StepContext) : StepContext {
    scoreABContact(context);

    return context
  }

  private function scoreABContact(context : StepContext) {
    var abContacts = context.CreatedRootEntities.whereTypeIs(ABContact)
    for (var abContact in abContacts) {
       abContact.updateScores()

    }
  }

}