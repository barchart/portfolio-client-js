(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Class = require('class.extend');

module.exports = function() {
    'use strict';

    return Class.extend({
        init: function() {

        },

        parse: function(textDocument) {
            if (typeof textDocument !== 'string') {
                throw new Error('The "textDocument" argument must be a string.');
            }

            return this._parse(textDocument);
        },

        _parse: function(textDocument) {
            return null;
        },

        toString: function() {
            return '[XmlDomParserBase]';
        }
    });
}();
},{"class.extend":13}],2:[function(require,module,exports){
var XmlDomParserBase = require('./../XmlDomParserBase');

module.exports = function() {
    'use strict';

    return XmlDomParserBase.extend({
        init: function() {
            if (window.DOMParser) {
                this._xmlDomParser = new DOMParser();
            } else {
                this._xmlDomParser = null;
            }
        },

        _parse: function(textDocument) {
            var xmlDocument;

            if (this._xmlDomParser) {
                xmlDocument = this._xmlDomParser.parseFromString(textDocument, 'text/xml');
            } else {
                xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
                xmlDocument.async = 'false';
                xmlDocument.loadXML(textDocument);
            }

            return xmlDocument;
        },

        toString: function() {
            return '[XmlDomParser]';
        }
    });
}();
},{"./../XmlDomParserBase":1}],3:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return {
		unitCodeToBaseCode: function(unitCode) {
			switch (unitCode) {
				case '2':
					return -1;
				case '3':
					return -2;
				case '4':
					return -3;
				case '5':
					return -4;
				case '6':
					return -5;
				case '7':
					return -6;
				case '8':
					return 0;
				case '9':
					return 1;
				case 'A':
					return 2;
				case 'B':
					return 3;
				case 'C':
					return 4;
				case 'D':
					return 5;
				case 'E':
					return 6;
				case 'F':
					return 7;
				default:
					return 0;
			}
		},

		baseCodeToUnitCode: function(baseCode) {
			switch (baseCode) {
				case -1:
					return '2';
				case -2:
					return '3';
				case -3:
					return '4';
				case -4:
					return '5';
				case -5:
					return '6';
				case -6:
					return '7';
				case 0:
					return '8';
				case 1:
					return '9';
				case 2:
					return 'A';
				case 3:
					return 'B';
				case 4:
					return 'C';
				case 5:
					return 'D';
				case 6:
					return 'E';
				case 7:
					return 'F';
				default:
					return 0;
			}
		},

		dateToDayCode: function(date) {
			var d = date.getDate();

			if (d >= 1 && d <= 9)
				return String.fromCharCode(("1").charCodeAt(0) + d - 1);
			else if (d == 10)
				return '0';
			else
				return String.fromCharCode(("A").charCodeAt(0) + d - 11);
		},

		dayCodeToNumber: function(dayCode) {
			var d = parseInt(dayCode, 31);

			if (d > 9) {
				d++;
			} else if (d === 0) {
				d = 10;
			}

			return d;
		}
	};
}();
},{}],4:[function(require,module,exports){
var lodashIsNaN = require('lodash.isnan');

module.exports = function() {
	'use strict';

	return function(value, digits, thousandsSeparator, useParenthesis) {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		var applyParenthesis = value < 0 && useParenthesis === true;

		if (applyParenthesis) {
			value = 0 - value;
		}

		var returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value > -1000 && value < 1000)) {
			var length = returnRef.length;
			var negative = value < 0;

			var found = digits === 0;
			var counter = 0;

			var buffer = [];

			for (var i = (length - 1); !(i < 0); i--) {
				if (counter === 3 && !(negative && i === 0)) {
					buffer.unshift(thousandsSeparator);

					counter = 0;
				}

				var character = returnRef.charAt(i);

				buffer.unshift(character);

				if (found) {
					counter = counter + 1;
				} else if (character === '.') {
					found = true;
				}
			}

			if (applyParenthesis) {
				buffer.unshift('(')
				buffer.push(')');
			}

			returnRef = buffer.join('');
		} else if (applyParenthesis) {
			returnRef = '(' + returnRef + ')';
		}

		return returnRef;
	};
}();
},{"lodash.isnan":14}],5:[function(require,module,exports){
var XmlDomParser = require('./common/xml/XmlDomParser');

var parseValue = require('./priceParser');
var parseTimestamp = require('./timestampParser');

module.exports = function() {
	'use strict';

	return function(msg) {
		var message = {
			message : msg,
			type : null
		};

		switch (msg.substr(0, 1)) {
			case '%': { // Jerq Refresh Messages
				var xmlDocument;

				try {
					var xmlDomParser = new XmlDomParser();
					xmlDocument = xmlDomParser.parse(msg.substring(1));
				}
				catch (e) {
					xmlDocument = undefined;
				}

				if (xmlDocument) {
					var node = xmlDocument.firstChild;

					switch (node.nodeName) {
						case 'BOOK': {
							message.symbol = node.attributes.getNamedItem('symbol').value;
							message.unitcode = node.attributes.getNamedItem('basecode').value;
							message.askDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
							message.bidDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
							message.asks = [];
							message.bids = [];

							var ary1, ary2;

							if ((node.attributes.getNamedItem('askprices')) && (node.attributes.getNamedItem('asksizes'))) {
								ary1 = node.attributes.getNamedItem('askprices').value.split(',');
								ary2 = node.attributes.getNamedItem('asksizes').value.split(',');

								for (var i = 0; i < ary1.length; i++) {
									message.asks.push({ "price" : parseValue(ary1[i], message.unitcode), "size" : parseInt(ary2[i])});
								}
							}

							if ((node.attributes.getNamedItem('bidprices')) && (node.attributes.getNamedItem('bidsizes'))) {
								ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
								ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

								for (var i = 0; i < ary1.length; i++) {
									message.bids.push({ "price" : parseValue(ary1[i], message.unitcode), "size" : parseInt(ary2[i])});
								}
							}

							message.type = 'BOOK';
							break;
						}
						case 'QUOTE': {
							for (var i = 0; i < node.attributes.length; i++) {
								switch (node.attributes[i].name) {
									case 'symbol':
										message.symbol = node.attributes[i].value;
										break;
									case 'name':
										message.name = node.attributes[i].value;
										break;
									case 'exchange':
										message.exchange = node.attributes[i].value;
										break;
									case 'basecode':
										message.unitcode = node.attributes[i].value;
										break;
									case 'pointvalue':
										message.pointValue = parseFloat(node.attributes[i].value);
										break;
									case 'tickincrement':
										message.tickIncrement = parseInt(node.attributes[i].value);
										break;
									case 'flag':
										message.flag = node.attributes[i].value;
										break;
									case 'lastupdate': {
										var v = node.attributes[i].value;
										message.lastUpdate = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
										break;
									}
									case 'bid':
										message.bidPrice = parseValue(node.attributes[i].value, message.unitcode);
										break;
									case 'bidsize':
										message.bidSize = parseInt(node.attributes[i].value);
										break;
									case 'ask':
										message.askPrice = parseValue(node.attributes[i].value, message.unitcode);
										break;
									case 'asksize':
										message.askSize = parseInt(node.attributes[i].value);
										break;
									case 'mode':
										message.mode = node.attributes[i].value;
										break;
								}

								var sessions = {};

								for (var j = 0; j < node.childNodes.length; j++) {
									if (node.childNodes[j].nodeName == 'SESSION') {
										var s = {};
										var attributes = node.childNodes[j].attributes;

										if (attributes.getNamedItem('id'))
											s.id = attributes.getNamedItem('id').value;
										if (attributes.getNamedItem('day'))
											s.day = attributes.getNamedItem('day').value;
										if (attributes.getNamedItem('last'))
											s.lastPrice = parseValue(attributes.getNamedItem('last').value, message.unitcode);
										if (attributes.getNamedItem('previous'))
											s.previousPrice = parseValue(attributes.getNamedItem('previous').value, message.unitcode);
										if (attributes.getNamedItem('open'))
											s.openPrice = parseValue(attributes.getNamedItem('open').value, message.unitcode);
										if (attributes.getNamedItem('high'))
											s.highPrice = parseValue(attributes.getNamedItem('high').value, message.unitcode);
										if (attributes.getNamedItem('low'))
											s.lowPrice = parseValue(attributes.getNamedItem('low').value, message.unitcode);
										if (attributes.getNamedItem('tradesize'))
											s.tradeSize = parseInt(attributes.getNamedItem('tradesize').value);
										if (attributes.getNamedItem('numtrades'))
											s.numberOfTrades = parseInt(attributes.getNamedItem('numtrades').value);
										if (attributes.getNamedItem('settlement'))
											s.settlementPrice = parseValue(attributes.getNamedItem('settlement').value, message.unitcode);
										if (attributes.getNamedItem('volume'))
											s.volume = parseInt(attributes.getNamedItem('volume').value);
										if (attributes.getNamedItem('openinterest'))
											s.openInterest = parseInt(attributes.getNamedItem('openinterest').value);
										if (attributes.getNamedItem('timestamp')) {
											var v = attributes.getNamedItem('timestamp').value;
											s.timeStamp = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
										}
										if (attributes.getNamedItem('tradetime')) {
											var v = attributes.getNamedItem('tradetime').value;
											s.tradeTime = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
										}

										if (s.id)
											sessions[s.id] = s;
									}
								}

								var premarket = typeof(sessions.combined.lastPrice) === 'undefined';
								var postmarket = !premarket && typeof(sessions.combined.settlementPrice) !== 'undefined';

								var session = premarket ? sessions.previous : sessions.combined;

								if (session.lastPrice)
									message.lastPrice = session.lastPrice;
								if (session.previousPrice)
									message.previousPrice = session.previousPrice;
								if (session.openPrice)
									message.openPrice = session.openPrice;
								if (session.highPrice)
									message.highPrice = session.highPrice;
								if (session.lowPrice)
									message.lowPrice = session.lowPrice;
								if (session.tradeSize)
									message.tradeSize = session.tradeSize;
								if (session.numberOfTrades)
									message.numberOfTrades = session.numberOfTrades;
								if (session.settlementPrice)
									message.settlementPrice = session.settlementPrice;
								if (session.volume)
									message.volume = session.volume;
								if (session.openInterest)
									message.openInterest = session.openInterest;
								if (session.id === 'combined' && sessions.previous.openInterest)
									message.openInterest = sessions.previous.openInterest;
								if (session.timeStamp)
									message.timeStamp = session.timeStamp;
								if (session.tradeTime)
									message.tradeTime = session.tradeTime;

								// 2016/10/29, BRI. We have a problem where we don't "roll" quotes
								// for futures. For example, LEZ16 doesn't "roll" the settlementPrice
								// to the previous price -- so, we did this on the open message (2,0A).
								// Eero has another idea. Perhaps we are setting the "day" improperly
								// here. Perhaps we should base the day off of the actual session
								// (i.e. "session" variable) -- instead of taking it from the "combined"
								// session.

								if (sessions.combined.day)
									message.day = sessions.combined.day;
								if (premarket && typeof(message.flag) === 'undefined')
									message.flag = 'p';

								var p = sessions.previous;

								message.previousPreviousPrice = p.previousPrice;
								message.previousSettlementPrice = p.settlementPrice;
								message.previousOpenPrice = p.openPrice;
								message.previousHighPrice = p.highPrice;
								message.previousLowPrice = p.lowPrice;
								message.previousTimeStamp = p.timeStamp;

								if (sessions.combined.day) {
									var sessionFormT = 'session_' + sessions.combined.day + '_T';

									if (sessions.hasOwnProperty(sessionFormT)) {
										var t = sessions[sessionFormT];

										var lastPriceT = t.lastPrice;

										if (lastPriceT) {
											var tradeTimeT = t.tradeTime;
											var tradeSizeT = t.tradeSize;

											var sessionIsEvening;

											if (tradeTimeT) {
												var noon = new Date(tradeTimeT.getFullYear(), tradeTimeT.getMonth(), tradeTimeT.getDate(), 12, 0, 0, 0);

												sessionIsEvening = tradeTimeT.getTime() > noon.getTime();
											} else {
												sessionIsEvening = false;
											}

											message.sessionT = sessionIsEvening;

											var sessionIsCurrent = premarket || sessionIsEvening;

											if (sessionIsCurrent) {
												message.lastPriceT = lastPriceT;
											}

											if (premarket || postmarket) {
												message.session = 'T';

												if (sessionIsCurrent) {
													if (tradeTimeT) {
														message.tradeTime = tradeTimeT;
													}

													if (tradeSizeT) {
														message.tradeSize = tradeSizeT;
													}
												}

												if (premarket) {
													if (t.volume) {
														message.volume = t.volume;
													}

													if (t.previousPrice) {
														message.previousPrice = t.previousPrice;
													}
												}
											}
										}
									}
								}
							}

							message.type = 'REFRESH_QUOTE';
							break;
						}
						case 'CV': {
							message.type = 'REFRESH_CUMULATIVE_VOLUME';
							message.symbol = node.attributes.getNamedItem('symbol').value;
							message.unitCode = node.attributes.getNamedItem('basecode').value;
							message.tickIncrement = parseValue(node.attributes.getNamedItem('tickincrement').value, message.unitCode);

							var dataAttribute = node.attributes.getNamedItem('data');

							if (dataAttribute) {
								var priceLevelsRaw = dataAttribute.value || '';
								var priceLevels = priceLevelsRaw.split(':');

								for (var i = 0; i < priceLevels.length; i++) {
									var priceLevelRaw = priceLevels[i];
									var priceLevelData = priceLevelRaw.split(',');

									priceLevels[i] = {
										price: parseValue(priceLevelData[0], message.unitCode),
										volume: parseInt(priceLevelData[1])
									};
								}

								priceLevels.sort(function(a, b) {
									return a.price - b.price;
								});

								message.priceLevels = priceLevels;
							} else {
								message.priceLevels = [];
							}

							break;
						}
						default:
							console.log(msg);
							break;
					}
				}

				break;
			}
			case '\x01': { // DDF Messages
				switch (msg.substr(1, 1)) {
					case '#': {
						// TO DO: Standardize the timezones for Daylight Savings
						message.type = 'TIMESTAMP';
						message.timestamp = new Date(parseInt(msg.substr(2, 4)), parseInt(msg.substr(6, 2)) - 1, parseInt(msg.substr(8, 2)), parseInt(msg.substr(10, 2)), parseInt(msg.substr(12, 2)), parseInt(msg.substr(14, 2)));
						break;
					}
					case '2': {
						message.record = '2';
						var pos = msg.indexOf(',', 0);
						message.symbol = msg.substring(2, pos);
						message.subrecord = msg.substr(pos + 1, 1);
						message.unitcode = msg.substr(pos + 3, 1);
						message.exchange = msg.substr(pos + 4, 1);
						message.delay = parseInt(msg.substr(pos + 5, 2));
						switch (message.subrecord) {
							case '0': {
								// TO DO: Error Handling / Sanity Check
								var pos2 = msg.indexOf(',', pos + 7);
								message.value = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
								message.element = msg.substr(pos2 + 1, 1);
								message.modifier = msg.substr(pos2 + 2, 1);

								switch (message.element) {
									case 'A':
										message.type = 'OPEN';
										break;
									case 'C':
										if (message.modifier == '1')
											message.type = 'OPEN_INTEREST';
										break;
									case 'D':
									case 'd':
										if (message.modifier == '0')
											message.type = 'SETTLEMENT';
										break;
									case 'V':
										if (message.modifier == '0')
											message.type = 'VWAP';
										break;
									case '0': {
										if (message.modifier == '0') {
											message.tradePrice = message.value;
											message.type = 'TRADE';
										}
										break;
									}
									case '5':
										message.type = 'HIGH';
										break;
									case '6':
										message.type = 'LOW';
										break;
									case '7': {
										if (message.modifier == '1')
											message.type ='VOLUME_YESTERDAY';
										else if (message.modifier == '6')
											message.type ='VOLUME';
										break;
									}
								}

								message.day = msg.substr(pos2 + 3, 1);
								message.session = msg.substr(pos2 + 4, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								break;
							}
							case '1':
							case '2':
							case '3':
							case '4': {
								var ary = msg.substring(pos + 8).split(',');
								message.openPrice = parseValue(ary[0], message.unitcode);
								message.highPrice = parseValue(ary[1], message.unitcode);
								message.lowPrice = parseValue(ary[2], message.unitcode);
								message.lastPrice = parseValue(ary[3], message.unitcode);
								message.bidPrice = parseValue(ary[4], message.unitcode);
								message.askPrice = parseValue(ary[5], message.unitcode);
								message.previousPrice = parseValue(ary[7], message.unitcode);
								message.settlementPrice = parseValue(ary[10], message.unitcode);
								message.volume = (ary[13].length > 0) ? parseInt(ary[13]) : undefined;
								message.openInterest = (ary[12].length > 0) ? parseInt(ary[12]) : undefined;
								message.day = ary[14].substr(0, 1);
								message.session = ary[14].substr(1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								message.type = 'REFRESH_DDF';
								break;
							}
							case '7': {
								var pos2 = msg.indexOf(',', pos + 7);
								message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);

								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.tradeSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								message.day = msg.substr(pos, 1);
								message.session = msg.substr(pos + 1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								message.type = 'TRADE';
								break;
							}
							case '8': {
								var pos2 = msg.indexOf(',', pos + 7);
								message.bidPrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.bidSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.askPrice = parseValue(msg.substring(pos, pos2), message.unitcode);
								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.askSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								message.day = msg.substr(pos, 1);
								message.session = msg.substr(pos + 1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								message.type = 'TOB';
								break;
							}
							case 'Z': {
								var pos2 = msg.indexOf(',', pos + 7);
								message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);

								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.tradeSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								message.day = msg.substr(pos, 1);
								message.session = msg.substr(pos + 1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								message.type = 'TRADE_OUT_OF_SEQUENCE';
								break;
							}
						}
						break;
					}
					case '3': {
						var pos = msg.indexOf(',', 0);
						message.symbol = msg.substring(2, pos);
						message.subrecord = msg.substr(pos + 1, 1);
						switch (message.subrecord) {
							case 'B': {
								message.unitcode = msg.substr(pos + 3, 1);
								message.exchange = msg.substr(pos + 4, 1);
								message.bidDepth = ((msg.substr(pos + 5, 1) == 'A') ? 10 : parseInt(msg.substr(pos + 5, 1)));
								message.askDepth = ((msg.substr(pos + 6, 1) == 'A') ? 10 : parseInt(msg.substr(pos + 6, 1)));
								message.bids = [];
								message.asks = [];
								var ary = msg.substring(pos + 8).split(',');
								for (var i = 0; i < ary.length; i++) {
									var ary2 = ary[i].split(/[A-Z]/);
									var c = ary[i].substr(ary2[0].length, 1);
									if (c <= 'J')
										message.asks.push({"price" : parseValue(ary2[0], message.unitcode), "size" : parseInt(ary2[1])});
									else
										message.bids.push({"price" : parseValue(ary2[0], message.unitcode), "size" : parseInt(ary2[1])});
								}

								message.type = 'BOOK';
								break;
							}
							default:
								break;
						}

						break;
					}
					default: {
						message.type = 'UNKNOWN';
						break;
					}
				}
			}
		}

		return message;
	};
}();
},{"./common/xml/XmlDomParser":2,"./priceParser":8,"./timestampParser":12}],6:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var monthMap = { };
	var numberMap = { };

	var addMonth = function (code, name, number) {
		monthMap[code] = name;
		numberMap[code] = number;
	};

	addMonth("F", "January", 1);
	addMonth("G", "February", 2);
	addMonth("H", "March", 3);
	addMonth("J", "April", 4);
	addMonth("K", "May", 5);
	addMonth("M", "June", 6);
	addMonth("N", "July", 7);
	addMonth("Q", "August", 8);
	addMonth("U", "September", 9);
	addMonth("V", "October", 10);
	addMonth("X", "November", 11);
	addMonth("Z", "December", 12);
	addMonth("Y", "Cash", 0);

	return {
		getCodeToNameMap: function() {
			return monthMap;
		},

		getCodeToNumberMap: function() {
			return numberMap;
		}
	};
}();
},{}],7:[function(require,module,exports){
var lodashIsNaN = require('lodash.isnan');
var decimalFormatter = require('./decimalFormatter');

module.exports = function() {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		var format;

		function getWholeNumberAsString(value) {
			var val = Math.floor(value);

			if ((val === 0) && (fractionSeparator === '')) {
				return '';
			} else {
				return val;
			}
		}

		function formatDecimal(value, digits) {
			return decimalFormatter(value, digits, thousandsSeparator, useParenthesis);
		}

		if (fractionSeparator === '.') {
			format = function(value, unitcode) {
				switch (unitcode) {
					case '2':
						return formatDecimal(value, 3);
					case '3':
						return formatDecimal(value, 4);
					case '4':
						return formatDecimal(value, 5);
					case '5':
						return formatDecimal(value, 6);
					case '6':
						return formatDecimal(value, 7);
					case '7':
						return formatDecimal(value, 8);
					case '8':
						return formatDecimal(value, 0);
					case '9':
						return formatDecimal(value, 1);
					case 'A':
						return formatDecimal(value, 2);
					case 'B':
						return formatDecimal(value, 3);
					case 'C':
						return formatDecimal(value, 4);
					case 'D':
						return formatDecimal(value, 5);
					case 'E':
						return formatDecimal(value, 6);
					default:
						if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
							return '';
						} else {
							return value;
						}
				}
			};
		} else {
			format = function(value, unitcode) {
				if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
					return '';
				}

				var originalValue = value;
				var negative = value < 0;
				var value = Math.abs(value);

				var prefix;
				var suffix;

				if (negative) {
					if (useParenthesis === true) {
						prefix = '(';
						suffix = ')';
					} else {
						prefix = '-';
						suffix = '';
					}
				} else {
					prefix = '';
					suffix = '';
				}

				switch (unitcode) {
					case '2':
						return [prefix, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1), suffix].join('');
					case '3':
						return [prefix, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 16, 2), suffix].join('');
					case '4':
						return [prefix, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 32, 2), suffix].join('');
					case '5':
						return [prefix, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 64), (specialFractions ? 3 : 2)), suffix].join('');
					case '6':
						return [prefix, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 128), 3), suffix].join('');
					case '7':
						return [prefix, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 256), 3), suffix].join('');
					case '8':
						return formatDecimal(originalValue, 0);
					case '9':
						return formatDecimal(originalValue, 1);
					case 'A':
						return formatDecimal(originalValue, 2);
					case 'B':
						return formatDecimal(originalValue, 3);
					case 'C':
						return formatDecimal(originalValue, 4);
					case 'D':
						return formatDecimal(originalValue, 5);
					case 'E':
						return formatDecimal(originalValue, 6);
					default:
						return originalValue;
				}
			};
		}

		return {
			format: format
		};
	};
}();
},{"./decimalFormatter":4,"lodash.isnan":14}],8:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var replaceExpressions = { };

	function getReplaceExpression(thousandsSeparator) {
		if (!replaceExpressions.hasOwnProperty(thousandsSeparator)) {
			replaceExpressions[thousandsSeparator] = new RegExp(thousandsSeparator, 'g');
		}

		return replaceExpressions[thousandsSeparator];
	}

	return function(str, unitcode, thousandsSeparator) {
		if (str.length < 1) {
			return undefined;
		} else if (str === '-') {
			return null;
		}

		if (thousandsSeparator) {
			str = str.replace(getReplaceExpression(thousandsSeparator), '');
		}

		if (!(str.indexOf('.') < 0)) {
			return parseFloat(str);
		}

		var sign = (str.substr(0, 1) == '-') ? -1 : 1;

		if (sign === -1) {
			str = str.substr(1);
		}

		switch (unitcode) {
			case '2': // 8ths
				return sign * (((str.length > 1) ? parseInt(str.substr(0, str.length - 1)) : 0) + (parseInt(str.substr(-1)) / 8));
			case '3': // 16ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 16));
			case '4': // 32ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 32));
			case '5': // 64ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 64));
			case '6': // 128ths
				return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 128));
			case '7': // 256ths
				return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 256));
			case '8':
				return sign * parseInt(str);
			case '9':
				return sign * (parseInt(str) / 10);
			case 'A':
				return sign * (parseInt(str) / 100);
			case 'B':
				return sign * (parseInt(str) / 1000);
			case 'C':
				return sign * (parseInt(str) / 10000);
			case 'D':
				return sign * (parseInt(str) / 100000);
			case 'E':
				return sign * (parseInt(str) / 1000000);
			default:
				return sign * parseInt(str);
		}
	};
}();
},{}],9:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return {
		format: function(symbol) {
			var returnRef;

			if (symbol !== null && typeof symbol === 'string') {
				returnRef = symbol.toUpperCase();
			} else {
				returnRef = symbol;
			}

			return returnRef;
 		}
	};
}();
},{}],10:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var exchangeRegex = /^(.*)\\.([A-Z]{1,4})$/i;

	var jerqFutureConversionRegex = /(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i;
	var concreteFutureRegex = /^(.{1,3})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
	var referenceFutureRegex = /^(.{1,3})(\*{1})([0-9]{1})$/i;
	var futureSpreadRegex = /^_S_/i;
	var forexRegex = /^\^([A-Z]{3})([A-Z]{3})$/i;
	var sectorRegex = /^\-(.*)$/i;
	var indexRegex = /^\$(.*)$/i;
	var batsRegex = /^(.*)\.BZ$/i;
	var usePercentRegex = /(\.RT)$/;

	var symbolParser = {
		parseInstrumentType: function(symbol) {
			if (typeof symbol !== 'string') {
				return null;
			}

			var exchangeMatch = symbol.match(exchangeRegex);

			if (exchangeMatch !== null) {
				symbol = exchangeMatch[1];
			}

			if (futureSpreadRegex.test(symbol)) {
				return {
					symbol: symbol,
					type: 'future_spread'
				};
			}

			var staticFutureMatch = symbol.match(concreteFutureRegex);

			if (staticFutureMatch !== null) {
				var currentDate = new Date();
				var currentYear = currentDate.getFullYear();

				var yearString = staticFutureMatch[3];
				var year = parseInt(yearString);

				if (year < 10) {
					year = Math.floor(currentYear / 10) * 10 + year;
				} else if (year < 100) {
					year = Math.floor(currentYear / 100) * 100 + year;

					if (year < currentYear) {
						var alternateYear = year + 100;

						if (currentYear - year > alternateYear - currentYear) {
							year = alternateYear;
						}
					}
				}

				return {
					symbol: symbol,
					type: 'future',
					root: staticFutureMatch[1],
					dynamic: false,
					month: staticFutureMatch[2],
					year: year
				};
			}

			var dynamicFutureMatch = symbol.match(referenceFutureRegex);

			if (dynamicFutureMatch !== null) {
				return {
					symbol: symbol,
					type: 'future',
					root: dynamicFutureMatch[1],
					dynamic: true,
					dynamicCode: dynamicFutureMatch[3]
				};
			}

			var forexMatch = symbol.match(forexRegex);

			if (forexMatch !== null) {
				return {
					symbol: symbol,
					type: 'forex'
				};
			}

			var indexMatch = symbol.match(indexRegex);

			if (indexMatch !== null) {
				return {
					symbol: symbol,
					type: 'index'
				};
			}

			var sectorMatch = symbol.match(sectorRegex);

			if (sectorMatch !== null) {
				return {
					symbol: symbol,
					type: 'sector'
				};
			}

			return null;
		},

		getIsConcrete: function(symbol) {
			return !this.getIsReference(symbol);
		},

		getIsReference: function(symbol) {
			return referenceFutureRegex.test(symbol);
		},

		getIsFuture: function(symbol) {
			return getIsType(symbol, 'future');
		},

		getIsFutureSpread: function(symbol) {
			return getIsType(symbol, 'future_spread');
		},

		getIsForex: function(symbol) {
			return getIsType(symbol, 'forex');
		},

		getIsSector: function(symbol) {
			return getIsType(symbol, 'sector');
		},

		getIsIndex: function(symbol) {
			return getIsType(symbol, 'index');
		},

		getIsBats: function(symbol) {
			return batsRegex.test(symbol);
		},

		getProducerSymbol: function(symbol) {
			var returnRef;

			if (typeof symbol === 'string') {
				returnRef = symbol.replace(jerqFutureConversionRegex, '$1$2$4');
			} else {
				returnRef = null;
			}

			return returnRef;
		},

		displayUsingPercent: function(symbol) {
			return usePercentRegex.test(symbol);
		}
	};

	var getIsType = function(symbol, type) {
		var instrumentType = symbolParser.parseInstrumentType(symbol);

		return instrumentType !== null && instrumentType.type === type;
	};

	return symbolParser;
}();
},{}],11:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(useTwelveHourClock, short) {
		var formatTime;

		if (useTwelveHourClock) {
			if (short) {
				formatTime = formatTwelveHourTimeShort;
			} else {
				formatTime = formatTwelveHourTime;
			}
		} else {
			if (short) {
				formatTime = formatTwentyFourHourTimeShort;
			} else {
				formatTime = formatTwentyFourHourTime;
			}
		}

		var formatters = {
			format: function(q) {
				var t = q.time;

				if (!t) {
					return '';
				} else if (!q.lastPrice || q.flag || q.sessionT) {
					return formatters.formatDate(t);
				} else {
					return formatters.formatTime(t, q.timezone);
				}
			},

			formatTime: function(date, timezone) {
				var returnRef;

				if (date) {
					returnRef = formatTime(date);

					if (timezone) {
						returnRef = returnRef + ' ' + timezone;
					}
				} else {
					returnRef = '';
				}

				return returnRef;
			},

			formatDate: function(date) {
				if (date) {
					return leftPad(date.getMonth() + 1) + '/' + leftPad(date.getDate()) + '/' + leftPad(date.getFullYear());
				} else {
					return '';
				}
			}
		};

		return formatters;
	};

	function formatTwelveHourTime(t) {
		var hours = t.getHours();
		var period;

		if (hours === 0) {
			hours = 12;
			period = 'AM';
		} else if (hours === 12) {
			hours = hours;
			period = 'PM';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'PM';
		} else {
			hours = hours;
			period = 'AM';
		}

		return leftPad(hours) + ':' + leftPad(t.getMinutes()) + ':' + leftPad(t.getSeconds()) + ' ' + period;
	}

	function formatTwelveHourTimeShort(t) {
		var hours = t.getHours();
		var period;

		if (hours === 0) {
			hours = 12;
			period = 'A';
		} else if (hours === 12) {
			hours = hours;
			period = 'P';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'P';
		} else {
			hours = hours;
			period = 'A';
		}

		return leftPad(hours) + ':' + leftPad(t.getMinutes()) + period;
	}

	function formatTwentyFourHourTime(t) {
		return leftPad(t.getHours()) + ':' + leftPad(t.getMinutes()) + ':' + leftPad(t.getSeconds());
	}

	function formatTwentyFourHourTimeShort(t) {
		return leftPad(t.getHours()) + ':' + leftPad(t.getMinutes());
	}

	function leftPad(value) {
		return ('00' + value).substr(-2);
	}
}();
},{}],12:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(bytes) {
		if (bytes.length !== 9)
			return null;

		var year = (bytes.charCodeAt(0) * 100) + bytes.charCodeAt(1) - 64;
		var month = bytes.charCodeAt(2) - 64 - 1;
		var day = bytes.charCodeAt(3) - 64;
		var hour = bytes.charCodeAt(4) - 64;
		var minute = bytes.charCodeAt(5) - 64;
		var second = bytes.charCodeAt(6) - 64;
		var ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

		// 2016/02/17. JERQ is providing us with date and time values that
		// are meant to be interpreted in the exchange's local timezone.
		//
		// This is interesting because different time values (e.g. 14:30 and
		// 13:30) can refer to the same moment (e.g. EST for US equities and
		// CST for US futures).
		//
		// Furthermore, when we use the timezone-sensitive Date object, we
		// create a problem. The represents (computer) local time. So, for
		// server applications, it is recommended that we use UTC -- so
		// that the values (hours) are not changed when JSON serialized
		// to ISO-8601 format. Then, the issue is passed along to the
		// consumer (which must ignore the timezone too).

		return new Date(year, month, day, hour, minute, second, ms);
	};
}();
},{}],13:[function(require,module,exports){
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };

  //I only added this line
  module.exports = Class;
})();

},{}],14:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
 * which returns `true` for `undefined` and other non-numeric values.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && objectToString.call(value) == numberTag);
}

