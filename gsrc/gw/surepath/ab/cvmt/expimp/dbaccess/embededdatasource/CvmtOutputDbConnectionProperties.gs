package gw.surepath.ab.cvmt.expimp.dbaccess.embededdatasource

uses java.lang.*

uses gw.surepath.ab.cvmt.expimp.properties.CvmtPropertiesConstants
uses gw.expimp.dbaccess.embededdatasource.DbConnectionProperties
uses gw.expimp.properties.*


public class CvmtOutputDbConnectionProperties implements DbConnectionProperties {

    private final var propertiesProvider : PropertiesProvider
    public construct(propertiesProvider_0 : PropertiesProvider) {
        this.propertiesProvider = propertiesProvider_0
    }

    override public function connectionUrl() : String {
        return propertiesProvider.getProperty(CvmtPropertiesConstants.OUTPUT_URL)
    }

    override public function userName() : String {
        return propertiesProvider.getProperty(CvmtPropertiesConstants.OUTPUT_USERNAME)
    }

    override public function password() : String {
        return propertiesProvider.getProperty(CvmtPropertiesConstants.OUTPUT_PASSWORD)
    }

    override public function maxTotal() : int {
        return parseNonNegativeInteger(propertiesProvider.getProperty(CvmtPropertiesConstants.OUTPUT_MAX_TOTAL), CvmtPropertiesConstants.OUTPUT_MAX_TOTAL)
    }

    override public function maxIdle() : int {
        return parseNonNegativeInteger(propertiesProvider.getProperty(CvmtPropertiesConstants.OUTPUT_MAX_IDLE), CvmtPropertiesConstants.OUTPUT_MAX_IDLE)
    }

    override public function minIdle() : int {
        return parseNonNegativeInteger(propertiesProvider.getProperty(CvmtPropertiesConstants.OUTPUT_MIN_IDLE), CvmtPropertiesConstants.OUTPUT_MIN_IDLE)
    }

}
