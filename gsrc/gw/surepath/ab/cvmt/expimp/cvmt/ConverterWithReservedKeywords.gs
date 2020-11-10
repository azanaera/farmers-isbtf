package gw.surepath.ab.cvmt.expimp.cvmt

uses gw.expimp.datafeed.dbmeta.NameShortener

public final class ConverterWithReservedKeywords implements NameShortener {

    private final var shortener : NameShortener
    private final var reservedKeywords : List<String>
    public construct(nameShortener : NameShortener, reservedKeywords_0 : List<String>) {
        this.shortener = nameShortener
        this.reservedKeywords = reservedKeywords_0
    }

    override public function generate(name : String) : String {
        return reservedKeywords.contains(name) ? shortener.generate(name + "_") : shortener.generate(name)
    }

}
