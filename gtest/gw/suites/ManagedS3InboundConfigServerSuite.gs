package gw.suites

uses gw.api.test.ABServerTestClassBase
uses gw.api.test.SuiteBuilder
uses junit.framework.Test

@Export
class ManagedS3InboundConfigServerSuite {
  public static final var NAME : String = "ABManagedS3InboundConfigServerSuite"

  public static function suite() : Test {
    return new SuiteBuilder(ABServerTestClassBase)
        .withSuiteName(NAME)
        .build()
  }
}