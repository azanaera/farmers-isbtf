package gw.surepath.suite.mt.datamapping

uses com.guidewire.commons.entity.type.EntityUtil
uses com.guidewire.commons.metadata.MetadataDependencies
uses com.guidewire.pl.system.internal.InternalMethods
uses gw.entity.IEntityPropertyInfo
uses gw.entity.IEntityType
uses gw.entity.ITypeList
uses gw.entity.ITypekeyPropertyInfo
uses java.util.ArrayList
uses java.util.Collections
uses java.util.HashMap
uses java.util.List
uses java.util.Map

@SuppressWarnings({"HiddenPackageReference"})
class TypeListUsageMap {

  private var _usageByTypeList : Map<String, List<DBFieldReference>>

  public construct() {
      this.compileUsageInfo()
}

  public function getUsages(typeList : ITypeList) : List {
    var usages = this._usageByTypeList.get(typeList.getRelativeName()) as List
    if(usages == null) {
      usages = Collections.emptyList()
    }
    return usages
  }

  private function compileUsageInfo() {
    this._usageByTypeList = new HashMap()
    var var1 = MetadataDependencies.getIntrinsicTypeFactory().getAllEntityTypes().iterator()
    while(true) {
      var entityType : IEntityType
      do {
        if(!var1.hasNext()) {
          return
        }
        entityType = var1.next() as IEntityType
      } while(!InternalMethods.asIEntityTypeInternal(entityType).isPersistent())
      var var3 = EntityUtil.getEntityProperties(entityType).iterator()
      while(var3.hasNext()) {
        var iEntityPropertyInfo = var3.next() as IEntityPropertyInfo
        if(InternalMethods.asIQueryablePropertyInfoInternal(iEntityPropertyInfo).isTypekey()) {
          this.addUsage(entityType, InternalMethods.asIEntityPropInfoInternal(iEntityPropertyInfo).asTypekey())
        }
      }
    }
  }

  private function addUsage(entityClass : IEntityType, fieldData : ITypekeyPropertyInfo) {
    var typeList = fieldData.getFeatureType().getRelativeName()
    var usages = this._usageByTypeList.get(typeList) as List<DBFieldReference>
    if(usages == null) {
      usages = new ArrayList<DBFieldReference>()
      this._usageByTypeList.put(typeList, usages)
    }
    (usages as List).add(DBFieldReference.createReferenceByField(entityClass, fieldData))
  }
    
}