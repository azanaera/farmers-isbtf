package gw.surepath.suite.mt.csvgenerator.dbimpl.csv

uses gw.datatype.GWJdbcType
uses gw.expimp.dbaccess.query.Column

/**
 * Abastract parent that generates a CSV file representing the schema information for the PMT schema
 */
abstract class AbstractCSVDdlStatementsGenerator {


  /**
   * Creates the table schema information for all table columns, includes datatype
   * @param tableName
   * @param columns
   * @return  string representing the table schema information
   */
  function createTableStatement(tableName: String, columns: List<CSVColumn>): String {
    var statement = ""
    for (var col in columns) {
      statement = statement + "\"" + tableName + "\",\"" + columnStm(col) + "\"\n"
    }
    return statement
  }

  private function columnStm(col: CSVColumn): String {

    var newColDelimiter = "\",\""
    var colStm = col.Column.getName()
        + newColDelimiter
        + resolveSqlType(col.Column)
    colStm += newColDelimiter
    if (col.Column.isNotNull()) {
      colStm += "not null"
    } else {
      colStm += "nullable"
    }
    colStm += newColDelimiter
    if (col.Column.isPrimaryKey()) {
      colStm += "primary key"
    }


    colStm += newColDelimiter + col.TypekeyName
    colStm += newColDelimiter + col.SingleFK
    colStm += newColDelimiter + col.MultipleFK
    return colStm

  }

  private function resolveSqlType(col: Column): String {
    return resolveType(GWJdbcType.valueOf(col.getJdbcType()), col.getLength(), col.getPrecision(), col.getScale())
  }

  abstract protected function resolveType(jdbcType: GWJdbcType, lenght: int, precision: int, scale: int): String


}