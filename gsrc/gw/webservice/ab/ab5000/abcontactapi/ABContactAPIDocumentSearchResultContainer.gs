package gw.webservice.ab.ab5000.abcontactapi

uses gw.webservice.ab.ab5000.abcontactapi.ABContactAPIDocumentInfo
uses gw.webservice.ab.ab5000.abcontactapi.IABContactAPIDocumentInfo
uses gw.webservice.ab.ab5000.abcontactapi.IABContactAPIDocumentSearchResultContainer


/**
 * API for Document Management. Retrieval of documents linked to ABContacts.
 */
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab5000/abcontactapi/ABContactAPIDocumentSearchResultContainer" )
final class ABContactAPIDocumentSearchResultContainer implements IABContactAPIDocumentSearchResultContainer {

  construct() {}

  var _totalResults : Integer as TotalResults
  public var Results : gw.webservice.ab.ab5000.abcontactapi.ABContactAPIDocumentInfo[]


  override function updateResults(results: List<IABContactAPIDocumentInfo>) {
    Results = results.toArray(new ABContactAPIDocumentInfo[results.size()])
  }
}