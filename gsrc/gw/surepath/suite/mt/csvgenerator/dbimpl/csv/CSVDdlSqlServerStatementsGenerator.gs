package gw.surepath.suite.mt.csvgenerator.dbimpl.csv

uses gw.datatype.GWJdbcType

/**
 *  Generates the SQL Server specific schema information
 */
class CSVDdlSqlServerStatementsGenerator extends AbstractCSVDdlStatementsGenerator {


  protected override function resolveType(jdbcType: GWJdbcType, lenght: int, precision: int, scale: int): String {

    if (isCharacter(jdbcType)) {
      if (lenght > 0) {
        return "varchar(" + lenght + ")"
      }
      return "varchar(4000)"
    }

    if (isNumber(jdbcType)) {
      var retVal = getNumberType(jdbcType)
      if((retVal == "numeric" or retVal == "decimal") and (scale > 0 or precision > 0)) {
        return retVal + "(" + (precision == 0 ? "*" : precision) + "," + scale + ")"
      }
      return retVal
    }

    if (isBinary(jdbcType)) {
      return "varbinary(max)"
    }

    if (isCharacterLob(jdbcType)) {
      return "varchar(max)"
    }

    if (isBoolean(jdbcType)) {
      return "bit"
    }

    if (isDate(jdbcType)) {
      return "datetime"
    }

    return "varchar(4000)"
  }

  private function isDate(jdbcType: GWJdbcType): boolean {
    return jdbcType == TIMESTAMP
  }

  private function isBoolean(jdbcType: GWJdbcType): boolean {
    var bools = {GWJdbcType.BIT, GWJdbcType.BOOLEAN}
    return bools.contains(jdbcType)
  }

  private function isCharacterLob(jdbcType: GWJdbcType): boolean {
    return jdbcType == CLOB
  }

  private function isBinary(jdbcType: GWJdbcType): boolean {
    var binaries = {GWJdbcType.BLOB, GWJdbcType.VARBINARY, GWJdbcType.SPATIAL_POLYGON}
    return binaries.contains(jdbcType)
  }
  //this has not been updated from Orale to SQL Server
  private function isNumber(jdbcType:GWJdbcType): boolean {
    var numbers = {GWJdbcType.INTEGER, GWJdbcType.BIGINT, GWJdbcType.DECIMAL, GWJdbcType.FLOAT, GWJdbcType.DOUBLE}
    return numbers.contains(jdbcType)
  }

  private function isCharacter(jdbcType: GWJdbcType): boolean {
    return jdbcType == VARCHAR
  }

  private function getNumberType(jdbcType: GWJdbcType) : String {
    switch (jdbcType) {
      case BIGINT:
        return "bigint"
      case INTEGER:
        return "integer"
      case FLOAT:
      case DOUBLE:
        return "float"
      case DECIMAL:
        return "decimal"
      default:
        return "numeric"
    }
  }
}