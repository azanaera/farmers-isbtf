package ext.ABContact.Enhancement

enhancement ABContactEnhancement : ABContact {


  property get legalLOBCode_Ext() : typekey.LineBusiness_Ext[] {
    var lobs = this.LegalLOBs_Ext
    var result = new java.util.ArrayList<typekey.LineBusiness_Ext>()
    for (var lob in lobs) {
      result.add(lob.LineBusiness)
    }
    return result.toTypedArray()
  }

  property set legalLOBCode_Ext(value : typekey.LineBusiness_Ext[]) {
    var lobs = new java.util.ArrayList<entity.LegalLOB_Ext>()
    for (var lobtp in value) {
      var lob = new LegalLOB_Ext()
      lob.LineBusiness = lobtp
      lobs.add(lob)
    }
    this.LegalLOBs_Ext = lobs.toTypedArray()
  }
  property get legalClaimCode_Ext() : typekey.LegalClaimType_Ext[] {
    var cts = this.LegClaimTypes_Ext
    var result = new java.util.ArrayList<typekey.LegalClaimType_Ext>()
    for (ct  in cts) {
      result.add(ct.LegalClaimType)
    }
    return result.toTypedArray()
  }

  property set legalClaimCode_Ext(value : typekey.LegalClaimType_Ext[]) {
    var cts = new java.util.ArrayList<entity.LegClaimType_Ext>()
    for (var ctcd in value) {
      var ct = new entity.LegClaimType_Ext()
      ct.LegalClaimType = ctcd
      cts.add(ct)
    }
    this.LegClaimTypes_Ext = cts.toTypedArray()
  }
  property get CoverageDefence_Ext() : typekey.CovDefense_Ext[] {
    var cts = this.LegalCovDefenses_Ext
    var result = new java.util.ArrayList<typekey.CovDefense_Ext>()
    for (ct  in cts) {
      result.add(ct.CovDefense)
    }
    return result.toTypedArray()
  }

  property set CoverageDefence_Ext(value : typekey.CovDefense_Ext[]) {
    var cts = new java.util.ArrayList<LegalCovDefense_Ext>()
    for (var ctcd in value) {
      var ct = new entity.LegalCovDefense_Ext()
      ct.CovDefense = ctcd
      cts.add(ct)
    }
    this.LegalCovDefenses_Ext = cts.toTypedArray()
  }



}
