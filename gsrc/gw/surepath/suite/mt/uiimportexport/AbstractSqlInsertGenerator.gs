package gw.surepath.suite.mt.uiimportexport

abstract class AbstractSqlInsertGenerator {

  function generate(tableName: String, columnNames: List<String>, columnValues: List<Object>): String {
    return rowToQuery(tableName, columnNames, columnValues)
  }

  function rowToQuery(tableName: String, columnNames: List<String>, columnValues: List<Object>): String {
    return "insert into "
        + tableName
        + "("
        + columnNames(columnNames)
        + ") values ("
        + values(columnValues)
        + ") ;"
  }

  private function columnNames(names: List<String>): String {
    return names.join(", ")
  }

  abstract protected function values(values:List<Object>) : String

}