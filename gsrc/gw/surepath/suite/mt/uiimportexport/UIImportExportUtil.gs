package gw.surepath.suite.mt.uiimportexport


uses cvmt.ab.configuration.expimp.ExportConfiguration
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.surepath.suite.mt.datamapping.DatamodelMapWriter
uses gw.surepath.suite.mt.datamapping.TypelistMapWriter
uses gw.api.web.WebUtil
uses gw.expimp.common.exporter.entity.DiscoverableEntityExporter
uses gw.expimp.dbimpl.oracle.OracleDbAccessGeneratorsFactory
uses gw.expimp.dbimpl.util.UuidConstraintNameGenerator
uses gw.expimp.dbimpl.util.UuidIndexNameGenerator
uses gw.expimp.dbinterfacefacade.DatabaseInterfaceFacadeHolder
uses gw.expimp.pmt.datamodel.IdentifiablePayload
uses gw.expimp.serialization.payload.SerializableIdentifiablePayload
uses gw.expimp.workorchestration.RepositoryCommonColumns
uses gw.surepath.suite.mt.ab.configuration.DmtToolsConfiguration
uses gw.expimp.datafeed.dbmeta.Row
uses gw.expimp.dbaccess.query.CommonColumns
uses gw.expimp.serialization.serializer.simple.PmtJsonSerializer
uses gw.expimp.workorchestration.dbpayloadprovider.PayloadStatus
uses gw.surepath.suite.mt.CommonUtil
uses org.apache.commons.io.IOUtils
uses java.io.File
uses java.io.FileOutputStream
uses java.nio.charset.Charset

/**
 * Utility class that exports
 */
class UIImportExportUtil {

  private static final var PMT_JSON_SERIALIZER = new PmtJsonSerializer()
  //private static final var _LOGGER = LoggerFactory.getLogger(UIImportExportUtil)


  static function processPayload(webFile: gw.api.web.WebFile, payloadID: String) {
    var pmtToolsConfiguration = new DmtToolsConfiguration()
    var identifiablePayload = PMT_JSON_SERIALIZER
        .deserialize<SerializableIdentifiablePayload>(IOUtils.toString(webFile.InputStream,  Charset.defaultCharset()),SerializableIdentifiablePayload)
    pmtToolsConfiguration.migration().execute(identifiablePayload.toIdentifiablePayload())
  }