module.exports = isNaN;

},{}],15:[function(require,module,exports){
var convert = require('../../lib/convert');

describe('When converting a baseCode to a unitCode', function() {
	it('-1 should translate to "2"', function() {
		expect(convert.baseCodeToUnitCode(-1)).toEqual('2');
	});

	it('-2 should translate to "3"', function() {
		expect(convert.baseCodeToUnitCode(-2)).toEqual('3');
	});

	it('-3 should translate to "4"', function() {
		expect(convert.baseCodeToUnitCode(-3)).toEqual('4');
	});

	it('-4 should translate to "5"', function() {
		expect(convert.baseCodeToUnitCode(-4)).toEqual('5');
	});

	it('-5 should translate to "6"', function() {
		expect(convert.baseCodeToUnitCode(-5)).toEqual('6');
	});

	it('-6 should translate to "7"', function() {
		expect(convert.baseCodeToUnitCode(-6)).toEqual('7');
	});

	it('0 should translate to "8"', function() {
		expect(convert.baseCodeToUnitCode(0)).toEqual('8');
	});

	it('1 should translate to "9"', function() {
		expect(convert.baseCodeToUnitCode(1)).toEqual('9');
	});

	it('2 should translate to "A"', function() {
		expect(convert.baseCodeToUnitCode(2)).toEqual('A');
	});

	it('3 should translate to "B"', function() {
		expect(convert.baseCodeToUnitCode(3)).toEqual('B');
	});

	it('4 should translate to "C"', function() {
		expect(convert.baseCodeToUnitCode(4)).toEqual('C');
	});

	it('5 should translate to "D"', function() {
		expect(convert.baseCodeToUnitCode(5)).toEqual('D');
	});

	it('6 should translate to "E"', function() {
		expect(convert.baseCodeToUnitCode(6)).toEqual('E');
	});

	it('7 should translate to "F"', function() {
		expect(convert.baseCodeToUnitCode(7)).toEqual('F');
	});

	it('"-1" should translate to 0', function() {
		expect(convert.baseCodeToUnitCode("-1")).toEqual(0);
	});

	it('A null value should translate to 0', function() {
		expect(convert.baseCodeToUnitCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', function() {
		expect(convert.baseCodeToUnitCode(undefined)).toEqual(0);
	});
});

describe('When converting a unitCode to a baseCode', function() {
	it('"2" should translate to -1', function() {
		expect(convert.unitCodeToBaseCode("2")).toEqual(-1);
	});

	it('"3" should translate to -2', function() {
		expect(convert.unitCodeToBaseCode("3")).toEqual(-2);
	});

	it('"4" should translate to -3', function() {
		expect(convert.unitCodeToBaseCode("4")).toEqual(-3);
	});

	it('"5" should translate to -4', function() {
		expect(convert.unitCodeToBaseCode("5")).toEqual(-4);
	});

	it('"6" should translate to -5', function() {
		expect(convert.unitCodeToBaseCode("6")).toEqual(-5);
	});

	it('"7" should translate to -6', function() {
		expect(convert.unitCodeToBaseCode("7")).toEqual(-6);
	});

	it('"8" should translate to 0', function() {
		expect(convert.unitCodeToBaseCode("8")).toEqual(0);
	});

	it('"9" should translate to 1', function() {
		expect(convert.unitCodeToBaseCode("9")).toEqual(1);
	});

	it('"A" should translate to 1', function() {
		expect(convert.unitCodeToBaseCode("A")).toEqual(2);
	});

	it('"B" should translate to 3', function() {
		expect(convert.unitCodeToBaseCode("B")).toEqual(3);
	});

	it('"C" should translate to 4', function() {
		expect(convert.unitCodeToBaseCode("C")).toEqual(4);
	});

	it('"D" should translate to 5', function() {
		expect(convert.unitCodeToBaseCode("D")).toEqual(5);
	});

	it('"E" should translate to 6', function() {
		expect(convert.unitCodeToBaseCode("E")).toEqual(6);
	});

	it('"F" should translate to 6', function() {
		expect(convert.unitCodeToBaseCode("F")).toEqual(7);
	});

	it('2 should translate to ', function() {
		expect(convert.unitCodeToBaseCode(2)).toEqual(0);
	});

	it('A null value should translate to 0', function() {
		expect(convert.unitCodeToBaseCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', function() {
		expect(convert.unitCodeToBaseCode(undefined)).toEqual(0);
	});
});

describe('When converting a date instance to a day code', function() {
	it('"Jan 1, 2016" should translate to 1', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 1))).toEqual('1');
	});

	it('"Jan 2, 2016" should translate to 2', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 2))).toEqual('2');
	});

	it('"Jan 3, 2016" should translate to 3', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 3))).toEqual('3');
	});

	it('"Jan 4, 2016" should translate to 4', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 4))).toEqual('4');
	});

	it('"Jan 5, 2016" should translate to 5', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 5))).toEqual('5');
	});

	it('"Jan 6, 2016" should translate to 6', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 6))).toEqual('6');
	});

	it('"Jan 7, 2016" should translate to 7', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 7))).toEqual('7');
	});

	it('"Jan 8, 2016" should translate to 8', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 8))).toEqual('8');
	});

	it('"Jan 9, 2016" should translate to 9', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 9))).toEqual('9');
	});

	it('"Jan 10, 2016" should translate to 0', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 10))).toEqual('0');
	});

	it('"Jan 11, 2016" should translate to A', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 11))).toEqual('A');
	});

	it('"Jan 12, 2016" should translate to B', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 12))).toEqual('B');
	});

	it('"Jan 13, 2016" should translate to C', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 13))).toEqual('C');
	});

	it('"Jan 14, 2016" should translate to D', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 14))).toEqual('D');
	});

	it('"Jan 15, 2016" should translate to E', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 15))).toEqual('E');
	});

	it('"Jan 16, 2016" should translate to F', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 16))).toEqual('F');
	});

	it('"Jan 17, 2016" should translate to G', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 17))).toEqual('G');
	});

	it('"Jan 18, 2016" should translate to H', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 18))).toEqual('H');
	});

	it('"Jan 19, 2016" should translate to I', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 19))).toEqual('I');
	});

	it('"Jan 20, 2016" should translate to J', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 20))).toEqual('J');
	});

	it('"Jan 21, 2016" should translate to K', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 21))).toEqual('K');
	});

	it('"Jan 22, 2016" should translate to L', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 22))).toEqual('L');
	});

	it('"Jan 23, 2016" should translate to M', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 23))).toEqual('M');
	});

	it('"Jan 24, 2016" should translate to N', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 24))).toEqual('N');
	});

	it('"Jan 25, 2016" should translate to O', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 25))).toEqual('O');
	});

	it('"Jan 26, 2016" should translate to P', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 26))).toEqual('P');
	});

	it('"Jan 27, 2016" should translate to Q', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 27))).toEqual('Q');
	});

	it('"Jan 28, 2016" should translate to R', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 28))).toEqual('R');
	});

	it('"Jan 29, 2016" should translate to S', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 29))).toEqual('S');
	});

	it('"Jan 30, 2016" should translate to T', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 30))).toEqual('T');
	});

	it('"Jan 31, 2016" should translate to U', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 31))).toEqual('U');
	});
});

