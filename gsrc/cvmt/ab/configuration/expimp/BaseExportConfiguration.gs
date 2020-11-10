package cvmt.ab.configuration.expimp;



uses gw.expimp.common.configurer.ExportConfigurer
uses gw.expimp.common.exporter.entity.children.GenericChildrenFinder
uses gw.expimp.common.exporter.entity.converter.ExportFieldConverter
uses gw.expimp.common.exporter.entity.converter.GenericEntityConverterWithBlacklist
uses gw.expimp.common.exporter.fieldconverter.DateFieldConverter
uses gw.expimp.common.exporter.schema.children.TypeChildrenFinder
uses gw.expimp.common.exporter.schema.converter.EntityDefinitionConverterWithBlacklist
uses gw.lang.reflect.IType
uses entity.Address
uses entity.Contact

internal final class BaseExportConfiguration {
  private final var configurer: ExportConfigurer;

  private construct(_configurer: ExportConfigurer) {
    configurer = _configurer;
    prepareChildrenFinders();
    prepareConverters();
  }

  public static function applyOn(configurer: ExportConfigurer) {
    new BaseExportConfiguration(configurer);
  }

  private function prepareChildrenFinders() {
    configurer.registerDefaultChildrenFinder(
        new GenericChildrenFinder(ExcludedChildren.GENERIC),
        new TypeChildrenFinder(ExcludedChildren.GENERIC));
    registerGenericChildrenFinder(Contact, ExcludedChildren.CONTACT)
    registerNoChildrenFinder(Address)
    registerNoChildrenFinder(ActivityPattern)
    registerNoChildrenFinder(Group)
    registerNoChildrenFinder(SpecialistService)
    registerNoChildrenFinder(UserContact)
    registerNoChildrenFinder(User)



  }

  private function prepareConverters() {
    configurer.registerDefaultConverter(
        new GenericEntityConverterWithBlacklist(
            exportFieldConverter(),
            ExcludedFields.GENERIC,
            ExcludedFK.GENERIC,
            ExcludedFK.FK_TYPES),
        new EntityDefinitionConverterWithBlacklist(
            ExcludedFields.GENERIC,
            ExcludedFK.GENERIC,
         ExcludedFK.FK_TYPES))
    registerBlackListConverter(ABContactContact, ExcludedFields.GENERIC, ExcludedFK.ABCONTACTCONTACT, ExcludedFK.FK_TYPES)
    registerWhiteListConverter(UserContact, {"PublicID"})
    registerBlackListConverter(Contact, ExcludedFields.CONTACT, ExcludedFK.GENERIC, ExcludedFK.FK_TYPES)
    registerWhiteListConverter(ActivityPattern, {"Code"})
    registerWhiteListConverter(SecurityZone, {"Name"})
    registerWhiteListConverter(SpecialistService, {"Code"})
    registerWhiteListConverter(User, {"PublicID"})

  }

  private function registerGenericChildrenFinder(type: IType, typesToOmit: IType[]) {
    configurer.registerGenericChildrenFinder(type, typesToOmit);
  }

  private function registerNoChildrenFinder(type: IType) {
    configurer.registerNoChildrenFinder(type);
  }

  private function registerWhiteListConverter(type: IType, fieldWhiteList: Set<String>) {
    configurer.registerWhiteListConverter(exportFieldConverter(), type, fieldWhiteList);
  }

  private function registerBlackListConverter(
      type: IType,
      fieldBlackList: Set<String>,
      fkBlackList: Set<String>,
      fkTypeBlackList: Set<IType>) {
    configurer.registerBlackListConverter(
        exportFieldConverter(),
        type,
        fieldBlackList,
        fkBlackList,
        fkTypeBlackList);
  }

  private function exportFieldConverter(): ExportFieldConverter {
    return ExportFieldConverter.builder()
        .withConverterForType(Date, new DateFieldConverter("yyyy-MM-dd HH:mm:ss"))
        .build();
  }
}