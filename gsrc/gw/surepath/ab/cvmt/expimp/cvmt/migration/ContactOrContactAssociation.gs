package gw.surepath.ab.cvmt.expimp.cvmt.migration

uses gw.expimp.pmt.datamodel.IdentifiablePayload
uses gw.expimp.pmt.migration.Migration



 public class ContactOrContactAssociation implements Migration {

    private final var contactMigration : ContactMigration
    private final var contactAssociationMigration : ContactAssociationMigration

    public construct(_contactMigration : ContactMigration, _contactAssociationMigration : ContactAssociationMigration) {
      contactMigration = _contactMigration
      contactAssociationMigration = _contactAssociationMigration
    }

   override public function execute(identifiablePayload : IdentifiablePayload) : void {
      if (containsABContactContact(identifiablePayload)) {
        contactAssociationMigration.execute(identifiablePayload)
      } else {
        contactMigration.execute(identifiablePayload)
      }
    }

    public static function containsABContactContact(identifiablePayload : IdentifiablePayload) : boolean {
      return identifiablePayload.getEntityPayload().getEntities().stream().anyMatch(\ entity -> Objects.equals(entity.getEntityType(), ABContactContact.TYPE.get().getRelativeName()))
    }

  }
