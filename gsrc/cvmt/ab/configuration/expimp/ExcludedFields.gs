package cvmt.ab.configuration.expimp;

uses com.google.common.collect.Sets

final class ExcludedFields {

  private final static var GENERIC_WITHOUT_DATES: Set<String> = Sets.newHashSet<String>({
      "Active",
      "ArchiveDate",
      "ArchivePartition",
      "ArchiveState",
      "BeanVersion",
      "ChangeType",
      "CreateTime",
      "DoNotDestroy",
      "ID",
      "LockingColumn",
      "LastUpdateTime",
      "TemporaryLastUpdateTime",
      "RetiredValue",
      "Referenced",
      "Subtype",
      "UpdateTime",
      "ObfuscatedInternal",
     // "PublicID", -- this is necessary to populate abcontactcontact
      "LoadCommandID"
  })

  private final static var OMMITTTED_DATES_FIELDS: Set<String> = Sets.newHashSet<String>({
      "EffectiveDate",
      "ExpirationDate"
  })

  public final static var GENERIC: Set<String> = Sets.union<String>(GENERIC_WITHOUT_DATES, OMMITTTED_DATES_FIELDS)

  public final static var CONTACT: Set<String> = Sets.union<String>(GENERIC, {
      "AutoSync",
      "ExternalID",
      "ExternalVersion",
      "Preferred",
      "ValidationLevel",
      "ObfuscatedInternal",
      "LoadRelatedContacts"
  })

}