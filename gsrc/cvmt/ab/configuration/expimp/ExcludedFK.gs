package cvmt.ab.configuration.expimp;

uses com.google.common.collect.Sets
uses gw.lang.reflect.IType

final class ExcludedFK {

  public static final var GENERIC : Set<String> = Sets.newHashSet<String>({
      "CreateUser",
      "UpdateUser",
      "Fixed",
      "BranchValue",
      "BasedOnValue",
      "FrozenSet",
      "Workflow",
      "SrcABContact"
  })



  public static final var FK_TYPES : Set<IType> = Sets.newHashSet<IType>({
      ArchiveFailure,
      ArchiveFailureDetails,
      UpgradeDatamodelInfo,
      Credential,
      Group,
      ABContactDocumentLink,
      DuplicateContactPair
  })

  public final static var ABCONTACTCONTACT: Set<String> = Sets.union<String>(GENERIC, {
      "RelABContact"
    })
}