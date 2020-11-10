package gw.surepath.suite.mt.datamapping

uses com.guidewire.commons.xml.parser.ConfigParser
uses com.guidewire.commons.xml.parser.ParentNode
uses com.guidewire.pl.system.service.parser.elements.elements.AbstractNode
uses com.guidewire.pl.system.util.XMLStringBuilder
uses gw.entity.IEntityPropertyInfo
uses gw.entity.IEntityType
uses gw.pl.util.FileUtil
uses gw.pl.util.StaticInt
uses java.io.File
uses java.util.HashMap
uses java.util.Map.Entry
uses org.apache.commons.lang.ClassUtils

@SuppressWarnings("HiddenPackageReference")
class SequenceNumbers extends AbstractNode implements ParentNode {
  private var _maxNumber = 0
  private var _sequenceNumbers = new HashMap()
  private static final var SEQUENCE_NUMBERS_NODE = "SequenceNumbers"
  private static final var SEQUENCE_NUMBER_NODE = "SequenceNumber"

  public construct() {}

  public function addChild(obj : Object) {
    var number = obj as SequenceNumber
    if(number.Number > this._maxNumber) {
      this._maxNumber = number.Number
    }
    this._sequenceNumbers.put(number.Key, StaticInt.get(number.Number))
  }

  public static function readFromFileInDir(dir : File) : SequenceNumbers {
    return readFromFile(getDefaultFile(dir))
  }

  private static function readFromFile(file : File) : SequenceNumbers {
    if(file.exists()) {
      var parser = new ConfigParser()
      return parser.parse(file, null, ClassUtils.getPackageName(typeof SequenceNumbers), null) as SequenceNumbers
    } else {
      return new SequenceNumbers()
    }
  }

  public function writeToFileInDir(dir : File){
    this.writeToFile(getDefaultFile(dir))
  }

  private function writeToFile(file : File) {
    file.getParentFile().mkdirs()
    FileUtil.write(file, this.composeXMLString())
  }

  public function getSequenceNumberForField(entity : IEntityType, fd : IEntityPropertyInfo) : Integer {
    var key = this.makeKey(entity, fd)
    var number = this._sequenceNumbers.get(key) as Integer
    if(number == null) {
      this._maxNumber++
      number = StaticInt.get(this._maxNumber)
      this._sequenceNumbers.put(key, number)
    }
    return number
    }

  private function composeXMLString() : String {
    var builder = new XMLStringBuilder()
    builder.startXMLNode("SequenceNumbers", true)
    var attributeMap = new HashMap()
    var it = this._sequenceNumbers.entrySet().iterator()
    while(it.hasNext()) {
      var entry = it.next() as Entry
      attributeMap.put("key", entry.getKey())
      attributeMap.put("number", entry.getValue())
      builder.addXMLNode("SequenceNumber", "", attributeMap, true)
    }
    builder.closeXMLNode("SequenceNumbers")
    return builder.toString()
  }

  private function makeKey(entity : IEntityType, fd : IEntityPropertyInfo) : String {
    return entity.getRelativeName() + "." + fd.getName()
  }

  private static function getDefaultFile(dir : File) : File {
    return new File(dir, "sequencenumbers.xml")
  }
}