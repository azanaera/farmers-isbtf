package gw.surepath.ab.cvmt.expimp.configuration

uses gw.expimp.properties.PropertiesConstants
uses gw.expimp.properties.PropertiesProvider
uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.surepath.ab.cvmt.expimp.properties.CvmtPropertiesConstants
uses gw.surepath.suite.integration.logging.StructuredLogger


public class CredentialsPluginPropertiesProvider_Ext implements PropertiesProvider {

  static final internal var INPUT_CREDENTIALS_PROPERTY : String = "gw.cvmt.db.input.credentials"
  static final internal var OUTPUT_CREDENTIALS_PROPERTY : String = "gw.cvmt.db.output.credentials"
  private final var credentialsPlugin : CredentialsPlugin
  public construct() {
    this(loadCredentialsPlugin())
  }

  public construct(_credentialsPlugin : CredentialsPlugin) {
    this.credentialsPlugin = _credentialsPlugin
  }

  override public function getProperty(key : String) : String {
    if (credentialsPlugin == null) {
      return null
    }
    try {
      if (CvmtPropertiesConstants.INPUT_USERNAME.equals(key)) {
        return getUsername(INPUT_CREDENTIALS_PROPERTY)
      }
      if (CvmtPropertiesConstants.INPUT_PASSWORD.equals(key)) {
        return getPassword(INPUT_CREDENTIALS_PROPERTY)
      }
      if (CvmtPropertiesConstants.OUTPUT_USERNAME.equals(key)) {
        return getUsername(OUTPUT_CREDENTIALS_PROPERTY)
      }
      if (CvmtPropertiesConstants.OUTPUT_PASSWORD.equals(key)) {
        return getPassword(OUTPUT_CREDENTIALS_PROPERTY)
      }
    }catch (exp : Exception){
      // If property not found,  it might be normal senrio.
      StructuredLogger.PLUGIN.info("Not able to find key for crdential provider ",
          :parameters = {"Key " -> key})

    }
    return null
  }

  private function getPassword(credentialsProperty : String) : String {
    return credentialsPlugin.retrieveUsernameAndPassword(credentialsProperty).getPassword()
  }

  private function getUsername(credentialsProperty : String) : String {
    return credentialsPlugin.retrieveUsernameAndPassword(credentialsProperty).getUsername()
  }

  private static function loadCredentialsPlugin() : CredentialsPlugin {
    if (Plugins.isEnabled(CredentialsPlugin)) {
      return Plugins.get(CredentialsPlugin)
    }
    return null
  }

}
