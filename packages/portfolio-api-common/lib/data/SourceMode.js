const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
    'use strict';

    /**
     * An enumeration item that describes the source of the positions (Manual vs Linked).
     *
     * @public
     * @extends {Enum}
     * @param {String} code
     * @param {String} description
     */
    class SourceMode extends Enum {
        constructor(code, description) {
            super(code, description);
        }

        /**
         * Show all positions (both manual and linked).
         *
         * @returns {SourceMode}
         */
        static get ALL() {
            return all;
        }

        /**
         * Show manually created (paper trading) positions only.
         *
         * @returns {SourceMode}
         */
        static get MANUAL() {
            return manual;
        }

        /**
         * Show brokerage linked (SnapTrade) positions only.
         *
         * @returns {SourceMode}
         */
        static get LINKED() {
            return linked;
        }

        /**
         * Given a code, returns the enumeration item.
         *
         * @public
         * @param {String} code
         * @returns {SourceMode|null}
         */
        static parse(code) {
            return Enum.fromCode(SourceMode, code);
        }

        toString() {
            return `[SourceMode (code=${this.code})]`;
        }
    }


    const all = new SourceMode('ALL', 'All Accounts');
    const manual = new SourceMode('MANUAL', 'Paper Trading');
    const linked = new SourceMode('LINKED', 'Brokerage Linked');

    return SourceMode;
})();