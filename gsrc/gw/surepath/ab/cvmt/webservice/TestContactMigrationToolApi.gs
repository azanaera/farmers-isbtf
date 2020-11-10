package gw.surepath.ab.cvmt.webservice

uses gw.api.locale.DisplayKey
uses gw.api.webservice.exception.RequiredFieldException
uses gw.expimp.common.datamodel.entity.EntityPayload
uses gw.expimp.dbinterfacefacade.DatabaseInterfaceFacadeHolder
uses gw.expimp.workorchestration.statusreporter.MigrationStatus
uses gw.xml.ws.WsiAuthenticationException
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

/**
 * WARNING: This web service should be used for testing only, it can be disabled on PROD by not assigning testclaimmigrationtooledit to users
 * <p>
 * An API used for testing Contact Migration Tool
 * <p>
 * Makes it possible to:
 * <ul>
 * <li>Load sample data - works only in dev mode (gw.server.mode=dev)</li>
 * <li>Insert payload into input interface</li>
 * <li>Read migration status for given payload</li>
 * </ul>
 * <p>
 * System permission with code testclaimmigrationtooledit is needed to access service
 * <p>
 * Local WSDL access - http://localhost:8180/cc/ws/gw/webservice/cc/cc1000/cvmt/TestContactMigrationToolApi?WSDL
 */
@WsiWebService("http://guidewire.com/ab/ws/gw/surepath/ab/cvmt/webservice/TestContactMigrationToolApi")
@Export
class TestContactMigrationToolApi {

  private final var entityPayloadSerializer: EntityPayloadSerializer
  private final var claimPayloadFinder: ContactPayloadFinder

  construct() {
    entityPayloadSerializer = new EntityPayloadSerializer()
    claimPayloadFinder = new ContactPayloadFinder()
  }

  /**
   * Loads small data set into CC database
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_TESTCONTACTMIGRATIONTOOLEDIT_SP})
  public function loadSampleData() {
    new gw.command.ImportSampleData().import()
  }

  /**
   * Retrieves migrated claim by payload id from Claim Center database and returns it in polimpex JSON format
   *
   * @param payloadId payload id is required search parameter
   * @return claim payload json string, null in case claim not found
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_TESTCONTACTMIGRATIONTOOLEDIT_SP})
  public function readClaimPayloadByPayloadId(payloadId: String): String {
    require(payloadId, "payloadId")
    return serializeOrNull(claimPayloadFinder.contactPayloadByPayloadId(payloadId))
  }

  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_TESTCONTACTMIGRATIONTOOLEDIT_SP})
  public function insertPayload(payload: String, payloadId: String, groupId: String) {
    require(payload, "payload")
    require(payloadId, "payloadId")
    require(groupId, "groupId")

    var entityPayload = deserialize(payload)
    DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().insertPayloads({entityPayload}, {payloadId}, {groupId})
  }

  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_TESTCONTACTMIGRATIONTOOLEDIT_SP})
  public function readMigrationStatus(groupId: String): MigrationStatusInfo[] {
    require(groupId, "groupId")

    var migrationStatuses = DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().readMigrationStatusByGroupId(groupId)

    return migrationStatuses.map(\status -> createPayloadMigrationStatus(status)).toTypedArray()
  }

  private function serializeOrNull(entityPayloadOption: Optional<EntityPayload>): String {
    return entityPayloadOption.isPresent() ? entityPayloadSerializer.serialize(entityPayloadOption.get()) : null
  }

  private function deserialize(payload: String): EntityPayload {
    return entityPayloadSerializer.deserialize(payload)
  }

  private function createPayloadMigrationStatus(status: MigrationStatus): MigrationStatusInfo {
    var migrationStatusInfo = new MigrationStatusInfo()

    migrationStatusInfo.payloadId = status.PayloadId
    migrationStatusInfo.groupId = status.GroupId
    migrationStatusInfo.status = status.Status
    migrationStatusInfo.message = status.Message

    return migrationStatusInfo
  }

  private function require(value: Object, parameterName: String) {
    if (value == null) {
      throw new RequiredFieldException(DisplayKey.get("Webservice.Error.MissingRequiredField", parameterName))
    }
  }
}