package wsi.remote.gw.webservice.cc

uses javax.xml.namespace.QName

uses gw.api.system.ABLoggerCategory
uses gw.surepath.suite.integration.logging.StructuredLogger
uses gw.xml.ws.WsdlConfig
uses gw.xml.ws.IWsiWebserviceConfigurationProvider

@Export
class CCConfigurationProvider implements IWsiWebserviceConfigurationProvider {

  private static var _logger = StructuredLogger.INTEGRATION
  override function configure( serviceName : QName, portName : QName, config : WsdlConfig )  {
    try {
      var cred = gw.plugin.credentials.CredentialsUtil.getCredentialsFromPlugin("wsi.remote.gw.webservice.cc.configurationprovider")
      config.Guidewire.Authentication.Username = cred.getUsername()
      config.Guidewire.Authentication.Password = cred.getPassword()
    }catch(e:Exception){
      _logger.error("Authentication for WSI web services that talk to ContactManager not found", CCConfigurationProvider#configure(QName, QName, WsdlConfig))
    }
  }

}
