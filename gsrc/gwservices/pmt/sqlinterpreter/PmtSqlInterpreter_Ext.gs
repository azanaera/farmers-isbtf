package gwservices.pmt.sqlinterpreter

uses gw.surepath.suite.integration.logging.StructuredLogger
uses gw.expimp.dbaccess.DbFactoriesHolder

uses java.sql.Connection
uses java.sql.PreparedStatement
uses java.sql.ResultSet
uses java.sql.SQLException

class PmtSqlInterpreter_Ext {

  private static final var LOGGER = StructuredLogger.TOOLS
  private var inputConnection : Connection
  private var outputConnection : Connection
  private var inputColumnLabels : List<String> as InputColumnLabels = {"No Results"}
  private var inputRows : List<List<String>> as InputRows = {{}}
  private var outputColumnLabels : List<String> as OutputColumnLabels = {"No Results"}
  private var outputRows : List<List<String>> as OutputRows = {{}}
  public var errorMessage : String as ErrorMessage

  construct() {
    inputConnection = DbFactoriesHolder.INSTANCE.inputDataSourceFactory().dataSource().Connection
    outputConnection = DbFactoriesHolder.INSTANCE.outputDataSourceFactory().dataSource().Connection
  }

  public function evaluateInputSQL( query : String) : ResultSet {

    errorMessage = null

    var stm : PreparedStatement
    var result : ResultSet

    try{
      stm = inputConnection.prepareStatement(query)

      try {
        result = stm.executeQuery()
        inputColumnLabels = findMetadataColumns(query, result)
        inputRows = findRowColumns(query, result)
      }catch (e : SQLException) {
        LOGGER.error("Error occurred when executing query", PmtSqlInterpreter_Ext#evaluateInputSQL(String), e)
        errorMessage = e.Message
      }
      finally{
        if(result != null){
          result.close()
        }
      }

    }catch (e : SQLException){
      LOGGER.error("Error occurred when executing query", PmtSqlInterpreter_Ext#evaluateInputSQL(String), e)
      errorMessage = e.Message
    }
    finally {
      if(stm!= null){
        stm.close()
      }
    }
    return result
  }

  public function evaluateOutputSQL( query : String) : ResultSet {

    errorMessage = null
    var stm : PreparedStatement
    var result : ResultSet

    try{
      stm = outputConnection.prepareStatement(query)
      result = stm.executeQuery()

      outputColumnLabels = findMetadataColumns(query, result)
      outputRows = findRowColumns(query, result)

    }catch (e : SQLException){
      LOGGER.error("Error occurred when executing query",PmtSqlInterpreter_Ext#evaluateInputSQL(String), e)
      errorMessage = e.Message
    }
    finally {
      if(stm!= null){
        stm.close()
      }
    }
    return result
  }

  private function findMetadataColumns(query: String, rs : ResultSet) : List<String> {

    if(!query.startsWithIgnoreCase("select")){
      return {"Update Executed"}
    }

    if(rs != null) {
      var meta = rs.getMetaData()
      var columnList = new ArrayList<String>()
      for (i in 1..meta.ColumnCount) {
        columnList.add(meta.getColumnLabel(i))
      }

      return columnList
    }
    return {}
  }

  private function findRowColumns(query : String, rs : ResultSet) : List<List<String>> {

    if(!query.startsWithIgnoreCase("select")){
      return {{}}
    }

    if(rs != null) {
      var metadata = findMetadataColumns(query,rs)
      var rows = new ArrayList<List<String>>()
      while (rs.next()) {
        var row = new ArrayList<String>()
        for (column in metadata) {
          row.add(rs.getObject(column) as String)
        }
        rows.add(row)
      }
      return rows
    }
    return {{}}
  }

}