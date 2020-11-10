package gw.surepath.ab.cvmt.webservice

uses gw.expimp.common.datamodel.entity.EntityPayload
uses gw.expimp.serialization.payload.SerializableEntityPayload
uses gw.expimp.serialization.serializer.JsonSerializer
uses gw.expimp.serialization.serializer.simple.PmtJsonSerializer

class EntityPayloadSerializer {

  private final var jsonSerializer: JsonSerializer

  internal construct() {
    jsonSerializer = new PmtJsonSerializer()
  }

  internal function serialize(entityPayload: EntityPayload): String {
    return jsonSerializer.serialize(new SerializableEntityPayload(entityPayload))
  }

  internal function deserialize(policyPayload: String): EntityPayload {
    var serializable = jsonSerializer.deserialize<SerializableEntityPayload>(policyPayload, SerializableEntityPayload)
    return serializable.toEntityPayload()
  }
}