package gw.surepath.suite.mt.datamapping

uses gw.pl.util.FileUtil
uses java.io.BufferedReader
uses java.io.BufferedWriter
uses java.io.File
uses java.io.IOException
uses java.io.StringReader
uses java.io.StringWriter
uses javax.xml.transform.TransformerException
uses org.apache.commons.lang.ObjectUtils

abstract class AbstractMapWriter {
  private final var _outputDir : File

  public construct(outputDir : File) {
      this._outputDir = outputDir
  }

  protected property get OutputDir() : File {
    return this._outputDir
  }

  protected function writeMappingFile(outputFile : File,writeToCSV : boolean,split : boolean) {
    var mappingString = this.constructMapXMLString(writeToCSV)
    if(writeToCSV) {
      var stringWriter = this.transformMappingToCSV(mappingString)
      if(split) {
       // this.splitIntoIndividualFiles(stringWriter, outputFile)
      } else {
        FileUtil.write(outputFile, stringWriter.toString())
      }
    } else {
      FileUtil.write(outputFile, mappingString)
    }
  }


    private function getPrefix(outputFile : File) : String {
      var outputFileName = outputFile.getName()
      var lastDot = outputFileName.lastIndexOf(46)
      var prefix = outputFileName.substring(0, lastDot == -1?outputFileName.length():lastDot)
      return prefix
    }

    protected abstract function transformMappingToCSV(var1 : String) : StringWriter

    protected abstract function constructMapXMLString(var1 : boolean) : String
}