package gw.surepath.ab.cvmt.expimp.configuration

uses gw.expimp.properties.PropertiesProvider
uses gw.external.configuration.SubstitutionProperties


class SubstitutionPropertiesProvider_Ext implements PropertiesProvider {

  public static final var CONFIG : String = "CONFIG_"
  private final var substitutionProperties : SubstitutionProperties

  public construct() {
    this.substitutionProperties = new SubstitutionProperties()
  }

  function getProperty(key : String) : String {
    var externalProviderKey : String = CONFIG +key.toUpperCase().replace(".", "_")
    return substitutionProperties.lookupValue("config", externalProviderKey)
  }

}
