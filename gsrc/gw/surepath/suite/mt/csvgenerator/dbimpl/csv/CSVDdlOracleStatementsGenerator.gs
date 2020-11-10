package gw.surepath.suite.mt.csvgenerator.dbimpl.csv

uses gw.datatype.GWJdbcType

/**
 * Generates the Postgres specific schema information
 */
class CSVDdlOracleStatementsGenerator extends AbstractCSVDdlStatementsGenerator {

  protected override function resolveType(jdbcType: GWJdbcType, lenght: int, precision: int, scale: int): String {

    if (isCharacter(jdbcType)) {
      if (lenght > 0) {
        return "varchar2(" + lenght + ")"
      }
      return "varchar2(4000)"
    }

    if (isNumber(jdbcType)) {
      if (scale > 0 || precision > 0) {
        return "number(" + (precision == 0 ? "*" : precision) + "," + scale + ")"
      }
      return "number"
    }

    if (isBinary(jdbcType)) {
      return "blob"
    }

    if (isCharacterLob(jdbcType)) {
      return "clob"
    }

    if (isBoolean(jdbcType)) {
      return "number(1)"
    }

    if (isDate(jdbcType)) {
      return "timestamp"
    }

    return "varchar2(4000)"
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
}