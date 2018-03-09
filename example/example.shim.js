const JwtGateway = require('@barchart/tgam-jwt-js/lib/JwtGateway');

const Currency = require('@barchart/common-js/lang/Currency'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');

module.exports = (() => {
	'use strict';

	window.Barchart = window.Barchart || { };
	window.Barchart.Jwt = window.Barchart.Jwt || { };
	window.Barchart.Jwt.JwtProvider = JwtGateway;

	window.Barchart.Currency = Currency;
	window.Barchart.Day = Day;
	window.Barchart.Decimal = Decimal;
	window.Barchart.TransactionType = TransactionType;

})();