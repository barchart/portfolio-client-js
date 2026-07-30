const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
    'use strict';

    /**
     * An enumeration item that describes how positions should be filtered.
     *
     * @public
     * @extends {Enum}
     * @param {String} code
     * @param {String} description
     */
    class FilterMode extends Enum {
        constructor(code, description) {
            super(code, description);
        }

        /**
         * Show open positions only.
         *
         * @returns {FilterMode}
         */
        static get OPEN() {
            return open;
        }

        /**
         * Show closed positions only.
         *
         * @returns {FilterMode}
         */
        static get CLOSED() {
            return closed;
        }

        /**
         * Show open and closed positions.
         *
         * @returns {FilterMode}
         */
        static get ALL() {
            return all;
        }

        /**
         * Given a code, returns the enumeration item.
         *
         * @public
         * @param {String} code
         * @returns {FilterMode|null}
         */
        static parse(code) {
            return Enum.fromCode(FilterMode, code);
        }

        toString() {
            return `[FilterMode (code=${this.code})]`;
        }
    }

    const open = new FilterMode('OPEN', 'Open only');
    const closed = new FilterMode('CLOSED', 'Closed only');
    const all = new FilterMode('ALL', 'Open and Closed');

    return FilterMode;
})();
