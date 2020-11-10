package gw.webservice.ab.ab5000.abcontactapi

uses gw.webservice.ab.ab5000.abcontactapi.ABContactAPISearchResult
uses gw.webservice.ab.ab5000.abcontactapi.IABContactAPISearchResult
uses gw.webservice.ab.ab5000.abcontactapi.IABContactAPISearchResultContainer

@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab5000/abcontactapi/ABContactAPISearchResultContainer" )
final class ABContactAPISearchResultContainer implements IABContactAPISearchResultContainer {

  var _totalResults : Integer as TotalResults
  public var Results      : gw.webservice.ab.ab5000.abcontactapi.ABContactAPISearchResult[]

  override function updateResults(value: List<IABContactAPISearchResult>) {
    Results = value.toArray(new ABContactAPISearchResult[value.size()])
  }
}
