package cvmt.ab.configuration;

uses gw.api.financials.*;
uses gw.expimp.common.exporter.fieldconverter.*;
uses gw.expimp.common.importer.fieldparser.*;
uses gw.lang.reflect.*;

uses java.math.*;
uses java.util.*;

internal class DbFieldsRepresentationConfiguration
{
    static function dbToEntityConvertersRegistry(): FieldConvertersRegistry
    {
        return FieldConvertersRegistry.builder()
            .withConverterForClass(Date, new DateFieldConverter("yyyy-MM-dd HH:mm:ss"))
            .withConverterForClass(CurrencyAmount, new ToStringFieldConverter())
            .build();
    }

    static function entityToDbFieldParsersRegistry(): FieldParserRegistry
    {
        return FieldParserRegistry.builder()
            .withFieldParserForType(TypeSystem.get(Date).getName(), new DateFieldParser("yyyy-MM-dd HH:mm:ss"))
            .withFieldParserForType(TypeSystem.get(CurrencyAmount).getName(), new BigDecimalFieldParser())
            .build();
    }

    static function entityToDbTypeCustomMapping():Map<String, String>
    {
        var map = new HashMap<String, String>();
        map.put(TypeSystem.get(CurrencyAmount).getName(), TypeSystem.get(BigDecimal).getName());
        return map;
    }

    private construct()
    {
    }
}