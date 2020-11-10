package gw.surepath.suite.mt.csvgenerator.dbimpl.csv

uses gw.api.web.WebUtil
uses gw.surepath.suite.mt.CommonUtil
uses org.apache.commons.io.IOUtils

uses java.io.File
uses java.io.FileOutputStream
uses java.nio.charset.Charset

/**
 * Created by dell-sai on 10/1/2018.
 */
class CSVUtil {



  static function generateWebFile() {

    var tableMetas = CommonUtil.CSVMetadata
    //var schemaGenerator = new AbstractCSVDdlStatementsGenerator()
    var schemaGenerator = StatementGenerator
    var stg = "TableName , Field Name , Data Type , IsNull , Is Primary Key , Type Key ,Foreign Key , Multiple FK Type \n"
    for (tableMeta in tableMetas) {
      stg = stg + schemaGenerator.createTableStatement(tableMeta.Name, tableMeta.CSVColumns)
    }


    var tmpFile = File.createTempFile("PMT_Schema", ".csv")
    // Write output in the file
    var fio = new FileOutputStream(tmpFile)

    try {
      IOUtils.write(stg, fio, Charset.defaultCharset())
    } finally {
      fio.close()
    }
    WebUtil.copyFileToClient("text/csv", tmpFile)

  }

  private static property get StatementGenerator() : AbstractCSVDdlStatementsGenerator {
    switch (CommonUtil.whichDB()) {
      case CommonUtil.DBFlavor._POSTGRES:
        return new CSVDdlPostgresStatementsGenerator()
      case CommonUtil.DBFlavor._SQLSERVER:
        return new CSVDdlSqlServerStatementsGenerator()
      case CommonUtil.DBFlavor._ORACLE:
        return new CSVDdlOracleStatementsGenerator()
      default:
        return null
    }
  }

}