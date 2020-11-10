package gw.api.contact.pendingchanges

uses entity.ABContact

@Export
class DefaultABContactPublicMethodsImpl extends ABContactPublicMethodsImpl {

  construct(contact : ABContact) {
    super(contact)
  }

  /**
   * Check whether the contact is editable. If contact is Vendor and has pending update changes then return false
   * In the base configuration, pending changes are created only when a user with insufficient permissions is working
   * with vendor contacts. If customer edits ContactSystemApprovalUtil in ClaimCenter and changes how ClaimCenter determines
   * if a contact updated in ClaimCenter will be applied immediately, or if it requires approval in ContactManager, then
   * they must modify this property
   */
  override property get EditableWithPendingUpdate() : boolean {
    return super.EditableWithPendingUpdate
  }
}