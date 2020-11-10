package gw.surepath.suite.mt.csvgenerator.dbimpl.csv


uses gw.expimp.dbaccess.query.Column

/**
 * Created by dell-sai on 9/17/2018.
 */
class CSVColumn {


  static function newColumn(_column: Column): ColumnBuilder {
    var builder = new ColumnBuilder()
    builder.column = _column
    return builder
  }

  // Can't extend the Column.gs as construtor is private
  private final var column: Column
  private final var singleFK: String
  private final var multipleFK: String
  private final var typeKeyName: String


  private construct(_column: Column,
                    _singleFK: String,
                    _multipleFK: String,
                    _typekeyName: String) {

    this.column = _column
    this.singleFK = _singleFK
    this.multipleFK = _multipleFK
    this.typeKeyName = _typekeyName
  }

  public property get MultipleFK() : String {
    return multipleFK
  }

  public property get SingleFK() : String {
    return singleFK
  }

  public property get Column() : Column {
    return column
  }

  public property get TypekeyName() : String {
    return typeKeyName
  }

  public static class ColumnBuilder {
    private var singleFK = ""
    private var multipleFK = ""
    private var typeKeyName = ""
    private var column: Column = null

    public function withColumn(type: Column): ColumnBuilder {
      column = type
      return this
    }

    public function withSingleFK(type: String): ColumnBuilder {
      singleFK = type
      return this
    }

    public function withMultipleFK(type: String): ColumnBuilder {
      multipleFK = type
      return this
    }

    public function withTypekeyName(type: String): ColumnBuilder {
      typeKeyName = type
      return this
    }

    public function create(): CSVColumn {
      return new CSVColumn(column, singleFK, multipleFK, typeKeyName)
    }
  }

}