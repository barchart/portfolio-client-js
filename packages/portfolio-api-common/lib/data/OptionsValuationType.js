const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
    'use strict';

    /**
     * Defines the method used to value options in a portfolio.
     *
     * @public
     * @extends {Enum}
     * @param {String} code
     * @param {String} description
     */
    class OptionsValuationType extends Enum {
        constructor(code, description) {
            super(code, description);
        }

        /**
         * Value based on the midpoint between Bid and Ask prices.
         * Default behavior.
         *
         * @public
         * @static
         * @returns {OptionsValuationType}
         */
        static get MIDPOINT() {
            return MIDPOINT;
        }

        /**
         * Value based on the Last Traded price.
         *
         * @public
         * @static
         * @returns {OptionsValuationType}
         */
        static get LAST_TRADE() {
            return LAST_TRADE;
        }

        /**
         * @public
         * @static
         * @param {String} code
         * @returns {OptionsValuationType|null}
         */
        static parse(code) {
            return Enum.fromCode(OptionsValuationType, code);
        }

        toString() {
            return `[OptionsValuationType (code=${this.code})]`;
        }
    }

    const MIDPOINT = new OptionsValuationType('midpoint', 'Bid/Ask Midpoint');
    const LAST_TRADE = new OptionsValuationType('last', 'Last Trade');

    return OptionsValuationType;
})();