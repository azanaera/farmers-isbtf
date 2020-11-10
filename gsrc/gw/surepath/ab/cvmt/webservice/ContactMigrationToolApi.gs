package gw.surepath.ab.cvmt.webservice

uses gw.expimp.common.datamodel.entity.EntityPayload
uses gw.expimp.common.datamodel.schema.Schema
uses gw.expimp.dbinterfacefacade.DatabaseInterfaceFacadeHolder
uses gw.expimp.serialization.payload.SerializableEntityPayload
uses gw.expimp.serialization.schema.SerializableSchema
uses gw.expimp.serialization.serializer.simple.PmtJsonSerializer
uses gw.expimp.workorchestration.MigrationComponentsHolder
uses gw.xml.ws.WsiAuthenticationException
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService
uses org.apache.commons.io.IOUtils

uses java.io.ByteArrayInputStream
uses java.io.ByteArrayOutputStream
uses java.nio.charset.Charset
uses java.util.zip.GZIPInputStream
uses java.util.zip.GZIPOutputStream

/**
 * An API used for managing Claim Migration Tool
 * <p>
 * Makes it possible to create and drop PMT tables
 * <p>
 * System permission with code policymigrationtooledit is needed to access service
 * <p>
 * Local WSDL access - http://localhost:8180/cc/ws/gw/webservice/cc/cc1000/cvmt/ContactMigrationToolApi?WSDL
 */
@WsiWebService("http://guidewire.com/ab/ws/gw/surepath/ab/cvmt/webservice/ContactMigrationToolApi")
@Export
class ContactMigrationToolApi {

  /**
   * Creates migration related tables
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  public function createDbTables() {
    DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().createDbTables()
  }

  /**
   * Creates migration related tables except for migration status
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  function createDbTablesWithoutMigrationStatus() {
    DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().createDbTablesWithoutMigrationStatus()
  }

  /**
   * Drops migration related tables
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  function dropAllDbTables() {
    DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().dropAllDbTables()
  }

  /**
   * Drops migration related tables except for migration status
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  function dropDbTablesWithoutMigrationStatus() {
    DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().dropDbTablesWithoutMigrationStatus()
  }

  /**
   * Returns serialized schema
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  public function schema(): String {
    var schema = DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().inputSchema()
    return serialize(schema)
  }

  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  public function insertPayloads(serializedPayloads: String) {

    var identifieblePayloads = unmarshal(serializedPayloads, IdentifiablePayload[])

    var db = DatabaseInterfaceFacadeHolder.INSTANCE.getFacade()
    db.insertPayloads(
        identifieblePayloads.map(\elt -> elt.entityPayload.toEntityPayload()).fastList(),
        identifieblePayloads.map(\elt -> elt.payloadId).fastList(),
        identifieblePayloads.map(\elt -> elt.groupId).fastList())
  }

  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  public function outputInterfaceSchema(): String {
    var schema = DatabaseInterfaceFacadeHolder.INSTANCE.getFacade().outputSchema()
    return serialize(schema)
  }

  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @WsiPermissions({SystemPermissionType.TC_CONTACTMIGRATIONTOOLEDIT_SP})
  public function outputtedPayloads(serializedPayloadIds: String): String {
    var payloadIds = unmarshal(serializedPayloadIds, String[])
    var facade = DatabaseInterfaceFacadeHolder.INSTANCE.getFacade()

    var statuses = MigrationComponentsHolder.INSTANCE.getMigrationComponents().MigrationStatusRepository
        .readByPayloadIds(payloadIds)
        .partitionUniquely(\elt -> elt.PayloadId)

    var payloads = facade.readOutputPayloads(Arrays.asList(payloadIds))

    var result = new ArrayList<IdentifiablePayload>(payloadIds.length)
    for (var payloadId in payloadIds) {
      var payload = payloads.get(payloadId)
      var migrationStatus = statuses.get(payloadId)
      if (payload != null && migrationStatus != null) {
        result.add(identifiablePayload(migrationStatus.getGroupId(), migrationStatus.getPayloadId(), payload))
      }
    }

    return marshal(result)
  }

  private function unmarshal<T>(data: String, klazz: Class<T>): T {
    return fromJson(unzip(decodeBase64(data)), klazz);
  }

  private function marshal(data: Object): String {
    var serialized = new PmtJsonSerializer().serialize(data)
    return encodeBase64(zip(serialized.getBytes(Charset.forName("UTF-8"))))
  }

  private function fromJson<T>(jsonBytes: byte[], klazz: Class<T>): T {
    return new PmtJsonSerializer()
        .deserialize(new String(jsonBytes, Charset.forName("UTF-8")), klazz);
  }

  private function decodeBase64(data: String): byte[] {
    return Base64.getDecoder().decode(data);
  }

  private function encodeBase64(zippedData: byte[]): String {
    return Base64.getEncoder().encodeToString(zippedData)
  }

  private function unzip(content: byte[]): byte[] {
    var inputStream = new GZIPInputStream(new ByteArrayInputStream(content))
    try {
      return IOUtils.toByteArray(inputStream)
    } finally {
      inputStream.close()
    }
  }

  private function zip(serializedPayloads: byte[]): byte[] {
    using (var compressedBytesStream = new ByteArrayOutputStream()) {
      using (var gzipOutputStream = new GZIPOutputStream(compressedBytesStream)) {
        gzipOutputStream.write(serializedPayloads)
        gzipOutputStream.finish()
        return compressedBytesStream.toByteArray();
      }
    }
  }

  private function identifiablePayload(
      groupId: String,
      payloadId: String,
      payload: EntityPayload): IdentifiablePayload {
    var result = new IdentifiablePayload()
    result.GroupId = groupId
    result.PayloadId = payloadId
    result.EntityPayload = new SerializableEntityPayload(payload)
    return result
  }

  private function serialize(schema: Schema): String {
    return new PmtJsonSerializer().serialize(new SerializableSchema(schema))
  }
}