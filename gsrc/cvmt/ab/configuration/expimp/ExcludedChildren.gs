package cvmt.ab.configuration.expimp;

uses gw.lang.reflect.IType
uses org.apache.commons.lang3.ArrayUtils

internal final class ExcludedChildren {

  public static final var GENERIC : IType[] = {
      MergedContactPair,
      PendingContactChange,
      ContactHistory,
      ABContactDocumentLink,
      ABContactContact
  }

  public static final var CONTACT : IType[] = ArrayUtils.addAll(GENERIC, {
      ContactTag,
      ContactContact,
      ContactFingerprint,
      ContactCategoryScore
  })



}