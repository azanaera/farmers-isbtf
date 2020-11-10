package gw.surepath.suite.mt.datamapping

uses com.guidewire.pl.system.service.parser.elements.elements.AbstractNode

class SequenceNumber extends AbstractNode {

  private var _number : int
  private var _key : String

  construct() {}

  public property get Number() : int {
    return this._number
  }

  public property set Number(number : int) {
    this._number = number
  }

  public property get Key() : String {
    return this._key
  }

  public property set Key(key : String) {
    this._key = key
  }

}