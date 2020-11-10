package gw.webservice.ab.ab5000.abcontactapi

uses gw.webservice.ab.ab5000.abcontactapi.ABContactAPIFindDuplicatesResult
uses gw.webservice.ab.ab5000.abcontactapi.IABContactAPIFindDuplicatesResult
uses gw.webservice.ab.ab5000.abcontactapi.IABContactAPIFindDuplicatesResultContainer


@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab5000/abcontactapi/ABContactAPIFindDuplicatesResultContainer" )
final class ABContactAPIFindDuplicatesResultContainer implements IABContactAPIFindDuplicatesResultContainer {

  construct() {}

  var _totalResults : Integer as TotalResults
  public var Results : gw.webservice.ab.ab5000.abcontactapi.ABContactAPIFindDuplicatesResult[]

  override function updateResults(value: List<IABContactAPIFindDuplicatesResult>) {
    Results = value.toArray(new ABContactAPIFindDuplicatesResult[value.size()])
  }
}
