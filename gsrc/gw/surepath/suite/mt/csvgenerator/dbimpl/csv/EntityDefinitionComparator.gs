package gw.surepath.suite.mt.csvgenerator.dbimpl.csv

uses gw.expimp.common.datamodel.schema.EntityDefinition

// BB:custom
class EntityDefinitionComparator implements Comparator<EntityDefinition> {

  override function compare(ed1: EntityDefinition, ed2: EntityDefinition): int {

    var typesCompared = ed1.Type.compareTo(ed2.Type)
    if (typesCompared == 0 && ed1.ParentType != null && ed2.ParentType != null) {
      return ed1.ParentType.compareTo(ed2.ParentType)
    }
    return typesCompared
  }
}