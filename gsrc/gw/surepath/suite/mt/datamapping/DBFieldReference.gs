package gw.surepath.suite.mt.datamapping

uses com.guidewire.pl.system.database.metadata.TableMetadata
uses com.guidewire.pl.system.internal.InternalMethods
uses gw.datatype.DataTypes
uses gw.entity.IEntityPropertyInfo
uses gw.entity.IEntityType
uses gw.entity.IMonetaryAmountPropertyInfo
uses gw.lang.reflect.IType

@SuppressWarnings("HiddenPackageReference")
class DBFieldReference {

  private var _tableName : String
  private var _entityType : IEntityType
  private var _fieldName : String
  private var _fieldType : IType
  private var _fieldData : IEntityPropertyInfo
  private var _tableNameLower : String
  private var _fieldNameLower : String

  public static function createReferenceByField(entity: IEntityType, field : IEntityPropertyInfo) : DBFieldReference {
      return new DBFieldReference(entity, field)
  }

  public property get JavaFieldTypeName() : String {
    return InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isLink() ? this._fieldData.getFeatureType().getRelativeName() : (InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isTypekey() ? InternalMethods.asIEntityPropInfoInternal(this._fieldData).asTypekey().getFeatureType().getRelativeName() : (InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isArray() ? InternalMethods.asIEntityPropInfoInternal(this._fieldData).asArray().getComponentEntityType().getRelativeName() + "[]" : this._fieldData.getFeatureType().getRelativeName()))
  }

  public property get ADTFieldLengthString() : String {
    var dataType = DataTypes.get(this._fieldData)
    if (dataType != null) {
      var length = dataType.asConstrainedDataType().getLength(null, null)
      return length != null ? "" + length : ""
    } else {
      return ""
    }
  }

  public property get ADTFieldPrecisionString() : String {
    var dataType = DataTypes.get(this._fieldData)
    return dataType != null && dataType.asPersistentDataType().isDecimalBased() ? "" + dataType.asPersistentDataType().getPrecision() : ""
  }

  public property get ADTFieldScaleString() : String {
    var dataType = DataTypes.get(this._fieldData)
    return dataType != null && dataType.asPersistentDataType().isDecimalBased() ? "" + dataType.asPersistentDataType().getScale() : ""
  }

  public property get ADTFieldTypeListName() : String {
    return InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isTypekey() ? InternalMethods.asIEntityPropInfoInternal(this._fieldData).asTypekey().getFeatureType().getRelativeName() : ""
  }

  public property get ADTFieldFKEntity() : String {
    return InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isLink() ? this._fieldData.getFeatureType().getRelativeName() : ""
  }

  public property get ADTFieldArrayEntity() : String {
    return InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isArray() ? InternalMethods.asIEntityPropInfoInternal(this._fieldData).asArray().getComponentEntityType().getRelativeName() : ""
  }

    public function getADTFieldTypeName(fullString : boolean) : String {
      if(InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isLink()) {
        return fullString?"Foreign Key to " + this._fieldData.getFeatureType().getRelativeName():"Foreign Key"
      } else if(InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isTypekey()) {
        return fullString?"Type Key of type " + InternalMethods.asIEntityPropInfoInternal(this._fieldData).asTypekey().getFeatureType().getRelativeName():"Type Key"
      } else if(InternalMethods.asIQueryablePropertyInfoInternal(this._fieldData).isArray()) {
        return fullString?"Array of " + InternalMethods.asIEntityPropInfoInternal(this._fieldData).asArray().getComponentEntityType().getRelativeName():"Array"
      } else if(this._fieldData typeis IMonetaryAmountPropertyInfo) {
        return "MonetaryAmount"
      } else {
        var dataType = DataTypes.get(this._fieldData)
        return dataType != null?dataType.getName():"Unknown data type"
      }
    }

    private function DBFieldReference(rootEntity : IEntityType, field : IEntityPropertyInfo) {
      this.initFromClassAndField(rootEntity, field)
    }

    private function initFromClassAndField(entityClass : IEntityType, field : IEntityPropertyInfo) {
      this._entityType = entityClass
      this._fieldData = field
      this._fieldName = field.getName()
      this._tableName = TableMetadata.getTableName(this._entityType)
      this._fieldType = this._fieldData.getFeatureType()
      this._tableNameLower = this._tableName.toLowerCase()
      this._fieldNameLower = this._fieldName.toLowerCase()
    }

    public property get TableName() : String {
      return this._tableName
    }

    public property get EntityType() : IEntityType {
      return this._entityType
    }

    public property get FieldName() : String {
      return this._fieldName
    }

    public property get FieldType() : IType {
      return this._fieldType
    }

    public function equals(obj : Object) : boolean {
      if(this == obj) {
        return true
      } else if(obj != null && this.getClass() == obj.getClass()) {
        var ref = obj as DBFieldReference
        return ref._tableNameLower == this._tableNameLower && ref._fieldNameLower == this._fieldNameLower
      } else {
        return false
      }
    }

    public function hashCode() : int {
      var result = this._tableNameLower != null?this._tableNameLower.hashCode():0
      result = 29 * result + (this._fieldNameLower != null?this._fieldNameLower.hashCode():0)
      return result
    }

    public function toString() : String {
      return this._tableName + "." + this._fieldName
    }
}