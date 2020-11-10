package gw.surepath.ab.cvmt.webservice

uses cvmt.ab.configuration.expimp.ExportConfiguration
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.expimp.common.datamodel.entity.EntityPayload
uses gw.expimp.common.exporter.entity.DiscoverableEntityExporter

uses java.util.function.Supplier

internal class ContactPayloadFinder {

  internal function contactPayloadByPayloadId(payloadId : String): Optional<EntityPayload> {
    return createContactPayload(\->
        Query.make(CvmtABContactInfo_SP)
            .compare(CvmtABContactInfo_SP#PayloadID, Relop.Equals, payloadId)
            .select()?.first()?.ABContact)
  }

  private function createContactPayload(contactSupplier : Supplier<ABContact>): Optional<EntityPayload> {
    var payload: Optional<EntityPayload>
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var contact = contactSupplier.get()
      if (contact != null) {
        var exporter = new DiscoverableEntityExporter(
            new ExportConfiguration().entityExporter(), bundle
        )
        payload = Optional.of(exporter.export(contact))
      } else {
        payload = Optional.empty()
      }
    })

    return payload
  }
}