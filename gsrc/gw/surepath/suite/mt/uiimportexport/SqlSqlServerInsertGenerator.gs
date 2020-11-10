package gw.surepath.suite.mt.uiimportexport

uses gw.api.database.spatial.SpatialPoint
uses gw.entity.TypeKey
uses java.math.BigDecimal
uses java.text.SimpleDateFormat

class SqlSqlServerInsertGenerator extends AbstractSqlInsertGenerator {

  override protected function values(values:List<Object>) : String {
    return values.map(\val -> {
      if (val typeis String) {
        return "'" + val.replaceAll("'", "''") + "'"
      } else if (val typeis Boolean) {
        return (val == true ? 1 : 0)
      } else if (val typeis Integer) {
        return val
      } else if (val typeis Long) {
        return val
      } else if (val typeis Float) {
        return val
      } else if (val typeis Double) {
        return val
      } else if (val typeis BigDecimal) {
        return val
      } else if (val typeis Date) {
        var df = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
        return "cast('" + df.format(val) + "' as datetime)"
      } else if (val typeis TypeKey) {
        return val.Code
      } else if (val typeis SpatialPoint) {
        //return val.getWellKnownText()
        return null
      } else {
        var errorMessage = "Type with no statement setter: " + typeof val
        ///   log.error(errorMessage)
        throw new RuntimeException(errorMessage)
      }
    }).join(", ")
  }
}