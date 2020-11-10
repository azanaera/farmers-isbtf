package gw.surepath.suite.mt.schemadiff

uses gw.api.web.WebUtil
uses gw.expimp.common.datamodel.schema.Schema
uses gw.expimp.schemaconsistency.diff.Difference
uses gw.expimp.schemaconsistency.diff.SchemaDifferer
uses gw.expimp.serialization.schema.SerializableSchema
uses gw.expimp.serialization.serializer.JsonSerializer
uses gw.expimp.serialization.serializer.simple.PmtJsonSerializer
uses gw.surepath.suite.mt.CommonUtil
uses org.apache.commons.io.IOUtils

uses java.io.File
uses java.io.FileOutputStream
uses java.io.InputStream
uses java.nio.charset.Charset

/**
 * Created by dell-sai on 10/1/2018.
 */
class SchemaDiffUtil {


  static function generateWebFile() {

    var schema = CommonUtil.Schema

    var serializable = new SerializableSchema(schema)
    var jsonSerializer: JsonSerializer = new PmtJsonSerializer()
    var json = jsonSerializer.serialize(serializable)
    // Write output in the file

    var tmpFile = File.createTempFile("PMT_Schema", ".json")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)

    try {
      IOUtils.write(json, fio, Charset.defaultCharset())
    } finally {
      fio.close()
     }
    WebUtil.copyFileToClient("text/json", tmpFile)

  }


  static function readSchema(inputStream: InputStream): Schema {
    var jsonSerializer: JsonSerializer = new PmtJsonSerializer()

    var json = IOUtils.toString(inputStream, Charset.defaultCharset())
    var newSchema = jsonSerializer.deserialize<SerializableSchema>(json,SerializableSchema)

    return newSchema.toSchema()
  }

  static function schemaDiff(webFile : gw.api.web.WebFile): List<Difference> {

    var oldSchema = readSchema(webFile.InputStream)
    var schema = CommonUtil.Schema
    var schemaDifferer = new SchemaDifferer()
    var diff = schemaDifferer.diff(oldSchema, schema)


    var tmpFile = File.createTempFile("diff", ".txt")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)

    try {

      if (diff.HasElements) diff.each(\elt -> IOUtils.write(elt.toString() + System.getProperty("line.separator"), fio, Charset.defaultCharset()))
      else IOUtils.write("No Diff Found !", fio, Charset.defaultCharset())
    } finally {
      fio.close()
    }
    WebUtil.copyFileToClient("text/plain", tmpFile)

    return diff
  }

}