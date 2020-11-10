package gw.surepath.ab.cvmt.expimp.dbaccess.embededdatasource

uses java.lang.*

uses gw.surepath.ab.cvmt.expimp.properties.CvmtPropertiesConstants
uses gw.expimp.dbaccess.embededdatasource.DbConnectionProperties
uses gw.expimp.properties.*


public class CvmtInputDbConnectionProperties implements DbConnectionProperties {

    private final var propertiesProvider : PropertiesProvider
    public construct(propertiesProvider_0 : PropertiesProvider) {
        this.propertiesProvider = propertiesProvider_0
    }

    override public function connectionUrl() : String {
        return propertiesProvider.getProperty(CvmtPropertiesConstants.INPUT_URL)
    }

    override public function userName() : String {
        return propertiesProvider.getProperty(CvmtPropertiesConstants.INPUT_USERNAME)
    }

    override public function password() : String {
        return propertiesProvider.getProperty(CvmtPropertiesConstants.INPUT_PASSWORD)
    }

    override public function maxTotal() : int {
        return parseNonNegativeInteger(propertiesProvider.getProperty(CvmtPropertiesConstants.INPUT_MAX_TOTAL), CvmtPropertiesConstants.INPUT_MAX_TOTAL)
    }

    override public function maxIdle() : int {
        return parseNonNegativeInteger(propertiesProvider.getProperty(CvmtPropertiesConstants.INPUT_MAX_IDLE), CvmtPropertiesConstants.INPUT_MAX_IDLE)
    }

    override public function minIdle() : int {
        return parseNonNegativeInteger(propertiesProvider.getProperty(CvmtPropertiesConstants.INPUT_MIN_IDLE), CvmtPropertiesConstants.INPUT_MIN_IDLE)
    }

}
