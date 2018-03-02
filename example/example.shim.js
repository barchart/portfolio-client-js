const JwtGateway = require('@barchart/tgam-jwt-js/lib/JwtGateway');

const Day = require('@barchart/common-js/lang/Day');

module.exports = (() => {
	'use strict';

	window.Barchart = window.Barchart || { };
	window.Barchart.Jwt = window.Barchart.Jwt || { };
	window.Barchart.Jwt.JwtProvider = JwtGateway;

	window.Barchart.Day = Day;

})();