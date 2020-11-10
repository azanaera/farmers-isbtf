package gw.surepath.ab.cvmt.webservice

uses gw.xml.ws.annotation.WsiExportable

/**
 * Detailed information about payload migration status
 */
@SuppressWarnings("VariableNaming")
@WsiExportable
final class MigrationStatusInfo {

  /**
   * Payload id
   */
  public var payloadId: String

  /**
   * Group id
   */
  public var groupId: String

  /**
   * Migration status: MIGRATING, MIGRATED, REJECTED, FAILING, FAILED
   */
  public var status: String

  /**
   * Error message in case of REJECTED, FAILING, FAILED statuses, otherwise empty string
   */
  public var message: String
}