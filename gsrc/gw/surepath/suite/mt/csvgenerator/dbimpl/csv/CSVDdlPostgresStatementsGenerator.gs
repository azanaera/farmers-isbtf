package gw.surepath.suite.mt.csvgenerator.dbimpl.csv

uses gw.datatype.GWJdbcType

/**
 * Generates the Postgres specific schema information
 */
class CSVDdlPostgresStatementsGenerator extends AbstractCSVDdlStatementsGenerator {

  protected override function resolveType(jdbcType: GWJdbcType, length: int, precision: int, scale: int): String {

    if (isCharacter(jdbcType)) {
      if (length > 0) {
        return "varchar(" + length + ")"
      }
      return "varchar(4000)"
    }

    if (isNumber(jdbcType)) {
      var retVal = getNumberType(jdbcType)
      if(retVal == "numeric" and (scale > 0 or precision > 0)) {
        return retVal + "(" + (precision == 0 ? "*" : precision) + "," + scale + ")"
      }
      return retVal
    }

    if (isBinary(jdbcType)) {
      return "bytea"
    }

    if (isCharacterLob(jdbcType)) {
      return "text"
    }

    if (isBoolean(jdbcType)) {
      return "boolean"
    }

    if (isDate(jdbcType)) {
      return "timestamp"
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
      default:
        return "numeric"
    }
  }
}