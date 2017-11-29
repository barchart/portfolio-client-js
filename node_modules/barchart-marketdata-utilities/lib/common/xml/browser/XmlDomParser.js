const XmlDomParserBase = require('./../XmlDomParserBase');

module.exports = (() => {
    'use strict';

    class XmlDomParser extends XmlDomParserBase {
        constructor() {
        	super();

            if (window.DOMParser) {
                this._xmlDomParser = new DOMParser();
            } else {
                this._xmlDomParser = null;
            }
        }

        _parse(textDocument) {
            let xmlDocument;

            if (this._xmlDomParser) {
                xmlDocument = this._xmlDomParser.parseFromString(textDocument, 'text/xml');
            } else {
                xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
                xmlDocument.async = 'false';
                xmlDocument.loadXML(textDocument);
            }

            return xmlDocument;
        }

        toString() {
            return '[XmlDomParser]';
        }
    }

    return XmlDomParser;
})();