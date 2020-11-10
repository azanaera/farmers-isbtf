package gw.suites

uses gw.api.test.ABUnitTestClassBase
uses gw.api.test.SuiteBuilder
uses junit.framework.Test

@Export
class ManagedS3OutboundConfigUnitSuite {
  public static final var NAME : String = "ABManagedS3OutboundConfigUnitSuite"

  public static function suite() : Test {
    return new SuiteBuilder(ABUnitTestClassBase)
        .withSuiteName(NAME)
        .build()
  }
}