describe('When converting a dayCode to number', function() {
	it('"1" should translate to 1', function() {
		expect(convert.dayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', function() {
		expect(convert.dayCodeToNumber("2")).toEqual(2);
	});

	it('"3" should translate to 3', function() {
		expect(convert.dayCodeToNumber("3")).toEqual(3);
	});

	it('"4" should translate to 4', function() {
		expect(convert.dayCodeToNumber("4")).toEqual(4);
	});

	it('"5" should translate to 5', function() {
		expect(convert.dayCodeToNumber("5")).toEqual(5);
	});

	it('"6" should translate to 6', function() {
		expect(convert.dayCodeToNumber("6")).toEqual(6);
	});

	it('"7" should translate to 7', function() {
		expect(convert.dayCodeToNumber("7")).toEqual(7);
	});

	it('"8" should translate to 8', function() {
		expect(convert.dayCodeToNumber("8")).toEqual(8);
	});

	it('"9" should translate to 9', function() {
		expect(convert.dayCodeToNumber("9")).toEqual(9);
	});

	it('"0" should translate to 10', function() {
		expect(convert.dayCodeToNumber("0")).toEqual(10);
	});

	it('"A" should translate to 11', function() {
		expect(convert.dayCodeToNumber("A")).toEqual(11);
	});

	it('"a" should translate to 11', function() {
		expect(convert.dayCodeToNumber("a")).toEqual(11);
	});

	it('"B" should translate to 12', function() {
		expect(convert.dayCodeToNumber("B")).toEqual(12);
	});

	it('"b" should translate to 12', function() {
		expect(convert.dayCodeToNumber("b")).toEqual(12);
	});

	it('"C" should translate to 13', function() {
		expect(convert.dayCodeToNumber("C")).toEqual(13);
	});

	it('"c" should translate to 13', function() {
		expect(convert.dayCodeToNumber("c")).toEqual(13);
	});

	it('"D" should translate to 14', function() {
		expect(convert.dayCodeToNumber("D")).toEqual(14);
	});

	it('"d" should translate to 14', function() {
		expect(convert.dayCodeToNumber("d")).toEqual(14);
	});

	it('"E" should translate to 15', function() {
		expect(convert.dayCodeToNumber("E")).toEqual(15);
	});

	it('"e" should translate to 15', function() {
		expect(convert.dayCodeToNumber("e")).toEqual(15);
	});

	it('"F" should translate to 16', function() {
		expect(convert.dayCodeToNumber("F")).toEqual(16);
	});

	it('"f" should translate to 16', function() {
		expect(convert.dayCodeToNumber("f")).toEqual(16);
	});

	it('"G" should translate to 17', function() {
		expect(convert.dayCodeToNumber("G")).toEqual(17);
	});

	it('"g" should translate to 17', function() {
		expect(convert.dayCodeToNumber("g")).toEqual(17);
	});

	it('"H" should translate to 18', function() {
		expect(convert.dayCodeToNumber("H")).toEqual(18);
	});

	it('"h" should translate to 18', function() {
		expect(convert.dayCodeToNumber("h")).toEqual(18);
	});

	it('"I" should translate to 19', function() {
		expect(convert.dayCodeToNumber("I")).toEqual(19);
	});

	it('"i" should translate to 19', function() {
		expect(convert.dayCodeToNumber("i")).toEqual(19);
	});

	it('"J" should translate to 20', function() {
		expect(convert.dayCodeToNumber("J")).toEqual(20);
	});

	it('"j" should translate to 20', function() {
		expect(convert.dayCodeToNumber("j")).toEqual(20);
	});

	it('"K" should translate to 21', function() {
		expect(convert.dayCodeToNumber("K")).toEqual(21);
	});

	it('"k" should translate to 21', function() {
		expect(convert.dayCodeToNumber("k")).toEqual(21);
	});

	it('"L" should translate to 22', function() {
		expect(convert.dayCodeToNumber("L")).toEqual(22);
	});

	it('"l" should translate to 22', function() {
		expect(convert.dayCodeToNumber("l")).toEqual(22);
	});

	it('"M" should translate to 23', function() {
		expect(convert.dayCodeToNumber("M")).toEqual(23);
	});

	it('"m" should translate to 23', function() {
		expect(convert.dayCodeToNumber("m")).toEqual(23);
	});

	it('"N" should translate to 24', function() {
		expect(convert.dayCodeToNumber("N")).toEqual(24);
	});

	it('"n" should translate to 24', function() {
		expect(convert.dayCodeToNumber("n")).toEqual(24);
	});

	it('"O" should translate to 25', function() {
		expect(convert.dayCodeToNumber("O")).toEqual(25);
	});

	it('"o" should translate to 25', function() {
		expect(convert.dayCodeToNumber("o")).toEqual(25);
	});

	it('"P" should translate to 26', function() {
		expect(convert.dayCodeToNumber("P")).toEqual(26);
	});

	it('"p" should translate to 26', function() {
		expect(convert.dayCodeToNumber("p")).toEqual(26);
	});

	it('"Q" should translate to 27', function() {
		expect(convert.dayCodeToNumber("Q")).toEqual(27);
	});

	it('"q" should translate to 27', function() {
		expect(convert.dayCodeToNumber("q")).toEqual(27);
	});

	it('"R" should translate to 28', function() {
		expect(convert.dayCodeToNumber("R")).toEqual(28);
	});

	it('"r" should translate to 28', function() {
		expect(convert.dayCodeToNumber("r")).toEqual(28);
	});

	it('"S" should translate to 29', function() {
		expect(convert.dayCodeToNumber("S")).toEqual(29);
	});

	it('"s" should translate to 29', function() {
		expect(convert.dayCodeToNumber("s")).toEqual(29);
	});

	it('"T" should translate to 30', function() {
		expect(convert.dayCodeToNumber("T")).toEqual(30);
	});

	it('"t" should translate to 30', function() {
		expect(convert.dayCodeToNumber("t")).toEqual(30);
	});

	it('"U" should translate to 31', function() {
		expect(convert.dayCodeToNumber("U")).toEqual(31);
	});

	it('"u" should translate to 31', function() {
		expect(convert.dayCodeToNumber("u")).toEqual(31);
	});
});
},{"../../lib/convert":3}],16:[function(require,module,exports){
var decimalFormatter = require('../../lib/decimalFormatter');

describe('when formatting invalid values', function() {
	it('formats a null value as a zero-length string', function() {
		expect(decimalFormatter(null, 0, ',')).toEqual('');
	});

	it('formats an undefined value as a zero-length string', function() {
		expect(decimalFormatter(undefined, 0, ',')).toEqual('');
	});

	it('formats Number.NaN as a zero-length string', function() {
		expect(decimalFormatter(Number.NaN, 0, ',')).toEqual('');
	});
});

describe('when using the "decimal" formatter with zero decimals and thousands separator', function() {
	it('formats 0 as "0"', function() {
		expect(decimalFormatter(0, 0, ',')).toEqual('0');
	});

	it('formats 0.1 as "0"', function() {
		expect(decimalFormatter(0.1, 0, ',')).toEqual('0');
	});

	it('formats 0.9 as "0"', function() {
		expect(decimalFormatter(0.9, 0, ',')).toEqual('1');
	});

	it('formats 377 as "377"', function() {
		expect(decimalFormatter(377, 0, ',')).toEqual('377');
	});

	it('formats -377 as "-377"', function() {
		expect(decimalFormatter(-377, 0, ',')).toEqual('-377');
	});

	it('formats 377.99 as "378"', function() {
		expect(decimalFormatter(377.99, 0, ',')).toEqual('378');
	});

	it('formats -377.99 as "-378"', function() {
		expect(decimalFormatter(-377.99, 0, ',')).toEqual('-378');
	});

	it('formats 377.49 as "377"', function() {
		expect(decimalFormatter(377.49, 0, ',')).toEqual('377');
	});

	it('formats -377.49 as "-377"', function() {
		expect(decimalFormatter(-377.49, 0, ',')).toEqual('-377');
	});

	it('formats 377377 as "377,377"', function() {
		expect(decimalFormatter(377377, 0, ',')).toEqual('377,377');
	});

	it('formats -377377 as "-377,377"', function() {
		expect(decimalFormatter(-377377, 0, ',')).toEqual('-377,377');
	});

	it('formats 377377.49 as "377,377"', function() {
		expect(decimalFormatter(377377.49, 0, ',')).toEqual('377,377');
	});

	it('formats -377377.49 as "-377,377"', function() {
		expect(decimalFormatter(-377377.49, 0, ',')).toEqual('-377,377');
	});

	it('formats 377377.99 as "377,378"', function() {
		expect(decimalFormatter(377377.99, 0, ',')).toEqual('377,378');
	});

	it('formats -377377.99 as "-377,378"', function() {
		expect(decimalFormatter(-377377.99, 0, ',')).toEqual('-377,378');
	});
});

describe('when using the "decimal" formatter with two decimals and thousands separator', function() {
	it('formats 0 as "0.00"', function() {
		expect(decimalFormatter(0, 2, ',')).toEqual('0.00');
	});

	it('formats 0.001 as "0.00"', function() {
		expect(decimalFormatter(0.001, 2, ',')).toEqual('0.00');
	});

	it('formats 0.009 as "0.01"', function() {
		expect(decimalFormatter(0.009, 2, ',')).toEqual('0.01');
	});

	it('formats 123.45 as "123.45"', function() {
		expect(decimalFormatter(123.45, 2, ',')).toEqual('123.45');
	});

	it('formats -123.45 as "-123.45"', function() {
		expect(decimalFormatter(-123.45, 2, ',')).toEqual('-123.45');
	});

	it('formats 1234.5 as "1234.50"', function() {
		expect(decimalFormatter(1234.5, 2, ',')).toEqual('1,234.50');
	});

	it('formats -1234.5 as "-1234.50"', function() {
		expect(decimalFormatter(-1234.5, 2, ',')).toEqual('-1,234.50');
	});

	it('formats 123456.789 as "123,456.79"', function() {
		expect(decimalFormatter(123456.789, 2, ',')).toEqual('123,456.79');
	});

	it('formats -123456.789 as "-123,456.79"', function() {
		expect(decimalFormatter(-123456.789, 2, ',')).toEqual('-123,456.79');
	});
});

describe('when using the "decimal" formatter with four decimals and thousands separator', function() {
	it('formats 1234.56789 as "1,234.5679"', function () {
		expect(decimalFormatter(1234.56789, 4, ',')).toEqual('1,234.5679');
	});

	it('formats -1234.56789 as "-1,234.5679"', function () {
		expect(decimalFormatter(-1234.56789, 4, ',')).toEqual('-1,234.5679');
	});
});

describe('when using the "decimal" formatter to format negative numbers with a thousands separator', function() {
	it('formats -123.456789 as "-123.45"', function () {
		expect(decimalFormatter(-123.456789, 2, ',')).toEqual('-123.46');
	});

	it('formats -123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(-123456.789 , 2, ',')).toEqual('-123,456.79');
	});
});

describe('when using the "decimal" formatter to format with parenthesis and a thousands separator', function() {
	it('formats 123.456789 as "-23.45"', function () {
		expect(decimalFormatter(123.456789, 2, ',', true)).toEqual('123.46');
	});

	it('formats -123.456789 as "-123.45"', function () {
		expect(decimalFormatter(-123.456789, 2, ',', true)).toEqual('(123.46)');
	});

	it('formats 123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(123456.789 , 2, ',', true)).toEqual('123,456.79');
	});

	it('formats -123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(-123456.789 , 2, ',', true)).toEqual('(123,456.79)');
	});

	it('formats -3770.75, to three decimal places, as "(3,770.750)', function () {
		expect(decimalFormatter(-3770.75 , 3, ',', true)).toEqual('(3,770.750)');
	});
});

