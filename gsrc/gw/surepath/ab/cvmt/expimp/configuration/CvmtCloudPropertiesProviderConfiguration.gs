package gw.surepath.ab.cvmt.expimp.configuration

uses java.lang.*

uses com.guidewire.pl.system.dependency.*
uses gw.surepath.ab.cvmt.expimp.properties.CvmtPropertiesConstants
uses gw.expimp.configuration.PropertiesProviderConfiguration
uses gw.expimp.properties.*
uses gw.plugin.credentials.*

@SuppressWarnings("HiddenPackageReference")
public class CvmtCloudPropertiesProviderConfiguration implements PropertiesProviderConfiguration {

  override public function propertiesProvider() : PropertiesProvider {
    return new EnvironmentAwareProperties(new ChainPropertiesProvider({
        new CredentialsPluginPropertiesProvider_Ext(),
        new SubstitutionPropertiesProvider_Ext(),
        new SystemAndFileBasedProperties("config/cvmt", "cvmt.properties")
    }), environmentName())
  }

  private function environmentName() : String {
    var environment = PLDependencies.getEnvironment()
    return environment != null ? environment.getEnv() : null
  }

  private static function loadCredentialsPlugin() : CredentialsPlugin {
    if (PLDependencies.getPluginConfig().isPluginEnabled(CredentialsPlugin)) {
      return PLDependencies.getPluginConfig().getPlugin(CredentialsPlugin)
    }
    return null
  }

}
