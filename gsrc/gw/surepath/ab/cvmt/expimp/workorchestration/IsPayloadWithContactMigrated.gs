package gw.surepath.ab.cvmt.expimp.workorchestration

uses gw.api.database.Queries
uses gw.api.database.Relop
uses gw.expimp.pmt.datamodel.IdentifiablePayload
uses gw.expimp.workorchestration.IsPayloadMigrated

public class IsPayloadWithContactMigrated implements IsPayloadMigrated {

    override public function check(payload : IdentifiablePayload) : boolean {
        var cvmtClaimInfo = Queries.createQuery(CvmtABContactInfo_SP.TYPE).compare(CvmtABContactInfo_SP.PAYLOADID_PROP.get(),
            Relop.Equals, payload.getPayloadId()).select().getAtMostOneRow()
        return cvmtClaimInfo != null
    }

}
