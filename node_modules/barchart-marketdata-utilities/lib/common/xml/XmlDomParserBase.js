module.exports = (() => {
    'use strict';

    class XmlDomParserBase {
        constructor() {

        }

        parse(textDocument) {
            if (typeof textDocument !== 'string') {
                throw new Error('The "textDocument" argument must be a string.');
            }

            return this._parse(textDocument);
        }

        _parse(textDocument) {
            return null;
        }

        toString() {
            return '[XmlDomParserBase]';
        }
    }

    return XmlDomParserBase;
})();