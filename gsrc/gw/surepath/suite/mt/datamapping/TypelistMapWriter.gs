package gw.surepath.suite.mt.datamapping

uses com.guidewire.commons.entity.type.EntityUtil
uses com.guidewire.commons.metadata.internal.loader2.MetadataLoader
uses com.guidewire.pl.config.PLConfigResourceKeys
uses com.guidewire.pl.system.database.schema.SchemaConstants
uses com.guidewire.pl.system.dependency.ProductionMetadataDependencySet
uses com.guidewire.pl.system.util.XMLStringBuilder
uses com.guidewire.pl.system.util.XMLUtil
uses gw.entity.ITypeList
uses gw.entity.TypeKey
uses gw.lang.reflect.TypeSystem
uses java.io.File
uses java.io.StringReader
uses java.io.StringWriter
uses java.util.ArrayList
uses java.util.Collections
uses java.util.Comparator
uses java.util.HashMap
uses java.util.List

@SuppressWarnings("HiddenPackageReference")
class TypelistMapWriter extends AbstractMapWriter {

  private static final var TOP_LEVEL_NODE = "Typelists"
  private static final var TYPELIST_NODE = "Typelist"
  private static final var TYPEKEY_NODE = "Typekey"
  private static final var REFERENCE_NODE = "Reference"
  private var _usageMap : TypeListUsageMap
  private static final var TYPELIST_COMPARATOR : TypelistMapWriter.TypeListComparator = new TypelistMapWriter.TypeListComparator()

  public static function writeTypelistMapToXML(outputDir : File, outputFile : File)  {
    (new TypelistMapWriter(outputDir)).writeMappingFile(outputFile, false, false)
  }

  public static function writeTypelistMapToCSV(outputDir : File, outputFile : File, split : boolean) {
    (new TypelistMapWriter(outputDir)).writeMappingFile(outputFile, true, split)
  }

  private construct(outputDir : File) {
    super(outputDir)
    ProductionMetadataDependencySet.setDependencies()
    this._usageMap = new TypeListUsageMap()
  }

  protected function transformMappingToCSV(mappingString : String) : StringWriter {
    var stringWriter = new StringWriter()
    var sr = new StringReader(mappingString)
    var xsltFile = PLConfigResourceKeys.TYPELIST_MAPPING_TOGETHER.getFile()
    try {
      XMLUtil.applyXSLTTransformation(sr, xsltFile, stringWriter)
    } finally {
      stringWriter.close()
    }
      return stringWriter
  }

  protected function constructMapXMLString(escapeForCSV : boolean) : String {
    var xmlBuilder = new XMLStringBuilder()
    xmlBuilder.setEscapeForCSV(escapeForCSV)
    xmlBuilder.startXMLNode("Typelists", true)
    var typelists = this.TypeListsInSortedOrder
    var var4 = typelists
    var var5 = typelists.length
    for(tl in var4) {
      this.writeTypelistData(tl, xmlBuilder)
    }
    //for(int var6 = 0 var6 < var5 ++var6) {
    //  ITypeList typelist = var4[var6]
    //  this.writeTypelistData(typelist, xmlBuilder)
    //}
    xmlBuilder.closeXMLNode("Typelists")
    return xmlBuilder.toString()
  }

  private function writeTypelistData(typeList : ITypeList, xmlBuilder : XMLStringBuilder) {
      var attributes = new HashMap()
      attributes.put("typelistName", typeList.getRelativeName())
      attributes.put("tableName", SchemaConstants.getConstants().getTypeListTableName(typeList))
      xmlBuilder.startXMLNode("Typelist", attributes, true)
      var typeKeys = this.getTypeKeysInSortedOrder(typeList)
      var usage = typeKeys.iterator()

      while(usage.hasNext()) {
        var typeKey = usage.next() as TypeKey
        this.writeTypekeyData(typeKey, xmlBuilder)
      }

      var usage1 = this._usageMap.getUsages(typeList)
      var typeKey1 = usage1.iterator()

      while(typeKey1.hasNext()) {
        var o = typeKey1.next()
        this.writeTypeListUsage(o as DBFieldReference, xmlBuilder)
      }

      xmlBuilder.closeXMLNode("Typelist")
      }

  private function writeTypekeyData(typeKey : TypeKey, xmlBuilder : XMLStringBuilder) {
    xmlBuilder.startXMLNode("Typekey", true)
    xmlBuilder.addXMLNode("Code", typeKey.getCode())
    xmlBuilder.addXMLNode("Name", typeKey.getUnlocalizedName())
    xmlBuilder.addXMLNode("Description", typeKey.getDescription())
    xmlBuilder.addXMLNode("Priority", Integer.toString(typeKey.getPriority()))
    xmlBuilder.closeXMLNode("Typekey")
  }

  private function writeTypeListUsage(referencingField : DBFieldReference, xmlBuilder : XMLStringBuilder) {
    xmlBuilder.startXMLNode("Reference", true)
    xmlBuilder.addXMLNode("Entity", referencingField.EntityType.getRelativeName())
    xmlBuilder.addXMLNode("Field", referencingField.FieldName)
    xmlBuilder.closeXMLNode("Reference")
  }

  private property get TypeListsInSortedOrder() : ITypeList[] {
    var typelists = new ArrayList()
    var var2 = MetadataLoader.getInstance().getTypelistNames().iterator()

    while (var2.hasNext()) {
      var typelistName = var2.next() as String
      typelists.add(TypeSystem.getByFullNameIfValid(EntityUtil.getTypelistTypeName(typelistName)) as ITypeList)
    }
    Collections.sort(typelists, TYPELIST_COMPARATOR)
    return typelists.toArray(new ITypeList[typelists.size()]) as ITypeList[]
  }

  private function getTypeKeysInSortedOrder<T extends TypeKey>(typeList : ITypeList<T>) : List<T> {
    return typeList.getTypeKeys(true)
  }

  private static class TypeListComparator<T extends TypeKey> implements Comparator<ITypeList<T>> {
    private construct() {}
    public function compare(o1 : ITypeList<T>, o2 : ITypeList<T>) : int {
      return o1.getRelativeName().compareToIgnoreCase(o2.getRelativeName())
    }
  }
}