describe('when using the "decimal" formatter to format with parenthesis and no thousands separator', function() {
	it('formats 123.456789 as "-23.45"', function () {
		expect(decimalFormatter(123.456789, 2, '', true)).toEqual('123.46');
	});

	it('formats -123.456789 as "-123.45"', function () {
		expect(decimalFormatter(-123.456789, 2, '', true)).toEqual('(123.46)');
	});

	it('formats 123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(123456.789 , 2, '', true)).toEqual('123456.79');
	});

	it('formats -123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(-123456.789 , 2, '', true)).toEqual('(123456.79)');
	});
});


},{"../../lib/decimalFormatter":4}],17:[function(require,module,exports){
var monthCodes = require('../../lib/monthCodes');

describe('When looking up a month name by code', function() {
	var map;

	beforeEach(function() {
		map = monthCodes.getCodeToNameMap();
	});

	it('"F" should map to "January"', function() {
		expect(map.F).toEqual("January");
	});

	it('"G" should map to "February"', function() {
		expect(map.G).toEqual("February");
	});

	it('"H" should map to "March"', function() {
		expect(map.H).toEqual("March");
	});

	it('"J" should map to "April"', function() {
		expect(map.J).toEqual("April");
	});

	it('"K" should map to "May"', function() {
		expect(map.K).toEqual("May");
	});

	it('"M" should map to "June"', function() {
		expect(map.M).toEqual("June");
	});

	it('"N" should map to "July"', function() {
		expect(map.N).toEqual("July");
	});

	it('"Q" should map to "August"', function() {
		expect(map.Q).toEqual("August");
	});

	it('"U" should map to "September"', function() {
		expect(map.U).toEqual("September");
	});

	it('"V" should map to "October"', function() {
		expect(map.V).toEqual("October");
	});

	it('"X" should map to "November"', function() {
		expect(map.X).toEqual("November");
	});

	it('"Z" should map to "December"', function() {
		expect(map.Z).toEqual("December");
	});
});

describe('When looking up a month number by code', function() {
	var map;

	beforeEach(function() {
		map = monthCodes.getCodeToNumberMap();
	});

	it('"F" should map to 1', function() {
		expect(map.F).toEqual(1);
	});

	it('"G" should map to 2', function() {
		expect(map.G).toEqual(2);
	});

	it('"H" should map to 3', function() {
		expect(map.H).toEqual(3);
	});

	it('"J" should map to 4', function() {
		expect(map.J).toEqual(4);
	});

	it('"K" should map to 5', function() {
		expect(map.K).toEqual(5);
	});

	it('"M" should map to 6', function() {
		expect(map.M).toEqual(6);
	});

	it('"N" should map to 7', function() {
		expect(map.N).toEqual(7);
	});

	it('"Q" should map to 8', function() {
		expect(map.Q).toEqual(8);
	});

	it('"U" should map to 9', function() {
		expect(map.U).toEqual(9);
	});

	it('"V" should map to 10', function() {
		expect(map.V).toEqual(10);
	});

	it('"X" should map to 11', function() {
		expect(map.X).toEqual(11);
	});

	it('"Z" should map to 12', function() {
		expect(map.Z).toEqual(12);
	});
});
},{"../../lib/monthCodes":6}],18:[function(require,module,exports){
var parseMessage = require('../../lib/messageParser');

describe('when parsing an XML refresh message', function() {
	describe('for an instrument that has settled and has a postmarket (form-T) trade', function() {
		var x;

		beforeEach(function() {
			x = parseMessage(`%<QUOTE symbol="AAPL" name="Apple Inc" exchange="NASDAQ" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="Q" flag="s" lastupdate="20160920163525" bid="11345" bidsize="10" ask="11352" asksize="1" mode="I">
					<SESSION day="J" session="R" timestamp="20160920171959" open="11305" high="11412" low="11251" last="11357" previous="11358" settlement="11357" tradesize="1382944" volume="36258067" numtrades="143218" pricevolume="3548806897.06" tradetime="20160920160000" ticks=".." id="combined"/>
					<SESSION day="I" timestamp="20160919000000" open="11519" high="11618" low="11325" last="11358" previous="11492" settlement="11358" volume="47010000" ticks=".." id="previous"/>
					<SESSION day="J" session="R" previous="11358" volume="13198" id="session_J_R"/>
					<SESSION day="J" session="T" timestamp="20160920172007" last="11355" previous="11358" tradesize="500" volume="656171" numtrades="1118" pricevolume="74390050.90" tradetime="20160920172007" ticks="+-" id="session_J_T"/>
					</QUOTE>`);
		});

		it('the "flag" should be "s"', function() {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should not be "T"', function() {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be true', function() {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 113.57', function() {
			expect(x.lastPrice).toEqual(113.57);
		});

		it('the "lastPriceT" should be 113.55', function() {
			expect(x.lastPriceT).toEqual(113.55);
		});

		it('the "volume" should come from the "combined" session', function() {
			expect(x.volume).toEqual(36258067);
		});
	});

	describe('for an instrument that is not settled, but has a postmarket (form-T) trade', function() {
		var x;

		beforeEach(function() {
			x = parseMessage(`%<QUOTE symbol="BAC" name="Bank of America Corp" exchange="NYSE" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="N" lastupdate="20160920152208" bid="1558" bidsize="20" ask="1559" asksize="1" mode="I">
					<SESSION day="J" session="R" timestamp="20160920160021" open="1574" high="1576" low="1551" last="1560" previous="1559" tradesize="1483737" volume="67399368" numtrades="96903" pricevolume="1041029293.48" tradetime="20160920160021" ticks=".." id="combined"/>
					<SESSION day="I" timestamp="20160919000000" open="1555" high="1578" low="1555" last="1559" previous="1549" settlement="1559" volume="66174800" ticks=".." id="previous"/>
					<SESSION day="J" session="R" previous="1559" volume="1772" id="session_J_R"/>
					<SESSION day="J" session="T" timestamp="20160920160527" last="1559" previous="1559" tradesize="1175" volume="296998" numtrades="356" pricevolume="4652652.89" tradetime="20160920160527" ticks=".." id="session_J_T"/>
					</QUOTE>`);
		});

		it('the "flag" should not be "s"', function() {
			expect(x.flag).not.toEqual('s');
		});

		it('the "session" should not be "T"', function() {
			expect(x.session).not.toEqual('T');
		});

		it('the "sessionT" should be true', function() {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 15.60', function() {
			expect(x.lastPrice).toEqual(15.60);
		});

		it('the "lastPriceT" should be 15.59', function() {
			expect(x.lastPriceT).toEqual(15.59);
		});

		it('the "volume" should come from the "combined" session', function() {
			expect(x.volume).toEqual(67399368);
		});
	});

	describe('for an instrument that has settled, but the form-T session is from the morning', function() {
		var x;

		beforeEach(function() {
			x = parseMessage(`%<QUOTE symbol="UDOW" name="Ultrapro DOW 30 Proshares" exchange="AMEX" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="A" lastupdate="20170222103439" bid="10994" bidsize="16" ask="10997" asksize="8" mode="I" flag="s">
				<SESSION day="L" session="R" timestamp="20170222111751" open="10933" high="11032" low="10918" last="10993" previous="10993" tradesize="112" volume="87485" numtrades="357" pricevolume="8628142.83" tradetime="20170222111751" ticks="++" id="combined" settlement="10993"/>
				<SESSION day="K" timestamp="20170221000000" open="10921" high="11021" low="10889" last="10993" previous="10798" settlement="10993" volume="387500" ticks=".." id="previous"/>
				<SESSION day="L" session="R" previous="10993" id="session_L_R"/>
				<SESSION day="L" session="T" timestamp="20170222080456" last="10987" previous="10993" tradesize="200" volume="400" numtrades="3" pricevolume="43949.00" tradetime="20170222080456" ticks=".-" id="session_L_T"/>
				</QUOTE>`);
		});

		it('the "flag" should be "s"', function() {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should be "T"', function() {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be false', function() {
			expect(x.sessionT).toEqual(false);
		});

		it('the "lastPrice" should be 109.93 (taken from "combined" session)', function() {
			expect(x.lastPrice).toEqual(109.93);
		});

		it('the "lastPriceT" should not be included', function() {
			expect(x.lastPriceT).not.toBeDefined();
		});

		it('the "tradeTime" should come from the "combined" session', function() {
			expect(x.tradeTime.getTime()).toEqual((new Date(2017, 1, 22, 11, 17, 51)).getTime());
		});
	});
});

describe('when parsing a DDF message', function() {
	describe('for a 2,Z message for SIRI, 3@3.94', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012SIRI,Z AQ15394,3,1I');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', function() {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.94', function() {
			expect(x.tradePrice).toEqual(3.94);
		});

		it('the "tradeSize" should be 3', function() {
			expect(x.tradeSize).toEqual(3);
		});
	});

	describe('for a 2,Z message for SIRI, 2998262@3.95', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012SIRI,Z AQ15395,2998262,1W');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', function() {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.95', function() {
			expect(x.tradePrice).toEqual(3.95);
		});

		it('the "tradeSize" should be 2998262', function() {
			expect(x.tradeSize).toEqual(2998262);
		});
	});

	describe('for a 2,0 message for AAPL', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012AAPL,0\x02AQ1510885,D0M \x03\x14PHWQT@\x04$');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "0"', function() {
			expect(x.subrecord).toEqual('0');
		});

		it('the "symbol" should be "AAPL"', function() {
			expect(x.symbol).toEqual('AAPL');
		});

		it('the "type" should be "SETTLEMENT"', function() {
			expect(x.type).toEqual('SETTLEMENT');
		});

		it('the "value" should be 108.85', function() {
			expect(x.value).toEqual(108.85);
		});
	});

	describe('for a 2,Z message for TSLA', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012TSLA,Z\x02AQ1521201,3,TI\x03');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "AAPL"', function() {
			expect(x.symbol).toEqual('TSLA');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be "212.01"', function() {
			expect(x.tradePrice).toEqual(212.01);
		});

		it('the "day" should be "T"', function() {
			expect(x.day).toEqual('T');
		});

		it('the "session" should be "I"', function() {
			expect(x.session).toEqual('I');
		});
	});
});

},{"../../lib/messageParser":5}],19:[function(require,module,exports){
var PriceFormatter = require('../../lib/priceFormatter');

describe('When a price formatter is created', function() {
	var priceFormatter;

	describe('with a decimal separator', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('.');
		});

		it('formats 377 (with unit code 2) as "377.000"', function() {
			expect(priceFormatter.format(377, '2')).toEqual('377.000');
		});

		it('formats -377 (with unit code 2) as "-377.000"', function() {
			expect(priceFormatter.format(-377, '2')).toEqual('-377.000');
		});

		it('formats 377.5 (with unit code 2) as "377.500"', function() {
			expect(priceFormatter.format(377.5, '2')).toEqual('377.500');
		});

		it('formats 377.75 (with unit code 2) as "377.750"', function() {
			expect(priceFormatter.format(377.75, '2')).toEqual('377.750');
		});

		it('formats 3770.75 (with unit code 2) as "3770.750"', function() {
			expect(priceFormatter.format(3770.75, '2')).toEqual('3770.750');
		});

		it('formats 37700.75 (with unit code 2) as "37700.750"', function() {
			expect(priceFormatter.format(37700.75, '2')).toEqual('37700.750');
		});

		it('formats 377000.75 (with unit code 2) as "377000.750"', function() {
			expect(priceFormatter.format(377000.75, '2')).toEqual('377000.750');
		});

		it('formats 3770000.75 (with unit code 2) as "3770000.750"', function() {
			expect(priceFormatter.format(3770000.75, '2')).toEqual('3770000.750');
		});

		it('formats 3770000 (with unit code 2) as "3770000.000"', function() {
			expect(priceFormatter.format(3770000, '2')).toEqual('3770000.000');
		});

		it('formats 0 (with unit code 2) as "0.000"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0.000');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});

		it('formats 0 (with unit code 8) as "0"', function() {
			expect(priceFormatter.format(0, '8')).toEqual('0');
		});

		it('formats 1000 (with unit code 8) as "1000"', function() {
			expect(priceFormatter.format(1000, '8')).toEqual('1000');
		});
	});

	describe('with a decimal separator, no special fractions, and a thousands separator', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('.', false, ',');
		});

		it('formats 377 (with unit code 2) as "377.000"', function() {
			expect(priceFormatter.format(377, '2')).toEqual('377.000');
		});

		it('formats -377 (with unit code 2) as "-377.000"', function() {
			expect(priceFormatter.format(-377, '2')).toEqual('-377.000');
		});

		it('formats 377.5 (with unit code 2) as "377.500"', function() {
			expect(priceFormatter.format(377.5, '2')).toEqual('377.500');
		});

		it('formats 377.75 (with unit code 2) as "377.750"', function() {
			expect(priceFormatter.format(377.75, '2')).toEqual('377.750');
		});

		it('formats 3770.75 (with unit code 2) as "3,770.750"', function() {
			expect(priceFormatter.format(3770.75, '2')).toEqual('3,770.750');
		});

		it('formats 37700.75 (with unit code 2) as "37,700.750"', function() {
			expect(priceFormatter.format(37700.75, '2')).toEqual('37,700.750');
		});

		it('formats 377000.75 (with unit code 2) as "377,000.750"', function() {
			expect(priceFormatter.format(377000.75, '2')).toEqual('377,000.750');
		});

		it('formats -377000.75 (with unit code 2) as "-377,000.750"', function() {
			expect(priceFormatter.format(-377000.75, '2')).toEqual('-377,000.750');
		});

		it('formats 3770000.75 (with unit code 2) as "3,770,000.750"', function() {
			expect(priceFormatter.format(3770000.75, '2')).toEqual('3,770,000.750');
		});

		it('formats 3770000 (with unit code 2) as "3,770,000.000"', function() {
			expect(priceFormatter.format(3770000, '2')).toEqual('3,770,000.000');
		});

		it('formats 0 (with unit code 2) as "0.000"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0.000');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});

		it('formats 0 (with unit code 8) as "0"', function() {
			expect(priceFormatter.format(0, '8')).toEqual('0');
		});

		it('formats 1000 (with unit code 8) as "1,000"', function() {
			expect(priceFormatter.format(1000, '8')).toEqual('1,000');
		});
	});

	describe('with a dash separator and no special fractions', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('-', false);
		});

		it('formats 123 (with unit code 2) as "123-0"', function() {
			expect(priceFormatter.format(123, '2')).toEqual('123-0');
		});

		it('formats -123 (with unit code 2) as "-123-0"', function() {
			expect(priceFormatter.format(-123, '2')).toEqual('-123-0');
		});

		it('formats 123.5 (with unit code 2) as "123-4"', function() {
			expect(priceFormatter.format(123.5, '2')).toEqual('123-4');
		});

		it('formats -123.5 (with unit code 2) as "-123-4"', function() {
			expect(priceFormatter.format(-123.5, '2')).toEqual('-123-4');
		});

		it('formats 0.5 (with unit code 2) as "0-4"', function() {
			expect(priceFormatter.format(0.5, '2')).toEqual('0-4');
		});

		it('formats 0 (with unit code 2) as "0-0"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0-0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});

		it('formats 123 (with unit code A) as "123.00"', function() {
			expect(priceFormatter.format(123, 'A')).toEqual('123.00');
		});

		it('formats 123.5 (with unit code A) as "123.50"', function() {
			expect(priceFormatter.format(123.5, 'A')).toEqual('123.50');
		});

		it('formats 123.555 (with unit code A) as "123.56"', function() {
			expect(priceFormatter.format(123.555, 'A')).toEqual('123.56');
		});
	});

	describe('with a dash separator and special fractions', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('-', true);
		});

		it('formats 123.625 (with unit code 5) as "123-200"', function() {
			expect(priceFormatter.format(123.625, '5')).toEqual('123-200');
		});

		it('formats -123.625 (with unit code 5) as "-123-200"', function() {
			expect(priceFormatter.format(-123.625, '5')).toEqual('-123-200');
		});

		it('formats 123.640625 (with unit code 5) as "123-205"', function() {
			expect(priceFormatter.format(123.640625, '5')).toEqual('123-205');
		});

		it('formats -123.640625 (with unit code 5) as "-123-205"', function() {
			expect(priceFormatter.format(-123.640625, '5')).toEqual('-123-205');
		});

		it('formats 0 (with unit code 2) as "0"', function () {
			expect(priceFormatter.format(0, '2')).toEqual('0-0');
		});
	});

	describe('with a tick separator and no special fractions', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('\'', false);
		});

		it('formats 123 (with unit code 2) as "123\'0"', function() {
			expect(priceFormatter.format(123, '2')).toEqual('123\'0');
		});

		it('formats 123.5 (with unit code 2) as "123\'4"', function() {
			expect(priceFormatter.format(123.5, '2')).toEqual('123\'4');
		});

		it('formats -123.5 (with unit code 2) as "-123\'4"', function() {
			expect(priceFormatter.format(-123.5, '2')).toEqual('-123\'4');
		});

		it('formats 0.5 (with unit code 2) as "0\'4"', function() {
			expect(priceFormatter.format(0.5, '2')).toEqual('0\'4');
		});

		it('formats -0.5 (with unit code 2) as "-0\'4"', function() {
			expect(priceFormatter.format(-0.5, '2')).toEqual('-0\'4');
		});

		it('formats 0 (with unit code 2) as "0\'0"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0\'0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with no separator and no special fractions', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('', false);
		});

		it('formats 123 (with unit code 2) as "1230"', function() {
			expect(priceFormatter.format(123, '2')).toEqual('1230');
		});

		it('formats 123.5 (with unit code 2) as "1234"', function() {
			expect(priceFormatter.format(123.5, '2')).toEqual('1234');
		});

		it('formats 0.5 (with unit code 2) as "4"', function() {
			expect(priceFormatter.format(0.5, '2')).toEqual('4');
		});

		it('formats 0 (with unit code 2) as "0"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with parenthetical negatives', function() {
		describe('and a decimal separator, no special fractions, and no thousands separator', function() {
			beforeEach(function() {
				priceFormatter = new PriceFormatter('.', false, '', true);
			});

			it('formats 3770.75 (with unit code 2) as "3770.750"', function() {
				expect(priceFormatter.format(3770.75, '2')).toEqual('3770.750');
			});

			it('formats -3770.75 (with unit code 2) as "(3770.750)"', function() {
				expect(priceFormatter.format(-3770.75, '2')).toEqual('(3770.750)');
			});

			it('formats 0 (with unit code 2) as "0.000"', function() {
				expect(priceFormatter.format(0, '2')).toEqual('0.000');
			});
		});

		describe('with a decimal separator, no special fractions, and a thousands separator', function() {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('.', false, ',', true);
			});

			it('formats 3770.75 (with unit code 2) as "3,770.750"', function() {
				expect(priceFormatter.format(3770.75, '2')).toEqual('3,770.750');
			});

			it('formats -3770.75 (with unit code 2) as "(3,770.750)"', function() {
				expect(priceFormatter.format(-3770.75, '2')).toEqual('(3,770.750)');
			});

			it('formats 0 (with unit code 2) as "0.000"', function() {
				expect(priceFormatter.format(0, '2')).toEqual('0.000');
			});
		});

		describe('with a dash separator and no special fractions', function() {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('-', false, '', true);
			});

			it('formats 123 (with unit code 2) as "123-0"', function () {
				expect(priceFormatter.format(123, '2')).toEqual('123-0');
			});

			it('formats -123 (with unit code 2) as "(123-0)"', function () {
				expect(priceFormatter.format(-123, '2')).toEqual('(123-0)');
			});

			it('formats 123.5 (with unit code 2) as "123-4"', function () {
				expect(priceFormatter.format(123.5, '2')).toEqual('123-4');
			});

			it('formats -123.5 (with unit code 2) as "(123-4)"', function () {
				expect(priceFormatter.format(-123.5, '2')).toEqual('(123-4)');
			});

			it('formats 0.5 (with unit code 2) as "0-4"', function() {
				expect(priceFormatter.format(0.5, '2')).toEqual('0-4');
			});

			it('formats -0.5 (with unit code 2) as "(0-4)"', function() {
				expect(priceFormatter.format(-0.5, '2')).toEqual('(0-4)');
			});

			it('formats 0 (with unit code 2) as "0"', function () {
				expect(priceFormatter.format(0, '2')).toEqual('0-0');
			});
		});

		describe('with a dash separator and special fractions', function() {
			beforeEach(function() {
				priceFormatter = new PriceFormatter('-', true, '', true);
			});

			it('formats 123.625 (with unit code 5) as "123-200"', function() {
				expect(priceFormatter.format(123.625, '5')).toEqual('123-200');
			});

			it('formats -123.625 (with unit code 5) as "(123-200)"', function() {
				expect(priceFormatter.format(-123.625, '5')).toEqual('(123-200)');
			});

			it('formats 123.640625 (with unit code 5) as "123-205"', function() {
				expect(priceFormatter.format(123.640625, '5')).toEqual('123-205');
			});

			it('formats -123.640625 (with unit code 5) as "(123-205)"', function() {
				expect(priceFormatter.format(-123.640625, '5')).toEqual('(123-205)');
			});
		});

		describe('with a tick separator and no special fractions', function() {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('\'', false, '', true);
			});

			it('formats 123.5 (with unit code 2) as "123\'4"', function () {
				expect(priceFormatter.format(123.5, '2')).toEqual('123\'4');
			});

			it('formats -123.5 (with unit code 2) as "(123\'4)"', function () {
				expect(priceFormatter.format(-123.5, '2')).toEqual('(123\'4)');
			});

			it('formats 0.5 (with unit code 2) as "0\'4"', function() {
				expect(priceFormatter.format(0.5, '2')).toEqual('0\'4');
			});

			it('formats -0.5 (with unit code 2) as "(0\'4)"', function() {
				expect(priceFormatter.format(-0.5, '2')).toEqual('(0\'4)');
			});

			it('formats 0 (with unit code 2) as "0\'0"', function() {
				expect(priceFormatter.format(0, '2')).toEqual('0\'0');
			});
		});

		describe('with no separator and no special fractions', function() {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('', false, '', true);
			});

			it('formats 0.5 (with unit code 2) as "4"', function () {
				expect(priceFormatter.format(0.5, '2')).toEqual('4');
			});

			it('formats -0.5 (with unit code 2) as "(4)"', function () {
				expect(priceFormatter.format(-0.5, '2')).toEqual('(4)');
			});

			it('formats 0 (with unit code 2) as "0"', function () {
				expect(priceFormatter.format(0, '2')).toEqual('0');
			});
		});
	});
});
},{"../../lib/priceFormatter":7}],20:[function(require,module,exports){
var priceParser = require('../../lib/priceParser');

describe('when parsing prices', function() {
	'use strict';

	describe('with a decimal fraction separator', function() {
		it('returns 0.75 (with unit code 2) when parsing ".75"', function() {
			expect(priceParser('.75', '2')).toEqual(0.75);
		});

		it('returns 377 (with unit code 2) when parsing "377.000"', function() {
			expect(priceParser('377.000', '2')).toEqual(377);
		});

		it('returns 377.5 (with unit code 2) when parsing "377.500"', function() {
			expect(priceParser('377.500', '2')).toEqual(377.5);
		});

		it('returns 377.75 (with unit code 2) when parsing "377.750"', function() {
			expect(priceParser('377.750', '2')).toEqual(377.75);
		});

		it('returns 3770.75 (with unit code 2) when parsing "3770.750"', function() {
			expect(priceParser('3770.750', '2')).toEqual(3770.75);
		});

		it('returns 37700.75 (with unit code 2) when parsing "37700.750"', function() {
			expect(priceParser('37700.750', '2')).toEqual(37700.75);
		});

		it('returns 377000.75 (with unit code 2) when parsing "377000.750"', function() {
			expect(priceParser('377000.750', '2')).toEqual(377000.75);
		});

		it('returns 3770000.75 (with unit code 2) when parsing "3770000.750"', function() {
			expect(priceParser('3770000.750', '2')).toEqual(3770000.75);
		});

		it('returns 3770000 (with unit code 2) when parsing "3770000.000"', function() {
			expect(priceParser('3770000.000', '2')).toEqual(3770000);
		});

		it('returns 0 (with unit code 2) when parsing "0.000"', function() {
			expect(priceParser('0.000', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', function() {
			expect(priceParser('', '2')).toEqual(undefined);
		});

		it('returns 0 (with unit code 8) when parsing "0"', function() {
			expect(priceParser('0', '8')).toEqual(0);
		});

		it('returns 1000 (with unit code 8) when parsing "1000"', function() {
			expect(priceParser('1000', '8')).toEqual(1000);
		});
	});

	describe('with a decimal fraction separator and a comma thousands separator', function() {
		it('returns 0.75 (with unit code 2) when parsing ".75"', function() {
			expect(priceParser('.75', '2', ',')).toEqual(0.75);
		});

		it('returns 3770.75 (with unit code 2) when parsing "3,770.750"', function() {
			expect(priceParser('3,770.750', '2', ',')).toEqual(3770.75);
		});

		it('returns 37700.75 (with unit code 2) when parsing "37,700.750"', function() {
			expect(priceParser('37,700.750', '2', ',')).toEqual(37700.75);
		});

		it('returns 377000.75 (with unit code 2) when parsing "377,000.750"', function() {
			expect(priceParser('377,000.750', '2', ',')).toEqual(377000.75);
		});

		it('returns 3770000.75 (with unit code 2) when parsing "3,770,000.750"', function() {
			expect(priceParser('3,770,000.750', '2', ',')).toEqual(3770000.75);
		});

		it('returns 3770000 (with unit code 2) when parsing "3,770,000.000"', function() {
			expect(priceParser('3,770,000.000', '2', ',')).toEqual(3770000);
		});
	});

	describe('with a dash fraction separator', function() {
		it('returns 123 (with unit code 2) when parsing "123-0"', function() {
			expect(priceParser('123-0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123-4"', function() {
			expect(priceParser('123-4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0-4"', function() {
			expect(priceParser('0-4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0-0"', function() {
			expect(priceParser('0-0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', function() {
			expect(priceParser('', '2')).toEqual(undefined);
		});
	});

	describe('with a tick fraction separator', function() {
		it('returns 123 (with unit code 2) when parsing "123\'0"', function() {
			expect(priceParser('123\'0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123\'4"', function() {
			expect(priceParser('123\'4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0\'4"', function() {
			expect(priceParser('0\'4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0\'0"', function() {
			expect(priceParser('0\'0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', function() {
			expect(priceParser('', '2')).toEqual(undefined);
		});
	});
});
},{"../../lib/priceParser":8}],21:[function(require,module,exports){
var symbolFormatter = require('../../lib/symbolFormatter');

describe('When a lowercase string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aapl');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When an uppercase string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'AAPL');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a mixed case string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aApL');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a zero-length string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = '');
	});

	it('The result should be the original, zero-length string', function() {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When a string with numbers is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'esm16');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('ESM16');
	});
});

describe('When a number is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 1);
	});

	it('The result should be a number', function() {
		expect(typeof formattedSymbol).toEqual('number');
	});

	it('The result should the original, unformatted string', function() {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When an undefined value is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = undefined);
	});

	it('The result should be a undefined', function() {
		expect(typeof formattedSymbol).toEqual('undefined');
	});
});

describe('When an null value is formatted', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = null);
	});

	it('The result should be null', function() {
		expect(formattedSymbol).toEqual(null);
	});
});
},{"../../lib/symbolFormatter":9}],22:[function(require,module,exports){
var symbolParser = require('../../lib/symbolParser');

describe('When parsing a symbol for instrument type', function() {
	describe('and the symbol is IBM', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('IBM');
		});

		it('the result should be null', function() {
			expect(instrumentType).toBe(null);
		});
	});

	describe('and the symbol is ESZ6', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ESZ6');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ6"', function() {
			expect(instrumentType.symbol).toEqual('ESZ6');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', function() {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', function() {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', function() {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ESZ16', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ESZ16');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ16"', function() {
			expect(instrumentType.symbol).toEqual('ESZ16');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', function() {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', function() {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', function() {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ESZ2016', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ESZ2016');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES2016Z6"', function() {
			expect(instrumentType.symbol).toEqual('ESZ2016');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', function() {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', function() {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', function() {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ES*0', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ES*0');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*0"', function() {
			expect(instrumentType.symbol).toEqual('ES*0');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', function() {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "0"', function() {
			expect(instrumentType.dynamicCode).toEqual('0');
		});
	});

	describe('and the symbol is ES*1', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ES*1');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*1"', function() {
			expect(instrumentType.symbol).toEqual('ES*1');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', function() {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "1"', function() {
			expect(instrumentType.dynamicCode).toEqual('1');
		});
	});

	describe('and the symbol is ^EURUSD', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('^EURUSD');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "^EURUSD"', function() {
			expect(instrumentType.symbol).toEqual('^EURUSD');
		});

		it('the "type" should be "forex"', function() {
			expect(instrumentType.type).toEqual('forex');
		});
	});

	describe('and the symbol is $DOWI', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('$DOWI');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "$DOWI"', function() {
			expect(instrumentType.symbol).toEqual('$DOWI');
		});

		it('the "type" should be "index"', function() {
			expect(instrumentType.type).toEqual('index');
		});
	});

	describe('and the symbol is -001A', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('-001A');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "-001A"', function() {
			expect(instrumentType.symbol).toEqual('-001A');
		});

		it('the "type" should be "index"', function() {
			expect(instrumentType.type).toEqual('sector');
		});
	});
});

describe('When checking to see if a symbol is a future', function() {
	it('the symbol "ESZ6" should return true', function() {
		expect(symbolParser.getIsFuture('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', function() {
		expect(symbolParser.getIsFuture('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', function() {
		expect(symbolParser.getIsFuture('ESZ2016')).toEqual(true);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsFuture('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return true', function() {
		expect(symbolParser.getIsFuture('O!H7')).toEqual(true);
	});

	it('the symbol "O!H17" should return true', function() {
		expect(symbolParser.getIsFuture('O!H17')).toEqual(true);
	});

	it('the symbol "O!H2017" should return true', function() {
		expect(symbolParser.getIsFuture('O!H2017')).toEqual(true);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsFuture('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', function() {
		expect(symbolParser.getIsFuture('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', function() {
		expect(symbolParser.getIsFuture('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsFuture('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', function() {
		expect(symbolParser.getIsFuture('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "concrete" future', function() {
	it('the symbol "ESZ6" should return true', function() {
		expect(symbolParser.getIsConcrete('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', function() {
		expect(symbolParser.getIsConcrete('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', function() {
		expect(symbolParser.getIsConcrete('ESZ2016')).toEqual(true);
	});

	it('the symbol "ES*0" should return false', function() {
		expect(symbolParser.getIsConcrete('ES*0')).toEqual(false);
	});

	it('the symbol "ES*1" should return false', function() {
		expect(symbolParser.getIsConcrete('ES*1')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "reference" future', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsReference('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsReference('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsReference('ESZ2016')).toEqual(false);
	});

	it('the symbol "ES*0" should return true', function() {
		expect(symbolParser.getIsReference('ES*0')).toEqual(true);
	});

	it('the symbol "ES*1" should return true', function() {
		expect(symbolParser.getIsReference('ES*1')).toEqual(true);
	});
});

describe('When checking to see if a symbol is sector', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsSector('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsSector('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsSector('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsSector('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', function() {
		expect(symbolParser.getIsSector('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', function() {
		expect(symbolParser.getIsSector('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', function() {
		expect(symbolParser.getIsSector('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsSector('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', function() {
		expect(symbolParser.getIsSector('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return true', function() {
		expect(symbolParser.getIsSector('-001A')).toEqual(true);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsSector('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', function() {
		expect(symbolParser.getIsSector('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});
});

describe('When checking to see if a symbol is forex', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsForex('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsForex('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsForex('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsForex('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', function() {
		expect(symbolParser.getIsForex('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', function() {
		expect(symbolParser.getIsForex('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', function() {
		expect(symbolParser.getIsForex('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsForex('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return true', function() {
		expect(symbolParser.getIsForex('^EURUSD')).toEqual(true);
	});

	it('the symbol "-001A" should return false', function() {
		expect(symbolParser.getIsForex('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsForex('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', function() {
		expect(symbolParser.getIsForex('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a future spread', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', function() {
		expect(symbolParser.getIsFutureSpread('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', function() {
		expect(symbolParser.getIsFutureSpread('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', function() {
		expect(symbolParser.getIsFutureSpread('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsFutureSpread('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', function() {
		expect(symbolParser.getIsFutureSpread('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', function() {
		expect(symbolParser.getIsFutureSpread('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsFutureSpread('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return true', function() {
		expect(symbolParser.getIsFutureSpread('_S_SP_ZCH7_ZCK7')).toEqual(true);
	});
});

describe('When checking to see if a symbol is a BATS listing', function() {
	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsBats('IBM')).toEqual(false);
	});

	it('the symbol "IBM.BZ" should return true', function() {
		expect(symbolParser.getIsBats('IBM.BZ')).toEqual(true);
	});
});

describe('When checking the display format for the symbol "HPIUSA.RP"', function() {
	it('it should not be formatted as a percent', function() {
		expect(symbolParser.displayUsingPercent('HPIUSA.RP')).toEqual(false);
	});
});

describe('When checking the display format for the symbol "UERMNTUS.RT"', function() {
	it('it should be formatted as a percent', function() {
		expect(symbolParser.displayUsingPercent('UERMNTUS.RT')).toEqual(true);
	});
});

describe('When getting a producer symbol', function() {
	it('TSLA should map to TSLA', function() {
		expect(symbolParser.getProducerSymbol('TSLA')).toEqual('TSLA');
	});

	it('TSLA.BZ should map to TSLA.BZ', function() {
		expect(symbolParser.getProducerSymbol('TSLA.BZ')).toEqual('TSLA.BZ');
	});

	it('ESZ6 should map to ESZ6', function() {
		expect(symbolParser.getProducerSymbol('ESZ6')).toEqual('ESZ6');
	});

	it('ESZ16 should map to ESZ6', function() {
		expect(symbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ESZ2016 should map to ESZ6', function() {
		expect(symbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ES*0 should map to ES*0', function() {
		expect(symbolParser.getProducerSymbol('ES*0')).toEqual('ES*0');
	});

	it('$DOWI should map to $DOWI', function() {
		expect(symbolParser.getProducerSymbol('$DOWI')).toEqual('$DOWI');
	});

	it('^EURUSD should map to ^EURUSD', function() {
		expect(symbolParser.getProducerSymbol('^EURUSD')).toEqual('^EURUSD');
	});
});
},{"../../lib/symbolParser":10}],23:[function(require,module,exports){
var timeFormatter = require('../../lib/timeFormatter');

describe('When a time formatter is created (without specifying the clock)', function() {
	var tf;

	beforeEach(function() {
		tf = timeFormatter();
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00:00"', function() {
				expect(tf.format(quote)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', function() {
				expect(tf.format(quote)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', function() {
				expect(tf.format(quote)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', function() {
				expect(tf.format(quote)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and timezone is present', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'CST';
			});

			it('the formatter outputs "13:08:09"', function() {
				expect(tf.format(quote)).toEqual('13:08:09 CST');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});

	describe('and a quote is formatted (with with no "flag" and a "lastPrice" value and a "sessionT" indicator)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456,
				sessionT: true
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a 24-hour clock is specified)', function() {
	var tf;

	beforeEach(function() {
		tf = timeFormatter(false);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00:00"', function() {
				expect(tf.format(quote)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', function() {
				expect(tf.format(quote)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', function() {
				expect(tf.format(quote)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', function() {
				expect(tf.format(quote)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08:09"', function() {
				expect(tf.format(quote)).toEqual('13:08:09 EDT');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a "short" 24-hour clock is specified)', function() {
	var tf;

	beforeEach(function() {
		tf = timeFormatter(false, true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00"', function() {
				expect(tf.format(quote)).toEqual('00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00"', function() {
				expect(tf.format(quote)).toEqual('12:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08"', function() {
				expect(tf.format(quote)).toEqual('07:08');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08"', function() {
				expect(tf.format(quote)).toEqual('13:08');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08"', function() {
				expect(tf.format(quote)).toEqual('13:08 EDT');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a 12-hour clock is specified)', function() {
	var tf;

	beforeEach(function() {
		tf = timeFormatter(true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "12:00:00 AM"', function() {
				expect(tf.format(quote)).toEqual('12:00:00 AM');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05:00 AM"', function() {
				expect(tf.format(quote)).toEqual('12:05:00 AM');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00 PM"', function() {
				expect(tf.format(quote)).toEqual('12:00:00 PM');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10:00 PM"', function() {
				expect(tf.format(quote)).toEqual('12:10:00 PM');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09 AM"', function() {
				expect(tf.format(quote)).toEqual('07:08:09 AM');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08:09 PM"', function() {
				expect(tf.format(quote)).toEqual('01:08:09 PM');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a "short" 12-hour clock is specified)', function() {
	var tf;

	beforeEach(function() {
		tf = timeFormatter(true, true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "12:00A"', function() {
				expect(tf.format(quote)).toEqual('12:00A');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05A"', function() {
				expect(tf.format(quote)).toEqual('12:05A');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00P"', function() {
				expect(tf.format(quote)).toEqual('12:00P');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10P"', function() {
				expect(tf.format(quote)).toEqual('12:10P');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08A"', function() {
				expect(tf.format(quote)).toEqual('07:08A');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08P"', function() {
				expect(tf.format(quote)).toEqual('01:08P');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', function() {
		var quote;

		beforeEach(function() {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', function() {
			beforeEach(function() {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', function() {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});
},{"../../lib/timeFormatter":11}]},{},[15,16,17,18,19,20,21,22,23]);
