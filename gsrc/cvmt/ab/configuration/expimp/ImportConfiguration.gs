package cvmt.ab.configuration.expimp;


uses gw.expimp.common.ToEntityType
uses gw.expimp.common.configurer.EntityImportConfig
uses gw.expimp.common.configurer.ImportConfigurer
uses gw.expimp.common.configurer.Registry
uses gw.expimp.common.configurer.conditions.Condition
uses gw.expimp.common.configurer.conditions.EntityTypeMatchesCondition
uses gw.expimp.common.datamodel.entity.Entity
uses gw.expimp.common.datamodel.entity.EntityReference
uses gw.expimp.common.importer.EntityImporter
uses gw.expimp.common.importer.builder.BaseImportGenericEntityBuilder
uses gw.expimp.common.importer.builderfactory.ExistingBeanBuilderFactory
uses gw.expimp.common.importer.builderfactory.NewBeanBuilderFactory
uses gw.expimp.common.importer.builderfactory.ThrowBeanLookupExceptionBuilderFactory
uses gw.expimp.common.importer.fieldparser.DateFieldParser
uses gw.expimp.common.importer.fieldparser.FieldParser
uses gw.expimp.common.importer.fieldparser.factory.ImportFieldParserFactory
uses gw.expimp.common.importer.lookup.BeanLookup
uses gw.expimp.common.importer.lookup.BeanLookupFactory
uses gw.expimp.common.importer.lookup.LoadBeanByFieldNameFromDatabase
uses gw.expimp.common.importer.lookup.LoadRequiredBeanByFieldNameFromDatabase
uses gw.expimp.common.importer.lookup.cache.CachedItem
uses gw.expimp.common.importer.lookup.cache.KeyableBeansCache
uses gw.expimp.common.importer.lookup.cache.KeyableBeansCacheFactory
uses gw.lang.reflect.IType
uses org.slf4j.LoggerFactory

uses java.util.function.Function

uses ToEntityType#toEntityType(Entity)

@SuppressWarnings("StructuredLogger")
class ImportConfiguration {
  private static final var LOG = LoggerFactory.getLogger("MigrationImportCache");
  private static final var PUBLIC_ID = "PublicID";
  private static final var CODE = "Code";
  private final var importConfigurer = new ImportConfigurer();
  private final var cacheFactory : KeyableBeansCacheFactory;
  private final var fieldParserFactory = fieldParserFactory();

  construct() {
    this(\-> new LoggingCache(KeyableBeansCacheFactory.DEFAULT.create()));
  }

  construct(_cacheFactory : KeyableBeansCacheFactory) {
    this.cacheFactory = _cacheFactory;
  }

  public function entityImporter() : EntityImporter {
    return new EntityImporter(buildersRegistry(), cacheFactory);
  }

  private function buildersRegistry() : Registry<Entity, EntityImportConfig> {
    return setupImport().registry();
  }

  private function setupImport() : ImportConfigurer {
    registerDefault(\entity, payload -> new BaseImportGenericEntityBuilder(toEntityType(entity),
        fieldParserFactory))

    registerRequiredBeanLookup(ActivityPattern, \c -> new LoadRequiredBeanByFieldNameFromDatabase(CODE))
    registerRequiredBeanLookup(SpecialistService, \c -> new LoadRequiredBeanByFieldNameFromDatabase(CODE))
    registerRequiredBeanLookup(User, \c -> new LoadRequiredBeanByFieldNameFromDatabase(PUBLIC_ID))
    registerRequiredBeanLookup(UserContact, \c -> new LoadRequiredBeanByFieldNameFromDatabase(PUBLIC_ID))

    return importConfigurer;
  }

  private function fieldParserFactory() : ImportFieldParserFactory {
    var customFieldParsers = new HashMap<IType, Function<IType, FieldParser>>();
    customFieldParsers.put(Date, \type -> new DateFieldParser("yyyy-MM-dd HH:mm:ss"));
    return new ImportFieldParserFactory(customFieldParsers);
  }

  private function registerDefault(builderFactory : NewBeanBuilderFactory) {
    importConfigurer.registerDefaultBuilder(builderFactory);
  }

  private function registerRequiredBeanLookup(
      type : IType,
      beanLookupFactory : BeanLookupFactory) {
    register(isAssignable(type), beanLookupFactory, new ThrowBeanLookupExceptionBuilderFactory(type));
  }

  private function registerLookupWithFallbackGenericBuilder(
      condition : Condition<Entity>,
      beanLookupFactory : BeanLookupFactory) {
    register(
        condition,
        beanLookupFactory,
        \entity, payload -> new BaseImportGenericEntityBuilder(toEntityType(entity), fieldParserFactory));
  }

  private function register(
      condition : Condition<Entity>,
      beanLookupFactory : BeanLookupFactory,
      fallbackBuilderFactory : NewBeanBuilderFactory) {
    importConfigurer.registerLookupWithBuilders(
        condition,
        beanLookupFactory,
        ExistingBeanBuilderFactory.DEFAULT,
        fallbackBuilderFactory);
  }

  private function isAssignable(type : IType) : Condition<Entity> {
    return \entity -> type.isAssignableFrom(toEntityType(entity));
  }


  private function register(condition: Condition<Entity>, builderFactory: NewBeanBuilderFactory) {
    importConfigurer.registerBuilder(condition, builderFactory)
  }
  private function is(type : IType) : Condition<Entity> {
    return new EntityTypeMatchesCondition(type.getRelativeName());
  }

  private static class LoggingCache implements KeyableBeansCache {

    private final var c : KeyableBeansCache

    private construct(_c : KeyableBeansCache) {
      c = _c
    }

    override function get(entityReference : EntityReference) : CachedItem {
      var cachedItem = c.get(entityReference)
      if (cachedItem.isMissing()) {
        LOG.trace("Cache miss for: <{}, {}>", entityReference.EntityType, entityReference.Id)
      } else {
        LOG.trace("Cache hit for: <{}, {}>", entityReference.EntityType, entityReference.Id)
      }
      return cachedItem
    }

    override function put(entityReference : EntityReference, cachedItem : CachedItem) {
      c.put(entityReference, cachedItem)
    }
  }
}