  static function generatePayload(existingPayloadID: String) {
    var databaseInterface = DatabaseInterfaceFacadeHolder.INSTANCE.getFacade()
    //var entityPayload = databaseInterface.InputDbApi.readPayload(existingPayloadID)
    var entityPayload = databaseInterface.readInputPayload(existingPayloadID)
    var serializableIdentifiablePayload = new SerializableIdentifiablePayload(new IdentifiablePayload(existingPayloadID,entityPayload))

    var tmpFile = File.createTempFile("PMT_Payload", ".json")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)
    try {
      IOUtils.write(PMT_JSON_SERIALIZER.serialize(serializableIdentifiablePayload), fio, Charset.defaultCharset())
    } finally {
      fio.close()
    }
    WebUtil.copyFileToClient("text/json", tmpFile)

  }

  static function generateInputDdl(){

    //var apiFactory = new OracleDbApiConfiguration().dbApiFactory()
    var apiFactory = CommonUtil.DbApiFactory
    var queryGenerator = apiFactory.queryGenerator()
    var ddlQueries = queryGenerator.ddlQueries(CommonUtil.Schema)

    ddlQueries.addAll(generatePayloadStatusDdl())

    var tmpFile = File.createTempFile("PMT_IN_DDL", ".sql")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)

    try {
      if (ddlQueries.HasElements) {
        ddlQueries.each(\query -> IOUtils.write(query + ";" + System.getProperty("line.separator"), fio,  Charset.defaultCharset()))
      } else IOUtils.write("DDL statatements are empty!", fio,  Charset.defaultCharset() )
    } finally {
      fio.close()
    }
    WebUtil.copyFileToClient("text/sql", tmpFile)

  }

  private static function generatePayloadStatusDdl() : List<String>{
    var tableName = CommonColumns.PREFIX + "PayloadStatus"

    var tableColumns = {
        CommonColumns.payloadIdPrimaryKey(),
        RepositoryCommonColumns.groupIdWithIndex(),
        RepositoryCommonColumns.status()
    }

    var ddlGenerator = new OracleDbAccessGeneratorsFactory(new UuidConstraintNameGenerator(), new UuidIndexNameGenerator()).ddlStatementsGenerator()

    var payloadStatusDdl = {ddlGenerator.createTableStatement(tableName, tableColumns)}
    var payloadStatusIndexes = ddlGenerator.createIndexStatements(tableName, tableColumns.where(\column -> column.isIndexed()))

    payloadStatusDdl.addAll(payloadStatusIndexes)

    return payloadStatusDdl
  }

  static function generateRows(existingPayloadID: String, newPayloadID: String): List<Row> {
    var databaseInterface = DatabaseInterfaceFacadeHolder.INSTANCE.getFacade()
    //var entityPayload = databaseInterface.InputDbApi.readPayload(existingPayloadID)
    var entityPayload = databaseInterface.readInputPayload(existingPayloadID)
    var schema = CommonUtil.Schema
    var apiFactory = CommonUtil.DbApiFactory
    var rows = apiFactory.dbMetaConverter().payloadToRows(entityPayload, schema, newPayloadID)

    return rows
  }

  static function generateWebFile(existingPayloadID: String, newPayloadID: String) {
    var tmpFile = File.createTempFile("PMT_Insert", ".sql")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)
    var rows = generateRows(existingPayloadID, newPayloadID)

    try {
      if (rows.HasElements) {
        var insertGenerator = InsertGenerator
        rows.each(\row -> IOUtils.write(insertGenerator.generate(row.TableName, row.ColumnNames, row.ColumnValues) + System.getProperty("line.separator"), fio,  Charset.defaultCharset()))

      } else IOUtils.write("No Payload ID found !", fio,  Charset.defaultCharset() )
      if (rows.HasElements) {
        var insertGenerator = InsertGenerator
        var status = insertGenerator.generate(CommonColumns.PREFIX + "PayloadStatus",
            {CommonColumns.PAYLOAD_ID, RepositoryCommonColumns.STATUS, RepositoryCommonColumns.GROUP_ID}
            , {newPayloadID, PayloadStatus.NEW, newPayloadID})
        IOUtils.write(status, fio, Charset.defaultCharset())
        IOUtils.write("commit;" + System.getProperty("line.separator"), fio,  Charset.defaultCharset())
      }
    } finally {
      fio.close()
    }
    WebUtil.copyFileToClient("text/sql", tmpFile)

  }

  static function generatePayloadFromPolicy(jobNumber: String) {
    var exporter = new DiscoverableEntityExporter(
    new ExportConfiguration().entityExporter(),  gw.transaction.Transaction.Current)
    var policy = Query.make (ABContact).compare(ABContact#PublicID, Relop.Equals,jobNumber).select().FirstResult

    var entityPayload = exporter.export(policy)
    //var serializePayloadGroup = createSerializablePayloadGroup(entityPayload, jobNumber)

    var tmpFile = File.createTempFile("PMT_Payload", ".json")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)
    try {
      IOUtils.write(PMT_JSON_SERIALIZER.serialize(entityPayload), fio, Charset.defaultCharset())
    } finally {
      fio.close()
    }
    WebUtil.copyFileToClient("text/json", tmpFile)
  }

  static function generateRowsFromPolicy(jobNumber: String, newPayloadID: String): List<Row> {
    var exporter = new DiscoverableEntityExporter(
    new ExportConfiguration().entityExporter(),  gw.transaction.Transaction.Current)
    var policy = Query.make (ABContact).compare(ABContact#PublicID, Relop.Equals,jobNumber).select().FirstResult
    var entityPayload = exporter.export(policy)
    var schema = CommonUtil.Schema
    var apiFactory = CommonUtil.DbApiFactory
    var rows = apiFactory.dbMetaConverter().payloadToRows(entityPayload, schema, newPayloadID)
    return rows
  }

  static function generateWebFileFromPolicy(jobNumber: String, newPayloadID: String) {
    var tmpFile = File.createTempFile("PMT_Insert", ".sql")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)
    var rows = generateRowsFromPolicy(jobNumber, newPayloadID)

    try {
      if (rows.HasElements) {
        var insertGenerator = InsertGenerator
        rows.each(\row ->
          IOUtils.write(insertGenerator.generate(row.TableName, row.ColumnNames, row.ColumnValues)
                + System.getProperty("line.separator"), fio, Charset.defaultCharset()))

      } else IOUtils.write("No Policy found !", fio,  Charset.defaultCharset())
      if (rows.HasElements) {
        var insertGenerator = InsertGenerator
        var status = insertGenerator.generate(CommonColumns.PREFIX + "PayloadStatus",
            {CommonColumns.PAYLOAD_ID, RepositoryCommonColumns.STATUS, RepositoryCommonColumns.GROUP_ID}
            , {newPayloadID, PayloadStatus.NEW, newPayloadID})
        IOUtils.write(status, fio,  Charset.defaultCharset())
      }
    } finally {
      fio.close()
    }
    WebUtil.copyFileToClient("text/sql", tmpFile)

  }

  static function generateDataModelCSV() {
    var tmpFile = File.createTempFile("ModelDump", ".csv")

    var wr = new DatamodelMapWriter(tmpFile)
    try {
      wr.writeDatamodelMapToCSV(tmpFile,false)
    } finally {
      wr = null
    }
    WebUtil.copyFileToClient("text/csv", tmpFile)
  }

  static function generateTypelistMapCSV() {
    var tmpFile = File.createTempFile("TypeList", ".csv")


    try {
      TypelistMapWriter.writeTypelistMapToCSV(tmpFile,tmpFile,false)
    } catch (e) {
    }
    WebUtil.copyFileToClient("text/csv", tmpFile)
  }

  private static property get InsertGenerator() : AbstractSqlInsertGenerator {
    switch (CommonUtil.whichDB()) {
      case CommonUtil.DBFlavor._POSTGRES:
        return new SqlPostgresInsertGenerator()
      case CommonUtil.DBFlavor._SQLSERVER:
        return new SqlSqlServerInsertGenerator()
      case CommonUtil.DBFlavor._ORACLE:
        return new SqlOracleInsertGenerator()
      default:
        return null
    }
  }

}