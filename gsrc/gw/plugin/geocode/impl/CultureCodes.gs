package gw.plugin.geocode.impl
uses java.util.Map
uses java.util.HashMap
uses java.util.Locale

/**
 * This is the list of supported "cultures" and mapping the corresponding Locale constants to these "cultures"
 * 
 * See http://msdn.microsoft.com/en-us/library/hh441729.aspx
 */
@Export
class CultureCodes {
  
  var _locCodes : Map<Locale,String>  as LocCodes = new HashMap<Locale, String>()
  var _imageCodes : Map<Locale,String> as ImageCodes = new HashMap<Locale, String>()

  construct() {
//     code comment location? image?
//    ("af" /*Afrikaans*/,true,false)
//    ("am" /*Amharic*/,true,false)
//    ("ar-sa" /*Arabic (Saudi Arabia)*/,true,false)
//    ("as" /*Assamese*/,true,false)
//    ("az-Latn" /*Azerbaijani (Latin)*/,true,false)
//    ("be" /*Belarusian*/,true,false)
//    ("bg" /*Bulgarian*/,true,false)
//    ("bn-BD" /*Bangla (Bangladesh)*/,true,false)
//    ("bn-IN" /*Bangla (India)*/,true,false)
//    ("bs" /*Bosnian (Latin)*/,true,false)
//    ("ca" /*Catalan Spanish*/,true,false)
//    ("ca-ES-valencia" /*Valencian*/,true,false)
//    ("cs" /*Czech*/,true,false)
//    ("cy" /*Welsh*/,true,false)
//    ("da" /*Danish*/,true,false)
//    ("de" /*German (Germany)*/,true,false)
      LocCodes.put(Locale.GERMAN, "de")
//    ("de-de" /*German (Germany) */,false,true)
      LocCodes.put(Locale.GERMANY, "de")
      ImageCodes.put(Locale.GERMANY, "de-de")
//    ("el" /*Greek*/,true,false)
//    ("en-GB" /*English (United Kingdom)*/,true,false)
      LocCodes.put(Locale.UK, "en-GB")
//    ("en-US" /*English (United States)*/,true,true)
      ImageCodes.put(Locale.US, "en-US")
      LocCodes.put(Locale.US, "en-US")
      
      LocCodes.put(Locale.CANADA, "en-US") // hack
//    ("es" /*Spanish (Spain)*/,true,false)
//    ("es-ES" /*Spantish (Spain)*/,false,true)
//    ("es-US" /*Spanish (United States)*/,false,true)
//    ("es-MX" /*Spanish (Mexico)*/,false,true)
//    ("et" /*Estonian*/,true,false)
//    ("eu" /*Basque*/,true,false)
//    ("fa" /*Persian*/,true,false)
//    ("fi" /*Finnish*/,true,false)
//    ("fil-Latn" /*Filipino*/,true,false)
//    ("fr" /*French (France)*/,true,false)
      LocCodes.put(Locale.FRENCH, "fr")
//    ("fr-FR" /*French (France)*/,false,true)
      LocCodes.put(Locale.FRANCE, "fr")
      ImageCodes.put(Locale.FRANCE, "fr-FR")
//    ("fr-CA" /*French (Canada)*/,false,true)
      LocCodes.put(Locale.CANADA_FRENCH, "fr")
      ImageCodes.put(Locale.CANADA_FRENCH, "fr-CA")
//    ("ga" /*Irish*/,true,false)
//    ("gd-Latn" /*Scottish Gaelic*/,true,false)
//    ("gl" /*Galician*/,true,false)
//    ("gu" /*Gujarati*/,true,false)
//    ("ha-Latn" /*Hausa (Latin)*/,true,false)
//    ("he" /*Hebrew*/,true,false)
//    ("hi" /*Hindi*/,true,false)
//    ("hr" /*Croatian*/,true,false)
//    ("hu" /*Hungarian*/,true,false)
//    ("hy" /*Armenian*/,true,false)
//    ("id" /*Indonesian*/,true,false)
//    ("ig-Latn" /*Igbo*/,true,false)
//    ("is" /*Icelandic*/,true,false)
//    ("it" /*Italian (Italy)*/,true,false)
      LocCodes.put(Locale.ITALIAN, "it")
//    ("it-it" /*Italian (Italy)*/,false,true)
      LocCodes.put(Locale.ITALY, "it")
      ImageCodes.put(Locale.ITALY, "it-it")
//    ("ja" /*Japanese*/,true,false)
      LocCodes.put(Locale.JAPAN, "ja")
      LocCodes.put(Locale.JAPANESE, "ja")
//    ("ka" /*Georgian*/,true,false)
//    ("kk" /*Kazakh*/,true,false)
//    ("km" /*Khmer*/,true,false)
//    ("kn" /*Kannada*/,true,false)
//    ("ko" /*Korean*/,true,false)
      LocCodes.put(Locale.KOREA, "ko")
      LocCodes.put(Locale.KOREAN, "ko")
//    ("kok" /*Konkani*/,true,false)
//    ("ku-Arab" /*Central Kurdish*/,true,false)
//    ("ky-Cyrl" /*Kyrgyz*/,true,false)
//    ("lb" /*Luxembourgish*/,true,false)
//    ("lt" /*Lithuanian*/,true,false)
//    ("lv" /*Latvian*/,true,false)
//    ("mi-Latn" /*Maori*/,true,false)
//    ("mk" /*Macedonian*/,true,false)
//    ("ml" /*Malayalam*/,true,false)
//    ("mn-Cyrl" /*Mongolian (Cyrillic)*/,true,false)
//    ("mr" /*Marathi*/,true,false)
//    ("ms" /*Malay (Malaysia)*/,true,false)
//    ("mt" /*Maltese*/,true,false)
//    ("nb" /*Norwegian (Bokmål)*/,true,false)
//    ("ne" /*Nepali (Nepal)*/,true,false)
//    ("nl" /*Dutch (Netherlands)*/,true,false)
//    ("nl-BE" /*Dutch (Netherlands)*/,false, true)
//    ("nn" /*Norwegian (Nynorsk)*/,true,false)
//    ("nso" /*Sesotho sa Leboa*/,true,false)
//    ("or" /*Odia*/,true,false)
//    ("pa" /*Punjabi (Gurmukhi)*/,true,false)
//    ("pa-Arab" /*Punjabi (Arabic)*/,true,false)
//    ("pl" /*Polish*/,true,false)
//    ("prs-Arab" /*Dari*/,true,false)
//    ("pt-BR" /*Portuguese (Brazil)*/,true,false)
//    ("pt-PT" /*Portuguese (Portugal)*/,true,false)
//    ("qut-Latn" /*K'iche'*/,true,false)
//    ("quz" /*Quechua (Peru)*/,true,false)
//    ("ro" /*Romanian (Romania)*/,true,false)
//    ("ru" /*Russian*/,true,false)
//    ("rw" /*Kinyarwanda*/,true,false)
//    ("sd-Arab" /*Sindhi (Arabic)*/,true,false)
//    ("si" /*Sinhala*/,true,false)
//    ("sk" /*Slovak*/,true,false)
//    ("sl" /*Slovenian*/,true,false)
//    ("sq" /*Albanian*/,true,false)
//    ("sr-Cyrl-BA" /*Serbian (Cyrillic,Bosnia and Herzegovina)*/,true,false)
//    ("sr-Cyrl-RS" /*Serbian (Cyrillic,Serbia)*/,true,false)
//    ("sr-Latn-RS" /*Serbian (Latin,Serbia)*/,true,false)
//    ("sv" /*Swedish (Sweden)*/,true,false)
//    ("sw" /*Kiswahili*/,true,false)
//    ("ta" /*Tamil*/,true,false)
//    ("te" /*Telugu*/,true,false)
//    ("tg-Cyrl" /*Tajik (Cyrillic)*/,true,false)
//    ("th" /*Thai*/,true,false)
//    ("ti" /*Tigrinya*/,true,false)
//    ("tk-Latn" /*Turkmen (Latin)*/,true,false)
//    ("tn" /*Setswana*/,true,false)
//    ("tr" /*Turkish*/,true,false)
//    ("tt-Cyrl" /*Tatar (Cyrillic)*/,true,false)
//    ("ug-Arab" /*Uyghur*/,true,false)
//    ("uk" /*Ukrainian*/,true,false)
//    ("ur" /*Urdu*/,true,false)
//    ("uz-Latn" /*Uzbek (Latin)*/,true,false)
//    ("vi" /*Vietnamese*/,true,false)
//    ("wo" /*Wolof*/,true,false)
//    ("xh" /*isiXhosa*/,true,false)
//    ("yo-Latn" /*Yoruba*/,true,false)
//    ("zh-Hans" /*Chinese (Simplified)*/,true,false)
      LocCodes.put(Locale.PRC, "zh-Hans")
      LocCodes.put(Locale.CHINA, "zh-Hans")
      LocCodes.put(Locale.CHINESE, "zh-Hans")
      LocCodes.put(Locale.SIMPLIFIED_CHINESE, "zh-Hans")
//    ("zh-Hant" /*Chinese (Traditional)*/,true,false)
      LocCodes.put(Locale.TAIWAN, "zh-Hant")
      LocCodes.put(Locale.TRADITIONAL_CHINESE, "zh-Hant")
//    ("zh-Hant" /*Chinese (Traditional)*/,true,false)
//    ("zu" /*isiZulu*/,true,false)
  }

}
