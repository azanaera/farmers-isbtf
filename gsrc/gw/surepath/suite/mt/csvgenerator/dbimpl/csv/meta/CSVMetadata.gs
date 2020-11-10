package gw.surepath.suite.mt.csvgenerator.dbimpl.csv.meta

uses gw.surepath.suite.mt.csvgenerator.dbimpl.csv.CSVColumn

class CSVMetadata {
  final var name: String as readonly Name
  final var csvColumns: List<CSVColumn>as readonly CSVColumns

  construct(_name: String, _csvColumns: List<CSVColumn>) {
    this.name = _name
    this.csvColumns = _csvColumns
  }
}