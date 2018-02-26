const JwtGateway = require('@barchart/tgam-jwt-js/lib/JwtGateway');

module.exports = (() => {
	'use strict';

	window.Barchart = window.Barchart || { };
	window.Barchart.Jwt = window.Barchart.Jwt || { };
	window.Barchart.Jwt.JwtProvider = JwtGateway;
})();