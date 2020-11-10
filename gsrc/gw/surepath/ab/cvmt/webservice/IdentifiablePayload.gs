package gw.surepath.ab.cvmt.webservice

uses gw.expimp.serialization.payload.SerializableEntityPayload

@SuppressWarnings("VariableNaming")
class IdentifiablePayload {

  public var groupId: String as GroupId
  public var payloadId: String as PayloadId
  public var entityPayload : SerializableEntityPayload as EntityPayload
}