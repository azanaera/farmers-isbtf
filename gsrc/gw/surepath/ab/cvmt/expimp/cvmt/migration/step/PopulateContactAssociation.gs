package gw.surepath.ab.cvmt.expimp.cvmt.migration.step

uses entity.ABContact
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.expimp.pmt.migration.MigrationStep
uses gw.expimp.pmt.migration.StepContext

class PopulateContactAssociation implements MigrationStep<StepContext> {

  override function execute(context : StepContext) : StepContext {
    setContactAssociation(context);

    return context
  }

  private function setContactAssociation(context : StepContext) {
    var contactAssociations = context.CreatedRootEntities.whereTypeIs(ABContactContact)

    for (var contactAssociation in contactAssociations) {

      var sourceContact = Query.make(ABContact).compare(ABContact#PublicID, Relop.Equals, contactAssociation.SourceRelatedContactPID).select().FirstResult
      contactAssociation.setSrcABContact(sourceContact)
      var relatedContact = Query.make(ABContact).compare(ABContact#PublicID, Relop.Equals, contactAssociation.RelatedContactPID).select().FirstResult
      contactAssociation.setRelABContact(relatedContact)



    }
  }

}