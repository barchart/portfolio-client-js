const xmlDom = require('xmldom');

const XmlDomParserBase = require('./XmlDomParserBase');

module.exports = (() => {
    'use strict';

    class XmlDomParser extends XmlDomParserBase {
        constructor(document) {
            super();

            this._xmlDomParser = new xmlDom.DOMParser();
        }

        _parse(textDocument) {
            return this._xmlDomParser.parseFromString(textDocument, 'text/xml');
        }

        toString() {
            return '[XmlDomParser]';
        }
    }

    return XmlDomParser;
})();