(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/@barchart/common-js/dist/cjs/lang/is.js
  var require_is = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/is.js"(exports, module) {
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var is_exports = {};
      __export(is_exports, {
        array: () => array,
        boolean: () => boolean,
        date: () => date,
        extension: () => extension,
        fn: () => fn,
        integer: () => integer,
        iterable: () => iterable,
        large: () => large,
        nan: () => nan,
        negative: () => negative,
        nil: () => nil,
        number: () => number,
        object: () => object,
        positive: () => positive,
        regexp: () => regexp,
        string: () => string,
        undef: () => undef,
        zeroLengthString: () => zeroLengthString
      });
      module.exports = __toCommonJS(is_exports);
      function number(candidate) {
        return typeof candidate === "number" && !isNaN(candidate);
      }
      function nan(candidate) {
        return typeof candidate === "number" && isNaN(candidate);
      }
      function integer(candidate) {
        return typeof candidate === "number" && !isNaN(candidate) && (candidate | 0) === candidate;
      }
      function large(candidate) {
        return typeof candidate === "number" && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
      }
      function positive(candidate) {
        return number(candidate) && candidate > 0;
      }
      function negative(candidate) {
        return number(candidate) && candidate < 0;
      }
      function iterable(candidate) {
        return !nil(candidate) && !undef(candidate) && fn(candidate[Symbol.iterator]);
      }
      function string(candidate) {
        return typeof candidate === "string";
      }
      function date(candidate) {
        return candidate instanceof Date;
      }
      function regexp(candidate) {
        return candidate instanceof RegExp;
      }
      function fn(candidate) {
        return typeof candidate === "function";
      }
      function array(candidate) {
        return Array.isArray(candidate);
      }
      function boolean(candidate) {
        return typeof candidate === "boolean";
      }
      function object(candidate) {
        return typeof candidate === "object" && candidate !== null;
      }
      function nil(candidate) {
        return candidate === null;
      }
      function undef(candidate) {
        return candidate === void 0;
      }
      function zeroLengthString(candidate) {
        return string(candidate) && candidate.length === 0;
      }
      function extension(parent, child) {
        return fn(parent) && fn(child) && child.prototype instanceof parent;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/assert.js
  var require_assert = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/assert.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var assert_exports = {};
      __export(assert_exports, {
        areEqual: () => areEqual,
        areNotEqual: () => areNotEqual,
        argumentIsArray: () => argumentIsArray,
        argumentIsOptional: () => argumentIsOptional,
        argumentIsRequired: () => argumentIsRequired,
        argumentIsValid: () => argumentIsValid
      });
      module.exports = __toCommonJS(assert_exports);
      var is = __toESM(require_is());
      var nativeTypes = [String, Number, Function, Boolean, Date, Array, Object, RegExp];
      function checkArgumentType(variable, variableName, type, typeDescription, index) {
        if (type === String) {
          if (!is.string(variable)) {
            throwInvalidTypeError(variableName, "string", index);
          }
        } else if (type === Number) {
          if (!is.number(variable)) {
            throwInvalidTypeError(variableName, "number", index);
          }
        } else if (type === Function) {
          if (!is.fn(variable)) {
            throwInvalidTypeError(variableName, "function", index);
          }
        } else if (type === Boolean) {
          if (!is.boolean(variable)) {
            throwInvalidTypeError(variableName, "boolean", index);
          }
        } else if (type === Date) {
          if (!is.date(variable)) {
            throwInvalidTypeError(variableName, "date", index);
          }
        } else if (type === RegExp) {
          if (!is.regexp(variable)) {
            throwInvalidTypeError(variableName, "RegExp", index);
          }
        } else if (type === Array) {
          if (!is.array(variable)) {
            throwInvalidTypeError(variableName, "array", index);
          }
        } else if (!(variable instanceof (type || Object))) {
          throwInvalidTypeError(variableName, typeDescription, index);
        }
      }
      function throwInvalidTypeError(variableName, typeDescription, index) {
        let message;
        if (typeof index === "number") {
          message = `The argument [ ${variableName || "unspecified"} ], at index [ ${index.toString()} ] must be a [ ${typeDescription || "unknown"} ]`;
        } else {
          message = `The argument [ ${variableName || "unspecified"} ] must be a [ ${typeDescription || "Object"} ]`;
        }
        throw new Error(message);
      }
      function throwCustomValidationError(variableName, predicateDescription) {
        throw new Error(`The argument [ ${variableName || "unspecified"} ] failed a validation check [ ${predicateDescription || "No description available"} ]`);
      }
      function argumentIsRequired(variable, variableName, type, typeDescription) {
        checkArgumentType(variable, variableName, type, typeDescription);
      }
      function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
        if (variable === null || variable === void 0) {
          return;
        }
        checkArgumentType(variable, variableName, type, typeDescription);
        if (is.fn(predicate) && !predicate(variable)) {
          throwCustomValidationError(variableName, predicateDescription);
        }
      }
      function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
        argumentIsRequired(variable, variableName, Array);
        if (itemConstraint) {
          let itemValidator;
          if (nativeTypes.includes(itemConstraint)) {
            itemValidator = (value, index) => checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
          } else {
            itemValidator = (value, index) => {
              if (itemConstraint.prototype !== void 0 && value instanceof itemConstraint) {
                return;
              }
              itemConstraint(value, `${variableName}[${index}]`);
            };
          }
          variable.forEach((v, i) => {
            itemValidator(v, i);
          });
        }
      }
      function argumentIsValid(variable, variableName, predicate, predicateDescription) {
        if (!predicate(variable)) {
          throwCustomValidationError(variableName, predicateDescription);
        }
      }
      function areEqual(a, b, descriptionA, descriptionB) {
        if (a !== b) {
          throw new Error(`The objects must be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
        }
      }
      function areNotEqual(a, b, descriptionA, descriptionB) {
        if (a === b) {
          throw new Error(`The objects cannot be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
        }
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Enum.js
  var require_Enum = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Enum.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Enum_exports = {};
      __export(Enum_exports, {
        default: () => Enum
      });
      module.exports = __toCommonJS(Enum_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var types = /* @__PURE__ */ new Map();
      var Enum = class _Enum {
        #code;
        #description;
        #mapping;
        /**
         * @param {string} code - The unique code of the enumeration item.
         * @param {string} description - A description of the enumeration item.
         * @param {number=} mapping - An alternate key value (used when external systems identify enumeration items using integer values).
         */
        constructor(code, description, mapping) {
          assert.argumentIsRequired(code, "code", String);
          assert.argumentIsRequired(description, "description", String);
          assert.argumentIsOptional(mapping, "mapping", Number);
          if (is.number(mapping)) {
            assert.argumentIsValid(mapping, "mapping", is.integer, "must be an integer");
          }
          this.#code = code;
          this.#description = description;
          if (is.number(mapping)) {
            this.#mapping = mapping;
          } else {
            this.#mapping = null;
          }
          const c = this.constructor;
          if (!types.has(c)) {
            types.set(c, []);
          }
          const valid = _Enum.fromCode(c, this.#code) === null && (this.#mapping === null || _Enum.fromMapping(c, this.#mapping) === null);
          if (valid) {
            types.get(c).push(this);
          }
        }
        /**
         * The unique code.
         *
         * @public
         * @returns {string}
         */
        get code() {
          return this.#code;
        }
        /**
         * The description.
         *
         * @public
         * @returns {string}
         */
        get description() {
          return this.#description;
        }
        /**
         * An alternate key value (used when external systems identify enumeration items
         * using numeric values). This value will not be present for all enumerations.
         *
         * @public
         * @returns {number|null}
         */
        get mapping() {
          return this.#mapping;
        }
        /**
         * Returns true if the provided {@link Enum} argument is equal
         * to the instance.
         *
         * @public
         * @param {Enum} other
         * @returns {boolean}
         */
        equals(other) {
          return other === this || other instanceof _Enum && other.constructor === this.constructor && other.code === this.code;
        }
        /**
         * Returns the JSON representation.
         *
         * @public
         * @returns {string}
         */
        toJSON() {
          return this.code;
        }
        /**
         * Looks up an enumeration item; given the enumeration type and the enumeration
         * item's value. If no matching item can be found, a null value is returned.
         *
         * @public
         * @static
         * @param {Function} type - The enumeration type.
         * @param {string} code - The enumeration item's code.
         * @returns {Enum|null}
         */
        static fromCode(type, code) {
          return _Enum.getItems(type).find((x) => x.code === code) || null;
        }
        /**
         * Looks up an enumeration item; given the enumeration type and the enumeration
         * item's value. If no matching item can be found, a null value is returned.
         *
         * @public
         * @static
         * @param {Function} type - The enumeration type.
         * @param {number} mapping - The enumeration item's mapping value.
         * @returns {Enum|null}
         */
        static fromMapping(type, mapping) {
          if (mapping === null) {
            return null;
          }
          return _Enum.getItems(type).find((x) => x.mapping === mapping) || null;
        }
        /**
         * Returns the enumeration's items (given an enumeration type).
         *
         * @public
         * @static
         * @param {Function} type - The enumeration to list.
         * @returns {Array}
         */
        static getItems(type) {
          return types.get(type) || [];
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Enum]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/big.js/big.js
  var require_big = __commonJS({
    "node_modules/big.js/big.js"(exports, module) {
      (function(GLOBAL) {
        "use strict";
        var Big, DP = 20, RM = 1, MAX_DP = 1e6, MAX_POWER = 1e6, NE = -7, PE = 21, STRICT = false, NAME = "[big.js] ", INVALID = NAME + "Invalid ", INVALID_DP = INVALID + "decimal places", INVALID_RM = INVALID + "rounding mode", DIV_BY_ZERO = NAME + "Division by zero", P = {}, UNDEFINED = void 0, NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
        function _Big_() {
          function Big2(n) {
            var x = this;
            if (!(x instanceof Big2)) return n === UNDEFINED ? _Big_() : new Big2(n);
            if (n instanceof Big2) {
              x.s = n.s;
              x.e = n.e;
              x.c = n.c.slice();
            } else {
              if (typeof n !== "string") {
                if (Big2.strict === true && typeof n !== "bigint") {
                  throw TypeError(INVALID + "value");
                }
                n = n === 0 && 1 / n < 0 ? "-0" : String(n);
              }
              parse(x, n);
            }
            x.constructor = Big2;
          }
          Big2.prototype = P;
          Big2.DP = DP;
          Big2.RM = RM;
          Big2.NE = NE;
          Big2.PE = PE;
          Big2.strict = STRICT;
          Big2.roundDown = 0;
          Big2.roundHalfUp = 1;
          Big2.roundHalfEven = 2;
          Big2.roundUp = 3;
          return Big2;
        }
        function parse(x, n) {
          var e, i, nl;
          if (!NUMERIC.test(n)) {
            throw Error(INVALID + "number");
          }
          x.s = n.charAt(0) == "-" ? (n = n.slice(1), -1) : 1;
          if ((e = n.indexOf(".")) > -1) n = n.replace(".", "");
          if ((i = n.search(/e/i)) > 0) {
            if (e < 0) e = i;
            e += +n.slice(i + 1);
            n = n.substring(0, i);
          } else if (e < 0) {
            e = n.length;
          }
          nl = n.length;
          for (i = 0; i < nl && n.charAt(i) == "0"; ) ++i;
          if (i == nl) {
            x.c = [x.e = 0];
          } else {
            for (; nl > 0 && n.charAt(--nl) == "0"; ) ;
            x.e = e - i - 1;
            x.c = [];
            for (e = 0; i <= nl; ) x.c[e++] = +n.charAt(i++);
          }
          return x;
        }
        function round(x, sd, rm, more) {
          var xc = x.c;
          if (rm === UNDEFINED) rm = x.constructor.RM;
          if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
            throw Error(INVALID_RM);
          }
          if (sd < 1) {
            more = rm === 3 && (more || !!xc[0]) || sd === 0 && (rm === 1 && xc[0] >= 5 || rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED)));
            xc.length = 1;
            if (more) {
              x.e = x.e - sd + 1;
              xc[0] = 1;
            } else {
              xc[0] = x.e = 0;
            }
          } else if (sd < xc.length) {
            more = rm === 1 && xc[sd] >= 5 || rm === 2 && (xc[sd] > 5 || xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) || rm === 3 && (more || !!xc[0]);
            xc.length = sd;
            if (more) {
              for (; ++xc[--sd] > 9; ) {
                xc[sd] = 0;
                if (sd === 0) {
                  ++x.e;
                  xc.unshift(1);
                  break;
                }
              }
            }
            for (sd = xc.length; !xc[--sd]; ) xc.pop();
          }
          return x;
        }
        function stringify(x, doExponential, isNonzero) {
          var e = x.e, s = x.c.join(""), n = s.length;
          if (doExponential) {
            s = s.charAt(0) + (n > 1 ? "." + s.slice(1) : "") + (e < 0 ? "e" : "e+") + e;
          } else if (e < 0) {
            for (; ++e; ) s = "0" + s;
            s = "0." + s;
          } else if (e > 0) {
            if (++e > n) {
              for (e -= n; e--; ) s += "0";
            } else if (e < n) {
              s = s.slice(0, e) + "." + s.slice(e);
            }
          } else if (n > 1) {
            s = s.charAt(0) + "." + s.slice(1);
          }
          return x.s < 0 && isNonzero ? "-" + s : s;
        }
        P.abs = function() {
          var x = new this.constructor(this);
          x.s = 1;
          return x;
        };
        P.cmp = function(y) {
          var isneg, x = this, xc = x.c, yc = (y = new x.constructor(y)).c, i = x.s, j = y.s, k = x.e, l = y.e;
          if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;
          if (i != j) return i;
          isneg = i < 0;
          if (k != l) return k > l ^ isneg ? 1 : -1;
          j = (k = xc.length) < (l = yc.length) ? k : l;
          for (i = -1; ++i < j; ) {
            if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
          }
          return k == l ? 0 : k > l ^ isneg ? 1 : -1;
        };
        P.div = function(y) {
          var x = this, Big2 = x.constructor, a = x.c, b = (y = new Big2(y)).c, k = x.s == y.s ? 1 : -1, dp = Big2.DP;
          if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throw Error(INVALID_DP);
          }
          if (!b[0]) {
            throw Error(DIV_BY_ZERO);
          }
          if (!a[0]) {
            y.s = k;
            y.c = [y.e = 0];
            return y;
          }
          var bl, bt, n, cmp, ri, bz = b.slice(), ai = bl = b.length, al = a.length, r = a.slice(0, bl), rl = r.length, q = y, qc = q.c = [], qi = 0, p = dp + (q.e = x.e - y.e) + 1;
          q.s = k;
          k = p < 0 ? 0 : p;
          bz.unshift(0);
          for (; rl++ < bl; ) r.push(0);
          do {
            for (n = 0; n < 10; n++) {
              if (bl != (rl = r.length)) {
                cmp = bl > rl ? 1 : -1;
              } else {
                for (ri = -1, cmp = 0; ++ri < bl; ) {
                  if (b[ri] != r[ri]) {
                    cmp = b[ri] > r[ri] ? 1 : -1;
                    break;
                  }
                }
              }
              if (cmp < 0) {
                for (bt = rl == bl ? b : bz; rl; ) {
                  if (r[--rl] < bt[rl]) {
                    ri = rl;
                    for (; ri && !r[--ri]; ) r[ri] = 9;
                    --r[ri];
                    r[rl] += 10;
                  }
                  r[rl] -= bt[rl];
                }
                for (; !r[0]; ) r.shift();
              } else {
                break;
              }
            }
            qc[qi++] = cmp ? n : ++n;
            if (r[0] && cmp) r[rl] = a[ai] || 0;
            else r = [a[ai]];
          } while ((ai++ < al || r[0] !== UNDEFINED) && k--);
          if (!qc[0] && qi != 1) {
            qc.shift();
            q.e--;
            p--;
          }
          if (qi > p) round(q, p, Big2.RM, r[0] !== UNDEFINED);
          return q;
        };
        P.eq = function(y) {
          return this.cmp(y) === 0;
        };
        P.gt = function(y) {
          return this.cmp(y) > 0;
        };
        P.gte = function(y) {
          return this.cmp(y) > -1;
        };
        P.lt = function(y) {
          return this.cmp(y) < 0;
        };
        P.lte = function(y) {
          return this.cmp(y) < 1;
        };
        P.minus = P.sub = function(y) {
          var i, j, t, xlty, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
          if (a != b) {
            y.s = -b;
            return x.plus(y);
          }
          var xc = x.c.slice(), xe = x.e, yc = y.c, ye = y.e;
          if (!xc[0] || !yc[0]) {
            if (yc[0]) {
              y.s = -b;
            } else if (xc[0]) {
              y = new Big2(x);
            } else {
              y.s = 1;
            }
            return y;
          }
          if (a = xe - ye) {
            if (xlty = a < 0) {
              a = -a;
              t = xc;
            } else {
              ye = xe;
              t = yc;
            }
            t.reverse();
            for (b = a; b--; ) t.push(0);
            t.reverse();
          } else {
            j = ((xlty = xc.length < yc.length) ? xc : yc).length;
            for (a = b = 0; b < j; b++) {
              if (xc[b] != yc[b]) {
                xlty = xc[b] < yc[b];
                break;
              }
            }
          }
          if (xlty) {
            t = xc;
            xc = yc;
            yc = t;
            y.s = -y.s;
          }
          if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--; ) xc[i++] = 0;
          for (b = i; j > a; ) {
            if (xc[--j] < yc[j]) {
              for (i = j; i && !xc[--i]; ) xc[i] = 9;
              --xc[i];
              xc[j] += 10;
            }
            xc[j] -= yc[j];
          }
          for (; xc[--b] === 0; ) xc.pop();
          for (; xc[0] === 0; ) {
            xc.shift();
            --ye;
          }
          if (!xc[0]) {
            y.s = 1;
            xc = [ye = 0];
          }
          y.c = xc;
          y.e = ye;
          return y;
        };
        P.mod = function(y) {
          var ygtx, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
          if (!y.c[0]) {
            throw Error(DIV_BY_ZERO);
          }
          x.s = y.s = 1;
          ygtx = y.cmp(x) == 1;
          x.s = a;
          y.s = b;
          if (ygtx) return new Big2(x);
          a = Big2.DP;
          b = Big2.RM;
          Big2.DP = Big2.RM = 0;
          x = x.div(y);
          Big2.DP = a;
          Big2.RM = b;
          return this.minus(x.times(y));
        };
        P.neg = function() {
          var x = new this.constructor(this);
          x.s = -x.s;
          return x;
        };
        P.plus = P.add = function(y) {
          var e, k, t, x = this, Big2 = x.constructor;
          y = new Big2(y);
          if (x.s != y.s) {
            y.s = -y.s;
            return x.minus(y);
          }
          var xe = x.e, xc = x.c, ye = y.e, yc = y.c;
          if (!xc[0] || !yc[0]) {
            if (!yc[0]) {
              if (xc[0]) {
                y = new Big2(x);
              } else {
                y.s = x.s;
              }
            }
            return y;
          }
          xc = xc.slice();
          if (e = xe - ye) {
            if (e > 0) {
              ye = xe;
              t = yc;
            } else {
              e = -e;
              t = xc;
            }
            t.reverse();
            for (; e--; ) t.push(0);
            t.reverse();
          }
          if (xc.length - yc.length < 0) {
            t = yc;
            yc = xc;
            xc = t;
          }
          e = yc.length;
          for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;
          if (k) {
            xc.unshift(k);
            ++ye;
          }
          for (e = xc.length; xc[--e] === 0; ) xc.pop();
          y.c = xc;
          y.e = ye;
          return y;
        };
        P.pow = function(n) {
          var x = this, one = new x.constructor("1"), y = one, isneg = n < 0;
          if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
            throw Error(INVALID + "exponent");
          }
          if (isneg) n = -n;
          for (; ; ) {
            if (n & 1) y = y.times(x);
            n >>= 1;
            if (!n) break;
            x = x.times(x);
          }
          return isneg ? one.div(y) : y;
        };
        P.prec = function(sd, rm) {
          if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
            throw Error(INVALID + "precision");
          }
          return round(new this.constructor(this), sd, rm);
        };
        P.round = function(dp, rm) {
          if (dp === UNDEFINED) dp = 0;
          else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
            throw Error(INVALID_DP);
          }
          return round(new this.constructor(this), dp + this.e + 1, rm);
        };
        P.sqrt = function() {
          var r, c, t, x = this, Big2 = x.constructor, s = x.s, e = x.e, half = new Big2("0.5");
          if (!x.c[0]) return new Big2(x);
          if (s < 0) {
            throw Error(NAME + "No square root");
          }
          s = Math.sqrt(+stringify(x, true, true));
          if (s === 0 || s === 1 / 0) {
            c = x.c.join("");
            if (!(c.length + e & 1)) c += "0";
            s = Math.sqrt(c);
            e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
            r = new Big2((s == 1 / 0 ? "5e" : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + e);
          } else {
            r = new Big2(s + "");
          }
          e = r.e + (Big2.DP += 4);
          do {
            t = r;
            r = half.times(t.plus(x.div(t)));
          } while (t.c.slice(0, e).join("") !== r.c.slice(0, e).join(""));
          return round(r, (Big2.DP -= 4) + r.e + 1, Big2.RM);
        };
        P.times = P.mul = function(y) {
          var c, x = this, Big2 = x.constructor, xc = x.c, yc = (y = new Big2(y)).c, a = xc.length, b = yc.length, i = x.e, j = y.e;
          y.s = x.s == y.s ? 1 : -1;
          if (!xc[0] || !yc[0]) {
            y.c = [y.e = 0];
            return y;
          }
          y.e = i + j;
          if (a < b) {
            c = xc;
            xc = yc;
            yc = c;
            j = a;
            a = b;
            b = j;
          }
          for (c = new Array(j = a + b); j--; ) c[j] = 0;
          for (i = b; i--; ) {
            b = 0;
            for (j = a + i; j > i; ) {
              b = c[j] + yc[i] * xc[j - i - 1] + b;
              c[j--] = b % 10;
              b = b / 10 | 0;
            }
            c[j] = b;
          }
          if (b) ++y.e;
          else c.shift();
          for (i = c.length; !c[--i]; ) c.pop();
          y.c = c;
          return y;
        };
        P.toExponential = function(dp, rm) {
          var x = this, n = x.c[0];
          if (dp !== UNDEFINED) {
            if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
              throw Error(INVALID_DP);
            }
            x = round(new x.constructor(x), ++dp, rm);
            for (; x.c.length < dp; ) x.c.push(0);
          }
          return stringify(x, true, !!n);
        };
        P.toFixed = function(dp, rm) {
          var x = this, n = x.c[0];
          if (dp !== UNDEFINED) {
            if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
              throw Error(INVALID_DP);
            }
            x = round(new x.constructor(x), dp + x.e + 1, rm);
            for (dp = dp + x.e + 1; x.c.length < dp; ) x.c.push(0);
          }
          return stringify(x, false, !!n);
        };
        P.toJSON = P.toString = function() {
          var x = this, Big2 = x.constructor;
          return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, !!x.c[0]);
        };
        P.toNumber = function() {
          var n = +stringify(this, true, true);
          if (this.constructor.strict === true && !this.eq(n.toString())) {
            throw Error(NAME + "Imprecise conversion");
          }
          return n;
        };
        P.toPrecision = function(sd, rm) {
          var x = this, Big2 = x.constructor, n = x.c[0];
          if (sd !== UNDEFINED) {
            if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
              throw Error(INVALID + "precision");
            }
            x = round(new Big2(x), sd, rm);
            for (; x.c.length < sd; ) x.c.push(0);
          }
          return stringify(x, sd <= x.e || x.e <= Big2.NE || x.e >= Big2.PE, !!n);
        };
        P.valueOf = function() {
          var x = this, Big2 = x.constructor;
          if (Big2.strict === true) {
            throw Error(NAME + "valueOf disallowed");
          }
          return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, true);
        };
        Big = _Big_();
        Big["default"] = Big.Big = Big;
        if (typeof define === "function" && define.amd) {
          define(function() {
            return Big;
          });
        } else if (typeof module !== "undefined" && module.exports) {
          module.exports = Big;
        } else {
          GLOBAL.Big = Big;
        }
      })(exports);
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Decimal.js
  var require_Decimal = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Decimal.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Decimal_exports = {};
      __export(Decimal_exports, {
        default: () => Decimal6
      });
      module.exports = __toCommonJS(Decimal_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_Enum = __toESM(require_Enum());
      var import_big = __toESM(require_big());
      var Decimal6 = class _Decimal {
        #big;
        /**
         * @param {Decimal|number|string} value - The value.
         */
        constructor(value) {
          this.#big = _Decimal.#getBig(value);
        }
        /**
         * Returns a new {@link Decimal} instance that is the sum of the
         * current instance's value and the value supplied.
         *
         * @public
         * @param {Decimal|number|string} other - The value to add.
         * @returns {Decimal}
         */
        add(other) {
          return new _Decimal(this.#big.plus(_Decimal.#getBig(other)));
        }
        /**
         * Returns a new {@link Decimal} instance with a value that results
         * from the subtraction of the value supplied from the current instance's
         * value.
         *
         * @public
         * @param {Decimal|number|string} other - The value to subtract.
         * @returns {Decimal}
         */
        subtract(other) {
          return new _Decimal(this.#big.minus(_Decimal.#getBig(other)));
        }
        /**
         * Returns a new {@link Decimal} instance that is the product of the
         * current instance's value and the value supplied.
         *
         * @public
         * @param {Decimal|number|string} other - The value to multiply the current instance by.
         * @returns {Decimal}
         */
        multiply(other) {
          return new _Decimal(this.#big.times(_Decimal.#getBig(other)));
        }
        /**
         * Returns a new {@link Decimal} instance with a value that results
         * from the division of the current instance's value by the value
         * supplied.
         *
         * @public
         * @param {Decimal|number|string} other - The value to divide the current instance by.
         * @returns {Decimal}
         */
        divide(other) {
          return new _Decimal(this.#big.div(_Decimal.#getBig(other)));
        }
        /**
         * Returns a new {@link Decimal} instance with a value that results
         * from raising the current instance to the power of the exponent
         * provided.
         *
         * @public
         * @param {number} exponent
         * @returns {Decimal}
         */
        raise(exponent) {
          assert.argumentIsRequired(exponent, "exponent", Number);
          return new _Decimal(this.#big.pow(exponent));
        }
        /**
         * Returns a new {@link Decimal} with a value resulting from a rounding
         * operation on the current value.
         *
         * @public
         * @param {number} places - The number of decimal places to retain.
         * @param {RoundingMode=} mode - The strategy to use for rounding.
         * @returns {Decimal}
         */
        round(places, mode) {
          assert.argumentIsRequired(places, "places", Number);
          assert.argumentIsOptional(mode, "mode", RoundingMode, "RoundingMode");
          const modeToUse = mode || RoundingMode.NORMAL;
          return new _Decimal(this.#big.round(places, modeToUse.value));
        }
        /**
         * Returns a new {@link Decimal} instance with of the remainder when
         * dividing the current instance by the value supplied.
         *
         * @public
         * @param {Decimal|number|string} other
         * @returns {Decimal}
         */
        mod(other) {
          return new _Decimal(this.#big.mod(_Decimal.#getBig(other)));
        }
        /**
         * Returns a new {@link Decimal} instance having the absolute value of
         * the current instance's value.
         *
         * @public
         * @returns {Decimal}
         */
        absolute() {
          return new _Decimal(this.#big.abs());
        }
        /**
         * Returns a new {@link Decimal} instance the opposite sign as the
         * current instance's value.
         *
         * @public
         * @returns {Decimal}
         */
        opposite() {
          return this.multiply(-1);
        }
        /**
         * Returns a boolean value, indicating if the current instance's value is
         * equal to zero (or approximately equal to zero).
         *
         * @public
         * @param {boolean=} approximate
         * @param {number=} places
         * @returns {boolean}
         */
        getIsZero(approximate, places) {
          assert.argumentIsOptional(approximate, "approximate", Boolean);
          assert.argumentIsOptional(places, "places", Number);
          return this.#big.eq(zero) || is.boolean(approximate) && approximate && this.round(places || import_big.default.DP, RoundingMode.NORMAL).getIsZero();
        }
        /**
         * Returns true if the current instance is positive; otherwise false.
         *
         * @public
         * @returns {boolean}
         */
        getIsPositive() {
          return this.#big.gt(zero);
        }
        /**
         * Returns true if the current instance is negative; otherwise false.
         *
         * @public
         * @returns {boolean}
         */
        getIsNegative() {
          return this.#big.lt(zero);
        }
        /**
         * Returns true if the current instance is greater than the value.
         *
         * @public
         * @param {Decimal|number|string} other - The value to compare.
         * @returns {boolean}
         */
        getIsGreaterThan(other) {
          return this.#big.gt(_Decimal.#getBig(other));
        }
        /**
         * Returns true if the current instance is greater than or equal to the value.
         *
         * @public
         * @param {Decimal|number|string} other - The value to compare.
         * @returns {boolean}
         */
        getIsGreaterThanOrEqual(other) {
          return this.#big.gte(_Decimal.#getBig(other));
        }
        /**
         * Returns true if the current instance is less than the value.
         *
         * @public
         * @param {Decimal|number|string} other - The value to compare.
         * @returns {boolean}
         */
        getIsLessThan(other) {
          return this.#big.lt(_Decimal.#getBig(other));
        }
        /**
         * Returns true if the current instance is less than or equal to the value.
         *
         * @public
         * @param {Decimal|number|string} other - The value to compare.
         * @returns {boolean}
         */
        getIsLessThanOrEqual(other) {
          return this.#big.lte(_Decimal.#getBig(other));
        }
        /**
         * Returns true if the current instance between two other values. The
         * test is inclusive, by default.
         *
         * @public
         * @param {Decimal|number|string} minimum - The minimum value.
         * @param {Decimal|number|string} maximum - The maximum value.
         * @param {boolean=} exclusive - If true, the value cannot equal the minimum or maximum value and still be considered "between" the other values.
         * @returns {boolean}
         */
        getIsBetween(minimum, maximum, exclusive) {
          assert.argumentIsOptional(exclusive, "exclusive", Boolean);
          if (is.boolean(exclusive) && exclusive) {
            return this.getIsGreaterThan(minimum) && this.getIsLessThan(maximum);
          } else {
            return this.getIsGreaterThanOrEqual(minimum) && this.getIsLessThanOrEqual(maximum);
          }
        }
        /**
         * Returns true if the current instance is equal to the value.
         *
         * @public
         * @param {Decimal|number|string} other - The value to compare.
         * @returns {boolean}
         */
        getIsEqual(other) {
          return this.#big.eq(_Decimal.#getBig(other));
        }
        /**
         * Returns true is close to another value.
         *
         * @public
         * @param {Decimal|number|string} other - The value to compare.
         * @param {number} places - The significant digits.
         * @returns {boolean}
         */
        getIsApproximate(other, places) {
          if (places === 0) {
            return this.getIsEqual(other);
          }
          const difference = this.subtract(other).absolute();
          const tolerance = _Decimal.ONE.divide(new _Decimal(10).raise(places));
          return difference.getIsLessThan(tolerance);
        }
        /**
         * Returns true if the current instance is an integer (i.e. has no decimal
         * component).
         *
         * @public
         * @return {boolean}
         */
        getIsInteger() {
          return this.getIsEqual(this.round(0));
        }
        /**
         * Returns the number of decimal places used.
         *
         * @public
         * @returns {number}
         */
        getDecimalPlaces() {
          const matches = this.toFixed().match(/-?\d*\.(\d*)/);
          let returnVal;
          if (matches === null) {
            returnVal = 0;
          } else {
            returnVal = matches[1].length;
          }
          return returnVal;
        }
        /**
         * Emits a floating point value that approximates the value of the current
         * instance.
         *
         * @public
         * @param {number=} places
         * @returns {number}
         */
        toFloat(places) {
          assert.argumentIsOptional(places, "places", Number);
          return parseFloat(this.#big.toFixed(places || 16));
        }
        /**
         * Returns a string-based representation of the instance's value.
         *
         * @public
         * @returns {string}
         */
        toFixed() {
          return this.#big.toFixed();
        }
        /**
         * Returns a {@link number} that is approximately equal to the value of
         * this {@link Decimal} instance.
         *
         * @public
         * @returns {number}
         */
        toNumber() {
          return this.#big.toNumber();
        }
        /**
         * Returns the JSON representation.
         *
         * @public
         * @returns {string}
         */
        toJSON() {
          return this.toFixed();
        }
        /**
         * Clones a {@link Decimal} instance.
         *
         * @public
         * @static
         * @param {Decimal} value
         * @returns {Decimal}
         */
        static clone(value) {
          assert.argumentIsRequired(value, "value", _Decimal, "Decimal");
          return new _Decimal(value.#big);
        }
        /**
         * An alias for the constructor. Creates a new instance. Suitable for
         * use with the value emitted by {@link Decimal#toJSON}.
         *
         * @public
         * @static
         * @param {Decimal|number|string} value
         * @returns {Decimal}
         */
        static parse(value) {
          return new _Decimal(value);
        }
        /**
         * Returns an instance with the value of zero.
         *
         * @public
         * @static
         * @returns {Decimal}
         */
        static get ZERO() {
          return decimalZero;
        }
        /**
         * Returns an instance with the value of one.
         *
         * @public
         * @static
         * @returns {Decimal}
         */
        static get ONE() {
          return decimalOne;
        }
        /**
         * Returns an instance with the value of one.
         *
         * @public
         * @static
         * @returns {Decimal}
         */
        static get NEGATIVE_ONE() {
          return decimalNegativeOne;
        }
        /**
         * Returns the {@link RoundingMode} enumeration type.
         *
         * @public
         * @static
         * @returns {typeof RoundingMode}
         */
        static get ROUNDING_MODE() {
          return RoundingMode;
        }
        /**
         * Runs {@link Decimal#getIsZero} and returns the result.
         *
         * @public
         * @static
         * @param {Decimal} instance
         * @returns {boolean}
         */
        static getIsZero(instance) {
          assert.argumentIsRequired(instance, "instance", _Decimal, "Decimal");
          return instance.getIsZero();
        }
        /**
         * Runs {@link Decimal#getIsZero} and returns the inverse.
         *
         * @public
         * @static
         * @param {Decimal} instance
         * @returns {boolean}
         */
        static getIsNotZero(instance) {
          assert.argumentIsRequired(instance, "instance", _Decimal, "Decimal");
          return !instance.getIsZero();
        }
        /**
         * Runs {@link Decimal#getIsPositive} and returns the result.
         *
         * @public
         * @static
         * @param {Decimal} instance
         * @returns {boolean}
         */
        static getIsPositive(instance) {
          assert.argumentIsRequired(instance, "instance", _Decimal, "Decimal");
          return instance.getIsPositive();
        }
        /**
         * Checks an instance to see if its negative or zero.
         *
         * @public
         * @static
         * @param {Decimal} instance
         * @returns {boolean}
         */
        static getIsNotPositive(instance) {
          assert.argumentIsRequired(instance, "instance", _Decimal, "Decimal");
          return instance.getIsNegative() || instance.getIsZero();
        }
        /**
         * Runs {@link Decimal#getIsNegative} and returns the result.
         *
         * @public
         * @static
         * @param {Decimal} instance
         * @returns {boolean}
         */
        static getIsNegative(instance) {
          assert.argumentIsRequired(instance, "instance", _Decimal, "Decimal");
          return instance.getIsNegative();
        }
        /**
         * Checks an instance to see if its positive or zero.
         *
         * @public
         * @static
         * @param {Decimal} instance
         * @returns {boolean}
         */
        static getIsNotNegative(instance) {
          assert.argumentIsRequired(instance, "instance", _Decimal, "Decimal");
          return instance.getIsPositive() || instance.getIsZero();
        }
        /**
         * A comparator function for {@link Decimal} instances.
         *
         * @public
         * @static
         * @param {Decimal} a
         * @param {Decimal} b
         * @returns {number}
         */
        static compareDecimals(a, b) {
          assert.argumentIsRequired(a, "a", _Decimal, "Decimal");
          assert.argumentIsRequired(b, "b", _Decimal, "Decimal");
          if (a.#big.gt(b.#big)) {
            return 1;
          } else if (a.#big.lt(b.#big)) {
            return -1;
          } else {
            return 0;
          }
        }
        static #getBig(value) {
          if (value instanceof import_big.default) {
            return value;
          } else if (value instanceof _Decimal) {
            return value.#big;
          } else {
            return new import_big.default(value);
          }
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Decimal]";
        }
      };
      var zero = new import_big.default(0);
      var positiveOne = new import_big.default(1);
      var negativeOne = new import_big.default(-1);
      var decimalZero = new Decimal6(zero);
      var decimalOne = new Decimal6(positiveOne);
      var decimalNegativeOne = new Decimal6(negativeOne);
      var RoundingMode = class extends import_Enum.default {
        #value;
        /**
            * @param {number} value
            * @param {string} description
            */
        constructor(value, description) {
          super(value.toString(), description);
          this.#value = value;
        }
        /**
         * The code used by the Big.js library.
         *
         * @ignore
         * @returns {number}
         */
        get value() {
          return this.#value;
        }
        /**
         * Rounds away from zero.
         *
         * @public
         * @static
         * @returns {RoundingMode}
         */
        static get UP() {
          return up;
        }
        /**
         * Rounds towards zero.
         *
         * @public
         * @static
         * @returns {RoundingMode}
         */
        static get DOWN() {
          return down;
        }
        /**
         * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
         *
         * @public
         * @static
         * @returns {RoundingMode}
         */
        static get NORMAL() {
          return normal;
        }
        toString() {
          return "[RoundingMode]";
        }
      };
      var up = new RoundingMode(3, "up");
      var down = new RoundingMode(0, "down");
      var normal = new RoundingMode(1, "normal");
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/uuid/dist/commonjs-browser/rng.js
  var require_rng = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/rng.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = rng;
      var getRandomValues;
      var rnds8 = new Uint8Array(16);
      function rng() {
        if (!getRandomValues) {
          getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
          if (!getRandomValues) {
            throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
          }
        }
        return getRandomValues(rnds8);
      }
    }
  });

  // node_modules/uuid/dist/commonjs-browser/regex.js
  var require_regex = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/regex.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/validate.js
  var require_validate = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/validate.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _regex = _interopRequireDefault(require_regex());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function validate(uuid) {
        return typeof uuid === "string" && _regex.default.test(uuid);
      }
      var _default = validate;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/stringify.js
  var require_stringify = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/stringify.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      exports.unsafeStringify = unsafeStringify;
      var _validate = _interopRequireDefault(require_validate());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var byteToHex = [];
      for (let i = 0; i < 256; ++i) {
        byteToHex.push((i + 256).toString(16).slice(1));
      }
      function unsafeStringify(arr, offset = 0) {
        return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
      }
      function stringify(arr, offset = 0) {
        const uuid = unsafeStringify(arr, offset);
        if (!(0, _validate.default)(uuid)) {
          throw TypeError("Stringified UUID is invalid");
        }
        return uuid;
      }
      var _default = stringify;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/v1.js
  var require_v1 = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/v1.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _rng = _interopRequireDefault(require_rng());
      var _stringify = require_stringify();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var _nodeId;
      var _clockseq;
      var _lastMSecs = 0;
      var _lastNSecs = 0;
      function v1(options, buf, offset) {
        let i = buf && offset || 0;
        const b = buf || new Array(16);
        options = options || {};
        let node = options.node || _nodeId;
        let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
        if (node == null || clockseq == null) {
          const seedBytes = options.random || (options.rng || _rng.default)();
          if (node == null) {
            node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
          }
          if (clockseq == null) {
            clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
          }
        }
        let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
        let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
        const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
        if (dt < 0 && options.clockseq === void 0) {
          clockseq = clockseq + 1 & 16383;
        }
        if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
          nsecs = 0;
        }
        if (nsecs >= 1e4) {
          throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
        }
        _lastMSecs = msecs;
        _lastNSecs = nsecs;
        _clockseq = clockseq;
        msecs += 122192928e5;
        const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
        b[i++] = tl >>> 24 & 255;
        b[i++] = tl >>> 16 & 255;
        b[i++] = tl >>> 8 & 255;
        b[i++] = tl & 255;
        const tmh = msecs / 4294967296 * 1e4 & 268435455;
        b[i++] = tmh >>> 8 & 255;
        b[i++] = tmh & 255;
        b[i++] = tmh >>> 24 & 15 | 16;
        b[i++] = tmh >>> 16 & 255;
        b[i++] = clockseq >>> 8 | 128;
        b[i++] = clockseq & 255;
        for (let n = 0; n < 6; ++n) {
          b[i + n] = node[n];
        }
        return buf || (0, _stringify.unsafeStringify)(b);
      }
      var _default = v1;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/parse.js
  var require_parse = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/parse.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _validate = _interopRequireDefault(require_validate());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function parse(uuid) {
        if (!(0, _validate.default)(uuid)) {
          throw TypeError("Invalid UUID");
        }
        let v;
        const arr = new Uint8Array(16);
        arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
        arr[1] = v >>> 16 & 255;
        arr[2] = v >>> 8 & 255;
        arr[3] = v & 255;
        arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
        arr[5] = v & 255;
        arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
        arr[7] = v & 255;
        arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
        arr[9] = v & 255;
        arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
        arr[11] = v / 4294967296 & 255;
        arr[12] = v >>> 24 & 255;
        arr[13] = v >>> 16 & 255;
        arr[14] = v >>> 8 & 255;
        arr[15] = v & 255;
        return arr;
      }
      var _default = parse;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/v35.js
  var require_v35 = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/v35.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.URL = exports.DNS = void 0;
      exports.default = v35;
      var _stringify = require_stringify();
      var _parse = _interopRequireDefault(require_parse());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function stringToBytes(str) {
        str = unescape(encodeURIComponent(str));
        const bytes = [];
        for (let i = 0; i < str.length; ++i) {
          bytes.push(str.charCodeAt(i));
        }
        return bytes;
      }
      var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
      exports.DNS = DNS;
      var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
      exports.URL = URL;
      function v35(name, version, hashfunc) {
        function generateUUID(value, namespace, buf, offset) {
          var _namespace;
          if (typeof value === "string") {
            value = stringToBytes(value);
          }
          if (typeof namespace === "string") {
            namespace = (0, _parse.default)(namespace);
          }
          if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
            throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
          }
          let bytes = new Uint8Array(16 + value.length);
          bytes.set(namespace);
          bytes.set(value, namespace.length);
          bytes = hashfunc(bytes);
          bytes[6] = bytes[6] & 15 | version;
          bytes[8] = bytes[8] & 63 | 128;
          if (buf) {
            offset = offset || 0;
            for (let i = 0; i < 16; ++i) {
              buf[offset + i] = bytes[i];
            }
            return buf;
          }
          return (0, _stringify.unsafeStringify)(bytes);
        }
        try {
          generateUUID.name = name;
        } catch (err) {
        }
        generateUUID.DNS = DNS;
        generateUUID.URL = URL;
        return generateUUID;
      }
    }
  });

  // node_modules/uuid/dist/commonjs-browser/md5.js
  var require_md5 = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/md5.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      function md5(bytes) {
        if (typeof bytes === "string") {
          const msg = unescape(encodeURIComponent(bytes));
          bytes = new Uint8Array(msg.length);
          for (let i = 0; i < msg.length; ++i) {
            bytes[i] = msg.charCodeAt(i);
          }
        }
        return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
      }
      function md5ToHexEncodedArray(input) {
        const output = [];
        const length32 = input.length * 32;
        const hexTab = "0123456789abcdef";
        for (let i = 0; i < length32; i += 8) {
          const x = input[i >> 5] >>> i % 32 & 255;
          const hex = parseInt(hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15), 16);
          output.push(hex);
        }
        return output;
      }
      function getOutputLength(inputLength8) {
        return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
      }
      function wordsToMd5(x, len) {
        x[len >> 5] |= 128 << len % 32;
        x[getOutputLength(len) - 1] = len;
        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;
        for (let i = 0; i < x.length; i += 16) {
          const olda = a;
          const oldb = b;
          const oldc = c;
          const oldd = d;
          a = md5ff(a, b, c, d, x[i], 7, -680876936);
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5gg(b, c, d, a, x[i], 20, -373897302);
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
          a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5hh(d, a, b, c, x[i], 11, -358537222);
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
          a = md5ii(a, b, c, d, x[i], 6, -198630844);
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
          a = safeAdd(a, olda);
          b = safeAdd(b, oldb);
          c = safeAdd(c, oldc);
          d = safeAdd(d, oldd);
        }
        return [a, b, c, d];
      }
      function bytesToWords(input) {
        if (input.length === 0) {
          return [];
        }
        const length8 = input.length * 8;
        const output = new Uint32Array(getOutputLength(length8));
        for (let i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input[i / 8] & 255) << i % 32;
        }
        return output;
      }
      function safeAdd(x, y) {
        const lsw = (x & 65535) + (y & 65535);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 65535;
      }
      function bitRotateLeft(num, cnt) {
        return num << cnt | num >>> 32 - cnt;
      }
      function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
      }
      function md5ff(a, b, c, d, x, s, t) {
        return md5cmn(b & c | ~b & d, a, b, x, s, t);
      }
      function md5gg(a, b, c, d, x, s, t) {
        return md5cmn(b & d | c & ~d, a, b, x, s, t);
      }
      function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
      }
      function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t);
      }
      var _default = md5;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/v3.js
  var require_v3 = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/v3.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _v = _interopRequireDefault(require_v35());
      var _md = _interopRequireDefault(require_md5());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var v3 = (0, _v.default)("v3", 48, _md.default);
      var _default = v3;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/native.js
  var require_native = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/native.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
      var _default = {
        randomUUID
      };
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/v4.js
  var require_v4 = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/v4.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _native = _interopRequireDefault(require_native());
      var _rng = _interopRequireDefault(require_rng());
      var _stringify = require_stringify();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function v4(options, buf, offset) {
        if (_native.default.randomUUID && !buf && !options) {
          return _native.default.randomUUID();
        }
        options = options || {};
        const rnds = options.random || (options.rng || _rng.default)();
        rnds[6] = rnds[6] & 15 | 64;
        rnds[8] = rnds[8] & 63 | 128;
        if (buf) {
          offset = offset || 0;
          for (let i = 0; i < 16; ++i) {
            buf[offset + i] = rnds[i];
          }
          return buf;
        }
        return (0, _stringify.unsafeStringify)(rnds);
      }
      var _default = v4;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/sha1.js
  var require_sha1 = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/sha1.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      function f(s, x, y, z) {
        switch (s) {
          case 0:
            return x & y ^ ~x & z;
          case 1:
            return x ^ y ^ z;
          case 2:
            return x & y ^ x & z ^ y & z;
          case 3:
            return x ^ y ^ z;
        }
      }
      function ROTL(x, n) {
        return x << n | x >>> 32 - n;
      }
      function sha1(bytes) {
        const K = [1518500249, 1859775393, 2400959708, 3395469782];
        const H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
        if (typeof bytes === "string") {
          const msg = unescape(encodeURIComponent(bytes));
          bytes = [];
          for (let i = 0; i < msg.length; ++i) {
            bytes.push(msg.charCodeAt(i));
          }
        } else if (!Array.isArray(bytes)) {
          bytes = Array.prototype.slice.call(bytes);
        }
        bytes.push(128);
        const l = bytes.length / 4 + 2;
        const N = Math.ceil(l / 16);
        const M = new Array(N);
        for (let i = 0; i < N; ++i) {
          const arr = new Uint32Array(16);
          for (let j = 0; j < 16; ++j) {
            arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
          }
          M[i] = arr;
        }
        M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
        M[N - 1][14] = Math.floor(M[N - 1][14]);
        M[N - 1][15] = (bytes.length - 1) * 8 & 4294967295;
        for (let i = 0; i < N; ++i) {
          const W = new Uint32Array(80);
          for (let t = 0; t < 16; ++t) {
            W[t] = M[i][t];
          }
          for (let t = 16; t < 80; ++t) {
            W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
          }
          let a = H[0];
          let b = H[1];
          let c = H[2];
          let d = H[3];
          let e = H[4];
          for (let t = 0; t < 80; ++t) {
            const s = Math.floor(t / 20);
            const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
            e = d;
            d = c;
            c = ROTL(b, 30) >>> 0;
            b = a;
            a = T;
          }
          H[0] = H[0] + a >>> 0;
          H[1] = H[1] + b >>> 0;
          H[2] = H[2] + c >>> 0;
          H[3] = H[3] + d >>> 0;
          H[4] = H[4] + e >>> 0;
        }
        return [H[0] >> 24 & 255, H[0] >> 16 & 255, H[0] >> 8 & 255, H[0] & 255, H[1] >> 24 & 255, H[1] >> 16 & 255, H[1] >> 8 & 255, H[1] & 255, H[2] >> 24 & 255, H[2] >> 16 & 255, H[2] >> 8 & 255, H[2] & 255, H[3] >> 24 & 255, H[3] >> 16 & 255, H[3] >> 8 & 255, H[3] & 255, H[4] >> 24 & 255, H[4] >> 16 & 255, H[4] >> 8 & 255, H[4] & 255];
      }
      var _default = sha1;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/v5.js
  var require_v5 = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/v5.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _v = _interopRequireDefault(require_v35());
      var _sha = _interopRequireDefault(require_sha1());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var v5 = (0, _v.default)("v5", 80, _sha.default);
      var _default = v5;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/nil.js
  var require_nil = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/nil.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _default = "00000000-0000-0000-0000-000000000000";
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/version.js
  var require_version = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/version.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _validate = _interopRequireDefault(require_validate());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function version(uuid) {
        if (!(0, _validate.default)(uuid)) {
          throw TypeError("Invalid UUID");
        }
        return parseInt(uuid.slice(14, 15), 16);
      }
      var _default = version;
      exports.default = _default;
    }
  });

  // node_modules/uuid/dist/commonjs-browser/index.js
  var require_commonjs_browser = __commonJS({
    "node_modules/uuid/dist/commonjs-browser/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "NIL", {
        enumerable: true,
        get: function get() {
          return _nil.default;
        }
      });
      Object.defineProperty(exports, "parse", {
        enumerable: true,
        get: function get() {
          return _parse.default;
        }
      });
      Object.defineProperty(exports, "stringify", {
        enumerable: true,
        get: function get() {
          return _stringify.default;
        }
      });
      Object.defineProperty(exports, "v1", {
        enumerable: true,
        get: function get() {
          return _v.default;
        }
      });
      Object.defineProperty(exports, "v3", {
        enumerable: true,
        get: function get() {
          return _v2.default;
        }
      });
      Object.defineProperty(exports, "v4", {
        enumerable: true,
        get: function get() {
          return _v3.default;
        }
      });
      Object.defineProperty(exports, "v5", {
        enumerable: true,
        get: function get() {
          return _v4.default;
        }
      });
      Object.defineProperty(exports, "validate", {
        enumerable: true,
        get: function get() {
          return _validate.default;
        }
      });
      Object.defineProperty(exports, "version", {
        enumerable: true,
        get: function get() {
          return _version.default;
        }
      });
      var _v = _interopRequireDefault(require_v1());
      var _v2 = _interopRequireDefault(require_v3());
      var _v3 = _interopRequireDefault(require_v4());
      var _v4 = _interopRequireDefault(require_v5());
      var _nil = _interopRequireDefault(require_nil());
      var _version = _interopRequireDefault(require_version());
      var _validate = _interopRequireDefault(require_validate());
      var _stringify = _interopRequireDefault(require_stringify());
      var _parse = _interopRequireDefault(require_parse());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
    }
  });

  // lib/data/InstrumentType.js
  var require_InstrumentType = __commonJS({
    "lib/data/InstrumentType.js"(exports, module) {
      var uuid = require_commonjs_browser();
      var assert = require_assert();
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class InstrumentType4 extends Enum {
          constructor(code, description, alternateDescription, canExistEmpty, canReinvest, canShort, canSwitchDirection, usesSymbols, hasCorporateActions, allowFractional, closeFractional, roundQuantity, strictOrdering, generator) {
            super(code, description);
            assert.argumentIsRequired(alternateDescription, "alternateDescription", String);
            assert.argumentIsRequired(canExistEmpty, "canExistEmpty", Boolean);
            assert.argumentIsRequired(canReinvest, "canReinvest", Boolean);
            assert.argumentIsRequired(canShort, "canShort", Boolean);
            assert.argumentIsRequired(canSwitchDirection, "canSwitchDirection", Boolean);
            assert.argumentIsRequired(usesSymbols, "usesSymbols", Boolean);
            assert.argumentIsRequired(hasCorporateActions, "hasCorporateActions", Boolean);
            assert.argumentIsRequired(allowFractional, "allowFractional", Boolean);
            assert.argumentIsRequired(closeFractional, "closeFractional", Boolean);
            assert.argumentIsRequired(roundQuantity, "roundQuantity", Boolean);
            assert.argumentIsRequired(strictOrdering, "strictOrdering", Boolean);
            assert.argumentIsRequired(generator, "generator", Function);
            this._alternateDescription = alternateDescription;
            this._canExistEmpty = canExistEmpty;
            this._canReinvest = canReinvest;
            this._canShort = canShort;
            this._canSwitchDirection = canSwitchDirection;
            this._usesSymbols = usesSymbols;
            this._hasCorporateActions = hasCorporateActions;
            this._allowFractional = allowFractional;
            this._closeFractional = closeFractional;
            this._roundQuantity = roundQuantity;
            this._strictOrdering = strictOrdering;
            this._generator = generator;
          }
          /**
           * A human-readable description.
           *
           * @public
           * @returns {String}
           */
          get alternateDescription() {
            return this._alternateDescription;
          }
          /**
           * Indicates if the position can exist without any associated transactions.
           *
           * @public
           * @returns {Boolean}
           */
          get canExistEmpty() {
            return this._canExistEmpty;
          }
          /**
           * Indicates if the instrument type allows automatic reinvestment.
           *
           * @public
           * @returns {Boolean}
           */
          get canReinvest() {
            return this._canReinvest;
          }
          /**
           * Indicates if short-selling is possible for this instrument type.
           *
           * @public
           * @returns {Boolean}
           */
          get canShort() {
            return this._canShort;
          }
          /**
           * Indicates if one transaction is allowed to switch a position size from
           * positive to negative (or vice versa).
           *
           * @public
           * @returns {Boolean}
           */
          get canSwitchDirection() {
            return this._canSwitchDirection;
          }
          /**
           * Indicates if an instrument of this type can be represented by a symbol.
           *
           * @public
           * @returns {Boolean}
           */
          get usesSymbols() {
            return this._usesSymbols;
          }
          /**
           * Indicates if corporate actions are possible for this type of instrument.
           *
           * @public
           * @returns {Boolean}
           */
          get hasCorporateActions() {
            return this._hasCorporateActions;
          }
          /**
           * Indicates if a position can have a fractional value; otherwise, only
           * integer values are allowed.
           *
           * @public
           * @returns {Boolean}
           */
          get allowFractional() {
            return this._allowFractional;
          }
          /**
           * Indicates if fractional shares should be closed when the position
           * size is less than one (or some of the fractional shares are closed).
           *
           * @public
           * @returns {Boolean}
           */
          get closeFractional() {
            return this._closeFractional;
          }
          /**
           * Indicates if transaction sequences must be honored before calculating position
           * totals.
           *
           * @public
           * @returns {Boolean}
           */
          get strictOrdering() {
            return this._strictOrdering;
          }
          /**
           * Indicates transaction quantities should be rounded.
           *
           * @public
           * @returns {Boolean}
           */
          get roundQuantity() {
            return this._roundQuantity;
          }
          /**
           * Indicates if the instrument is a futures contract.
           *
           * @public
           * @returns {boolean}
           */
          get future() {
            return this === future;
          }
          /**
           * Indicates if the instrument is an option contract.
           *
           * @public
           * @returns {boolean}
           */
          get option() {
            return this === equityOption || this === futureOption;
          }
          /**
           * Generates an identifier for the instrument.
           *
           * @public
           * @param {Object} instrument
           * @returns {String}
           */
          generateIdentifier(instrument) {
            assert.argumentIsRequired(instrument, "instrument");
            if (instrument.type !== this) {
              throw new Error("Unable to generate instrument identifier for incompatible type.");
            }
            return this._generator(instrument);
          }
          /**
           * Cash.
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get CASH() {
            return cash;
          }
          /**
           * Crypto Tokens.
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get CRYPTO() {
            return crypto2;
          }
          /**
           * An equity issue.
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get EQUITY() {
            return equity;
          }
          /**
           * An option on equity shares.
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get EQUITY_OPTION() {
            return equityOption;
          }
          /**
           * A mutual fund.
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get FUND() {
            return fund;
          }
          /**
           * A futures contract.
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get FUTURE() {
            return future;
          }
          /**
           * An option on a futures contract.
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get FUTURE_OPTION() {
            return futureOption;
          }
          /**
           * An undefined asset (e.g. a house, or a collectible, or a salvaged alien spaceship).
           *
           * @public
           * @static
           * @returns {InstrumentType}
           */
          static get OTHER() {
            return other;
          }
          /**
           * @public
           * @static
           * @param {String} code
           * @returns {InstrumentType|null}
           */
          static parse(code) {
            return Enum.fromCode(InstrumentType4, code);
          }
          /**
           * Generates an identifier for the instrument.
           *
           * @public
           * @static
           * @param {Object} instrument
           * @returns {String}
           */
          static generateIdentifier(instrument) {
            const type = Enum.fromCode(InstrumentType4, instrument.type.code);
            return type.generateIdentifier(instrument);
          }
          /**
           *
           * @public
           * @static
           * @param {Number} code
           * @returns {InstrumentType}
           */
          static fromSymbolType(code) {
            assert.argumentIsRequired(code, "code", Number);
            if (code === 1 || code === 6 || code === 7 || code === 11) {
              return InstrumentType4.EQUITY;
            } else if (code === 34) {
              return InstrumentType4.EQUITY_OPTION;
            } else if (code === 5 || code === 15) {
              return InstrumentType4.FUND;
            } else if (code === 2) {
              return InstrumentType4.FUTURE;
            } else if (code === 12) {
              return InstrumentType4.FUTURE_OPTION;
            } else if (code === 999) {
              return InstrumentType4.CRYPTO;
            } else {
              throw new Error(`Unable to determine InstrumentType for [ ${code} ]`);
            }
          }
          toString() {
            return `[InstrumentType (code=${this.code})]`;
          }
        }
        const cash = new InstrumentType4("CASH", "cash", "Cash", true, false, false, true, false, false, true, false, false, false, (instrument) => `BARCHART-${instrument.type.code}-${instrument.currency.code}`);
        const crypto2 = new InstrumentType4("CRYPTO", "crypto", "Crypto", false, false, true, false, true, false, true, false, false, true, (instrument) => `BARCHART-CRYPTO-${instrument.name.toUpperCase()}`);
        const equity = new InstrumentType4("EQUITY", "equity", "Equities", false, true, true, false, true, true, true, true, true, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
        const equityOption = new InstrumentType4("EQUITY_OPTION", "equity option", "Equity Options", false, false, true, false, true, false, false, false, false, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
        const fund = new InstrumentType4("FUND", "mutual fund", "Funds", false, true, false, false, true, true, true, false, true, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
        const future = new InstrumentType4("FUTURE", "futures contract", "Futures", false, false, true, false, true, false, false, false, false, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
        const futureOption = new InstrumentType4("FUTURE_OPTION", "futures option", "Futures Options", false, false, true, false, true, false, false, false, false, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
        const other = new InstrumentType4("OTHER", "other", "Other", false, false, false, false, false, false, true, false, true, true, (instrument) => `BARCHART-${instrument.type.code}-${uuid.v4()}`);
        return InstrumentType4;
      })();
    }
  });

  // lib/calculators/AveragePriceCalculator.js
  var require_AveragePriceCalculator = __commonJS({
    "lib/calculators/AveragePriceCalculator.js"(exports, module) {
      var Decimal6 = require_Decimal();
      var is = require_is();
      var InstrumentType4 = require_InstrumentType();
      module.exports = (() => {
        "use strict";
        class AveragePriceCalculator2 {
          constructor() {
          }
          /**
           * Calculates the average price of a position.
           *
           * @public
           * @static
           * @param {Object} instrument
           * @param {Decimal|Number} basis
           * @param {Decimal|Number} quantity
           * @returns {Decimal|null}
           */
          static calculate(instrument, basis, quantity) {
            let basisToUse = null;
            if (is.number(basis)) {
              basisToUse = new Decimal6(basis);
            } else if (basis instanceof Decimal6) {
              basisToUse = basis;
            }
            let quantityToUse = null;
            if (is.number(basis)) {
              quantityToUse = new Decimal6(quantity);
            } else if (basis instanceof Decimal6) {
              quantityToUse = quantity;
            }
            const calculator = calculators.get(instrument.type);
            return calculator(instrument, basisToUse, quantityToUse);
          }
          toString() {
            return `[AveragePriceCalculator]`;
          }
        }
        function calculateForCash(instrument, basis, quantity) {
          return Decimal6.ONE;
        }
        function calculateForCrypto(instrument, basis, quantity) {
          if (basis === null || quantity === null || quantity.getIsZero()) {
            return null;
          }
          return basis.divide(quantity).opposite();
        }
        function calculateForEquity(instrument, basis, quantity) {
          if (basis === null || quantity === null || quantity.getIsZero()) {
            return null;
          }
          return basis.divide(quantity).opposite();
        }
        function calculateForEquityOption(instrument, basis, quantity) {
          if (basis === null || quantity === null || quantity.getIsZero()) {
            return null;
          }
          const multiplier = instrument.option.multiplier;
          return basis.divide(quantity).divide(multiplier).opposite();
        }
        function calculateForFund(instrument, basis, quantity) {
          if (basis === null || quantity === null || quantity.getIsZero()) {
            return null;
          }
          return basis.divide(quantity).opposite();
        }
        function calculateForFuture(instrument, basis, quantity) {
          if (basis === null || quantity === null || quantity.getIsZero()) {
            return null;
          }
          const minimumTick = instrument.future.tick;
          const minimumTickValue = instrument.future.value;
          return basis.divide(quantity).multiply(minimumTick).divide(minimumTickValue).opposite();
        }
        function calculateForFutureOption(instrument, basis, quantity) {
          if (basis === null || quantity === null || quantity.getIsZero()) {
            return null;
          }
          const minimumTick = instrument.option.tick;
          const minimumTickValue = instrument.option.value;
          return basis.divide(quantity).multiply(minimumTick).divide(minimumTickValue).opposite();
        }
        function calculateForOther(instrument, basis, quantity) {
          if (basis === null || quantity === null || quantity.getIsZero()) {
            return null;
          }
          return basis.divide(quantity).opposite();
        }
        const calculators = /* @__PURE__ */ new Map();
        calculators.set(InstrumentType4.CASH, calculateForCash);
        calculators.set(InstrumentType4.CRYPTO, calculateForCrypto);
        calculators.set(InstrumentType4.EQUITY, calculateForEquity);
        calculators.set(InstrumentType4.EQUITY_OPTION, calculateForEquityOption);
        calculators.set(InstrumentType4.FUND, calculateForFund);
        calculators.set(InstrumentType4.FUTURE, calculateForFuture);
        calculators.set(InstrumentType4.FUTURE_OPTION, calculateForFutureOption);
        calculators.set(InstrumentType4.OTHER, calculateForOther);
        return AveragePriceCalculator2;
      })();
    }
  });

  // lib/calculators/ValuationCalculator.js
  var require_ValuationCalculator = __commonJS({
    "lib/calculators/ValuationCalculator.js"(exports, module) {
      var Decimal6 = require_Decimal();
      var is = require_is();
      var InstrumentType4 = require_InstrumentType();
      module.exports = (() => {
        "use strict";
        class ValuationCalculator2 {
          constructor() {
          }
          /**
           * Calculates the value of a position.
           *
           * @public
           * @static
           * @param {Object} instrument
           * @param {Decimal|Number} price
           * @param {Decimal|Number} quantity
           * @returns {null|Decimal}
           */
          static calculate(instrument, price, quantity) {
            let priceToUse = null;
            if (is.number(price)) {
              priceToUse = new Decimal6(price);
            } else if (price instanceof Decimal6) {
              priceToUse = price;
            }
            if (priceToUse === null) {
              return null;
            }
            const calculator = calculators.get(instrument.type);
            return calculator(instrument, priceToUse, quantity);
          }
          toString() {
            return `[ValuationCalculator]`;
          }
        }
        function calculateForCash(instrument, price, quantity) {
          return new Decimal6(quantity);
        }
        function calculateForCrypto(instrument, price, quantity) {
          return price.multiply(quantity);
        }
        function calculateForEquity(instrument, price, quantity) {
          return price.multiply(quantity);
        }
        function calculateForEquityOption(instrument, price, quantity) {
          const priceMultiplier = instrument.option.multiplier;
          return price.multiply(priceMultiplier).multiply(quantity);
        }
        function calculateForFund(instrument, price, quantity) {
          return price.multiply(quantity);
        }
        function calculateForFuture(instrument, price, quantity) {
          const minimumTick = instrument.future.tick;
          const minimumTickValue = instrument.future.value;
          return price.divide(minimumTick).multiply(minimumTickValue).multiply(quantity);
        }
        function calculateForFutureOption(instrument, price, quantity) {
          const minimumTick = instrument.option.tick;
          const minimumTickValue = instrument.option.value;
          return price.divide(minimumTick).multiply(minimumTickValue).multiply(quantity);
        }
        function calculateForOther(instrument, price, quantity) {
          return price.multiply(quantity);
        }
        const calculators = /* @__PURE__ */ new Map();
        calculators.set(InstrumentType4.CASH, calculateForCash);
        calculators.set(InstrumentType4.CRYPTO, calculateForCrypto);
        calculators.set(InstrumentType4.EQUITY, calculateForEquity);
        calculators.set(InstrumentType4.EQUITY_OPTION, calculateForEquityOption);
        calculators.set(InstrumentType4.FUND, calculateForFund);
        calculators.set(InstrumentType4.FUTURE, calculateForFuture);
        calculators.set(InstrumentType4.FUTURE_OPTION, calculateForFutureOption);
        calculators.set(InstrumentType4.OTHER, calculateForOther);
        return ValuationCalculator2;
      })();
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/sorting/comparators.js
  var require_comparators = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/sorting/comparators.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var comparators_exports = {};
      __export(comparators_exports, {
        compareBooleans: () => compareBooleans,
        compareDates: () => compareDates,
        compareNull: () => compareNull,
        compareNumbers: () => compareNumbers,
        compareStrings: () => compareStrings,
        empty: () => empty
      });
      module.exports = __toCommonJS(comparators_exports);
      var assert = __toESM(require_assert());
      function compareDates(a, b) {
        assert.argumentIsRequired(a, "a", Date);
        assert.argumentIsRequired(b, "b", Date);
        return a.getTime() - b.getTime();
      }
      function compareNumbers(a, b) {
        assert.argumentIsRequired(a, "a", Number);
        assert.argumentIsRequired(b, "b", Number);
        return a - b;
      }
      function compareStrings(a, b) {
        assert.argumentIsRequired(a, "a", String);
        assert.argumentIsRequired(b, "b", String);
        return a.localeCompare(b);
      }
      function compareBooleans(a, b) {
        assert.argumentIsRequired(a, "a", Boolean);
        assert.argumentIsRequired(b, "b", Boolean);
        if (a === b) {
          return 0;
        } else if (a) {
          return 1;
        } else {
          return -1;
        }
      }
      function compareNull(a, b) {
        if (a === null && b !== null) {
          return -1;
        } else if (a !== null && b === null) {
          return 1;
        } else {
          return 0;
        }
      }
      function empty(a, b) {
        return 0;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/sorting/ComparatorBuilder.js
  var require_ComparatorBuilder = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/sorting/ComparatorBuilder.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var ComparatorBuilder_exports = {};
      __export(ComparatorBuilder_exports, {
        default: () => ComparatorBuilder
      });
      module.exports = __toCommonJS(ComparatorBuilder_exports);
      var assert = __toESM(require_assert());
      var comparators = __toESM(require_comparators());
      var ComparatorBuilder = class _ComparatorBuilder {
        #comparator;
        #invert;
        #previous;
        /**
         * @param {Function} comparator - The initial comparator.
         * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
         * @param {ComparatorBuilder=} previous - The previous comparator builder in the chain.
         */
        constructor(comparator, invert, previous) {
          assert.argumentIsRequired(comparator, "comparator", Function);
          assert.argumentIsOptional(invert, "invert", Boolean);
          this.#comparator = comparator;
          this.#invert = invert || false;
          this.#previous = previous || null;
        }
        /**
         * Adds a new comparator to the list of comparators to use.
         *
         * @public
         * @param {Function} comparator - The next comparator function.
         * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
         * @returns {ComparatorBuilder}
         */
        thenBy(comparator, invert) {
          assert.argumentIsRequired(comparator, "comparator", Function);
          assert.argumentIsOptional(invert, "invert", Boolean);
          return new _ComparatorBuilder(comparator, invert, this);
        }
        /**
         * Flips the order of the comparator (e.g. ascending to descending).
         *
         * @public
         * @returns {ComparatorBuilder}
         */
        invert() {
          let previous;
          if (this.#previous) {
            previous = this.#previous.invert();
          } else {
            previous = null;
          }
          return new _ComparatorBuilder(this.#comparator, !this.#invert, previous);
        }
        /**
         * Returns the comparator function.
         *
         * @public
         * @returns {Function}
         */
        toComparator() {
          let previousComparator;
          if (this.#previous) {
            previousComparator = this.#previous.toComparator();
          } else {
            previousComparator = comparators.empty;
          }
          return (a, b) => {
            let result = previousComparator(a, b);
            if (result === 0) {
              let sortA;
              let sortB;
              if (this.#invert) {
                sortA = b;
                sortB = a;
              } else {
                sortA = a;
                sortB = b;
              }
              result = this.#comparator(sortA, sortB);
            }
            return result;
          };
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[ComparatorBuilder]";
        }
        /**
         * Creates a {@link ComparatorBuilder}, given an initial comparator function.
         *
         * @public
         * @static
         * @param {Function} comparator - The initial comparator.
         * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
         * @returns {ComparatorBuilder}
         */
        static startWith(comparator, invert) {
          return new _ComparatorBuilder(comparator, invert);
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/DayFormatType.js
  var require_DayFormatType = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/DayFormatType.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var DayFormatType_exports = {};
      __export(DayFormatType_exports, {
        default: () => DayFormatType
      });
      module.exports = __toCommonJS(DayFormatType_exports);
      var import_Enum = __toESM(require_Enum());
      var DayFormatType = class extends import_Enum.default {
        #regex;
        #yearIndex;
        #monthIndex;
        #dayIndex;
        #yearShift;
        /**
            * @param {string} description
            * @param {RegExp} regex
            * @param {number} yearIndex
            * @param {number} monthIndex
            * @param {number} dayIndex
            * @param {number} yearShift
            */
        constructor(description, regex, yearIndex, monthIndex, dayIndex, yearShift) {
          super(description, description);
          this.#regex = regex;
          this.#yearIndex = yearIndex;
          this.#monthIndex = monthIndex;
          this.#dayIndex = dayIndex;
          this.#yearShift = yearShift;
        }
        /**
         * A regular expression for parsing the day type.
         *
         * @public
         * @returns {RegExp}
         */
        get regex() {
          return this.#regex;
        }
        /**
         * The index used to read the year from a regular expression match.
         *
         * @public
         * @returns {number}
         */
        get yearIndex() {
          return this.#yearIndex;
        }
        /**
         * The index used to read the month from a regular expression match.
         *
         * @public
         * @returns {number}
         */
        get monthIndex() {
          return this.#monthIndex;
        }
        /**
         * The index used to read the day from a regular expression match.
         *
         * @public
         * @returns {number}
         */
        get dayIndex() {
          return this.#dayIndex;
        }
        /**
         * The amount to add to the year (extracted from a formatted string) to get the
         * full year (e.g. for "11-31-25" of an MM-DD-YY string, the value will be 2000).
         *
         * @public
         * @returns {number}
         */
        get yearShift() {
          return this.#yearShift;
        }
        /**
         * Specifies date formatting as four-digit year, then month, then day (e.g. 2025-11-31).
         *
         * @public
         * @static
         * @returns {DayFormatType}
         */
        static get YYYY_MM_DD() {
          return yyyymmdd;
        }
        /**
         * Specifies date formatting as month, then day, then four-digit year (e.g. 11-31-2025).
         *
         * @public
         * @static
         * @returns {DayFormatType}
         */
        static get MM_DD_YYYY() {
          return mmddyyyy;
        }
        /**
         * Specifies date formatting as month, then day, then two-digit year (e.g. 11-31-25).
         *
         * @public
         * @static
         * @returns {DayFormatType}
         */
        static get MM_DD_YY() {
          return mmddyy;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[DayFormatType (description=${this.description})]`;
        }
      };
      function getMillenniumShift() {
        const today = /* @__PURE__ */ new Date();
        return Math.floor(today.getFullYear() / 100) * 100;
      }
      var yyyymmdd = new DayFormatType("YYYY_MM_DD", /^([0-9]{4})[-/.]?([0-9]{1,2})[-/.]?([0-9]{1,2})$/, 1, 2, 3, 0);
      var mmddyyyy = new DayFormatType("MM_DD_YYYY", /^([0-9]{1,2})[-/.]?([0-9]{1,2})[-/.]?([0-9]{4})$/, 3, 1, 2, 0);
      var mmddyy = new DayFormatType("MM_DD_YY", /^([0-9]{1,2})[-/.]?([0-9]{1,2})[-/.]?([0-9]{2})$/, 3, 1, 2, getMillenniumShift());
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Day.js
  var require_Day = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Day.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Day_exports = {};
      __export(Day_exports, {
        default: () => Day5
      });
      module.exports = __toCommonJS(Day_exports);
      var assert = __toESM(require_assert());
      var comparators = __toESM(require_comparators());
      var is = __toESM(require_is());
      var import_ComparatorBuilder = __toESM(require_ComparatorBuilder());
      var import_DayFormatType = __toESM(require_DayFormatType());
      var Day5 = class _Day {
        #year;
        #month;
        #day;
        /**
         * @param {number} year
         * @param {number} month
         * @param {number} day
         */
        constructor(year, month, day) {
          if (!_Day.validate(year, month, day)) {
            throw new Error(`Unable to instantiate [ Day ], input is invalid [ ${year} ], [ ${month} ], [ ${day} ]`);
          }
          this.#year = year;
          this.#month = month;
          this.#day = day;
        }
        /**
         * Calculates a new {@link Day} in the future (or past).
         *
         * @public
         * @param {number} days - The number of days to add (negative numbers can be used for subtraction).
         * @param {boolean=} inverse - If true, the sign of the "days" value will be flipped.
         * @returns {Day}
         */
        addDays(days, inverse) {
          assert.argumentIsRequired(days, "days", Number);
          assert.argumentIsOptional(inverse, "inverse", Boolean);
          assert.argumentIsValid(days, "days", is.large, "is an integer");
          let totalDaysToShift;
          if (is.boolean(inverse) && inverse) {
            totalDaysToShift = days * -1;
          } else {
            totalDaysToShift = days;
          }
          const positive = is.positive(totalDaysToShift);
          let shiftedDay = this.#day;
          let shiftedMonth = this.#month;
          let shiftedYear = this.#year;
          while (totalDaysToShift !== 0) {
            let monthDaysAvailable;
            let monthDaysToShift;
            if (positive) {
              monthDaysAvailable = _Day.getDaysInMonth(shiftedYear, shiftedMonth) - shiftedDay;
              monthDaysToShift = Math.min(totalDaysToShift, monthDaysAvailable);
            } else {
              monthDaysAvailable = 1 - shiftedDay;
              monthDaysToShift = Math.max(totalDaysToShift, monthDaysAvailable);
            }
            totalDaysToShift = totalDaysToShift - monthDaysToShift;
            if (totalDaysToShift === 0) {
              shiftedDay = shiftedDay + monthDaysToShift;
            } else if (positive) {
              shiftedMonth++;
              if (shiftedMonth > 12) {
                shiftedYear++;
                shiftedMonth = 1;
              }
              shiftedDay = 0;
            } else {
              shiftedMonth--;
              if (shiftedMonth < 1) {
                shiftedYear--;
                shiftedMonth = 12;
              }
              shiftedDay = _Day.getDaysInMonth(shiftedYear, shiftedMonth) + 1;
            }
          }
          return new _Day(shiftedYear, shiftedMonth, shiftedDay);
        }
        /**
         * Calculates a new {@link Day} in the past (or future).
         *
         * @public
         * @param {number} days - The number of days to subtract (negative numbers can be used for addition).
         * @returns {Day}
         */
        subtractDays(days) {
          return this.addDays(days, true);
        }
        /**
         * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
         * the month and the new month has fewer days than the current month, days will be subtracted
         * as necessary (e.g. adding one month to March 31 will return April 30).
         *
         * @public
         * @param {number} months - The number of months to add (negative numbers can be used for subtraction).
         * @param {boolean=} inverse - If true, the sign of the "days" value will be flipped.
         * @returns {Day}
         */
        addMonths(months, inverse) {
          assert.argumentIsRequired(months, "months", Number);
          assert.argumentIsOptional(inverse, "inverse", Boolean);
          assert.argumentIsValid(months, "months", is.large, "is an integer");
          let totalMonthsToShift;
          if (is.boolean(inverse) && inverse) {
            totalMonthsToShift = months * -1;
          } else {
            totalMonthsToShift = months;
          }
          const monthsToShift = totalMonthsToShift % 12;
          const yearsToShift = (totalMonthsToShift - monthsToShift) / 12;
          let shiftedYear = this.year + yearsToShift;
          let shiftedMonth = this.month + monthsToShift;
          let shiftedDay = this.day;
          if (shiftedMonth > 12) {
            shiftedYear = shiftedYear + 1;
            shiftedMonth = shiftedMonth - 12;
          }
          if (shiftedMonth < 1) {
            shiftedYear = shiftedYear - 1;
            shiftedMonth = shiftedMonth + 12;
          }
          while (!_Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
            shiftedDay = shiftedDay - 1;
          }
          return new _Day(shiftedYear, shiftedMonth, shiftedDay);
        }
        /**
         * Calculates a new {@link Day} in the past (or future).
         *
         * @public
         * @param {number} months - The number of months to subtract (negative numbers can be used for addition).
         * @returns {Day}
         */
        subtractMonths(months) {
          return this.addMonths(months, true);
        }
        /**
         * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
         * the month and the new month has fewer days than the current month, days will be subtracted
         * as necessary (e.g. adding one year to February 29 will return February 28).
         *
         * @public
         * @param {number} years - The number of years to add (negative numbers can be used for subtraction).
         * @param {boolean=} inverse - If true, the sign of the "days" value will be flipped.
         * @returns {Day}
         */
        addYears(years, inverse) {
          assert.argumentIsRequired(years, "years", Number);
          assert.argumentIsOptional(inverse, "inverse", Boolean);
          assert.argumentIsValid(years, "years", is.large, "is an integer");
          let yearsToShift;
          if (is.boolean(inverse) && inverse) {
            yearsToShift = years * -1;
          } else {
            yearsToShift = years;
          }
          let shiftedYear = this.year + yearsToShift;
          let shiftedMonth = this.month;
          let shiftedDay = this.day;
          while (!_Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
            shiftedDay = shiftedDay - 1;
          }
          return new _Day(shiftedYear, shiftedMonth, shiftedDay);
        }
        /**
         * Calculates a new {@link Day} in the past (or future).
         *
         * @public
         * @param {number} years - The number of years to subtract (negative numbers can be used for addition).
         * @returns {Day}
         */
        subtractYears(years) {
          return this.addYears(years, true);
        }
        /**
         * Returns a new {@link Day} instance for the start of the month referenced by the current instance.
         *
         * @public
         * @returns {Day}
         */
        getStartOfMonth() {
          return new _Day(this.year, this.month, 1);
        }
        /**
         * Returns a new instance for the {@link Day} end of the month referenced by the current instance.
         *
         * @public
         * @returns {Day}
         */
        getEndOfMonth() {
          return new _Day(this.year, this.month, _Day.getDaysInMonth(this.year, this.month));
        }
        /**
         * Indicates if the current {@link Day} instance occurs before another day.
         *
         * @public
         * @param {Day} other
         * @returns {boolean}
         */
        getIsBefore(other) {
          return _Day.compareDays(this, other) < 0;
        }
        /**
         * Indicates if the current {@link Day} instance occurs after another day.
         *
         * @public
         * @param {Day} other
         * @returns {boolean}
         */
        getIsAfter(other) {
          return _Day.compareDays(this, other) > 0;
        }
        /**
         * Indicates the current day falls between two other days, inclusive
         * of the range boundaries.
         *
         * @public
         * @param {Day=} first
         * @param {Day=} last
         * @returns {boolean}
         */
        getIsContained(first, last) {
          assert.argumentIsOptional(first, "first", _Day, "Day");
          assert.argumentIsOptional(last, "last", _Day, "Day");
          let notAfter;
          let notBefore;
          if (first && last && first.getIsAfter(last)) {
            notBefore = false;
            notAfter = false;
          } else {
            notAfter = !(last instanceof _Day) || !this.getIsAfter(last);
            notBefore = !(first instanceof _Day) || !this.getIsBefore(first);
          }
          return notAfter && notBefore;
        }
        /**
         * Indicates if another {@link Day} refers to the same moment.
         *
         * @public
         * @param {Day} other
         * @returns {boolean}
         */
        getIsEqual(other) {
          return _Day.compareDays(this, other) === 0;
        }
        /**
         * Calculates and returns name of the day of the week (e.g. Monday, Tuesday, Wednesday, etc.).
         *
         * @public
         * @returns {string}
         */
        getName() {
          const count = _Day.countDaysBetween(REFERENCE_MONDAY, this);
          let index = count % NAMES_OF_DAYS.length;
          if (index < 0) {
            index = index + NAMES_OF_DAYS.length;
          }
          return NAMES_OF_DAYS[index];
        }
        /**
         * The year.
         *
         * @public
         * @returns {number}
         */
        get year() {
          return this.#year;
        }
        /**
         * The month of the year (January is one, December is twelve).
         *
         * @public
         * @returns {number}
         */
        get month() {
          return this.#month;
        }
        /**
         * The day of the month.
         *
         * @public
         * @returns {number}
         */
        get day() {
          return this.#day;
        }
        /**
         * Outputs the date as the formatted string: {year}-{month}-{day}.
         *
         * @public
         * @returns {string}
         */
        format() {
          return `${leftPad(this.#year, 4, "0")}-${leftPad(this.#month, 2, "0")}-${leftPad(this.#day, 2, "0")}`;
        }
        /**
         * Returns the JSON representation.
         *
         * @public
         * @returns {string}
         */
        toJSON() {
          return this.format();
        }
        /**
         * Clones a {@link Day} instance.
         *
         * @public
         * @static
         * @param {Day} value
         * @returns {Day}
         */
        static clone(value) {
          assert.argumentIsRequired(value, "value", _Day, "Day");
          return new _Day(value.year, value.month, value.day);
        }
        /**
         * Converts a string (which matches the output of {@link Day#format}) into
         * a {@link Day} instance.
         *
         * @public
         * @static
         * @param {string} value
         * @param {DayFormatType=} type
         * @returns {Day}
         */
        static parse(value, type) {
          assert.argumentIsRequired(value, "value", String);
          let t;
          if (type instanceof import_DayFormatType.default) {
            t = type;
          } else {
            t = import_DayFormatType.default.YYYY_MM_DD;
          }
          const match = value.match(t.regex);
          if (match === null) {
            throw new Error(`Unable to parse value as Day [ ${value} ]`);
          }
          return new _Day(parseInt(match[t.yearIndex]) + t.yearShift, parseInt(match[t.monthIndex]), parseInt(match[t.dayIndex]));
        }
        /**
         * Creates a {@link Day} from the year, month, and day properties (in local time)
         * of the {@link Date} argument.
         *
         * @public
         * @static
         * @param {Date} date
         * @returns {Day}
         */
        static fromDate(date) {
          assert.argumentIsRequired(date, "date", Date);
          return new _Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
        /**
         * Creates a {@link Day} from the year, month, and day properties (in UTC)
         * of the {@link Date} argument.
         *
         * @public
         * @static
         * @param {Date} date
         * @returns {Day}
         */
        static fromDateUtc(date) {
          assert.argumentIsRequired(date, "date", Date);
          return new _Day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
        }
        /**
         * Returns a {@link Day} instance using today's local date.
         *
         * @public
         * @static
         * @returns {Day}
         */
        static getToday() {
          return _Day.fromDate(/* @__PURE__ */ new Date());
        }
        /**
         * Returns true if the year, month, and day combination is valid; otherwise false.
         *
         * @public
         * @static
         * @param {number} year
         * @param {number} month
         * @param {number} day
         * @returns {boolean}
         */
        static validate(year, month, day) {
          return is.integer(year) && is.integer(month) && is.integer(day) && !(month < 1) && !(month > 12) && !(day < 1) && !(day > _Day.getDaysInMonth(year, month));
        }
        /**
         * Returns the number of days in a given month.
         *
         * @public
         * @static
         * @param {number} year - The year number (e.g. 2017)
         * @param {number} month - The month number (e.g. 2 is February)
         * @returns {number}
         */
        static getDaysInMonth(year, month) {
          switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: {
              return 31;
            }
            case 4:
            case 6:
            case 9:
            case 11: {
              return 30;
            }
            case 2: {
              if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                return 29;
              } else {
                return 28;
              }
            }
          }
        }
        /**
         * A comparator function for {@link Day} instances.
         *
         * @public
         * @static
         * @param {Day} a
         * @param {Day} b
         * @returns {number}
         */
        static compareDays(a, b) {
          assert.argumentIsRequired(a, "a", _Day, "Day");
          assert.argumentIsRequired(b, "b", _Day, "Day");
          return comparator(a, b);
        }
        /**
         * Calculates the number of days between two {@link Day} instances (may return
         * a negative value).
         *
         * @public
         * @static
         * @param {Day} a
         * @param {Day} b
         * @returns {number}
         */
        static countDaysBetween(a, b) {
          assert.argumentIsRequired(a, "a", _Day, "Day");
          assert.argumentIsRequired(b, "b", _Day, "Day");
          if (a.getIsEqual(b)) {
            return 0;
          }
          let start;
          let end;
          let reversed = b.getIsBefore(a);
          if (reversed) {
            start = b;
            end = a;
          } else {
            start = a;
            end = b;
          }
          let currentMonth = start.month;
          let currentYear = start.year;
          let counter = 0 - start.day;
          while (!(currentMonth === end.month && currentYear === end.year)) {
            counter = counter + _Day.getDaysInMonth(currentYear, currentMonth);
            if (currentMonth === 12) {
              currentMonth = 1;
              currentYear = currentYear + 1;
            } else {
              currentMonth = currentMonth + 1;
            }
          }
          counter = counter + end.day;
          if (reversed) {
            counter = counter * -1;
          }
          return counter;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Day]";
        }
      };
      function leftPad(value, digits, character) {
        let string = value.toString();
        let padding = digits - string.length;
        return `${character.repeat(padding)}${string}`;
      }
      var comparator = import_ComparatorBuilder.default.startWith((a, b) => comparators.compareNumbers(a.year, b.year)).thenBy((a, b) => comparators.compareNumbers(a.month, b.month)).thenBy((a, b) => comparators.compareNumbers(a.day, b.day)).toComparator();
      var NAMES_OF_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      var REFERENCE_MONDAY = new Day5(2024, 1, 1);
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/array.js
  var require_array = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/array.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var array_exports = {};
      __export(array_exports, {
        batchBy: () => batchBy,
        binarySearch: () => binarySearch,
        difference: () => difference,
        differenceBy: () => differenceBy,
        differenceSymmetric: () => differenceSymmetric,
        differenceSymmetricBy: () => differenceSymmetricBy,
        dropLeft: () => dropLeft,
        dropRight: () => dropRight,
        first: () => first,
        flatten: () => flatten,
        groupBy: () => groupBy,
        indexBy: () => indexBy,
        insert: () => insert,
        intersection: () => intersection,
        intersectionBy: () => intersectionBy,
        last: () => last,
        partition: () => partition,
        remove: () => remove,
        union: () => union,
        unionBy: () => unionBy,
        unique: () => unique,
        uniqueBy: () => uniqueBy
      });
      module.exports = __toCommonJS(array_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      function unique(a) {
        assert.argumentIsArray(a, "a");
        return uniqueBy(a, (item) => item);
      }
      function uniqueBy(a, keySelector) {
        assert.argumentIsArray(a, "a");
        return a.filter((item, index, array) => {
          const key = keySelector(item);
          return array.findIndex((candidate) => key === keySelector(candidate)) === index;
        });
      }
      function groupBy(a, keySelector) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsRequired(keySelector, "keySelector", Function);
        return a.reduce((groups, item) => {
          const key = keySelector(item);
          if (!Object.prototype.hasOwnProperty.call(groups, key)) {
            groups[key] = [];
          }
          groups[key].push(item);
          return groups;
        }, {});
      }
      function batchBy(a, keySelector) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsRequired(keySelector, "keySelector", Function);
        let currentKey = null;
        let currentBatch = null;
        return a.reduce((batches, item) => {
          const key = keySelector(item);
          if (currentBatch === null || currentKey !== key) {
            currentKey = key;
            currentBatch = [];
            batches.push(currentBatch);
          }
          currentBatch.push(item);
          return batches;
        }, []);
      }
      function indexBy(a, keySelector) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsRequired(keySelector, "keySelector", Function);
        return a.reduce((map, item) => {
          const key = keySelector(item);
          if (Object.prototype.hasOwnProperty.call(map, key)) {
            throw new Error("Unable to index array. A duplicate key exists.");
          }
          map[key] = item;
          return map;
        }, {});
      }
      function dropLeft(a) {
        assert.argumentIsArray(a, "a");
        let returnRef = Array.from(a);
        if (returnRef.length !== 0) {
          returnRef.shift();
        }
        return returnRef;
      }
      function dropRight(a) {
        assert.argumentIsArray(a, "a");
        let returnRef = Array.from(a);
        if (returnRef.length !== 0) {
          returnRef.pop();
        }
        return returnRef;
      }
      function first(a) {
        assert.argumentIsArray(a, "a");
        let returnRef;
        if (a.length !== 0) {
          returnRef = a[0];
        } else {
          returnRef = void 0;
        }
        return returnRef;
      }
      function last(a) {
        assert.argumentIsArray(a, "a");
        let returnRef;
        if (a.length !== 0) {
          returnRef = a[a.length - 1];
        } else {
          returnRef = void 0;
        }
        return returnRef;
      }
      function flatten(a, recursive) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsOptional(recursive, "recursive", Boolean);
        const empty = [];
        let flat = empty.concat.apply(empty, a);
        if (recursive && flat.some((x) => is.array(x))) {
          flat = flatten(flat, true);
        }
        return flat;
      }
      function partition(a, size) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsOptional(size, "size", Number);
        const copy = a.slice(0);
        const partitions = [];
        while (copy.length !== 0) {
          partitions.push(copy.splice(0, size));
        }
        return partitions;
      }
      function difference(a, b) {
        return differenceBy(a, b, (item) => item);
      }
      function differenceBy(a, b, keySelector) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsArray(b, "b");
        assert.argumentIsRequired(keySelector, "keySelector", Function);
        const returnRef = [];
        a.forEach((candidate) => {
          const candidateKey = keySelector(candidate);
          const exclude = b.some((comparison) => candidateKey === keySelector(comparison));
          if (!exclude) {
            returnRef.push(candidate);
          }
        });
        return returnRef;
      }
      function differenceSymmetric(a, b) {
        return differenceSymmetricBy(a, b, (item) => item);
      }
      function differenceSymmetricBy(a, b, keySelector) {
        return unionBy(differenceBy(a, b, keySelector), differenceBy(b, a, keySelector), keySelector);
      }
      function union(a, b) {
        return unionBy(a, b, (item) => item);
      }
      function unionBy(a, b, keySelector) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsArray(b, "b");
        assert.argumentIsRequired(keySelector, "keySelector", Function);
        const returnRef = a.slice();
        b.forEach((candidate) => {
          const candidateKey = keySelector(candidate);
          const exclude = returnRef.some((comparison) => candidateKey === keySelector(comparison));
          if (!exclude) {
            returnRef.push(candidate);
          }
        });
        return returnRef;
      }
      function intersection(a, b) {
        return intersectionBy(a, b, (item) => item);
      }
      function intersectionBy(a, b, keySelector) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsArray(b, "b");
        const returnRef = [];
        a.forEach((candidate) => {
          const candidateKey = keySelector(candidate);
          const include = b.some((comparison) => candidateKey === keySelector(comparison));
          if (include) {
            returnRef.push(candidate);
          }
        });
        return returnRef;
      }
      function remove(a, predicate) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsRequired(predicate, "predicate", Function);
        const index = a.findIndex(predicate);
        const found = !(index < 0);
        if (found) {
          a.splice(index, 1);
        }
        return found;
      }
      function insert(a, item, comparator) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsRequired(comparator, "comparator", Function);
        if (a.length === 0 || !(comparator(item, a[a.length - 1]) < 0)) {
          a.push(item);
        } else if (comparator(item, a[0]) < 0) {
          a.unshift(item);
        } else {
          a.splice(binarySearchForInsert(a, item, comparator, 0, a.length - 1), 0, item);
        }
        return a;
      }
      function binarySearch(a, key, comparator, start, end) {
        assert.argumentIsArray(a, "a");
        assert.argumentIsRequired(comparator, "comparator", Function);
        assert.argumentIsOptional(start, "start", Number);
        assert.argumentIsOptional(end, "end", Number);
        if (a.length === 0) {
          return null;
        }
        return binarySearchForMatch(a, key, comparator, start || 0, end || a.length - 1);
      }
      function binarySearchForMatch(a, key, comparator, start, end) {
        const size = end - start;
        const midpointIndex = start + Math.floor(size / 2);
        const midpointItem = a[midpointIndex];
        const comparison = comparator(key, midpointItem);
        if (comparison === 0) {
          return midpointItem;
        } else if (size < 2) {
          const finalIndex = a.length - 1;
          const finalItem = a[finalIndex];
          if (end === finalIndex && comparator(key, finalItem) === 0) {
            return finalItem;
          } else {
            return null;
          }
        } else if (comparison > 0) {
          return binarySearchForMatch(a, key, comparator, midpointIndex, end);
        } else {
          return binarySearchForMatch(a, key, comparator, start, midpointIndex);
        }
      }
      function binarySearchForInsert(a, item, comparator, start, end) {
        const size = end - start;
        const midpointIndex = start + Math.floor(size / 2);
        const midpointItem = a[midpointIndex];
        const comparison = comparator(item, midpointItem);
        if (size < 2) {
          if (comparison > 0) {
            const finalIndex = a.length - 1;
            if (end === finalIndex && comparator(item, a[finalIndex]) > 0) {
              return end + 1;
            }
            return end;
          }
          return start;
        }
        if (comparison > 0) {
          return binarySearchForInsert(a, item, comparator, midpointIndex, end);
        }
        return binarySearchForInsert(a, item, comparator, start, midpointIndex);
      }
    }
  });

  // lib/data/PositionSummaryFrame.js
  var require_PositionSummaryFrame = __commonJS({
    "lib/data/PositionSummaryFrame.js"(exports, module) {
      var array = require_array();
      var assert = require_assert();
      var Day5 = require_Day();
      var Decimal6 = require_Decimal();
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class PositionSummaryFrame5 extends Enum {
          constructor(code, description, unique, rangeCalculator, startDateCalculator, descriptionCalculator) {
            super(code, description);
            assert.argumentIsRequired(unique, "unique", Boolean);
            assert.argumentIsRequired(rangeCalculator, "rangeCalculator", Function);
            assert.argumentIsRequired(startDateCalculator, "startDateCalculator", Function);
            assert.argumentIsRequired(descriptionCalculator, "descriptionCalculator", Function);
            this._unique = unique;
            this._rangeCalculator = rangeCalculator;
            this._startDateCalculator = startDateCalculator;
            this._descriptionCalculator = descriptionCalculator;
          }
          /**
           * If true, only one summary, of the given type, can exist for a
           * position. If false, multiple summaries, of the given type, can
           * exist for a position.
           *
           * @public
           * @returns {Boolean}
           */
          get unique() {
            return this._unique;
          }
          /**
           * Returns a human-readable description of the frame, given
           * start and end dates.
           *
           * @public
           * @returns {PositionSummaryRange} range
           * @returns {String}
           */
          describeRange(range) {
            return this._descriptionCalculator(range.start, range.end);
          }
          /**
           * Returns the most recent ranges for the frame.
           *
           * @public
           * @param {Number} periods
           * @returns {PositionSummaryRange[]}
           */
          getRecentRanges(periods) {
            const startDate = this.getStartDate(periods);
            const transaction = { date: startDate, snapshot: { open: Decimal6.ONE } };
            return this.getRanges([transaction]);
          }
          /**
           * Returns the ranges for the set of {@link Transaction} objects.
           *
           * @public
           * @param {Transaction[]} transactions
           * @returns {PositionSummaryRange[]}
           */
          getRanges(transactions) {
            assert.argumentIsArray(transactions, "transactions");
            return this._rangeCalculator(getFilteredTransactions(transactions));
          }
          /**
           * Returns the range which contains a given date and all subsequent ranges.
           *
           * @public
           * @param {Day} date
           * @returns {PositionSummaryRange[]}
           */
          getRangesFromDate(date) {
            assert.argumentIsRequired(date, "date", Day5, "Day");
            const transaction = { date, snapshot: { open: Decimal6.ONE } };
            return this.getRanges([transaction]);
          }
          /**
           * Returns the range immediately prior to the range containing the
           * date supplied.
           *
           * @public
           * @param {Day} date
           * @param {Number} periods
           * @returns {PositionSummaryRange[]}
           */
          getPriorRanges(date, periods) {
            assert.argumentIsRequired(date, "date", Day5, "Day");
            assert.argumentIsRequired(periods, "periods", Number, "Number");
            const transactionOne = { date: this.getStartDate(periods - 1, date), snapshot: { open: Decimal6.ONE } };
            const transactionTwo = { date, snapshot: { open: Decimal6.ZERO } };
            return this._rangeCalculator([transactionOne, transactionTwo]);
          }
          /**
           * Returns the start date for a frame, a given number of periods ago.
           *
           * @public
           * @param {Number} periods
           * @param {Day=} start
           * @returns {Day}
           */
          getStartDate(periods, start) {
            assert.argumentIsRequired(periods, "periods", Number);
            assert.argumentIsOptional(start, "start", Day5, "Day");
            return this._startDateCalculator(periods, start);
          }
          /**
           * A summary for a calendar year.
           *
           * @public
           * @static
           * @returns {PositionSummaryFrame}
           */
          static get YEARLY() {
            return yearly;
          }
          /**
           * A summary for a quarter.
           *
           * @public
           * @static
           * @returns {PositionSummaryFrame}
           */
          static get QUARTERLY() {
            return quarterly;
          }
          /**
           * A summary for a calendar month.
           *
           * @public
           * @static
           * @returns {PositionSummaryFrame}
           */
          static get MONTHLY() {
            return monthly;
          }
          /**
           * A summary the current year (to date).
           *
           * @public
           * @static
           * @returns {PositionSummaryFrame}
           */
          static get YTD() {
            return ytd;
          }
          /**
           * Returns the {@link PositionSummaryFrame} instance that matches the code
           * provided.
           *
           * @public
           * @static
           * @param {String} code
           * @returns {PositionSummaryFrame|null}
           */
          static parse(code) {
            return Enum.fromCode(PositionSummaryFrame5, code);
          }
          toString() {
            return `[PositionSummaryFrame (code=${this.code})]`;
          }
        }
        const yearly = new PositionSummaryFrame5("YEARLY", "year", false, getYearlyRanges, getYearlyStartDate, getYearlyRangeDescription);
        const quarterly = new PositionSummaryFrame5("QUARTERLY", "quarter", false, getQuarterlyRanges, getQuarterlyStartDate, getQuarterlyRangeDescription);
        const monthly = new PositionSummaryFrame5("MONTHLY", "month", false, getMonthlyRanges, getMonthlyStartDate, getMonthlyRangeDescription);
        const ytd = new PositionSummaryFrame5("YTD", "year-to-date", true, getYearToDateRanges, getYearToDateStartDate, getYearToDateRangeDescription);
        function getRange(start, end) {
          return { start, end };
        }
        function getYearlyRanges(transactions) {
          const ranges = [];
          if (transactions.length !== 0) {
            const first = array.first(transactions);
            const last = array.last(transactions);
            const firstDate = first.date;
            let lastYear;
            if (last.snapshot.open.getIsZero()) {
              lastYear = last.date.year + 1;
            } else {
              lastYear = Day5.getToday().year;
            }
            for (let end = new Day5(firstDate.year, 12, 31); end.year < lastYear; end = end.addYears(1)) {
              ranges.push(getRange(end.subtractYears(1), end));
            }
          }
          return ranges;
        }
        function getQuarterlyRanges(transactions) {
          return [];
        }
        function getMonthlyRanges(transactions) {
          const ranges = [];
          if (transactions.length !== 0) {
            const today = Day5.getToday();
            const first = array.first(transactions);
            const last = array.last(transactions);
            const firstDate = first.date;
            let lastDate;
            if (last.snapshot.open.getIsZero()) {
              lastDate = last.date;
            } else {
              lastDate = today;
            }
            if (today.month === lastDate.month && today.year === lastDate.year) {
              lastDate = lastDate.subtractMonths(1);
            }
            lastDate = lastDate.getEndOfMonth();
            for (let end = firstDate.getEndOfMonth(); !end.getIsAfter(lastDate); end = end.addMonths(1).getEndOfMonth()) {
              ranges.push(getRange(end.subtractMonths(1).getEndOfMonth(), end));
            }
          }
          return ranges;
        }
        function getYearToDateRanges(transactions) {
          const ranges = [];
          if (transactions.length !== 0) {
            const last = array.last(transactions);
            const currentYear = Day5.getToday().year;
            if (!last.snapshot.open.getIsZero() || last.date.year === currentYear) {
              let end = new Day5(currentYear, 12, 31);
              let start = end.subtractYears(1);
              ranges.push(getRange(start, end));
            }
          }
          return ranges;
        }
        function getYearlyStartDate(periods, date) {
          const today = date || Day5.getToday();
          return today.subtractMonths(today.month - 1).subtractDays(today.day).subtractYears(periods);
        }
        function getQuarterlyStartDate(periods, date) {
          return null;
        }
        function getMonthlyStartDate(periods, date) {
          const today = date || Day5.getToday();
          return today.subtractMonths(periods).subtractDays(today.day);
        }
        function getYearToDateStartDate(periods, date) {
          return null;
        }
        function getYearlyRangeDescription(start, end) {
          return `Year ended ${end.format()}`;
        }
        function getQuarterlyRangeDescription(start, end) {
          return "";
        }
        function getMonthlyRangeDescription(start, end) {
          return `Month ended ${end.format()}`;
        }
        function getYearToDateRangeDescription(start, end) {
          return `${end.year.toString()} YTD`;
        }
        function getFilteredTransactions(transactions) {
          return transactions.reduce((filtered, transaction) => {
            if (!transaction.snapshot.open.getIsZero() || transaction.type.closing) {
              filtered.push(transaction);
            }
            return filtered;
          }, []);
        }
        return PositionSummaryFrame5;
      })();
    }
  });

  // lib/data/TransactionType.js
  var require_TransactionType = __commonJS({
    "lib/data/TransactionType.js"(exports, module) {
      var assert = require_assert();
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class TransactionType4 extends Enum {
          constructor(code, description, display, sequence, purchase, sale, income2, opening, closing, fee2, corporateAction, initial, terminal, significant, chaining, chained, transfer) {
            super(code, description);
            assert.argumentIsRequired(display, "display", String);
            assert.argumentIsRequired(sequence, "sequence", Number);
            assert.argumentIsRequired(purchase, "purchase", Boolean);
            assert.argumentIsRequired(sale, "sale", Boolean);
            assert.argumentIsRequired(income2, "income", Boolean);
            assert.argumentIsRequired(opening, "opening", Boolean);
            assert.argumentIsRequired(closing, "closing", Boolean);
            assert.argumentIsRequired(fee2, "fee", Boolean);
            assert.argumentIsRequired(corporateAction, "corporateAction", Boolean);
            assert.argumentIsRequired(initial, "initial", Boolean);
            assert.argumentIsRequired(terminal, "terminal", Boolean);
            assert.argumentIsRequired(significant, "significant", Boolean);
            assert.argumentIsRequired(chaining, "chaining", Boolean);
            assert.argumentIsRequired(chained, "chained", Boolean);
            assert.argumentIsRequired(transfer, "transfer", Boolean);
            this._display = display;
            this._sequence = sequence;
            this._purchase = purchase;
            this._sale = sale;
            this._income = income2;
            this._opening = opening;
            this._closing = closing;
            this._fee = fee2;
            this._corporateAction = corporateAction;
            this._initial = initial;
            this._terminal = terminal;
            this._significant = significant;
            this._chaining = chaining;
            this._chained = chained;
            this._transfer = transfer;
          }
          /**
           * A human-readable description of the transaction type.
           *
           * @public
           * @returns {String}
           */
          get display() {
            return this._display;
          }
          /**
           * Specifies ordering when multiple transactions occur on the same day, for
           * the same position.
           *
           * @public
           * @returns {Number}
           */
          get sequence() {
            return this._sequence;
          }
          /**
           * Indicates if the transaction was a trade.
           *
           * @public
           * @returns {Boolean}
           */
          get trade() {
            return this._purchase || this._sale;
          }
          /**
           * Indicates if the transaction was a purchase.
           *
           * @public
           * @returns {Boolean}
           */
          get purchase() {
            return this._purchase;
          }
          /**
           * Indicates if the transaction was a sale.
           *
           * @public
           * @returns {Boolean}
           */
          get sale() {
            return this._sale;
          }
          /**
           * Indicates if the transaction was an income payment.
           *
           * @public
           * @returns {Boolean}
           */
          get income() {
            return this._income;
          }
          /**
           * Indicates if the transaction opens the position (i.e. increases its
           * magnitude).
           *
           * @public
           * @returns {Boolean}
           */
          get opening() {
            return this._opening;
          }
          /**
           * Indicates if the transaction closes the position (i.e. decreases its
           * magnitude).
           *
           * @public
           * @returns {Boolean}
           */
          get closing() {
            return this._closing;
          }
          /**
           * Indicates if the transaction is a chart that neither opens nor
           * closes the position.
           *
           * @public
           * @returns {Boolean}
           */
          get fee() {
            return this._fee;
          }
          /**
           * Indicates if the transaction is a corporate action.
           *
           * @public
           * @returns {Boolean}
           */
          get corporateAction() {
            return this._corporateAction;
          }
          /**
           * Indicates if the transaction can be the first transaction for a position.
           *
           * @public
           * @returns {Boolean}
           */
          get initial() {
            return this._initial;
          }
          /**
           * Indicates if the transaction must be the last
           *
           * @public
           * @returns {Boolean}
           */
          get terminal() {
            return this._terminal;
          }
          /**
           * Significant transactions cannot be discarded during transaction re-write.
           *
           * @public
           * @returns {Boolean}
           */
          get significant() {
            return this._significant;
          }
          /**
           * Chain transactions cause another position to be created.
           *
           * @public
           * @returns {Boolean}
           */
          get chaining() {
            return this._chaining;
          }
          /**
           * Chained transactions are created from another position.
           *
           * @public
           * @returns {Boolean}
           */
          get chained() {
            return this._chained;
          }
          /**
           * Indicates if the transaction should cause gains and losses to be
           * transferred from the original (chaining) position.
           *
           * @public
           * @returns {Boolean}
           */
          get transfer() {
            return this._transfer;
          }
          /**
           * A purchase.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get BUY() {
            return buy;
          }
          /**
           * A sale.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get SELL() {
            return sell;
          }
          /**
           * A purchase (in a short position).
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get BUY_SHORT() {
            return buyShort;
          }
          /**
           * A short sale.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get SELL_SHORT() {
            return sellShort;
          }
          /**
           * A cash dividend.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DIVIDEND() {
            return dividend;
          }
          /**
           * A cash dividend, reinvested.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DIVIDEND_REINVEST() {
            return dividendReinvest;
          }
          /**
           * A stock dividend.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DIVIDEND_STOCK() {
            return dividendStock;
          }
          /**
           * A mutual fund distribution in cash.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DISTRIBUTION_CASH() {
            return distributionCash;
          }
          /**
           * A mutual fund distribution in units.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DISTRIBUTION_FUND() {
            return distributionFund;
          }
          /**
           * A mutual fund distribution in cash, reinvested.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DISTRIBUTION_REINVEST() {
            return distributionReinvest;
          }
          /**
           * A split.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get SPLIT() {
            return split;
          }
          /**
           * A fee.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get FEE() {
            return fee;
          }
          /**
           * A mutual fund fee, which is paid in units.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get FEE_UNITS() {
            return feeUnits;
          }
          /**
           * A deposit.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DEPOSIT() {
            return deposit;
          }
          /**
           * A withdrawal.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get WITHDRAWAL() {
            return withdrawal;
          }
          /**
           * A system-generated withdrawal, arising from another transaction.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DEBIT() {
            return debit;
          }
          /**
           * A system-generated transaction, indicating the security has stopped active trading.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get DELIST() {
            return delist;
          }
          /**
           * A system-generated deposit, arising from another transaction.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get CREDIT() {
            return credit;
          }
          /**
           * A valuation event.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get VALUATION() {
            return valuation;
          }
          /**
           * Other Income.
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get INCOME() {
            return income;
          }
          /**
           * A closing transaction as a result of a merger (for the acquired company).
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get MERGER_CLOSE() {
            return mergerClose;
          }
          /**
           * A opening transaction as a result of a merger (for the acquiring company).
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get MERGER_OPEN() {
            return mergerOpen;
          }
          /**
           * A spin-off (transaction applies to the original company).
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get SPINOFF() {
            return spinoff;
          }
          /**
           * A spin-off (transaction opens a position in a new company).
           *
           * @public
           * @static
           * @returns {TransactionType}
           */
          static get SPINOFF_OPEN() {
            return spinoffOpen;
          }
          /**
           * @public
           * @static
           * @param {String} code
           * @returns {TransactionType|null}
           */
          static parse(code) {
            return Enum.fromCode(TransactionType4, code);
          }
          toString() {
            return `[TransactionType (code=${this.code})]`;
          }
        }
        const buy = new TransactionType4("B", "Buy", "Buy", 0, true, false, false, true, false, false, false, true, false, true, false, false, false);
        const sell = new TransactionType4("S", "Sell", "Sell", 0, false, true, false, false, true, false, false, false, false, true, false, false, false);
        const buyShort = new TransactionType4("BS", "Buy To Cover", "Buy To Cover", 0, true, false, false, false, true, false, false, false, false, true, false, false, false);
        const sellShort = new TransactionType4("SS", "Sell Short", "Sell Short", 0, false, true, false, true, false, false, false, true, false, true, false, false, false);
        const dividend = new TransactionType4("DV", "Dividend", "Dividend", 1, false, false, true, false, false, false, true, false, false, false, false, false, false);
        const dividendReinvest = new TransactionType4("DX", "Dividend (Reinvested)", "Dividend Reinvest", 1, false, false, false, true, false, false, true, false, false, false, false, false, false);
        const dividendStock = new TransactionType4("DS", "Dividend (Stock)", "Dividend Stock", 1, false, false, false, true, false, false, true, false, false, false, false, false, false);
        const split = new TransactionType4("SP", "Split", "Split", 1, false, false, false, true, false, false, true, false, false, false, false, false, false);
        const fee = new TransactionType4("F", "Fee", "Fee", 0, false, false, false, false, false, true, false, false, false, false, false, false, false);
        const feeUnits = new TransactionType4("FU", "Fee Units", "Fee", 0, false, false, false, false, true, false, false, false, false, false, false, false, false);
        const delist = new TransactionType4("DL", "Delist", "Delist", 1, false, false, false, false, false, false, true, false, true, false, false, false, false);
        const mergerClose = new TransactionType4("MC", "Merger Close", "Merger Close", 1, false, false, false, false, true, false, true, false, true, false, true, false, false);
        const mergerOpen = new TransactionType4("MO", "Merger Open", "Merger Open", 1, false, false, false, true, false, false, true, true, false, true, false, true, true);
        const spinoff = new TransactionType4("SPF", "Spinoff", "Spinoff", 1, false, false, false, false, false, false, true, false, false, false, true, false, false);
        const spinoffOpen = new TransactionType4("SPFO", "Spinoff Open", "Spinoff Open", 1, false, false, false, true, false, false, true, true, false, true, false, true, true);
        const distributionCash = new TransactionType4("DC", "Distribution (Cash)", "Cash Distribution", 1, false, false, true, false, false, false, true, false, false, false, false, false, false);
        const distributionReinvest = new TransactionType4("DY", "Distribution (Reinvested)", "Distribution Reinvest", 1, false, false, false, true, false, false, true, false, false, false, false, false, false);
        const distributionFund = new TransactionType4("DF", "Distribution (Units)", "Unit Distribution", 1, false, false, false, true, false, false, true, false, false, false, false, false, false);
        const deposit = new TransactionType4("D", "Deposit", "Deposit", 0, false, false, false, false, false, false, false, true, false, true, false, false, false);
        const withdrawal = new TransactionType4("W", "Withdrawal", "Withdrawal", 0, false, false, false, false, false, false, false, true, false, true, false, false, false);
        const debit = new TransactionType4("DR", "Debit", "Debit", 0, false, false, false, false, false, false, false, true, false, true, false, false, false);
        const credit = new TransactionType4("CR", "Credit", "Credit", 0, false, false, false, false, false, false, false, true, false, true, false, false, false);
        const valuation = new TransactionType4("V", "Valuation", "Valuation", 0, false, false, false, false, false, false, false, false, false, false, false, false, false);
        const income = new TransactionType4("I", "Income", "Income", 0, false, false, true, false, false, false, false, false, false, false, false, false, false);
        return TransactionType4;
      })();
    }
  });

  // lib/data/PositionDirection.js
  var require_PositionDirection = __commonJS({
    "lib/data/PositionDirection.js"(exports, module) {
      var assert = require_assert();
      var Decimal6 = require_Decimal();
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class PositionDirection extends Enum {
          constructor(code, description, sign) {
            super(code, description);
            assert.argumentIsRequired(sign, "sign", String);
            this._sign = sign;
          }
          /**
           * A description of the positiveness or negativeness of the size of the
           * position.
           *
           * @public
           * @returns {String}
           */
          get sign() {
            return this._sign;
          }
          /**
           * Indicates if the position size is positive (i.e. {@link PositionDirection#LONG}).
           *
           * @public
           * @returns {boolean}
           */
          get positive() {
            return this === long;
          }
          /**
           * Indicates if the position size is negative (i.e. {@link PositionDirection#SHORT}).
           *
           * @public
           * @returns {boolean}
           */
          get negative() {
            return this === short;
          }
          /**
           * Indicates if the position size is zero (i.e. {@link PositionDirection#LONG} or
           * {@link PositionDirection#SHORT}).
           *
           * @public
           * @returns {boolean}
           */
          get open() {
            return this !== even;
          }
          /**
           * Indicates if the position size is zero (i.e. {@link PositionDirection#EVEN}).
           *
           * @public
           * @returns {boolean}
           */
          get closed() {
            return this === even;
          }
          /**
           * A positive quantity position.
           *
           * @public
           * @static
           * @returns {PositionDirection}
           */
          static get LONG() {
            return long;
          }
          /**
           * A positive quantity position.
           *
           * @public
           * @static
           * @returns {PositionDirection}
           */
          static get SHORT() {
            return short;
          }
          /**
           * A zero quantity position.
           *
           * @public
           * @static
           * @returns {PositionDirection}
           */
          static get EVEN() {
            return even;
          }
          /**
           * @public
           * @static
           * @param {String} code
           * @returns {PositionDirection|null}
           */
          static parse(code) {
            return Enum.fromCode(PositionDirection, code);
          }
          /**
           * Given an open quantity, returns a {@link PositionDirection} that
           * describes the quantity.
           *
           * @public
           * @static
           * @param {Decimal} open
           * @returns {PositionDirection}
           */
          static for(open) {
            assert.argumentIsRequired(open, "open", Decimal6, "Decimal");
            if (open.getIsPositive()) {
              return long;
            } else if (open.getIsNegative()) {
              return short;
            } else {
              return even;
            }
          }
          toString() {
            return `[PositionDirection (code=${this.code})]`;
          }
        }
        const long = new PositionDirection("LONG", "Long", "positive");
        const short = new PositionDirection("SHORT", "Short", "negative");
        const even = new PositionDirection("EVEN", "Even", "zero");
        return PositionDirection;
      })();
    }
  });

  // lib/data/TransactionValidator.js
  var require_TransactionValidator = __commonJS({
    "lib/data/TransactionValidator.js"(exports, module) {
      var assert = require_assert();
      var array = require_array();
      var Decimal6 = require_Decimal();
      var is = require_is();
      var InstrumentType4 = require_InstrumentType();
      var PositionDirection = require_PositionDirection();
      var TransactionType4 = require_TransactionType();
      module.exports = (() => {
        "use strict";
        class TransactionValidator2 {
          constructor() {
          }
          /**
           * Determines the desired sequence number for a transaction.
           *
           * @public
           * @param {Object} transaction
           * @return {Number}
           */
          static getSortSequence(transaction) {
            let effective;
            if (is.number(transaction.resequence)) {
              effective = transaction.resequence;
            } else {
              effective = transaction.sequence;
            }
            return effective;
          }
          /**
           * Given an array of transactions, ensures that all sequence numbers and dates
           * are properly ordered.
           *
           * @public
           * @static
           * @param {Object[]} transactions
           * @param {Boolean=} strict
           * @returns {Boolean}
           */
          static validateOrder(transactions, strict) {
            return TransactionValidator2.getInvalidIndex(transactions, strict) < 0;
          }
          /**
           * Given an array of transactions, when transaction references are present, ensures
           * that no transactions within the set reference the same transaction.
           *
           * @public
           * @static
           * @param {Object[]} transactions
           * @returns {Boolean}
           */
          static validateReferences(transactions) {
            assert.argumentIsArray(transactions, "transactions");
            const references = {};
            return transactions.every((t) => {
              let valid = true;
              if (is.object(t.reference) && is.string(t.reference.root) && is.string(t.reference.transaction)) {
                const root = t.reference.root;
                const transaction = t.reference.transaction;
                if (!references.hasOwnProperty(root)) {
                  references[root] = [];
                }
                const transactions2 = references[root];
                if (transactions2.some((t2) => t2 === transaction)) {
                  valid = false;
                } else {
                  transactions2.push(transaction);
                }
              }
              return valid;
            });
          }
          /**
           * Given an array of transactions, returns the index of the first transaction that with an invalid
           * sequence number or date.
           *
           * @public
           * @static
           * @param {Object[]} transactions
           * @param {Boolean=} strict
           * @returns {Number}
           */
          static getInvalidIndex(transactions, strict) {
            assert.argumentIsArray(transactions, "transactions");
            assert.argumentIsOptional(strict, "strict", Boolean);
            return transactions.findIndex((t, i, a) => t.sequence !== i + 1 || i !== 0 && t.date.getIsBefore(a[i - 1].date) || i !== 0 && is.boolean(strict) && strict && t.date.getIsEqual(a[i - 1].date) && t.type.sequence < a[i - 1].type.sequence);
          }
          /**
           * Given an array of transactions, returns the index of the first transaction that would cause an invalid direction switch.
           *
           * @public
           * @static
           * @param {Object[]} transactions
           * @param {InstrumentType} instrumentType
           * @param {Object=} position
           * @return {Number}
           */
          static getSwitchIndex(transactions, instrumentType, position) {
            assert.argumentIsArray(transactions, "transactions");
            assert.argumentIsRequired(instrumentType, "instrumentType", InstrumentType4, "InstrumentType");
            assert.argumentIsOptional(position, "position");
            let open = position ? position.snapshot.open : Decimal6.ZERO;
            let currentDirection = open.getIsZero() ? null : PositionDirection.for(open);
            return transactions.findIndex((t) => {
              let quantity = t.quantity.absolute();
              if (t.type.sale) {
                quantity = quantity.opposite();
              }
              const nextOpen = open.add(quantity);
              const nextDirection = nextOpen.getIsZero() ? PositionDirection.EVEN : PositionDirection.for(nextOpen);
              const isValidSwitch = TransactionValidator2.validateDirectionSwitch(instrumentType, currentDirection, nextDirection);
              if (!isValidSwitch) {
                return true;
              }
              open = nextOpen;
              currentDirection = nextDirection;
              return false;
            });
          }
          /**
           * Given an array of transactions, returns the index of the first transaction that would violate position rules.
           *
           * @public
           * @static
           * @param {Object[]} transactions
           * @param {InstrumentType} instrumentType
           * @param {Object=} position
           * @return {Number}
           */
          static getPositionViolationIndex(transactions, instrumentType, position) {
            assert.argumentIsArray(transactions, "transactions");
            assert.argumentIsRequired(instrumentType, "instrumentType", InstrumentType4, "InstrumentType");
            assert.argumentIsOptional(position, "position");
            let open = position ? position.snapshot.open : Decimal6.ZERO;
            let currentDirection = open.getIsZero() ? PositionDirection.EVEN : PositionDirection.for(open);
            return transactions.findIndex((t) => {
              const quantity = t.quantity.absolute();
              const type = t.type;
              const validTypes = TransactionValidator2.getTransactionTypesFor(instrumentType, true, currentDirection);
              const isValidType = validTypes.includes(type);
              if (!isValidType) {
                return true;
              }
              const delta = type.sale ? quantity.opposite() : quantity;
              const nextOpen = open.add(delta);
              const nextDirection = nextOpen.getIsZero() ? PositionDirection.EVEN : PositionDirection.for(nextOpen);
              open = nextOpen;
              currentDirection = nextDirection;
              return false;
            });
          }
          /**
          * Given an instrument type, returns all valid transaction types.
          *
          * @static
          * @public
          * @param {InstrumentType} instrumentType
          * @param {Boolean=} userInitiated
          * @param {PositionDirection=} currentDirection
          * @returns {TransactionType[]}
          */
          static getTransactionTypesFor(instrumentType, userInitiated, currentDirection) {
            assert.argumentIsRequired(instrumentType, "instrumentType", InstrumentType4, "InstrumentType");
            assert.argumentIsOptional(userInitiated, "userInitiated", Boolean);
            let valid = validTransactionTypes[instrumentType.code] || [];
            if (userInitiated) {
              valid = valid.filter((data) => data.user === userInitiated);
            }
            if (currentDirection) {
              valid = valid.filter((data) => data.directions.some((d) => d === currentDirection));
            }
            return valid.map((d) => d.type);
          }
          /**
           * Returns transaction types which can be initiated by the user, regardless
           * of instrument type.
           *
           * @public
           * @static
           * @returns {TransactionType[]}
           */
          static getUserInitiatedTransactionTypes() {
            return array.unique(Object.keys(validTransactionTypes).reduce((types, key) => {
              const instrumentTypes = validTransactionTypes[key];
              instrumentTypes.forEach((data) => {
                if (data.user) {
                  types.push(data.type);
                }
              });
              return types;
            }, []));
          }
          /**
           * Determines if a transaction type is applicable to an instrument type.
           *
           * @static
           * @public
           * @param {InstrumentType} instrumentType
           * @param {TransactionType} transactionType
           * @param {Boolean=} userInitiated
           * @returns {Boolean}
           */
          static validateTransactionType(instrumentType, transactionType, userInitiated) {
            assert.argumentIsRequired(transactionType, "transactionType", TransactionType4, "TransactionType");
            const transactionTypes = TransactionValidator2.getTransactionTypesFor(instrumentType, userInitiated);
            return transactionTypes.some((t) => t === transactionType);
          }
          /**
           * Determines if a transaction type is valid as the first transaction of
           * a position.
           *
           * @public
           * @param {TransactionType} transactionType
           * @returns {Boolean}
           */
          static validateInitialTransactionType(transactionType) {
            return transactionType.initial;
          }
          /**
           * Determines if a position for a given instrument type can exist in
           * the given direction.
           *
           * @static
           * @public
           * @param {InstrumentType} instrumentType
           * @param {PositionDirection} direction
           * @returns {Boolean}
           */
          static validateDirection(instrumentType, direction) {
            assert.argumentIsRequired(instrumentType, "instrumentType", InstrumentType4, "InstrumentType");
            assert.argumentIsRequired(direction, "direction", PositionDirection, "PositionDirection");
            return validDirections[instrumentType.code].some((d) => d === direction);
          }
          /**
           * Determines if the position switches direction and if the direction switch
           * is valid.
           *
           * @static
           * @public
           * @param {InstrumentType} instrumentType
           * @param {PositionDirection|null|undefined} currentDirection
           * @param {PositionDirection} proposedDirection
           * @returns {Boolean}
           */
          static validateDirectionSwitch(instrumentType, currentDirection, proposedDirection) {
            return currentDirection === null || instrumentType.canSwitchDirection || (currentDirection.closed || proposedDirection.closed || currentDirection.positive === proposedDirection.positive);
          }
          toString() {
            return "[TransactionValidator]";
          }
        }
        const validTransactionTypes = {};
        function associateTypes(instrumentType, transactionType, userInitiated, directions) {
          const instrumentTypeCode = instrumentType.code;
          if (!validTransactionTypes.hasOwnProperty(instrumentTypeCode)) {
            validTransactionTypes[instrumentTypeCode] = [];
          }
          validTransactionTypes[instrumentTypeCode].push({ type: transactionType, user: userInitiated, directions: directions || [PositionDirection.LONG, PositionDirection.SHORT, PositionDirection.EVEN] });
        }
        associateTypes(InstrumentType4.CRYPTO, TransactionType4.BUY, true, [PositionDirection.LONG, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.CRYPTO, TransactionType4.SELL, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.CRYPTO, TransactionType4.SELL_SHORT, true, [PositionDirection.SHORT, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.CRYPTO, TransactionType4.BUY_SHORT, true, [PositionDirection.SHORT]);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.BUY, true, [PositionDirection.LONG, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.SELL, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.SELL_SHORT, true, [PositionDirection.SHORT, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.BUY_SHORT, true, [PositionDirection.SHORT]);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.FEE, true, [PositionDirection.LONG, PositionDirection.SHORT]);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.DIVIDEND, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.DIVIDEND_REINVEST, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.DIVIDEND_STOCK, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.SPLIT, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.DELIST, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.MERGER_OPEN, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.MERGER_CLOSE, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.SPINOFF, false);
        associateTypes(InstrumentType4.EQUITY, TransactionType4.SPINOFF_OPEN, false);
        associateTypes(InstrumentType4.EQUITY_OPTION, TransactionType4.BUY, true, [PositionDirection.LONG, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.EQUITY_OPTION, TransactionType4.SELL, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.EQUITY_OPTION, TransactionType4.SELL_SHORT, true, [PositionDirection.SHORT, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.EQUITY_OPTION, TransactionType4.BUY_SHORT, true, [PositionDirection.SHORT]);
        associateTypes(InstrumentType4.FUND, TransactionType4.BUY, true, [PositionDirection.LONG, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.FUND, TransactionType4.SELL, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.FUND, TransactionType4.FEE, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.FUND, TransactionType4.FEE_UNITS, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.DISTRIBUTION_CASH, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.DISTRIBUTION_REINVEST, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.DISTRIBUTION_FUND, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.SPLIT, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.DELIST, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.MERGER_OPEN, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.MERGER_CLOSE, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.SPINOFF, false);
        associateTypes(InstrumentType4.FUND, TransactionType4.SPINOFF_OPEN, false);
        associateTypes(InstrumentType4.FUTURE, TransactionType4.BUY, true, [PositionDirection.LONG, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.FUTURE, TransactionType4.SELL, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.FUTURE, TransactionType4.SELL_SHORT, true, [PositionDirection.SHORT, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.FUTURE, TransactionType4.BUY_SHORT, true, [PositionDirection.SHORT]);
        associateTypes(InstrumentType4.FUTURE_OPTION, TransactionType4.BUY, true, [PositionDirection.LONG, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.FUTURE_OPTION, TransactionType4.SELL, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.FUTURE_OPTION, TransactionType4.SELL_SHORT, true, [PositionDirection.SHORT, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.FUTURE_OPTION, TransactionType4.BUY_SHORT, true, [PositionDirection.SHORT]);
        associateTypes(InstrumentType4.OTHER, TransactionType4.BUY, true, [PositionDirection.LONG, PositionDirection.EVEN]);
        associateTypes(InstrumentType4.OTHER, TransactionType4.SELL, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.OTHER, TransactionType4.INCOME, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.OTHER, TransactionType4.FEE, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.OTHER, TransactionType4.VALUATION, true, [PositionDirection.LONG]);
        associateTypes(InstrumentType4.CASH, TransactionType4.DEPOSIT, true);
        associateTypes(InstrumentType4.CASH, TransactionType4.WITHDRAWAL, true);
        associateTypes(InstrumentType4.CASH, TransactionType4.DEBIT, false);
        associateTypes(InstrumentType4.CASH, TransactionType4.CREDIT, false);
        const validDirections = {};
        function associateDirections(instrumentType, positionDirection) {
          const instrumentTypeCode = instrumentType.code;
          if (!validDirections.hasOwnProperty(instrumentTypeCode)) {
            validDirections[instrumentTypeCode] = [];
          }
          validDirections[instrumentTypeCode].push(positionDirection);
        }
        associateDirections(InstrumentType4.CRYPTO, PositionDirection.EVEN);
        associateDirections(InstrumentType4.CRYPTO, PositionDirection.LONG);
        associateDirections(InstrumentType4.CRYPTO, PositionDirection.SHORT);
        associateDirections(InstrumentType4.EQUITY, PositionDirection.EVEN);
        associateDirections(InstrumentType4.EQUITY, PositionDirection.LONG);
        associateDirections(InstrumentType4.EQUITY, PositionDirection.SHORT);
        associateDirections(InstrumentType4.EQUITY_OPTION, PositionDirection.EVEN);
        associateDirections(InstrumentType4.EQUITY_OPTION, PositionDirection.LONG);
        associateDirections(InstrumentType4.EQUITY_OPTION, PositionDirection.SHORT);
        associateDirections(InstrumentType4.FUND, PositionDirection.EVEN);
        associateDirections(InstrumentType4.FUND, PositionDirection.LONG);
        associateDirections(InstrumentType4.FUTURE, PositionDirection.EVEN);
        associateDirections(InstrumentType4.FUTURE, PositionDirection.LONG);
        associateDirections(InstrumentType4.FUTURE, PositionDirection.SHORT);
        associateDirections(InstrumentType4.FUTURE_OPTION, PositionDirection.EVEN);
        associateDirections(InstrumentType4.FUTURE_OPTION, PositionDirection.LONG);
        associateDirections(InstrumentType4.FUTURE_OPTION, PositionDirection.SHORT);
        associateDirections(InstrumentType4.OTHER, PositionDirection.EVEN);
        associateDirections(InstrumentType4.OTHER, PositionDirection.LONG);
        associateDirections(InstrumentType4.CASH, PositionDirection.EVEN);
        associateDirections(InstrumentType4.CASH, PositionDirection.LONG);
        associateDirections(InstrumentType4.CASH, PositionDirection.SHORT);
        return TransactionValidator2;
      })();
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Currency.js
  var require_Currency = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Currency.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Currency_exports = {};
      __export(Currency_exports, {
        default: () => Currency5
      });
      module.exports = __toCommonJS(Currency_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_Enum = __toESM(require_Enum());
      var Currency5 = class _Currency extends import_Enum.default {
        #precision;
        #alternateDescription;
        /**
            * @param {string} code - Currency code (e.g. "USD")
            * @param {string} description - The description (e.g. "US Dollar")
            * @param {number} precision - The number of decimal places possible for by a real world transaction.
            * @param {string=} alternateDescription
            */
        constructor(code, description, precision, alternateDescription) {
          super(code, description);
          assert.argumentIsRequired(precision, "precision", Number);
          assert.argumentIsValid(precision, "precision", is.integer, "is an integer");
          assert.argumentIsOptional(alternateDescription, "alternateDescription", String);
          this.#precision = precision;
          this.#alternateDescription = alternateDescription || description;
        }
        /**
         * The maximum number of decimal places supported by a real world transaction.
         *
         * @public
         * @returns {number}
         */
        get precision() {
          return this.#precision;
        }
        /**
         * An alternate human-readable description.
         *
         * @public
         * @returns {string}
         */
        get alternateDescription() {
          return this.#alternateDescription;
        }
        /**
         * Given a code, returns the enumeration item.
         *
         * @public
         * @static
         * @param {string} code
         * @returns {Currency|null}
         */
        static parse(code) {
          const value = import_Enum.default.fromCode(_Currency, code);
          return value instanceof _Currency ? value : null;
        }
        /**
         * The Argentine Peso.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get ARS() {
          return ars;
        }
        /**
         * The Australian Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get AUD() {
          return aud;
        }
        /**
         * The Bermudian Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get BMD() {
          return bmd;
        }
        /**
         * The Brazilian Real.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get BRL() {
          return brl;
        }
        /**
         * The Bahamian Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get BSD() {
          return bsd;
        }
        /**
         * The Canadian Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get CAD() {
          return cad;
        }
        /**
         * The Swiss Franc.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get CHF() {
          return chf;
        }
        /**
         * The Chinese Yuan.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get CNY() {
          return cny;
        }
        /**
         * The Czech Koruna.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get CZK() {
          return czk;
        }
        /**
         * The Danish Krone.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get DKK() {
          return dkk;
        }
        /**
         * The Euro.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get EUR() {
          return eur;
        }
        /**
         * The Fijian Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get FJD() {
          return fjd;
        }
        /**
         * The British Pound.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get GBP() {
          return gbp;
        }
        /**
         * The British Penny.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get GBX() {
          return gbx;
        }
        /**
         * The Ghanaian Cedi.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get GHS() {
          return ghs;
        }
        /**
         * The Hong Kong Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get HKD() {
          return hkd;
        }
        /**
         * The Hungarian Forint.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get HUF() {
          return huf;
        }
        /**
         * The Indonesian Rupiah.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get IDR() {
          return idr;
        }
        /**
         * The Israeli New Shekel.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get ILS() {
          return ils;
        }
        /**
         * The Jordanian Dinar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get JOD() {
          return jod;
        }
        /**
         * The Japanese Yen.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get JPY() {
          return jpy;
        }
        /**
         * The South Korean Won.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get KRW() {
          return krw;
        }
        /**
         * The Lebanese Pound.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get LBP() {
          return lbp;
        }
        /**
         * The Mexican Peso.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get MXN() {
          return mxn;
        }
        /**
         * The Malaysian Ringgit.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get MYR() {
          return myr;
        }
        /**
         * The Namibian Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get NAD() {
          return nad;
        }
        /**
         * The Nigerian Naira.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get NGN() {
          return ngn;
        }
        /**
         * The Norwegian Krone.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get NOK() {
          return nok;
        }
        /**
         * The New Zealand Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get NZD() {
          return nzd;
        }
        /**
         * The Peruvian Sol.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get PEN() {
          return pen;
        }
        /**
         * The Papua New Guinean Kina.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get PGK() {
          return pgk;
        }
        /**
         * The Philippine peso.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get PHP() {
          return php;
        }
        /**
         * The Polish Zloty.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get PLN() {
          return pln;
        }
        /**
         * The Russian Ruble.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get RUB() {
          return rub;
        }
        /**
         * The Russian Ruble (Old).
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get RUR() {
          return rur;
        }
        /**
         * The Swedish Krona.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get SEK() {
          return sek;
        }
        /**
         * The Singapore Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get SGD() {
          return sgd;
        }
        /**
         * The Thai Baht.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get THB() {
          return thb;
        }
        /**
         * The Turkish Lira.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get TRY() {
          return trx;
        }
        /**
         * The New Taiwan Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get TWD() {
          return twd;
        }
        /**
         * The US Dollar.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get USD() {
          return usd;
        }
        /**
         * The Uruguay Peso.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get UYI() {
          return uyi;
        }
        /**
         * The South African Rand.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get ZAR() {
          return zar;
        }
        /**
         * The Zambian Kwacha.
         *
         * @public
         * @static
         * @returns {Currency}
         */
        static get ZMW() {
          return zmw;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Currency (code=${this.code})]`;
        }
      };
      var ars = new Currency5("ARS", "Argentine Peso", 2, "ARS");
      var aud = new Currency5("AUD", "Australian Dollar", 2, "AUD$");
      var bmd = new Currency5("BMD", "Bermudian Dollar", 2, "BMD");
      var brl = new Currency5("BRL", "Brazilian Real", 2, "BRL");
      var bsd = new Currency5("BSD", "Bahamian Dollar", 2, "BSD");
      var cad = new Currency5("CAD", "Canadian Dollar", 2, "CAD$");
      var chf = new Currency5("CHF", "Swiss Franc", 2, "CHF");
      var cny = new Currency5("CNY", "Chinese Yuan", 2, "CNY");
      var czk = new Currency5("CZK", "Czech Koruna", 2, "CZK");
      var dkk = new Currency5("DKK", "Danish Krone", 2, "DKK");
      var eur = new Currency5("EUR", "Euro", 2, "EUR");
      var fjd = new Currency5("FJD", "Fijian Dollar", 2, "FJD");
      var gbp = new Currency5("GBP", "British Pound", 2, "GBP");
      var gbx = new Currency5("GBX", "British Penny", 2, "GBX");
      var ghs = new Currency5("GHS", "Ghanaian Cedi", 2, "GHS");
      var hkd = new Currency5("HKD", "Hong Kong Dollar", 2, "HK$");
      var huf = new Currency5("HUF", "Hungarian Forint", 2, "HUF");
      var idr = new Currency5("IDR", "Indonesian Rupiah", 2, "IDR");
      var ils = new Currency5("ILS", "Israeli New Shekel", 2, "ILS");
      var jod = new Currency5("JOD", "Jordanian Dinar", 2, "JOD");
      var jpy = new Currency5("JPY", "Japanese Yen", 2, "JPY");
      var krw = new Currency5("KRW", "South Korean Won", 2, "KRW");
      var lbp = new Currency5("LBP", "Lebanese Pound", 2, "LBP");
      var mxn = new Currency5("MXN", "Mexican Peso", 2, "MXN");
      var myr = new Currency5("MYR", "Malaysian Ringgit", 2, "MYR");
      var nad = new Currency5("NAD", "Namibian Dollar", 2, "NAD");
      var ngn = new Currency5("NGN", "Nigerian Naira", 2, "NGN");
      var nok = new Currency5("NOK", "Norwegian Krone", 2, "Nkr");
      var nzd = new Currency5("NZD", "New Zealand Dollar", 2, "NZD");
      var pen = new Currency5("PEN", "Peruvian Sol", 2, "PEN");
      var pgk = new Currency5("PGK", "Papua New Guinean Kina", 2, "PGK");
      var php = new Currency5("PHP", "Philippine peso", 2, "PHP");
      var pln = new Currency5("PLN", "Polish Zloty", 2, "PLN");
      var rub = new Currency5("RUB", "Russian Ruble", 2, "RUB");
      var rur = new Currency5("RUR", "Russian Ruble (Old)", 2, "RUR");
      var sek = new Currency5("SEK", "Swedish Krona", 2, "SEK");
      var sgd = new Currency5("SGD", "Singapore Dollar", 2, "SGD");
      var thb = new Currency5("THB", "Thai Baht", 2, "THB");
      var trx = new Currency5("TRY", "Turkish Lira", 2, "TRY");
      var twd = new Currency5("TWD", "New Taiwan Dollar", 2, "TWD");
      var usd = new Currency5("USD", "US Dollar", 2, "US$");
      var uyi = new Currency5("UYI", "Uruguay Peso", 2, "UYI");
      var zar = new Currency5("ZAR", "South African Rand", 2, "ZAR");
      var zmw = new Currency5("ZMW", "Zambian Kwacha", 2, "ZMW");
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/memoize.js
  var require_memoize = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/memoize.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var memoize_exports = {};
      __export(memoize_exports, {
        cache: () => cache,
        simple: () => simple
      });
      module.exports = __toCommonJS(memoize_exports);
      var assert = __toESM(require_assert());
      function simple(fn) {
        const cache2 = {};
        return (x) => {
          if (!Object.prototype.hasOwnProperty.call(cache2, x)) {
            cache2[x] = fn(x);
          }
          return cache2[x];
        };
      }
      function cache(fn, duration) {
        assert.argumentIsRequired(fn, "fn", Function);
        assert.argumentIsOptional(duration, "duration", Number);
        const durationToUse = duration || 0;
        let executionTime = null;
        let cacheResult = null;
        return () => {
          const currentTime = (/* @__PURE__ */ new Date()).getTime();
          if (executionTime === null || durationToUse > 0 && currentTime > executionTime + durationToUse) {
            executionTime = currentTime;
            cacheResult = fn();
          }
          return cacheResult;
        };
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Rate.js
  var require_Rate = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Rate.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Rate_exports = {};
      __export(Rate_exports, {
        default: () => Rate
      });
      module.exports = __toCommonJS(Rate_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var memoize = __toESM(require_memoize());
      var import_Currency = __toESM(require_Currency());
      var import_Decimal = __toESM(require_Decimal());
      var Rate = class _Rate {
        #decimal;
        #float;
        #numerator;
        #denominator;
        /**
         * @param {number|string|Decimal} value - The rate
         * @param {Currency} numerator - The quote currency
         * @param {Currency} denominator - The base currency
         */
        constructor(value, numerator, denominator) {
          assert.argumentIsRequired(numerator, "numerator", import_Currency.default, "Currency");
          assert.argumentIsRequired(denominator, "denominator", import_Currency.default, "Currency");
          if (numerator === denominator) {
            throw new Error("A rate cannot use two identical currencies.");
          }
          if (is.number(value)) {
            this.#decimal = null;
            this.#float = value;
          } else if (value instanceof import_Decimal.default) {
            this.#decimal = value;
            this.#float = null;
          } else {
            this.#decimal = new import_Decimal.default(value);
            this.#float = null;
          }
          if (this.#float !== null && !(this.#float > 0) || this.#decimal !== null && !this.#decimal.getIsPositive()) {
            throw new Error("Rate value must be positive.");
          }
          this.#numerator = numerator;
          this.#denominator = denominator;
        }
        /**
         * The rate (as a {@link Decimal}) instance.
         *
         * @public
         * @returns {Decimal}
         */
        get decimal() {
          if (this.#decimal === null) {
            this.#decimal = new import_Decimal.default(this.float);
          }
          return this.#decimal;
        }
        /**
         * The rate (as a floating point number).
         *
         * @public
         * @returns {number}
         */
        get float() {
          if (this.#float === null) {
            this.#float = this.#decimal.toNumber();
          }
          return this.#float;
        }
        /**
         * The numerator (i.e. quote) currency. In other words,
         * this is EUR of the EURUSD pair.
         *
         * @public
         * @returns {Currency}
         */
        get numerator() {
          return this.#numerator;
        }
        /**
         * The quote (i.e. numerator) currency. In other words,
         * this is EUR of the EURUSD pair.
         *
         * @public
         * @returns {Currency}
         */
        get quote() {
          return this.#numerator;
        }
        /**
         * The denominator (i.e. base) currency. In other words,
         * this is USD of the EURUSD pair.
         *
         * @public
         * @returns {Currency}
         */
        get denominator() {
          return this.#denominator;
        }
        /**
         * The base (i.e. denominator) currency. In other words,
         * this is USD of the EURUSD pair.
         *
         * @public
         * @returns {Currency}
         */
        get base() {
          return this.#denominator;
        }
        /**
         * Returns the equivalent rate with the numerator and denominator (i.e. the quote and base)
         * currencies.
         *
         * @public
         * @returns {Rate}
         */
        invert() {
          let inverted;
          if (this.#decimal === null) {
            inverted = 1 / this.#float;
          } else {
            inverted = import_Decimal.default.ONE.divide(this.decimal);
          }
          return new _Rate(inverted, this.#denominator, this.#numerator);
        }
        /**
         * Formats the currency pair as a string (e.g. "EURUSD" or "^EURUSD").
         *
         * @public
         * @param {boolean=} useCarat - If true, a carat is used as a prefix to the resulting string.
         * @returns {string}
         */
        formatPair(useCarat) {
          assert.argumentIsOptional(useCarat, "useCarat", Boolean);
          return `${useCarat ? "^" : ""}${this.#numerator.code}${this.#denominator.code}`;
        }
        /**
         * Returns the Barchart symbol for the exchange rate.
         *
         * @public
         * @return {string}
         */
        getSymbol() {
          return `^${this.denominator.code}${this.numerator.code}`;
        }
        /**
         * Creates a {@link Rate} instance, when given a value
         *
         * @public
         * @static
         * @param {number|string|Decimal} value - The rate.
         * @param {string} symbol - A string that can be parsed as a currency pair.
         * @returns {Rate}
         */
        static fromPair(value, symbol) {
          assert.argumentIsRequired(symbol, "symbol", String);
          const pair = parsePair(symbol);
          return new _Rate(value, import_Currency.default.parse(pair.numerator), import_Currency.default.parse(pair.denominator));
        }
        /**
         * Given a {@link Decimal} value in a known currency, output
         * a {@link Decimal} converted to an alternate currency.
         *
         * @public
         * @static
         * @param {Decimal} amount - The amount to convert.
         * @param {Currency} currency - The currency of the amount.
         * @param {Currency} desiredCurrency - The currency to convert to.
         * @param {...Rate} rates - A list of exchange rates to be used for the conversion.
         * @returns {Decimal}
         */
        static convert(amount, currency, desiredCurrency, ...rates) {
          assert.argumentIsRequired(amount, "amount", import_Decimal.default, "Decimal");
          assert.argumentIsRequired(currency, "currency", import_Currency.default, "Currency");
          assert.argumentIsRequired(desiredCurrency, "desiredCurrency", import_Currency.default, "Currency");
          if (currency === desiredCurrency) {
            return amount;
          }
          if (currency === import_Currency.default.GBX) {
            const gbp = convert(amount, import_Currency.default.GBX, import_Currency.default.GBP, [GBPGBX]);
            return convert(gbp, import_Currency.default.GBP, desiredCurrency, rates);
          }
          if (desiredCurrency === import_Currency.default.GBX) {
            const gbp = convert(amount, currency, import_Currency.default.GBP, [GBXGBP, ...rates]);
            return convert(gbp, import_Currency.default.GBP, import_Currency.default.GBX, [GBXGBP]);
          }
          return convert(amount, currency, desiredCurrency, rates);
        }
        /**
         * Returns a list of rates which do no change.
         *
         * @public
         * @static
         * @returns {Rate[]}
         */
        static getStaticRates() {
          return [new _Rate(GBXGBP.float, GBXGBP.numerator, GBXGBP.denominator)];
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Rate]`;
        }
      };
      var pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;
      var parsePair = memoize.simple((symbol) => {
        const match = symbol.match(pairExpression);
        if (match === null) {
          throw new Error('The "pair" argument cannot be parsed.');
        }
        return {
          numerator: match[2],
          denominator: match[1]
        };
      });
      function convert(amount, currency, desiredCurrency, rates) {
        if (currency === desiredCurrency) {
          return amount;
        }
        const numerator = desiredCurrency;
        const denominator = currency;
        let rate = rates.find((r) => r.numerator === numerator && r.denominator === denominator || r.numerator === denominator && r.denominator === numerator);
        if (rate && rate.numerator === denominator) {
          rate = rate.invert();
        }
        if (!rate) {
          throw new Error("Unable to perform conversion, given the rates provided.");
        }
        return amount.multiply(rate.decimal);
      }
      var GBPGBX = Rate.fromPair(100, "^GBPGBX");
      var GBXGBP = Rate.fromPair(0.01, "^GBXGBP");
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/graph/Edge.js
  var require_Edge = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/graph/Edge.js"(exports, module) {
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Edge_exports = {};
      __export(Edge_exports, {
        default: () => Edge
      });
      module.exports = __toCommonJS(Edge_exports);
      var Edge = class {
        #from;
        #to;
        #data;
        /**
         * @param {Vertex} from
         * @param {Vertex} to
         * @param {*=} data
         */
        constructor(from, to, data) {
          this.#from = from;
          this.#to = to;
          this.#data = data || null;
        }
        /**
         * The starting vertex.
         *
         * @public
         * @returns {Vertex}
         */
        get from() {
          return this.#from;
        }
        /**
         * The end vertex.
         *
         * @public
         * @returns {Vertex}
         */
        get to() {
          return this.#to;
        }
        /**
         * Ad hoc data associated with the edge (in other words the "value"
         * of the edge).
         *
         * @public
         * @returns {*|null}
         */
        get data() {
          return this.#data;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Edge (from=${this.from.data.toString()}, to=${this.to.data.toString()}})]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/graph/Vertex.js
  var require_Vertex = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/graph/Vertex.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Vertex_exports = {};
      __export(Vertex_exports, {
        default: () => Vertex
      });
      module.exports = __toCommonJS(Vertex_exports);
      var assert = __toESM(require_assert());
      var import_Edge = __toESM(require_Edge());
      var Vertex = class _Vertex {
        #data;
        #edges;
        /**
         * @param {*=} data
         */
        constructor(data) {
          this.#data = data || null;
          this.#edges = [];
        }
        /**
         * Ad hoc data associated with the vertex (in other words the "value"
         * of the vertex).
         *
         * @public
         * @returns {*}
         */
        get data() {
          return this.#data;
        }
        /**
         * Returns all edges from this vertex to other vertices.
         *
         * @public
         * @returns {Edge[]}
         */
        getEdges() {
          return this.#edges;
        }
        /**
         * Adds an edge.
         *
         * @public
         * @param {Vertex} other
         * @param {*=} data
         * @returns {Edge}
         */
        addEdge(other, data) {
          assert.argumentIsRequired(other, "other", _Vertex, "Vertex");
          if (other === this) {
            throw new Error("Graph vertex cannot connect to itself.");
          }
          if (this.hasEdge(other)) {
            throw new Error(`Graph already has edge between [ ${this.data.toString()} ] and [ ${other.data.toString()} ]`);
          }
          const edge = new import_Edge.default(this, other, data);
          this.#edges.push(edge);
          return edge;
        }
        /**
         * Locates an edge.
         *
         * @public
         * @param {Vertex} other
         * @returns {Edge|null}
         */
        getEdge(other) {
          return this.#edges.find((e) => e.to === other) || null;
        }
        /**
         * Indicates if this vertex has an edge.
         *
         * @public
         * @param {Vertex} other
         * @returns {boolean}
         */
        hasEdge(other) {
          return this.getEdge(other) !== null;
        }
        /**
         * Finds all possible paths from this vertex (node) to another vertex (node).
         *
         * @public
         * @param {Vertex} other
         * @param {Edge[]=} walk
         * @returns {Edge[][]}
         */
        getPaths(other, walk) {
          if (walk && this === other) {
            return [walk];
          }
          if (walk && walk.some((edge) => edge.from === this)) {
            return [];
          }
          let paths = [];
          this.#edges.forEach((edge) => {
            let current;
            if (walk) {
              current = walk.slice(0);
            } else {
              current = [];
            }
            current.push(edge);
            paths = paths.concat(edge.to.getPaths(other, current));
          });
          return paths;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Vertex (data=${this.data.toString()})]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/CurrencyTranslator.js
  var require_CurrencyTranslator = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/CurrencyTranslator.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var CurrencyTranslator_exports = {};
      __export(CurrencyTranslator_exports, {
        default: () => CurrencyTranslator2
      });
      module.exports = __toCommonJS(CurrencyTranslator_exports);
      var assert = __toESM(require_assert());
      var array = __toESM(require_array());
      var comparators = __toESM(require_comparators());
      var memoize = __toESM(require_memoize());
      var import_Currency = __toESM(require_Currency());
      var import_Decimal = __toESM(require_Decimal());
      var import_Rate = __toESM(require_Rate());
      var import_ComparatorBuilder = __toESM(require_ComparatorBuilder());
      var import_Edge = __toESM(require_Edge());
      var import_Vertex = __toESM(require_Vertex());
      var CurrencyTranslator2 = class {
        #translators;
        #maps;
        /**
         * @param {string[]} symbols - Forex symbols which will be used for translations.
         */
        constructor(symbols) {
          assert.argumentIsArray(symbols, "symbols", String);
          this.#translators = solve(symbols);
          this.#maps = {};
          this.#maps.rates = /* @__PURE__ */ new Map();
          this.#maps.translation = /* @__PURE__ */ new Map();
          this.#translators.forEach((translator) => {
            const path = translator.path;
            path.forEach((edge) => {
              const from = edge.from.data;
              const to = edge.to.data;
              if (!this.#maps.rates.has(from)) {
                this.#maps.rates.set(from, /* @__PURE__ */ new Map());
              }
              if (!this.#maps.rates.get(from).has(to)) {
                this.#maps.rates.get(from).set(to, { edge, translators: [] });
              }
              this.#maps.rates.get(from).get(to).translators.push(translator);
            });
          });
          this.#translators.forEach((translator) => {
            const from = translator.from;
            const to = translator.to;
            if (!this.#maps.translation.has(from)) {
              this.#maps.translation.set(from, /* @__PURE__ */ new Map());
            }
            this.#maps.translation.get(from).set(to, translator);
          });
        }
        /**
         * Updates the calculator with new rates.
         *
         * @public
         * @param {Rate[]} rates
         */
        setRates(rates) {
          rates.forEach((rate) => {
            this.setRate(rate);
          });
        }
        /**
         * Updates the calculator with a new rate.
         *
         * @public
         * @param {Rate} rate
         */
        setRate(rate) {
          assert.argumentIsRequired(rate, "rate", import_Rate.default, "Rate");
          this.#updateRate(rate);
          this.#updateRate(rate.invert());
        }
        /**
         * Performs a currency translation, using the rates previously supplied to
         * the calculator.
         *
         * @public
         * @param {number|Decimal} amount
         * @param {Currency} current
         * @param {Currency} desired
         * @returns {number|Decimal}
         */
        translate(amount, current, desired) {
          assert.argumentIsRequired(current, "current", import_Currency.default, "Currency");
          assert.argumentIsRequired(desired, "desired", import_Currency.default, "Currency");
          if (current === desired) {
            return amount;
          }
          return this.#maps.translation.get(current).get(desired).translate(amount);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[CurrencyTranslator]`;
        }
        #updateRate(rate) {
          const from = rate.base;
          const to = rate.quote;
          const data = this.#maps.rates.get(from).get(to);
          const current = data.edge.data.rate;
          if (current !== null && current === rate.float) {
            return;
          }
          data.edge.data.rate = rate.float;
          data.translators.forEach((t) => t.clear());
        }
      };
      var pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;
      var parsePair = memoize.simple((symbol) => {
        const match = symbol.match(pairExpression);
        if (match === null) {
          throw new Error('The "pair" argument cannot be parsed.');
        }
        return {
          quote: import_Currency.default.parse(match[1]),
          base: import_Currency.default.parse(match[2])
        };
      });
      var solve = (symbols) => {
        const vertices = /* @__PURE__ */ new Map();
        const getVertex = (currency, create) => {
          if (create && !vertices.has(currency)) {
            vertices.set(currency, new import_Vertex.default(currency));
          }
          return vertices.get(currency) || null;
        };
        const graph = (currencyA, currencyB) => {
          const vertexA = getVertex(currencyA, true);
          const vertexB = getVertex(currencyB, true);
          if (!vertexA.hasEdge(vertexB)) {
            vertexA.addEdge(vertexB, { rate: null });
          }
        };
        const currencies = /* @__PURE__ */ new Set();
        symbols.forEach((symbol) => {
          const pair = parsePair(symbol);
          currencies.add(pair.quote);
          currencies.add(pair.base);
          graph(pair.quote, pair.base);
          graph(pair.base, pair.quote);
        });
        const translators = [];
        currencies.forEach((currencyA) => {
          currencies.forEach((currencyB) => {
            if (currencyA === currencyB) {
              return;
            }
            const vertexA = getVertex(currencyA, false);
            const vertexB = getVertex(currencyB, false);
            const candidates = vertexA.getPaths(vertexB);
            if (candidates.length === 0) {
              console.warn(`Unable to find path for [ ${currencyA.code} ] to [ ${currencyB.code} ]`);
              return;
            }
            candidates.sort(pathComparator);
            translators.push(new Translator(candidates[0]));
          });
        });
        return translators;
      };
      var Translator = class {
        #path;
        #factors;
        constructor(path) {
          assert.argumentIsArray(path, "path", import_Edge.default, "Edge");
          this.#path = path;
          this.#factors = {};
          this.#factors.float = null;
          this.#factors.decimal = null;
        }
        /**
         * The currency of the input value.
         *
         * @public
         * @returns {Currency}
         */
        get from() {
          return array.first(this.#path).from.data;
        }
        /**
         * The currency of the output value.
         *
         * @public
         * @returns {Currency}
         */
        get to() {
          return array.last(this.#path).to.data;
        }
        /**
         * The graph edges (steps) used to convert from the source
         * currency to the desired currency.
         *
         * @public
         * @returns {Edge[]}
         */
        get path() {
          return this.#path.slice(0);
        }
        /**
         * Clears the cached factor used to convert values.
         *
         * @public
         */
        clear() {
          this.#factors.float = null;
          this.#factors.decimal = null;
        }
        /**
         * Translates an amount in the source currency to the desired currency.
         *
         * @public
         * @param {number|Decimal} amount
         * @returns {number|Decimal}
         */
        translate(amount) {
          const ready = this.#checkFactors();
          if (!ready) {
            throw new Error(`Unable to translate from [ ${this.from.code} ] to [ ${this.to.code} ], exchange rate is unknown.`);
          }
          if (amount instanceof import_Decimal.default) {
            return amount.multiply(this.#factors.decimal);
          } else {
            return amount * this.#factors.float;
          }
        }
        toString() {
          return `[Translator (path=${this.#path.map((edge) => `${edge.from.code} > ${edge.to.code}`).join()})]`;
        }
        #checkFactors() {
          if (this.#factors.float !== null) {
            return true;
          }
          let factor = 1;
          for (let i = 0; i < this.#path.length; i++) {
            const edge = this.#path[i];
            if (edge.data.rate === null) {
              return false;
            }
            factor = factor * edge.data.rate;
          }
          this.#factors.float = factor;
          this.#factors.decimal = import_Decimal.default.parse(factor);
          return true;
        }
      };
      var pathComparator = import_ComparatorBuilder.default.startWith((a, b) => comparators.compareNumbers(a.length, b.length)).toComparator();
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Disposable.js
  var require_Disposable = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Disposable.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Disposable_exports = {};
      __export(Disposable_exports, {
        default: () => Disposable
      });
      module.exports = __toCommonJS(Disposable_exports);
      var assert = __toESM(require_assert());
      var Disposable = class _Disposable {
        #disposed;
        constructor() {
          this.#disposed = false;
        }
        /**
         * Indicates if the dispose action has been executed.
         *
         * @public
         * @returns {boolean}
         */
        get disposed() {
          return this.#disposed;
        }
        /**
         * Invokes end-of-life logic. Once this function has been
         * invoked, further interaction with the object is not
         * recommended.
         *
         * @public
         */
        dispose() {
          if (this.#disposed) {
            return;
          }
          this.#disposed = true;
          this._onDispose();
        }
        /**
         * @protected
         * @abstract
         * @ignore
         */
        _onDispose() {
        }
        /**
         * Returns true if the {@link Disposable#dispose} function has been invoked.
         *
         * @public
         * @deprecated
         * @returns {boolean}
         */
        getIsDisposed() {
          return this.#disposed;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Disposable]";
        }
        /**
         * Creates and returns a {@link Disposable} object with end-of-life logic
         * delegated to a function.
         *
         * @public
         * @static
         * @param {Function} disposeAction
         * @returns {Disposable}
         */
        static fromAction(disposeAction) {
          assert.argumentIsRequired(disposeAction, "disposeAction", Function);
          return new DisposableAction(disposeAction);
        }
        /**
         * Creates and returns a {@link Disposable} object whose end-of-life
         * logic does nothing.
         *
         * @public
         * @static
         * @returns {Disposable}
         */
        static getEmpty() {
          return _Disposable.fromAction(() => {
          });
        }
      };
      var DisposableAction = class extends Disposable {
        #disposeAction;
        /**
            * @param {Function} disposeAction
            */
        constructor(disposeAction) {
          super();
          this.#disposeAction = disposeAction;
        }
        /**
         * @protected
         * @override
         */
        _onDispose() {
          this.#disposeAction();
          this.#disposeAction = null;
        }
        toString() {
          return "[DisposableAction]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/Stack.js
  var require_Stack = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/Stack.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Stack_exports = {};
      __export(Stack_exports, {
        default: () => Stack
      });
      module.exports = __toCommonJS(Stack_exports);
      var assert = __toESM(require_assert());
      var Stack = class {
        #array;
        constructor() {
          this.#array = [];
        }
        /**
         * Adds an item to the stack.
         *
         * @public
         * @param {object} item
         * @returns {object} - The item added to the stack.
         */
        push(item) {
          this.#array.push(item);
          return item;
        }
        /**
         * Removes and returns an item from the stack. Throws if the stack is empty.
         *
         * @public
         * @returns {object} - The removed from the stack.
         */
        pop() {
          if (this.empty()) {
            throw new Error("Stack is empty");
          }
          return this.#array.pop();
        }
        /**
         * Returns the next item in the stack (without removing it). Throws if the stack is empty.
         *
         * @public
         * @returns {object} - The item added to the stack.
         */
        peek() {
          if (this.empty()) {
            throw new Error("Stack is empty");
          }
          return this.#array[this.#array.length - 1];
        }
        /**
         * Returns true if the stack is empty; otherwise false.
         *
         * @public
         * @returns {boolean}
         */
        empty() {
          return this.#array.length === 0;
        }
        /**
         * Runs an action on each item in the stack.
         *
         * @public
         * @param {Function} action - The action to run.
         */
        scan(action) {
          assert.argumentIsRequired(action, "action", Function);
          for (let i = this.#array.length - 1; i >= 0; i--) {
            action(this.#array[i]);
          }
        }
        /**
         * Outputs an array of the stack's items; without affecting the
         * stack's internal state;
         *
         * @public
         * @returns {Array}
         */
        toArray() {
          return this.#array.slice(0).reverse();
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Stack]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/specialized/DisposableStack.js
  var require_DisposableStack = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/specialized/DisposableStack.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var DisposableStack_exports = {};
      __export(DisposableStack_exports, {
        default: () => DisposableStack
      });
      module.exports = __toCommonJS(DisposableStack_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_Stack = __toESM(require_Stack());
      var import_Disposable = __toESM(require_Disposable());
      var DisposableStack = class _DisposableStack extends import_Disposable.default {
        #stack;
        constructor() {
          super();
          this.#stack = new import_Stack.default();
        }
        /**
         * Adds a new {@link Disposable} instance to the stack.
         *
         * @public
         * @param {Disposable} disposable - The item to add.
         */
        push(disposable) {
          assert.argumentIsRequired(disposable, "disposable", import_Disposable.default, "Disposable");
          if (this.disposed) {
            throw new Error("Unable to push item onto DisposableStack because it has been disposed.");
          }
          this.#stack.push(disposable);
        }
        /**
         * @protected
         * @override
         */
        _onDispose() {
          while (!this.#stack.empty()) {
            this.#stack.pop().dispose();
          }
        }
        /**
         * @public
         * @static
         * @param {*} bindings
         * @returns {DisposableStack}
         */
        static fromArray(bindings) {
          assert.argumentIsArray(bindings, "bindings", import_Disposable.default, "Disposable");
          const returnRef = new _DisposableStack();
          for (let i = 0; i < bindings.length; i++) {
            returnRef.push(bindings[i]);
          }
          return returnRef;
        }
        /**
         * @public
         * @static
         * @async
         * @param {*} stack
         * @param {*} promise
         * @returns {Promise}
         */
        static async pushPromise(stack, promise) {
          assert.argumentIsRequired(stack, "stack", _DisposableStack, "DisposableStack");
          assert.argumentIsRequired(promise, "promise");
          const b = await promise;
          let bindings;
          if (is.array(b)) {
            bindings = b;
          } else {
            bindings = [b];
          }
          bindings.forEach((binding) => stack.push(binding));
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/messaging/Event.js
  var require_Event = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/messaging/Event.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Event_exports = {};
      __export(Event_exports, {
        default: () => Event
      });
      module.exports = __toCommonJS(Event_exports);
      var assert = __toESM(require_assert());
      var import_Disposable = __toESM(require_Disposable());
      var Event = class extends import_Disposable.default {
        #sender;
        #observers;
        /**
         * @param {*} sender - The object which owns the event.
         */
        constructor(sender) {
          super();
          this.#sender = sender || null;
          this.#observers = [];
        }
        /**
         * Registers an event handler which will receive a notification when
         * {@link Event#fire} is called.
         *
         * @public
         * @param {Function} handler - The function which will be called each time the event fires. The first argument will be the event data. The second argument will be the event owner (i.e. sender).
         * @returns {Disposable}
         */
        register(handler) {
          assert.argumentIsRequired(handler, "handler", Function);
          this.#addRegistration(handler);
          return import_Disposable.default.fromAction(() => {
            if (this.disposed) {
              return;
            }
            this.#removeRegistration(handler);
          });
        }
        /**
         * Removes registration for an event handler. That is, the handler will
         * no longer be called if the event fires.
         *
         * @public
         * @param {Function} handler
         */
        unregister(handler) {
          assert.argumentIsRequired(handler, "handler", Function);
          this.#removeRegistration(handler);
        }
        /**
         * Removes all handlers from the event.
         *
         * @public
         */
        clear() {
          this.#observers = [];
        }
        /**
         * Triggers the event, calling all previously registered handlers.
         *
         * @public
         * @param {*} data - The data to pass each handler.
         */
        fire(data) {
          let observers = this.#observers;
          for (let i = 0; i < observers.length; i++) {
            let observer = observers[i];
            observer(data, this.#sender);
          }
        }
        /**
         * Returns true if no handlers are currently registered.
         *
         * @public
         * @returns {boolean}
         */
        getIsEmpty() {
          return this.#observers.length === 0;
        }
        /**
         * @protected
         * @override
         */
        _onDispose() {
          this.#observers = null;
        }
        #addRegistration(handler) {
          let copiedObservers = this.#observers.slice();
          copiedObservers.push(handler);
          this.#observers = copiedObservers;
        }
        #removeRegistration(handler) {
          const indicesToRemove = [];
          for (let i = 0; i < this.#observers.length; i++) {
            let candidate = this.#observers[i];
            if (candidate === handler) {
              indicesToRemove.push(i);
            }
          }
          if (indicesToRemove.length > 0) {
            const copiedObservers = this.#observers.slice();
            for (let j = indicesToRemove.length - 1; !(j < 0); j--) {
              copiedObservers.splice(indicesToRemove[j], 1);
            }
            this.#observers = copiedObservers;
          }
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Event]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/Tree.js
  var require_Tree = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/Tree.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Tree_exports = {};
      __export(Tree_exports, {
        default: () => Tree
      });
      module.exports = __toCommonJS(Tree_exports);
      var is = __toESM(require_is());
      var Tree = class _Tree {
        /**
         * @param {*} value - The value of the node.
         * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
         */
        constructor(value, parent) {
          this._value = value;
          this._parent = parent || null;
          this._children = [];
        }
        /**
         * Gets the root node.
         *
         * @public
         * @returns {Tree}
         */
        getRoot() {
          if (this.getIsRoot()) {
            return this;
          } else {
            return this._parent.getRoot();
          }
        }
        /**
         * Returns the parent node. If this is the root node, a null value is returned.
         *
         * @public
         * @returns {Tree|null}
         */
        getParent() {
          return this._parent;
        }
        /**
         * Returns the collection of children nodes.
         *
         * @public
         * @returns {Array<Tree>}
         */
        getChildren() {
          return this._children;
        }
        /**
         * Returns the value associated with the current node.
         *
         * @public
         * @returns {*}
         */
        getValue() {
          return this._value;
        }
        /**
         * Returns true if this node has no children; otherwise false.
         *
         * @public
         * @returns {boolean}
         */
        getIsLeaf() {
          return this._children.length === 0;
        }
        /**
         * Returns true if this node has children; otherwise false.
         *
         * @public
         * @returns {boolean}
         */
        getIsInner() {
          return this._children.length !== 0;
        }
        /**
         * Returns true if this node has no parent; otherwise false.
         *
         * @public
         * @returns {boolean}
         */
        getIsRoot() {
          return this._parent === null;
        }
        /**
         * Adds a child node to the current node and returns a reference
         * to the child node.
         *
         * @public
         * @param {*} value - The value of the child.
         * @returns {Tree}
         */
        addChild(value) {
          const returnRef = new _Tree(value, this);
          this._children.push(returnRef);
          return returnRef;
        }
        /**
         * Removes a child node.
         *
         * @public
         * @param {Tree} node - The child to remove.
         */
        removeChild(node) {
          for (let i = this._children.length - 1; !(i < 0); i--) {
            const child = this._children[i];
            if (child === node) {
              this._children.splice(i, 1);
              child._parent = null;
              child._children = [];
              break;
            }
          }
        }
        /**
         * Removes the current node from the parent tree. Use on a root node
         * has no effect.
         *
         * @public
         */
        sever() {
          if (this.getIsRoot()) {
            return;
          }
          this.getParent().removeChild(this);
        }
        /**
         * Searches the children nodes for the first child node that matches the
         * predicate.
         *
         * @public
         * @param {nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
         * @returns {Tree|null}
         */
        findChild(predicate) {
          let returnRef = null;
          for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (predicate(child.getValue(), child)) {
              returnRef = child;
              break;
            }
          }
          return returnRef;
        }
        /**
         * Searches the tree recursively, starting with the current node.
         *
         * @public
         * @param {nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
         * @param {boolean=} parentFirst - If true, the tree will be searched from parent-to-child (breadth first). Otherwise, child-to-parent (depth first).
         * @param {boolean=} includeCurrentNode - True, if the current node should be checked against the predicate.
         * @returns {Tree|null}
         */
        search(predicate, parentFirst, includeCurrentNode) {
          let returnRef = null;
          if (parentFirst && includeCurrentNode && predicate(this.getValue(), this)) {
            returnRef = this;
          }
          if (returnRef === null) {
            for (let i = 0; i < this._children.length; i++) {
              const child = this._children[i];
              returnRef = child.search(predicate, parentFirst, true);
              if (returnRef !== null) {
                break;
              }
            }
          }
          if (returnRef === null && !parentFirst && includeCurrentNode && predicate(this.getValue(), this)) {
            returnRef = this;
          }
          return returnRef;
        }
        /**
         * Walks the children of the current node, running an action on each node.
         *
         * @public
         * @param {nodeAction} walkAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
         * @param {boolean=} parentFirst - If true, the tree will be searched from parent-to-child (breadth first). Otherwise, child-to-parent (depth first).
         * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
         */
        walk(walkAction, parentFirst, includeCurrentNode) {
          const predicate = (value, node) => {
            walkAction(value, node);
            return false;
          };
          this.search(predicate, parentFirst, includeCurrentNode);
        }
        /**
         * Returns the count of all descendant nodes by walking the tree. Consequently, this
         * function is not efficient.
         *
         * @public
         * @returns {number}
         */
        count() {
          let count = 0;
          this.walk(() => count++, true, true);
          return count;
        }
        /**
         * Climbs the parents of the current node -- current node up to the root node, running an action on each node.
         *
         * @public
         * @param {nodeAction} climbAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
         * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
         */
        climb(climbAction, includeCurrentNode) {
          if (includeCurrentNode) {
            climbAction(this.getValue(), this);
          }
          if (this._parent !== null) {
            this._parent.climb(climbAction, true);
          }
        }
        /**
         * Climbs the tree, evaluating each parent until a predicate is matched. Once matched,
         * the {@link Tree} node is returned. Otherwise, if the predicate cannot be matched,
         * a null value is returned.
         *
         * @public
         * @param {nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
         * @param {boolean=} includeCurrentNode - If true, the predicate will be applied to the current node.
         * @returns {Tree|null}
         */
        findParent(predicate, includeCurrentNode) {
          let returnRef;
          if (is.boolean(includeCurrentNode) && includeCurrentNode && predicate(this.getValue(), this)) {
            returnRef = this;
          } else if (this._parent !== null) {
            returnRef = this._parent.findParent(predicate, true);
          } else {
            returnRef = null;
          }
          return returnRef;
        }
        /**
         * Creates a representation of the tree using JavaScript objects and arrays.
         *
         * @public
         * @param {Function=} valueConverter - An optional function for converting the value of each node.
         * @param {boolean=} omitEmptyChildren - If true, empty children arrays will be excluded from output.
         * @returns {object}
         */
        toJSObj(valueConverter, omitEmptyChildren) {
          let valueConverterToUse;
          if (is.fn(valueConverter)) {
            valueConverterToUse = valueConverter;
          } else {
            valueConverterToUse = (x) => x;
          }
          const converted = {
            value: valueConverterToUse(this._value)
          };
          if (!(is.boolean(omitEmptyChildren) && omitEmptyChildren && this._children.length === 0)) {
            converted.children = this._children.map((child) => child.toJSObj(valueConverter, omitEmptyChildren));
          }
          return converted;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Tree]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // lib/processing/binding/BindingTree.js
  var require_BindingTree = __commonJS({
    "lib/processing/binding/BindingTree.js"(exports, module) {
      var Tree = require_Tree();
      module.exports = (() => {
        "use strict";
        class BindingTree2 extends Tree {
          constructor(value, parent) {
            super(value, parent);
            this._children2 = [];
          }
          /**
           * Returns the collection of children values.
           *
           * @public
           * @returns {Array<*>}
           */
          getChildren2() {
            return this._children2;
          }
          addChild(value) {
            const returnRef = new BindingTree2(value, this);
            this._children.push(returnRef);
            this._children2.push(value.binding);
            return returnRef;
          }
          /**
           * Removes a child node.
           *
           * @public
           * @param {Tree} node - The child to remove.
           */
          removeChild(node) {
            for (let i = this._children.length - 1; !(i < 0); i--) {
              const child = this._children[i];
              if (child === node) {
                this._children.splice(i, 1);
                this._children2.splice(i, 1);
                child._parent = null;
                child._children.splice(0, child._children.length);
                child._children2.splice(0, child._children2.length);
                break;
              }
            }
          }
          toString() {
            return "[BindingTree]";
          }
        }
        return BindingTree2;
      })();
    }
  });

  // lib/processing/definitions/PositionLevelType.js
  var require_PositionLevelType = __commonJS({
    "lib/processing/definitions/PositionLevelType.js"(exports, module) {
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class PositionLevelType5 extends Enum {
          constructor(code) {
            super(code, code);
          }
          /**
           * A level of grouping for positions which share the same instrument.
           *
           * @public
           * @static
           * @returns {PositionLevelType}
           */
          static get INSTRUMENT() {
            return instrument;
          }
          /**
           * A level of grouping that represents an entire portfolio's contents.
           *
           * @public
           * @static
           * @returns {PositionLevelType}
           */
          static get PORTFOLIO() {
            return portfolio;
          }
          /**
           * A level of grouping that represents a single positions (i.e. guaranteed to
           * be a leaf node in a grouping tree).
           *
           * @public
           * @static
           * @return {PositionLevelType}
           */
          static get POSITION() {
            return position;
          }
          /**
           * A level of grouping that doesn't fit into any other explicitly defined
           * category. This could be an intermediate level of grouping (e.g. an asset
           * class within a portfolio).
           *
           * @public
           * @static
           * @return {PositionLevelType}
           */
          static get OTHER() {
            return other;
          }
        }
        const instrument = new PositionLevelType5("INSTRUMENT");
        const portfolio = new PositionLevelType5("PORTFOLIO");
        const position = new PositionLevelType5("POSITION");
        const other = new PositionLevelType5("OTHER");
        return PositionLevelType5;
      })();
    }
  });

  // lib/processing/definitions/PositionLevelDefinition.js
  var require_PositionLevelDefinition = __commonJS({
    "lib/processing/definitions/PositionLevelDefinition.js"(exports, module) {
      var assert = require_assert();
      var Currency5 = require_Currency();
      var is = require_is();
      var InstrumentType4 = require_InstrumentType();
      var PositionLevelType5 = require_PositionLevelType();
      module.exports = (() => {
        "use strict";
        class PositionLevelDefinition5 {
          constructor(name, type, keySelector, descriptionSelector, currencySelector, requiredGroups, requiredGroupGenerator) {
            assert.argumentIsRequired(name, "name", String);
            assert.argumentIsRequired(type, "type", PositionLevelType5, "PositionLevelType");
            assert.argumentIsRequired(keySelector, "keySelector", Function);
            assert.argumentIsRequired(descriptionSelector, "descriptionSelector", Function);
            assert.argumentIsRequired(currencySelector, "currencySelector", Function);
            if (requiredGroups) {
              assert.argumentIsArray(requiredGroups, "requiredGroups", validateRequiredGroup, "RequiredGroup");
            }
            assert.argumentIsOptional(requiredGroupGenerator, "requiredGroupGenerator", Function);
            this._name = name;
            this._type = type;
            this._keySelector = keySelector;
            this._descriptionSelector = descriptionSelector;
            this._currencySelector = currencySelector;
            this._requiredGroups = requiredGroups || [];
            this._single = type === PositionLevelType5.POSITION;
            this._homogeneous = type === PositionLevelType5.INSTRUMENT;
            this._requiredGroupGenerator = requiredGroupGenerator || ((input) => null);
          }
          /**
           * The name of the grouping level.
           *
           * @public
           * @returns {String}
           */
          get name() {
            return this._name;
          }
          /**
           * A general description of the type of items grouped together.
           *
           * @public
           * @returns {PositionLevelType}
           */
          get type() {
            return this._type;
          }
          /**
           * A function, when given a {@link PositionItem}, returns a string that is used
           * to group {@link PositionItem} instances into different groups.
           *
           * @public
           * @returns {PositionLevelDefinition~keySelector}
           */
          get keySelector() {
            return this._keySelector;
          }
          /**
           * A function, when given a {@link PositionItem}, returns a string used to describe the
           * group.
           *
           * @public
           * @returns {PositionLevelDefinition~descriptionSelector}
           */
          get descriptionSelector() {
            return this._descriptionSelector;
          }
          /**
           * A function, when given a {@link PositionItem}, returns the {@link Currency} used to
           * display values for the group.
           *
           * @public
           * @returns {PositionLevelDefinition~currencySelector}
           */
          get currencySelector() {
            return this._currencySelector;
          }
          /**
           * Indicates the required groups. This allows for the creation of empty
           * groups.
           *
           * @public
           * @returns {PositionLevelDefinition~RequiredGroup[]}
           */
          get requiredGroups() {
            return this._requiredGroups;
          }
          /**
           * Indicates if the grouping level is meant to only contain a single item.
           *
           * @public
           * @returns {Boolean}
           */
          get single() {
            return this._single;
          }
          /**
           * Indicates if the grouping level only contains items for the same instrument.
           *
           * @public
           * @return {Boolean}
           */
          get homogeneous() {
            return this._homogeneous;
          }
          /**
           * Given an input, potentially creates a new {@link PositionLevelDefinition~RequiredGroup}.
           *
           * @public
           * @param {*} input
           * @returns {PositionLevelDefinition~RequiredGroup|null}
           */
          generateRequiredGroup(input) {
            const requiredGroup = this._requiredGroupGenerator(input);
            if (requiredGroup !== null) {
              validateRequiredGroup(requiredGroup, "requiredGroup");
              this._requiredGroups.push(requiredGroup);
            }
            return requiredGroup;
          }
          /**
           * Builds a {@link PositionLevelDefinition~RequiredGroup} for a portfolio.
           *
           * @public
           * @static
           * @param {Object} portfolio
           * @param {Currency=} currency
           * @returns {PositionLevelDefinition~RequiredGroup}
           */
          static buildRequiredGroupForPortfolio(portfolio, currency) {
            assert.argumentIsOptional(currency, "currency", Currency5, "Currency");
            return {
              key: PositionLevelDefinition5.getKeyForPortfolioGroup(portfolio),
              description: PositionLevelDefinition5.getDescriptionForPortfolioGroup(portfolio),
              currency: currency || Currency5.CAD
            };
          }
          /**
           * Generates the key for a {@link PositionGroup}, representing a portfolio, held
           * within a {@link PositionContainer}.
           *
           * @public
           * @static
           * @param {Object} portfolio
           * @returns {String}
           */
          static getKeyForPortfolioGroup(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", Object);
            return portfolio.portfolio;
          }
          static getDescriptionForPortfolioGroup(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", Object);
            return portfolio.name;
          }
          static getRequiredGroupGeneratorForPortfolio(currency) {
            return (portfolio) => {
              let requiredGroup;
              if (is.object(portfolio) && is.string(portfolio.portfolio) && is.string(portfolio.name)) {
                requiredGroup = PositionLevelDefinition5.buildRequiredGroupForPortfolio(portfolio, currency);
              } else {
                requiredGroup = null;
              }
              return requiredGroup;
            };
          }
          /**
           * Builds a {@link PositionLevelDefinition~RequiredGroup} for an asset class.
           *
           * @public
           * @static
           * @param {InstrumentType} type
           * @param {Currency} currency
           * @param {Currency=} defaultCurrency
           * @returns {PositionLevelDefinition~RequiredGroup}
           */
          static buildRequiredGroupForAssetClass(type, currency, defaultCurrency) {
            return {
              key: PositionLevelDefinition5.getKeyForAssetClassGroup(type, currency),
              description: PositionLevelDefinition5.getDescriptionForAssetClassGroup(type, currency, defaultCurrency),
              currency
            };
          }
          /**
           * Generates the key for a {@link PositionGroup}, representing a grouping of positions
           * by asset class, held within a {@link PositionContainer}.
           *
           * @public
           * @static
           * @param {InstrumentType} type
           * @param {Currency} currency
           * @returns {String}
           */
          static getKeyForAssetClassGroup(type, currency) {
            assert.argumentIsRequired(type, "type", InstrumentType4, "InstrumentType");
            assert.argumentIsRequired(currency, "currency", Currency5, "Currency");
            return `${type.code}|${currency.code}`;
          }
          static getDescriptionForAssetClassGroup(type, currency, defaultCurrency) {
            assert.argumentIsRequired(type, "type", InstrumentType4, "InstrumentType");
            assert.argumentIsRequired(currency, "currency", Currency5, "Currency");
            assert.argumentIsOptional(defaultCurrency, "defaultCurrency", Currency5, "Currency");
            return `${type.alternateDescription}${currency === (defaultCurrency || Currency5.CAD) ? "" : ` (${currency.alternateDescription})`}`;
          }
          toString() {
            return "[PositionLevelDefinition]";
          }
        }
        function validateRequiredGroup(requiredGroup, variableName) {
          assert.argumentIsRequired(requiredGroup, variableName, Object);
          assert.argumentIsRequired(requiredGroup.key, `${variableName}.key`, String);
          assert.argumentIsRequired(requiredGroup.description, `${variableName}.description`, String);
          assert.argumentIsRequired(requiredGroup.currency, `${variableName}.currency`, Currency5, "Currency");
        }
        return PositionLevelDefinition5;
      })();
    }
  });

  // lib/processing/definitions/PositionTreeDefinition.js
  var require_PositionTreeDefinition = __commonJS({
    "lib/processing/definitions/PositionTreeDefinition.js"(exports, module) {
      var assert = require_assert();
      var PositionLevelDefinition5 = require_PositionLevelDefinition();
      module.exports = (() => {
        "use strict";
        class PositionTreeDefinitions {
          constructor(name, definitions, exclusionDependencies) {
            assert.argumentIsRequired(name, "name", String);
            assert.argumentIsArray(definitions, "definitions", PositionLevelDefinition5, "PositionLevelDefinition");
            if (exclusionDependencies) {
              assert.argumentIsArray(exclusionDependencies, "exclusionDependencies", String);
            }
            this._name = name;
            this._definitions = definitions;
            this._exclusionDependencies = exclusionDependencies || [];
          }
          /**
           * The name of the tree.
           *
           * @public
           * @returns {String}
           */
          get name() {
            return this._name;
          }
          /**
           * An ordered list of {@link PositionLevelDefinitions} that describes the
           * levels of the tree. The first item represents the top-most level of the
           * tree (i.e. the children of the root node) and the last item represents the
           * bottom-most level of the tree (i.e. leaf nodes).
           *
           * @public
           * @returns {PositionLevelDefinitions[]}
           */
          get definitions() {
            return this._definitions;
          }
          /**
           * Returns the names of other trees which should be impacted when a
           * group (from the current tree) is excluded.
           *
           * @public
           * @returns {String[]}
           */
          get exclusionDependencies() {
            return this._exclusionDependencies;
          }
          toString() {
            return "[PositionTreeDefinitions]";
          }
        }
        return PositionTreeDefinitions;
      })();
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/formatter.js
  var require_formatter = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/formatter.js"(exports, module) {
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var formatter_exports = {};
      __export(formatter_exports, {
        numberToString: () => numberToString
      });
      module.exports = __toCommonJS(formatter_exports);
      function numberToString(value, digits, thousandsSeparator, useParenthesis) {
        if (value === void 0 || value === null || Number.isNaN(value)) {
          return "";
        }
        const applyParenthesis = value < 0 && useParenthesis === true;
        if (applyParenthesis) {
          value = 0 - value;
        }
        let returnRef = value.toFixed(digits);
        if (thousandsSeparator && !(value > -1e3 && value < 1e3)) {
          const length = returnRef.length;
          const negative = value < 0;
          let found = digits === 0;
          let counter = 0;
          const buffer = [];
          for (let i = length - 1; !(i < 0); i--) {
            if (counter === 3 && !(negative && i === 0)) {
              buffer.unshift(thousandsSeparator);
              counter = 0;
            }
            const character = returnRef.charAt(i);
            buffer.unshift(character);
            if (found) {
              counter = counter + 1;
            } else if (character === ".") {
              found = true;
            }
          }
          if (applyParenthesis) {
            buffer.unshift("(");
            buffer.push(")");
          }
          returnRef = buffer.join("");
        } else if (applyParenthesis) {
          returnRef = "(" + returnRef + ")";
        }
        return returnRef;
      }
    }
  });

  // node_modules/@barchart/marketdata-api-js/lib/utilities/format/fraction.js
  var require_fraction = __commonJS({
    "node_modules/@barchart/marketdata-api-js/lib/utilities/format/fraction.js"(exports, module) {
      var is = require_is();
      module.exports = (() => {
        "use strict";
        function getIntegerPart(value, fractionSeparator) {
          const floor = Math.floor(value);
          if (floor === 0 && fractionSeparator === "") {
            return "";
          } else {
            return floor;
          }
        }
        function getDecimalPart(absoluteValue) {
          return absoluteValue - Math.floor(absoluteValue);
        }
        function frontPad(value, digits) {
          return ["000", Math.floor(value)].join("").substr(-1 * digits);
        }
        function formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis) {
          if (!is.number(value)) {
            return "";
          }
          if (!is.number(fractionFactor)) {
            return "";
          }
          if (!is.number(fractionDigits)) {
            return "";
          }
          if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
            fractionSeparator = ".";
          }
          const absoluteValue = Math.abs(value);
          const integerPart = getIntegerPart(absoluteValue, fractionSeparator);
          const decimalPart = getDecimalPart(absoluteValue);
          const denominator = fractionFactor;
          const numerator = decimalPart * denominator;
          const roundedNumerator = Math.floor(parseFloat(numerator.toFixed(1)));
          const formattedNumerator = frontPad(roundedNumerator, fractionDigits);
          let prefix;
          let suffix;
          if (value < 0) {
            useParenthesis = is.boolean(useParenthesis) && useParenthesis;
            if (useParenthesis) {
              prefix = "(";
              suffix = ")";
            } else {
              prefix = "-";
              suffix = "";
            }
          } else {
            prefix = "";
            suffix = "";
          }
          return [prefix, integerPart, fractionSeparator, formattedNumerator, suffix].join("");
        }
        return formatFraction;
      })();
    }
  });

  // lib/data/FilterMode.js
  var require_FilterMode = __commonJS({
    "lib/data/FilterMode.js"(exports, module) {
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class FilterMode2 extends Enum {
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
            return Enum.fromCode(FilterMode2, code);
          }
          toString() {
            return `[FilterMode (code=${this.code})]`;
          }
        }
        const open = new FilterMode2("OPEN", "Open only");
        const closed = new FilterMode2("CLOSED", "Closed only");
        const all = new FilterMode2("ALL", "Open and Closed");
        return FilterMode2;
      })();
    }
  });

  // lib/processing/binding/PositionGroupBinding.js
  var require_PositionGroupBinding = __commonJS({
    "lib/processing/binding/PositionGroupBinding.js"(exports, module) {
      module.exports = (() => {
        "use strict";
        class PositionGroupBinding {
          constructor(formatted, actions) {
            this.formatted = formatted;
            this._actions = actions || {};
          }
          /**
           * Returns formatted data.
           *
           * @public
           * @returns {Object}
           */
          get data() {
            return this.formatted;
          }
          /**
           * Returns the binding identifier.
           *
           * @public
           * @returns {Number}
           */
          get id() {
            return this.formatted.id;
          }
          /**
           * Returns the binding key.
           *
           * @public
           * @returns {String}
           */
          get key() {
            return this.formatted.key;
          }
          /**
           * Returns the binding description.
           *
           * @public
           * @returns {String}
           */
          get description() {
            return this.formatted.description;
          }
          /**
           * Set a flag to indicate if parent groups should exclude this group's
           * items from their calculations.
           *
           * @public
           * @param {Boolean} value
           */
          setExcluded(value) {
            return this._actions.setExcluded(value);
          }
          /**
           * Sets the filter mode for the group.
           *
           * @public
           * @param {FilterMode} mode
           */
          setFilterMode(mode) {
            return this._actions.setFilterMode(mode);
          }
          /**
           * Changes the group currency.
           *
           * @public
           * @param {Currency} currency
           */
          changeCurrency(currency) {
            return this._actions.changeCurrency(currency);
          }
          /**
           * Returns a string representation of the binding.
           *
           * @public
           * @returns {String}
           */
          toString() {
            return "[PositionGroupBinding]";
          }
        }
        return PositionGroupBinding;
      })();
    }
  });

  // lib/processing/PositionGroup.js
  var require_PositionGroup = __commonJS({
    "lib/processing/PositionGroup.js"(exports, module) {
      var array = require_array();
      var assert = require_assert();
      var Currency5 = require_Currency();
      var CurrencyTranslator2 = require_CurrencyTranslator();
      var Decimal6 = require_Decimal();
      var Disposable = require_Disposable();
      var Event = require_Event();
      var formatter = require_formatter();
      var is = require_is();
      var fractionFormatter = require_fraction();
      var InstrumentType4 = require_InstrumentType();
      var FilterMode2 = require_FilterMode();
      var PositionLevelDefinition5 = require_PositionLevelDefinition();
      var PositionLevelType5 = require_PositionLevelType();
      var PositionGroupBinding = require_PositionGroupBinding();
      module.exports = (() => {
        "use strict";
        let counter = 0;
        const DIRECTION_DOWN = "down";
        const DIRECTION_UNCHANGED = "unchanged";
        const DIRECTION_UP = "up";
        const FUNDAMENTAL_FIELDS = ["percentChange1m", "percentChange1y", "percentChange3m", "percentChangeYtd"];
        class PositionGroup2 {
          constructor(definition, items, currency, currencyTranslator, key, description, calculationsSuspended) {
            this._id = counter++;
            this._definition = definition;
            this._items = items;
            this._parentGroup = null;
            this._portfolioGroup = null;
            this._currency = currency || Currency5.CAD;
            this._currencyTranslator = currencyTranslator;
            this._bypassCurrencyTranslation = false;
            this._useBarchartPriceFormattingRules = false;
            this._key = key;
            this._description = description;
            this._single = this._definition.single;
            this._homogeneous = this._definition.homogeneous;
            this._calculationsSuspended = calculationsSuspended;
            this._excluded = false;
            this._showClosedPositions = false;
            this._showOpenedPositions = false;
            this._groupExcludedChangeEvent = new Event(this);
            this._showClosedPositionsChangeEvent = new Event(this);
            this._showOpenedPositionsChangeEvent = new Event(this);
            this._filterMode = FilterMode2.OPEN;
            this._excludedItems = [];
            this._excludedItemMap = {};
            this._consideredItems = this._items.slice(0);
            this._dataFormat = {};
            this._dataActual = {};
            this._dataFormat.key = this._key;
            this._dataFormat.id = this._id;
            this._dataFormat.description = this._description;
            this._dataFormat.levelTypeCode = this._definition.type.code;
            this._dataFormat.single = this._single;
            this._dataFormat.homogeneous = this._homogeneous;
            this._dataFormat.currencyCode = this._currency.code;
            this._dataFormat.filterModeCode = this._filterMode.code;
            this._dataFormat.open = false;
            this._dataFormat.linked = false;
            this._dataFormat.hasLinked = false;
            this._dataFormat.hasManual = false;
            this._dataFormat.positions = [];
            this._dataFormat.excluded = this._excluded;
            this._dataFormat.hide = false;
            this._dataFormat.invalid = false;
            this._dataFormat.locked = false;
            this._dataFormat.calculating = false;
            this._dataFormat.expired = false;
            this._dataFormat.empty = this._items.length === 0;
            this._dataFormat.newsExists = false;
            this._dataFormat.quantity = null;
            this._dataFormat.quantityZero = true;
            this._dataFormat.quantityPrevious = null;
            this._dataFormat.basisPrice = null;
            this._dataFormat.unrealizedPrice = null;
            this._dataFormat.unrealizedPricePositive = false;
            this._dataFormat.unrealizedPriceNegative = false;
            this._dataFormat.instrument = null;
            this._dataFormat.fundamental = {};
            this._dataActual.key = this._key;
            this._dataActual.description = this._description;
            this._dataActual.newsExists = false;
            this._dataActual.quantity = null;
            this._dataActual.quantityPrevious = null;
            this._dataActual.basisPrice = null;
            this._dataActual.unrealizedPrice = null;
            if (this._single && items.length === 1) {
              const item = items[0];
              this._dataFormat.portfolio = item.portfolio.portfolio;
              this._dataFormat.position = item.position.position;
              this._dataFormat.instrument = item.position.instrument;
              this._dataFormat.fundamental = item.data.fundamental || {};
            } else {
              this._dataFormat.portfolio = null;
              this._dataFormat.position = null;
            }
            if (this._homogeneous && items.length !== 0) {
              const item = items[0];
              this._dataFormat.instrument = item.position.instrument;
              this._dataFormat.fundamental = item.data.fundamental || {};
            }
            this._dataActual.quoteLast = null;
            this._dataActual.quoteOpen = null;
            this._dataActual.quoteHigh = null;
            this._dataActual.quoteLow = null;
            this._dataActual.quoteChange = null;
            this._dataActual.quoteChangePercent = null;
            this._dataActual.quoteTime = null;
            this._dataActual.quoteVolume = null;
            this._dataFormat.quoteLast = null;
            this._dataFormat.quoteOpen = null;
            this._dataFormat.quoteHigh = null;
            this._dataFormat.quoteLow = null;
            this._dataFormat.quoteChange = null;
            this._dataFormat.quoteChangePercent = null;
            this._dataFormat.quoteTime = null;
            this._dataFormat.quoteVolume = null;
            this._dataFormat.quoteChangeDirection = DIRECTION_UNCHANGED;
            this._dataFormat.quoteChangePositive = false;
            this._dataFormat.quoteChangeNegative = false;
            this._dataActual.currentPrice = null;
            this._dataActual.basis = null;
            this._dataActual.basis2 = null;
            this._dataActual.realized = null;
            this._dataActual.realizedToday = null;
            this._dataActual.income = null;
            this._dataActual.market = null;
            this._dataActual.market2 = null;
            this._dataActual.marketPercent = null;
            this._dataActual.marketPercentPortfolio = null;
            this._dataActual.unrealized = null;
            this._dataActual.unrealizedToday = null;
            this._dataActual.gainToday = null;
            this._dataActual.total = null;
            this._dataActual.summaryTotalCurrent = null;
            this._dataActual.summaryTotalPrevious = null;
            this._dataActual.summaryTotalPrevious2 = null;
            this._dataActual.marketPrevious = null;
            this._dataActual.marketPrevious2 = null;
            this._dataActual.marketChange = null;
            this._dataActual.marketChangePercent = null;
            this._dataActual.cashTotal = null;
            this._dataActual.totalDivisor = null;
            this._dataActual.periodDivisorCurrent = null;
            this._dataActual.periodDivisorPrevious = null;
            this._dataActual.periodDivisorPrevious2 = null;
            this._dataFormat.currentPrice = null;
            this._dataFormat.basis = null;
            this._dataFormat.basis2 = null;
            this._dataFormat.realized = null;
            this._dataFormat.realizedPercent = null;
            this._dataFormat.realizedPositive = false;
            this._dataFormat.realizedNegative = false;
            this._dataFormat.realizedToday = null;
            this._dataFormat.realizedTodayPositive = false;
            this._dataFormat.realizedTodayNegative = false;
            this._dataFormat.income = null;
            this._dataFormat.market = null;
            this._dataFormat.market2 = null;
            this._dataFormat.marketPercent = null;
            this._dataFormat.marketPercentPortfolio = null;
            this._dataFormat.marketDirection = DIRECTION_UNCHANGED;
            this._dataFormat.unrealized = null;
            this._dataFormat.unrealizedPercent = null;
            this._dataFormat.unrealizedPositive = false;
            this._dataFormat.unrealizedNegative = false;
            this._dataFormat.unrealizedToday = null;
            this._dataFormat.unrealizedTodayPositive = false;
            this._dataFormat.unrealizedTodayNegative = false;
            this._dataFormat.gainToday = null;
            this._dataFormat.gainTodayPositive = false;
            this._dataFormat.gainTodayNegative = false;
            this._dataFormat.total = null;
            this._dataFormat.totalPositive = false;
            this._dataFormat.totalNegative = false;
            this._dataFormat.summaryTotalCurrent = null;
            this._dataFormat.summaryTotalCurrentPositive = false;
            this._dataFormat.summaryTotalCurrentNegative = false;
            this._dataFormat.summaryTotalPrevious = null;
            this._dataFormat.summaryTotalPreviousPositive = false;
            this._dataFormat.summaryTotalPreviousNegative = false;
            this._dataFormat.summaryTotalPrevious2 = null;
            this._dataFormat.summaryTotalPrevious2Positive = false;
            this._dataFormat.summaryTotalPrevious2Negative = false;
            this._dataFormat.marketPrevious = null;
            this._dataFormat.marketPrevious2 = null;
            this._dataFormat.marketChange = null;
            this._dataFormat.marketChangePercent = null;
            this._dataFormat.cashTotal = null;
            this._dataFormat.portfolioType = null;
            this._dataActual.periodPrice = null;
            this._dataActual.periodPricePrevious = null;
            this._dataFormat.periodPrice = null;
            this._dataFormat.periodPricePrevious = null;
            this._dataActual.periodIncome = null;
            this._dataActual.periodRealized = null;
            this._dataActual.periodUnrealized = null;
            this._dataFormat.periodIncome = null;
            this._dataFormat.periodRealized = null;
            this._dataFormat.periodUnrealized = null;
            this._dataActual.totalPercent = null;
            this._dataActual.periodPercent = null;
            this._dataActual.periodPercentPrevious = null;
            this._dataActual.periodPercentPrevious2 = null;
            this._dataFormat.totalPercent = null;
            this._dataFormat.periodPercent = null;
            this._dataFormat.periodPercentPrevious = null;
            this._dataFormat.periodPercentPrevious2 = null;
            this._dataActual.todayQuote = null;
            this._dataActual.todayExchange = null;
            this._dataFormat.todayQuote = null;
            this._dataFormat.todayExchange = null;
            this._dataActual.todayPrice = null;
            this._dataActual.todayPricePrevious = null;
            this._dataFormat.todayPrice = null;
            this._dataFormat.todayPricePrevious = null;
            this._binding = new PositionGroupBinding(this._dataFormat, {
              changeCurrency: (currency2) => this.changeCurrency(currency2),
              setExcluded: (value) => this.setExcluded(value),
              setFilterMode: (mode) => this.setFilterMode(mode)
            });
            this._items.forEach((item) => {
              bindItem.call(this, item);
            });
            this.refresh();
          }
          /**
           * A unique (and otherwise meaningless) identifier for the group.
           *
           * @public
           * @returns {Number}
           */
          get id() {
            return this._id;
          }
          /**
           * The {@link PositionLevelDefinition} which was used to generate this group.
           *
           * @public
           * @returns {PositionLevelDefinition}
           */
          get definition() {
            return this._definition;
          }
          /**
           * The key of the group.
           *
           * @public
           * @returns {String}
           */
          get key() {
            return this._key;
          }
          /**
           * The description of the group.
           *
           * @public
           * @returns {String}
           */
          get description() {
            return this._description;
          }
          /**
           * The {@link Currency} which all aggregated data is presented in.
           *
           * @public
           * @returns {Currency}
           */
          get currency() {
            return this._currency;
          }
          /**
           * The {@link PositionItem} instances which for which aggregated data is compiled.
           *
           * @public
           * @returns {PositionItem[]}
           */
          get items() {
            return this._items;
          }
          /**
           * The string-based, human-readable aggregated data for the group.
           *
           * @public
           * @returns {Object}
           */
          get data() {
            return this._dataFormat;
          }
          /**
           * The raw aggregated data for the group (typically {@link Decimal} instances).
           *
           * @public
           * @returns {Object}
           */
          get actual() {
            return this._dataActual;
          }
          /**
           * The binding data for the group.
           *
           * @public
           * @returns {PositionGroupBinding}
           */
          get binding() {
            return this._binding;
          }
          /**
           * Indicates if the group will only contain one {@link PositionItem} — that is,
           * indicates if the group represents a single position.
           *
           * @public
           * @returns {Boolean}
           */
          get single() {
            return this._single;
          }
          /**
           * Indicates if the group will only contain {@link PositionItem} instances
           * that share the same instrument.
           *
           * @public
           * @returns {Boolean}
           */
          get homogeneous() {
            return this._homogeneous;
          }
          /**
           * Indicates if the group should be excluded from higher-level aggregations.
           *
           * @public
           * @returns {Boolean}
           */
          get excluded() {
            return this._excluded;
          }
          /**
           * Suspends recalculation of aggregated group data.
           *
           * @public
           */
          suspendCalculations() {
            this._calculationsSuspended = true;
          }
          /**
           * Resumes recalculation of aggregated group data.
           *
           * @public
           */
          resumeCalculations() {
            if (this._calculationsSuspended) {
              this._calculationsSuspended = false;
              this.refresh();
            }
          }
          /**
           * Changes the group currency.
           *
           * @public
           * @param {Currency} currency
           */
          changeCurrency(currency) {
            assert.argumentIsRequired(currency, "currency", Currency5, "Currency");
            if (this._currency !== currency) {
              this._currency = currency;
              this.refresh();
            }
          }
          /**
           * Sets the immediate parent group (allowing for calculation of relative
           * percentages).
           *
           * @public
           * @param {PositionGroup} group
           */
          setParentGroup(group) {
            assert.argumentIsOptional(group, "group", PositionGroup2, "PositionGroup");
            if (this._parentGroup !== null) {
              throw new Error("The parent group has already been set.");
            }
            this._parentGroup = group;
          }
          /**
           * Sets the nearest parent group for a portfolio (allowing for calculation
           * of relative percentages).
           *
           * @public
           * @param {PositionGroup} group
           */
          setPortfolioGroup(group) {
            assert.argumentIsOptional(group, "group", PositionGroup2, "PositionGroup");
            if (this._portfolioGroup !== null) {
              throw new Error("The portfolio group has already been set.");
            }
            this._portfolioGroup = group;
          }
          /**
           * Adds a new {@link PositionItem} to the group.
           *
           * @public
           * @param {PositionItem} item
           */
          addItem(item) {
            this._items.push(item);
            this._consideredItems.push(item);
            this._dataFormat.empty = false;
            bindItem.call(this, item);
            this.refresh();
            if (this._excluded) {
              this.setExcluded(false);
              this.setExcluded(true);
            }
          }
          /**
           * Sets the list of items which are excluded from group aggregation calculations.
           *
           * @public
           * @param {Object[]} items
           */
          setExcludedItems(items) {
            this._excludedItems = items;
            this._consideredItems = array.difference(this._items, this._excludedItems);
            this._excludedItemMap = this._excludedItems.reduce((map, item) => {
              const key = item.position.position;
              map[key] = item;
              return map;
            }, {});
            this.refresh();
          }
          /**
           * Set a flag to indicate if parent groups should exclude this group's
           * items from their calculations.
           *
           * @public
           * @param {Boolean} value
           */
          setExcluded(value) {
            assert.argumentIsRequired(value, "value", Boolean);
            if (this._excluded !== value) {
              this._excluded = value;
              this._dataFormat.excluded = value;
              this._groupExcludedChangeEvent.fire(value);
            }
          }
          setShowClosedPositions(value) {
            assert.argumentIsRequired(value, "value", Boolean);
            if (this._showClosedPositions !== value) {
              this._showClosedPositionsChangeEvent.fire(this._showClosedPositions = value);
            }
          }
          setShowOpenedPositions(value) {
            assert.argumentIsRequired(value, "value", Boolean);
            if (this._showOpenedPositions !== value) {
              this._showOpenedPositionsChangeEvent.fire(this._showOpenedPositions = value);
            }
          }
          setFilterMode(mode) {
            assert.argumentIsRequired(mode, "mode", FilterMode2);
            const showClosed = mode !== FilterMode2.OPEN;
            const showOpen = mode !== FilterMode2.CLOSED;
            this._filterMode = mode;
            this._dataFormat.filterModeCode = mode.code;
            this.setShowClosedPositions(showClosed);
            this.setShowOpenedPositions(showOpen);
          }
          /**
           * Updates the portfolio data. For example, a portfolio's name might change. This
           * function only affects {@link PositionLevelType.PORTFOLIO} groups.
           *
           * @public
           * @param {Object} portfolio
           */
          updatePortfolio(portfolio) {
            if (this._definition.type !== PositionLevelType5.PORTFOLIO || this._key !== PositionLevelDefinition5.getKeyForPortfolioGroup(portfolio) || !this.getIsEmpty()) {
              return;
            }
            this._description = PositionLevelDefinition5.getDescriptionForPortfolioGroup(portfolio);
            this._dataActual.description = this._description;
            this._dataFormat.description = this._description;
            let portfolioType;
            if (portfolio.miscellany && portfolio.miscellany.data.type && portfolio.miscellany.data.type.value) {
              portfolioType = portfolio.miscellany.data.type.value;
            } else {
              portfolioType = null;
            }
            this._dataFormat.portfolioType = formatString(portfolioType);
            this.changeCurrency(this._definition.currencySelector({ portfolio }));
          }
          /**
           * Causes all aggregated data to be recalculated.
           *
           * @public
           */
          refresh() {
            if (this._calculationsSuspended) {
              return;
            }
            calculateStaticData(this, this._definition);
            calculatePriceData(this, null, true);
          }
          /**
           * Causes the percent of the group, with respect to the parent group's
           * total, to be recalculated.
           *
           * @public
           */
          refreshMarketPercent() {
            if (this._calculationsSuspended) {
              return;
            }
            calculateMarketPercent(this, this._parentGroup, this._portfolioGroup);
          }
          /**
           * Causes aggregated data to be recalculated using a new exchange rate.
           *
           * @public
           */
          refreshTranslations() {
            if (this._bypassCurrencyTranslation) {
              return;
            }
            this.refresh();
          }
          /**
           * Indicates if the group contains any items.
           *
           * @public
           * @returns {boolean}
           */
          getIsEmpty() {
            return this._items.length === 0;
          }
          /**
           * Adds an observer for changes to the exclusion of the group
           * from higher level aggregations.
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerGroupExcludedChangeHandler(handler) {
            return this._groupExcludedChangeEvent.register(handler);
          }
          /**
           * Changes rules for price formatting.
           *
           * @public
           * @param {boolean} value
           */
          setBarchartPriceFormattingRules(value) {
            assert.argumentIsRequired(value, "value", Boolean);
            if (this._useBarchartPriceFormattingRules === value) {
              return;
            }
            this._useBarchartPriceFormattingRules = value;
            if ((this._single || this._homogeneous) && this._dataActual.currentPrice) {
              const item = this._items[0];
              const instrument = item.position.instrument;
              const currency = instrument.currency;
              this._dataFormat.currentPrice = formatFraction(this._dataActual.currentPrice, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteLast = formatFraction(this._dataActual.quoteLast, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteOpen = formatFraction(this._dataActual.quoteOpen, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteHigh = formatFraction(this._dataActual.quoteHigh, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteLow = formatFraction(this._dataActual.quoteLow, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteChange = formatFraction(this._dataActual.quoteChange, currency, instrument, this._useBarchartPriceFormattingRules);
            }
          }
          toString() {
            return "[PositionGroup]";
          }
        }
        function bindItem(item) {
          const quoteBinding = item.registerQuoteChangeHandler((quote, sender) => {
            if (this._calculationsSuspended) {
              return;
            }
            if (this._single || this._homogeneous && item === this._items[0]) {
              const instrument = sender.position.instrument;
              const currency = instrument.currency;
              this._dataActual.currentPrice = is.number(quote.lastPrice) ? quote.lastPrice : null;
              this._dataActual.quoteLast = is.number(quote.previousPrice) ? quote.previousPrice : null;
              this._dataActual.quoteOpen = is.number(quote.openPrice) ? quote.openPrice : null;
              this._dataActual.quoteHigh = is.number(quote.highPrice) ? quote.highPrice : null;
              this._dataActual.quoteLow = is.number(quote.lowPrice) ? quote.lowPrice : null;
              this._dataFormat.currentPrice = formatFraction(this._dataActual.currentPrice, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteLast = formatFraction(this._dataActual.quoteLast, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteOpen = formatFraction(this._dataActual.quoteOpen, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteHigh = formatFraction(this._dataActual.quoteHigh, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteLow = formatFraction(this._dataActual.quoteLow, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataActual.quoteChange = is.number(quote.priceChange) ? quote.priceChange : null;
              this._dataActual.quoteChangePercent = is.number(quote.percentChange) ? quote.percentChange : null;
              this._dataFormat.quoteChange = formatFraction(this._dataActual.quoteChange, currency, instrument, this._useBarchartPriceFormattingRules);
              this._dataFormat.quoteChangePercent = formatPercent(new Decimal6(this._dataActual.quoteChangePercent || 0), 2);
              this._dataActual.quoteTime = quote.timeDisplay;
              this._dataActual.quoteVolume = is.number(quote.volume) ? quote.volume : null;
              this._dataFormat.quoteTime = formatString(this._dataActual.quoteTime);
              this._dataFormat.quoteVolume = formatNumber(this._dataActual.quoteVolume, 0);
              const quoteChangePositive = quote.lastPriceDirection === "up";
              const quoteChangeNegative = quote.lastPriceDirection === "down";
              setTimeout(() => this._dataFormat.quoteChangeDirection = formatDirection(quoteChangePositive, quoteChangeNegative), 0);
              this._dataFormat.quoteChangePositive = is.number(this._dataActual.quoteChange) && this._dataActual.quoteChange > 0;
              this._dataFormat.quoteChangeNegative = is.number(this._dataActual.quoteChange) && this._dataActual.quoteChange < 0;
            }
            calculatePriceData(this, sender, false);
          });
          const fundamentalBinding = item.registerFundamentalDataChangeHandler((data) => {
            if (this._single || this._homogeneous) {
              this._dataFormat.fundamental = data;
              return;
            }
            const fundamentalData = this.items.reduce((sums, item2, i) => {
              if (item2.data && item2.data.fundamental && item2.data.fundamental.raw) {
                const fundamental = item2.data.fundamental.raw;
                FUNDAMENTAL_FIELDS.forEach((fieldName) => {
                  const summary = sums[fieldName];
                  const value = fundamental[fieldName];
                  if (is.number(value)) {
                    summary.total = sums[fieldName].total + value;
                    summary.count = sums[fieldName].count + 1;
                  }
                  if (i + 1 === this.items.length) {
                    let averageFormat;
                    if (summary.count > 0) {
                      averageFormat = formatPercent(new Decimal6(summary.total / summary.count), 2, true);
                    } else {
                      averageFormat = "\u2014";
                    }
                    summary.averageFormat = averageFormat;
                  }
                });
              }
              return sums;
            }, FUNDAMENTAL_FIELDS.reduce((sums, fieldName) => {
              sums[fieldName] = { total: 0, count: 0, averageFormat: "\u2014" };
              return sums;
            }, {}));
            this._dataFormat.fundamental = FUNDAMENTAL_FIELDS.reduce((format, fieldName) => {
              format[fieldName] = fundamentalData[fieldName].averageFormat;
              return format;
            }, {});
          });
          let newsBinding = Disposable.getEmpty();
          let lockedBinding = Disposable.getEmpty();
          let calculatingBinding = Disposable.getEmpty();
          if (this._single || this._homogeneous) {
            newsBinding = item.registerNewsExistsChangeHandler((exists) => {
              this._dataActual.newsExists = exists;
              this._dataFormat.newsExists = exists;
            });
          }
          if (this._single) {
            lockedBinding = item.registerLockChangeHandler((locked) => {
              this._dataFormat.locked = locked;
            });
            calculatingBinding = item.registerCalculatingChangeHandler((calculating) => {
              this._dataFormat.calculating = calculating;
            });
          }
          const portfolioChangeBinding = item.registerPortfolioChangeHandler((portfolio) => {
            const descriptionSelector = this._definition.descriptionSelector;
            this._description = descriptionSelector(this._items[0]);
            this._dataActual.description = this._description;
            this._dataFormat.description = this._description;
            if (this._definition.type !== PositionLevelType5.PORTFOLIO || this._key !== PositionLevelDefinition5.getKeyForPortfolioGroup(portfolio)) {
              return;
            }
            const currencySelector = this._definition.currencySelector;
            this.changeCurrency(currencySelector({ portfolio }));
          });
          let disposalBinding = null;
          disposalBinding = item.registerPositionItemDisposeHandler(() => {
            quoteBinding.dispose();
            fundamentalBinding.dispose();
            newsBinding.dispose();
            lockedBinding.dispose();
            calculatingBinding.dispose();
            portfolioChangeBinding.dispose();
            disposalBinding.dispose();
            array.remove(this._items, (i) => i === item);
            array.remove(this._excludedItems, (i) => i === item);
            array.remove(this._consideredItems, (i) => i === item);
            delete this._excludedItemMap[item.position.position];
            this._dataFormat.empty = this._items.length === 0;
            this.refresh();
          });
        }
        function setPositionsFormat(format, items) {
          const includePositions = format.single || format.homogeneous;
          const positions = [];
          let open = false;
          let linked = items.length !== 0;
          let hasLinked = false;
          let hasManual = false;
          items.forEach((item) => {
            const position = item.position;
            const portfolio = item.portfolio;
            const instrument = position.instrument;
            const positionLinked = portfolio ? !!portfolio.snaptrade : false;
            const positionOpen = position.snapshot ? position.snapshot.direction.open : false;
            open = open || positionOpen;
            linked = linked && positionLinked;
            hasLinked = hasLinked || positionLinked;
            hasManual = hasManual || !positionLinked;
            if (!includePositions) {
              return;
            }
            positions.push({
              portfolio: position.portfolio,
              portfolioName: portfolio ? portfolio.name : null,
              position: position.position,
              cash: position.cash,
              linked: positionLinked,
              open: positionOpen,
              quantity: formatDecimal(item.data.quantity, 2),
              instrument
            });
          });
          format.open = open;
          format.linked = linked;
          format.hasLinked = hasLinked;
          format.hasManual = hasManual;
          format.positions = positions;
        }
        function formatDirection(up, down) {
          if (up) {
            return DIRECTION_UP;
          }
          if (down) {
            return DIRECTION_DOWN;
          }
          return DIRECTION_UNCHANGED;
        }
        function formatString(value) {
          if (value === null || value === void 0) {
            return null;
          }
          if (is.string(value)) {
            return value;
          }
          if (is.number(value) || is.boolean(value)) {
            return value.toString();
          }
          return null;
        }
        function formatNumber(number, precision) {
          if (!is.number(number)) {
            return "\u2014";
          }
          return formatter.numberToString(number, precision, ",", false);
        }
        function formatDecimal(decimal, precision) {
          if (decimal === null) {
            return "\u2014";
          }
          return formatNumber(decimal.toFloat(), precision);
        }
        function formatPercent(decimal, precision, plus) {
          if (decimal === null) {
            return "\u2014";
          }
          let prefix;
          if (is.boolean(plus) && plus && !Decimal6.getIsNegative(decimal)) {
            prefix = "+";
          } else {
            prefix = "";
          }
          return `${prefix}${formatDecimal(decimal.multiply(100), precision)}%`;
        }
        function formatFraction(value, currency, instrument, useBarchartPriceFormattingRules) {
          let decimal = value instanceof Decimal6;
          let precision = currency.precision;
          if (instrument && value !== null) {
            const type = instrument.type;
            const code = instrument.code;
            if (code && code.supportsFractions && (type === InstrumentType4.FUTURE || type === InstrumentType4.FUTURE_OPTION)) {
              const rounded = code.roundToNearestTick(decimal ? value.toFloat() : value, instrument.future ? instrument.future.tick : instrument.option.tick, true);
              return fractionFormatter(rounded, code.fractionFactor, code.fractionDigits, "-", true);
            }
            if (code && useBarchartPriceFormattingRules) {
              precision = code.decimalDigits;
            }
          }
          if (decimal) {
            return formatDecimal(value, precision);
          } else {
            return formatNumber(value, precision);
          }
        }
        function formatCurrency(decimal, currency) {
          let translated = decimal;
          let desired = currency;
          if (desired === Currency5.GBX) {
            desired = Currency5.GBP;
            if (translated !== null) {
              translated = translated.multiply(0.01);
            }
          }
          return formatDecimal(translated, desired.precision);
        }
        function formatFractionSpecial(value, currency, instrument) {
          let translated = value;
          let desired = currency;
          if (desired === Currency5.GBX) {
            desired = Currency5.GBP;
            if (is.number(value)) {
              translated = new Decimal6(value);
            }
            if (translated !== null) {
              translated = translated.multiply(0.01);
            }
          }
          return formatFraction(translated, desired, instrument);
        }
        function calculateStaticData(group, definition) {
          const actual = group._dataActual;
          const format = group._dataFormat;
          const currency = group.currency;
          const currencyTranslator = group._currencyTranslator;
          const items = group._consideredItems;
          format.currencyCode = currency.code;
          setPositionsFormat(format, group._items);
          group._bypassCurrencyTranslation = items.every((item) => item.currency === currency);
          const translate = (item, value) => {
            if (item.currency === currency || value.getIsZero()) {
              return value;
            }
            return currencyTranslator.translate(value, item.currency, currency);
          };
          const updates = items.reduce((updates2, item) => {
            updates2.basis = updates2.basis.add(translate(item, item.data.basis));
            if (item.position.instrument.type === InstrumentType4.FUTURE) {
              if (group.single) {
                updates2.basis2 = null;
              }
            } else {
              updates2.basis2 = updates2.basis2.add(translate(item, item.data.basis));
            }
            updates2.realized = updates2.realized.add(translate(item, item.data.realized));
            updates2.unrealized = updates2.unrealized.add(translate(item, item.data.unrealized));
            updates2.realizedToday = updates2.realizedToday.add(translate(item, item.data.realizedToday));
            updates2.income = updates2.income.add(translate(item, item.data.income));
            updates2.summaryTotalCurrent = updates2.summaryTotalCurrent.add(translate(item, item.data.periodGain));
            updates2.summaryTotalPrevious = updates2.summaryTotalPrevious.add(translate(item, item.data.periodGainPrevious));
            updates2.summaryTotalPrevious2 = updates2.summaryTotalPrevious2.add(translate(item, item.data.periodGainPrevious2));
            updates2.marketPrevious = updates2.marketPrevious.add(translate(item, item.data.marketPrevious));
            updates2.marketPrevious2 = updates2.marketPrevious2.add(translate(item, item.data.marketPrevious2));
            updates2.periodIncome = updates2.periodIncome.add(translate(item, item.data.periodIncome));
            updates2.periodRealized = updates2.periodRealized.add(translate(item, item.data.periodRealized));
            updates2.periodUnrealized = updates2.periodUnrealized.add(translate(item, item.data.periodUnrealized));
            if (item.position.instrument.type === InstrumentType4.CASH) {
              updates2.cashTotal = updates2.cashTotal.add(translate(item, item.data.market));
            }
            updates2.totalDivisor = updates2.totalDivisor.add(translate(item, item.data.totalDivisor));
            updates2.periodDivisorCurrent = updates2.periodDivisorCurrent.add(translate(item, item.data.periodDivisor));
            updates2.periodDivisorPrevious = updates2.periodDivisorPrevious.add(translate(item, item.data.periodDivisorPrevious));
            updates2.periodDivisorPrevious2 = updates2.periodDivisorPrevious2.add(translate(item, item.data.periodDivisorPrevious2));
            if (group.homogeneous) {
              updates2.quantity = updates2.quantity.add(item.data.quantity);
            }
            return updates2;
          }, {
            basis: Decimal6.ZERO,
            basis2: Decimal6.ZERO,
            realized: Decimal6.ZERO,
            unrealized: Decimal6.ZERO,
            realizedToday: Decimal6.ZERO,
            income: Decimal6.ZERO,
            summaryTotalCurrent: Decimal6.ZERO,
            summaryTotalPrevious: Decimal6.ZERO,
            summaryTotalPrevious2: Decimal6.ZERO,
            marketPrevious: Decimal6.ZERO,
            marketPrevious2: Decimal6.ZERO,
            periodIncome: Decimal6.ZERO,
            periodRealized: Decimal6.ZERO,
            periodUnrealized: Decimal6.ZERO,
            cashTotal: Decimal6.ZERO,
            totalDivisor: Decimal6.ZERO,
            periodDivisorCurrent: Decimal6.ZERO,
            periodDivisorPrevious: Decimal6.ZERO,
            periodDivisorPrevious2: Decimal6.ZERO,
            quantity: Decimal6.ZERO
          });
          actual.basis = updates.basis;
          actual.basis2 = updates.basis2;
          actual.realized = updates.realized;
          actual.unrealized = updates.unrealized;
          actual.realizedToday = updates.realizedToday;
          actual.income = updates.income;
          actual.summaryTotalCurrent = updates.summaryTotalCurrent;
          actual.summaryTotalPrevious = updates.summaryTotalPrevious;
          actual.summaryTotalPrevious2 = updates.summaryTotalPrevious2;
          actual.marketPrevious = updates.marketPrevious;
          actual.marketPrevious2 = updates.marketPrevious2;
          actual.periodIncome = updates.periodIncome;
          actual.periodRealized = updates.periodRealized;
          actual.periodUnrealized = updates.periodUnrealized;
          actual.cashTotal = updates.cashTotal;
          actual.totalDivisor = updates.totalDivisor;
          actual.periodDivisorCurrent = updates.periodDivisorCurrent;
          actual.periodDivisorPrevious = updates.periodDivisorPrevious;
          actual.periodDivisorPrevious2 = updates.periodDivisorPrevious2;
          if (group.homogeneous) {
            actual.quantity = updates.quantity;
          }
          format.basis = formatCurrency(actual.basis, currency);
          format.basis2 = formatCurrency(actual.basis2, currency);
          format.realized = formatCurrency(actual.realized, currency);
          format.realizedPositive = actual.realized.getIsPositive();
          format.realizedNegative = actual.realized.getIsNegative();
          format.unrealized = formatCurrency(actual.unrealized, currency);
          format.realizedToday = formatCurrency(actual.realizedToday, currency);
          format.realizedTodayPositive = actual.realizedToday.getIsPositive();
          format.realizedTodayNegative = actual.realizedToday.getIsNegative();
          format.income = formatCurrency(actual.income, currency);
          format.summaryTotalCurrent = formatCurrency(updates.summaryTotalCurrent, currency);
          format.summaryTotalCurrentPositive = updates.summaryTotalCurrent.getIsPositive();
          format.summaryTotalCurrentNegative = updates.summaryTotalCurrent.getIsNegative();
          format.summaryTotalPrevious = formatCurrency(updates.summaryTotalPrevious, currency);
          format.summaryTotalPreviousPositive = updates.summaryTotalPrevious.getIsPositive();
          format.summaryTotalPreviousNegative = updates.summaryTotalPrevious.getIsNegative();
          format.summaryTotalPrevious2 = formatCurrency(updates.summaryTotalPrevious2, currency);
          format.summaryTotalPrevious2Positive = updates.summaryTotalPrevious2.getIsPositive();
          format.summaryTotalPrevious2Negative = updates.summaryTotalPrevious2.getIsNegative();
          format.marketPrevious = formatCurrency(updates.marketPrevious, currency);
          format.marketPrevious2 = formatCurrency(updates.marketPrevious2, currency);
          format.periodIncome = formatCurrency(updates.periodIncome, currency);
          format.periodRealized = formatCurrency(updates.periodRealized, currency);
          format.periodUnrealized = formatCurrency(updates.periodUnrealized, currency);
          format.cashTotal = formatCurrency(updates.cashTotal, currency);
          if (group.homogeneous) {
            format.quantity = formatDecimal(actual.quantity, 2);
            format.quantityZero = actual.quantity.getIsZero();
          }
          calculateRealizedPercent(group);
          calculateUnrealizedPercent(group);
          actual.periodPercent = calculateGainPercent(actual.summaryTotalCurrent, actual.periodDivisorCurrent);
          actual.periodPercentPrevious = calculateGainPercent(actual.summaryTotalPrevious, actual.periodDivisorPrevious);
          actual.periodPercentPrevious2 = calculateGainPercent(actual.summaryTotalPrevious2, actual.periodDivisorPrevious2);
          format.periodPercent = formatPercent(actual.periodPercent, 2);
          format.periodPercentPrevious = formatPercent(actual.periodPercentPrevious, 2);
          format.periodPercentPrevious2 = formatPercent(actual.periodPercentPrevious2, 2);
          const groupItems = group._items;
          if (group.single && groupItems.length === 1) {
            const item = groupItems[0];
            const instrument = item.position.instrument;
            actual.quantity = item.data.quantity;
            actual.quantityPrevious = item.data.quantityPrevious;
            format.quantity = formatDecimal(actual.quantity, 2);
            format.quantityZero = actual.quantity.getIsZero();
            format.quantityPrevious = formatDecimal(actual.quantityPrevious, 2);
            actual.basisPrice = item.data.basisPrice;
            format.basisPrice = formatFractionSpecial(actual.basisPrice, currency, instrument);
            actual.periodPrice = item.data.periodPrice;
            actual.periodPricePrevious = item.data.periodPricePrevious;
            format.periodPrice = formatCurrency(actual.periodPrice, currency);
            format.periodPricePrevious = formatCurrency(actual.periodPricePrevious, currency);
            actual.unrealizedPrice = item.data.unrealizedPrice;
            format.unrealizedPrice = formatFractionSpecial(actual.unrealizedPrice, currency, instrument);
            format.unrealizedPricePositive = actual.unrealizedPrice !== null && actual.unrealizedPrice.getIsPositive();
            format.unrealizedPriceNegative = actual.unrealizedPrice !== null && actual.unrealizedPrice.getIsNegative();
            format.invalid = definition.type === PositionLevelType5.POSITION && item.invalid;
            format.locked = definition.type === PositionLevelType5.POSITION && item.data.locked;
            format.calculating = definition.type === PositionLevelType5.POSITION && item.data.calculating;
            format.expired = definition.type === PositionLevelType5.POSITION && item.data.expired;
          }
          if (group.homogeneous && groupItems.length !== 0) {
            const item = groupItems[0];
            format.expired = item.data.expired;
          }
          let portfolioType = null;
          if (groupItems.length > 0) {
            const portfolio = groupItems[0].portfolio;
            if (groupItems.every((i) => i.portfolio.portfolio === portfolio.portfolio)) {
              if (portfolio.miscellany && portfolio.miscellany.data.type && portfolio.miscellany.data.type.value) {
                portfolioType = portfolio.miscellany.data.type.value;
              }
            }
          }
          format.portfolioType = formatString(portfolioType);
          format.todayQuote = "\u2014";
          format.todayExchange = "\u2014";
          format.todayPrice = "\u2014";
          format.todayPricePrevious = "\u2014";
          format.unrealizedToday = "\u2014";
          format.gainToday = "\u2014";
        }
        function calculatePriceData(group, item, forceRefresh) {
          const currency = group.currency;
          const actual = group._dataActual;
          const format = group._dataFormat;
          const refresh = is.boolean(forceRefresh) && forceRefresh || (actual.market === null || actual.unrealizedToday === null || actual.total === null);
          if (!refresh && group._excludedItemMap.hasOwnProperty(item.position.position)) {
            return;
          }
          const currencyTranslator = group._currencyTranslator;
          const translate = (item2, value) => {
            if (item2.currency === currency || value.getIsZero()) {
              return value;
            }
            return currencyTranslator.translate(value, item2.currency, currency);
          };
          let updates;
          if (refresh) {
            const items = group._consideredItems;
            updates = items.reduce((updates2, item2) => {
              updates2.market = updates2.market.add(translate(item2, item2.data.market));
              if (item2.position.instrument.type === InstrumentType4.FUTURE) {
                updates2.market2 = updates2.market2.add(translate(item2, item2.data.unrealized));
              } else {
                updates2.market2 = updates2.market2.add(translate(item2, item2.data.market));
              }
              updates2.marketAbsolute = updates2.marketAbsolute.add(translate(item2, item2.data.marketAbsolute));
              updates2.unrealized = updates2.unrealized.add(translate(item2, item2.data.unrealized));
              updates2.unrealizedToday = updates2.unrealizedToday.add(translate(item2, item2.data.unrealizedToday));
              updates2.realizedToday = updates2.realizedToday.add(translate(item2, item2.data.realizedToday));
              updates2.gainToday = updates2.gainToday.add(translate(item2, item2.data.unrealizedToday.add(item2.data.realizedToday)));
              updates2.summaryTotalCurrent = updates2.summaryTotalCurrent.add(translate(item2, item2.data.periodGain));
              updates2.periodUnrealized = updates2.periodUnrealized.add(translate(item2, item2.data.periodUnrealized));
              return updates2;
            }, {
              market: Decimal6.ZERO,
              market2: Decimal6.ZERO,
              marketAbsolute: Decimal6.ZERO,
              marketDirection: unchanged,
              unrealized: Decimal6.ZERO,
              unrealizedToday: Decimal6.ZERO,
              realizedToday: Decimal6.ZERO,
              gainToday: Decimal6.ZERO,
              summaryTotalCurrent: Decimal6.ZERO,
              periodUnrealized: Decimal6.ZERO
            });
          } else {
            updates = {};
            updates.market = actual.market.add(translate(item, item.data.marketChange));
            if (item.position.instrument.type === InstrumentType4.FUTURE) {
              updates.market2 = actual.market2.add(translate(item, item.data.unrealizedChange));
            } else {
              updates.market2 = actual.market2.add(translate(item, item.data.marketChange));
            }
            updates.marketAbsolute = actual.marketAbsolute.add(translate(item, item.data.marketAbsoluteChange));
            updates.marketDirection = { up: item.data.marketChange.getIsPositive(), down: item.data.marketChange.getIsNegative() };
            updates.unrealized = actual.unrealized.add(translate(item, item.data.unrealizedChange));
            updates.unrealizedToday = actual.unrealizedToday.add(translate(item, item.data.unrealizedTodayChange));
            updates.realizedToday = actual.realizedToday.add(translate(item, item.data.realizedTodayChange));
            updates.gainToday = actual.gainToday.add(translate(item, item.data.unrealizedTodayChange).add(item.data.realizedTodayChange));
            updates.summaryTotalCurrent = actual.summaryTotalCurrent.add(translate(item, item.data.periodGainChange));
            updates.periodUnrealized = actual.periodUnrealized.add(translate(item, item.data.periodUnrealizedChange));
          }
          actual.market = updates.market;
          actual.market2 = updates.market2;
          actual.marketAbsolute = updates.marketAbsolute;
          actual.unrealized = updates.unrealized;
          actual.unrealizedToday = updates.unrealizedToday;
          actual.realizedToday = updates.realizedToday;
          actual.gainToday = updates.gainToday;
          actual.summaryTotalCurrent = updates.summaryTotalCurrent;
          actual.periodUnrealized = updates.periodUnrealized;
          actual.total = updates.unrealized.add(actual.realized).add(actual.income);
          actual.totalPercent = calculateGainPercent(actual.total, actual.totalDivisor);
          let marketChange = updates.market.subtract(actual.marketPrevious);
          let marketChangePercent;
          if (actual.marketPrevious.getIsApproximate(Decimal6.ZERO, 4)) {
            if (marketChange.getIsPositive()) {
              marketChangePercent = Decimal6.ONE;
            } else if (marketChange.getIsNegative()) {
              marketChangePercent = Decimal6.NEGATIVE_ONE;
            } else {
              marketChangePercent = Decimal6.ZERO;
            }
          } else {
            marketChangePercent = marketChange.divide(actual.marketPrevious);
          }
          actual.marketChange = marketChange;
          actual.marketChangePercent = marketChangePercent;
          format.market = formatCurrency(actual.market, currency);
          format.market2 = formatCurrency(actual.market2, currency);
          if (updates.marketDirection.up || updates.marketDirection.down) {
            format.marketDirection = DIRECTION_UNCHANGED;
            setTimeout(() => format.marketDirection = formatDirection(updates.marketDirection.up, updates.marketDirection.down), 0);
          }
          format.unrealized = formatCurrency(actual.unrealized, currency);
          format.unrealizedPositive = actual.unrealized.getIsPositive();
          format.unrealizedNegative = actual.unrealized.getIsNegative();
          format.unrealizedToday = formatCurrency(actual.unrealizedToday, currency);
          format.unrealizedTodayPositive = actual.unrealizedToday.getIsPositive();
          format.unrealizedTodayNegative = actual.unrealizedToday.getIsNegative();
          format.realizedToday = formatCurrency(actual.realizedToday, currency);
          format.realizedTodayPositive = actual.realizedToday.getIsPositive();
          format.realizedTodayNegative = actual.realizedToday.getIsNegative();
          format.gainToday = formatCurrency(actual.gainToday, currency);
          format.gainTodayPositive = actual.gainToday.getIsPositive();
          format.gainTodayNegative = actual.gainToday.getIsNegative();
          format.summaryTotalCurrent = formatCurrency(actual.summaryTotalCurrent, currency);
          format.summaryTotalCurrentPositive = actual.summaryTotalCurrent.getIsPositive();
          format.summaryTotalCurrentNegative = actual.summaryTotalCurrent.getIsNegative();
          format.periodUnrealized = formatCurrency(actual.periodUnrealized, currency);
          format.total = formatCurrency(actual.total, currency);
          format.totalPositive = actual.total.getIsPositive();
          format.totalNegative = actual.total.getIsNegative();
          format.totalPercent = formatPercent(actual.totalPercent, 2);
          format.marketChange = formatCurrency(actual.marketChange, currency);
          format.marketChangePercent = formatPercent(actual.marketChangePercent, 2);
          calculateRealizedPercent(group);
          calculateUnrealizedPercent(group);
          actual.periodPercent = calculateGainPercent(actual.summaryTotalCurrent, actual.periodDivisorCurrent);
          format.periodPercent = formatPercent(actual.periodPercent, 2);
          let priceItem = null;
          if (group.single && item) {
            priceItem = item;
          } else if (group.homogeneous && group._consideredItems.length !== 0) {
            priceItem = group._consideredItems[0];
          }
          if (priceItem) {
            actual.unrealizedPrice = priceItem.data.unrealizedPrice;
            format.unrealizedPrice = formatFractionSpecial(actual.unrealizedPrice, currency, priceItem.position.instrument);
            format.unrealizedPricePositive = actual.unrealizedPrice !== null && actual.unrealizedPrice.getIsPositive();
            format.unrealizedPriceNegative = actual.unrealizedPrice !== null && actual.unrealizedPrice.getIsNegative();
            actual.todayQuote = priceItem.data.todayQuote;
            actual.todayExchange = priceItem.data.todayExchange;
            format.todayQuote = actual.todayQuote === null ? "\u2014" : actual.todayQuote.format();
            format.todayExchange = actual.todayExchange === null ? "\u2014" : actual.todayExchange.format();
            actual.todayPrice = priceItem.data.todayPrice;
            actual.todayPricePrevious = priceItem.data.todayPricePrevious;
            format.todayPrice = actual.todayPrice === null ? "\u2014" : formatFractionSpecial(actual.todayPrice, currency, priceItem.position.instrument);
            format.todayPricePrevious = actual.todayPricePrevious === null ? "\u2014" : formatFractionSpecial(actual.todayPricePrevious, currency, priceItem.position.instrument);
            if (actual.todayPrice === null) {
              format.unrealizedToday = "\u2014";
              if (actual.realizedToday.getIsEqual(Decimal6.ZERO)) {
                format.gainToday = "\u2014";
              }
            }
          }
        }
        function calculateMarketPercent(group, parentGroup, portfolioGroup) {
          const actual = group._dataActual;
          const format = group._dataFormat;
          const excluded = group._excluded;
          const currencyTranslator = group._currencyTranslator;
          const calculatePercent = (parent) => {
            if (!parent || excluded) {
              return null;
            }
            const parentData = parent._dataActual;
            if (parentData.marketAbsolute === null || parentData.marketAbsolute.getIsApproximate(Decimal6.ZERO, 4)) {
              return null;
            }
            let numerator;
            if (group.currency === parent.currency) {
              numerator = actual.marketAbsolute;
            } else {
              numerator = currencyTranslator.translate(actual.marketAbsolute, group.currency, parent.currency);
            }
            return numerator.divide(parentData.marketAbsolute);
          };
          actual.marketPercent = calculatePercent(parentGroup);
          format.marketPercent = formatPercent(actual.marketPercent, 2);
          if (parentGroup === portfolioGroup) {
            actual.marketPercentPortfolio = actual.marketPercent;
            format.marketPercentPortfolio = format.marketPercent;
          } else {
            actual.marketPercentPortfolio = calculatePercent(portfolioGroup);
            format.marketPercentPortfolio = formatPercent(actual.marketPercentPortfolio, 2);
          }
        }
        function calculateRealizedPercent(group) {
          const actual = group._dataActual;
          const format = group._dataFormat;
          const openBasis = actual.basis;
          const totalBasis = actual.totalDivisor;
          const numerator = actual.realized;
          const denominator = totalBasis.subtract(openBasis);
          if (denominator.getIsApproximate(Decimal6.ZERO, 4)) {
            actual.realizedPercent = Decimal6.ZERO;
          } else {
            actual.realizedPercent = numerator.divide(denominator);
          }
          format.realizedPercent = formatPercent(actual.realizedPercent, 2);
        }
        function calculateUnrealizedPercent(group) {
          const actual = group._dataActual;
          const format = group._dataFormat;
          const numerator = actual.unrealized;
          const denominator = actual.basis.absolute();
          if (denominator.getIsApproximate(Decimal6.ZERO, 4)) {
            actual.unrealizedPercent = Decimal6.ZERO;
          } else {
            actual.unrealizedPercent = numerator.divide(denominator);
          }
          format.unrealizedPercent = formatPercent(actual.unrealizedPercent, 2);
        }
        function calculateGainPercent(gain, basis) {
          return basis.getIsApproximate(Decimal6.ZERO, 4) ? Decimal6.ZERO : gain.divide(basis);
        }
        const unchanged = { up: false, down: false };
        return PositionGroup2;
      })();
    }
  });

  // lib/data/OptionsValuationType.js
  var require_OptionsValuationType = __commonJS({
    "lib/data/OptionsValuationType.js"(exports, module) {
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
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
        const MIDPOINT = new OptionsValuationType("MIDPOINT", "Bid/Ask Midpoint");
        const LAST_TRADE = new OptionsValuationType("LAST_TRADE", "Last Trade");
        return OptionsValuationType;
      })();
    }
  });

  // lib/processing/PositionItem.js
  var require_PositionItem = __commonJS({
    "lib/processing/PositionItem.js"(exports, module) {
      var assert = require_assert();
      var Currency5 = require_Currency();
      var Day5 = require_Day();
      var Decimal6 = require_Decimal();
      var Disposable = require_Disposable();
      var Event = require_Event();
      var is = require_is();
      var InstrumentType4 = require_InstrumentType();
      var PositionDirection = require_PositionDirection();
      var OptionsValuationType = require_OptionsValuationType();
      var AveragePriceCalculator2 = require_AveragePriceCalculator();
      var ValuationCalculator2 = require_ValuationCalculator();
      module.exports = (() => {
        "use strict";
        class PositionItem3 extends Disposable {
          constructor(portfolio, position, currentSummary, previousSummaries, reporting, reportDate) {
            super();
            this._portfolio = portfolio;
            this._position = position;
            this._priceSelctor = getPriceSelector(this._portfolio, this._position);
            const instrument = position.instrument;
            this._currency = instrument.currency || Currency5.CAD;
            this._invalid = instrument.type.usesSymbols && (!is.object(instrument.symbol) || !is.string(instrument.symbol.barchart));
            this._exchangeStatus = null;
            this._currentSummary = currentSummary || null;
            this._previousSummaries = previousSummaries || [];
            this._reporting = reporting;
            this._reportDate = reportDate || null;
            this._today = calculateToday(this._reportDate, this._exchangeStatus);
            this._currentQuote = null;
            this._previousQuote = null;
            this._currentPrice = null;
            this._data = {};
            this._data.basis = null;
            this._data.market = null;
            this._data.marketChange = null;
            this._data.marketAbsolute = null;
            this._data.marketAbsoluteChange = null;
            this._data.todayQuote = null;
            this._data.todayExchange = null;
            this._data.todayPrice = null;
            this._data.todayPricePrevious = null;
            this._data.realizedToday = null;
            this._data.realizedTodayChange = null;
            this._data.unrealizedToday = null;
            this._data.unrealizedTodayChange = null;
            this._data.unrealized = null;
            this._data.unrealizedChange = null;
            this._data.marketPrevious = null;
            this._data.marketPrevious2 = null;
            this._data.quantity = null;
            this._data.quantityPrevious = null;
            this._data.realized = null;
            this._data.income = null;
            this._data.basisPrice = null;
            this._data.unrealizedPrice = null;
            this._data.periodIncome = null;
            this._data.periodRealized = null;
            this._data.periodUnrealized = null;
            this._data.periodUnrealizedChange = null;
            this._data.periodPrice = null;
            this._data.periodPricePrevious = null;
            this._data.periodGain = null;
            this._data.periodGainChange = null;
            this._data.periodGainPrevious = null;
            this._data.periodGainPrevious2 = null;
            this._data.periodDivisor = null;
            this._data.periodDivisorChange = null;
            this._data.periodDivisorPrevious = null;
            this._data.periodDivisorPrevious2 = null;
            this._data.initiate = null;
            this._data.totalDivisor = null;
            this._data.newsExists = false;
            this._data.fundamental = {};
            this._data.calculating = getIsCalculating(position);
            this._data.locked = getIsLocked(position);
            this._data.expired = getIsExpired(position, this._today);
            this._quoteChangedEvent = new Event(this);
            this._newsExistsChangedEvent = new Event(this);
            this._fundamentalDataChangedEvent = new Event(this);
            this._lockChangedEvent = new Event(this);
            this._calculatingChangedEvent = new Event(this);
            this._portfolioChangedEvent = new Event(this);
            this._positionItemDisposeEvent = new Event(this);
            calculateStaticData(this);
            calculatePriceData(this, null, null, this._today);
          }
          /**
           * The portfolio of the encapsulated position.
           *
           * @public
           * @returns {Object}
           */
          get portfolio() {
            return this._portfolio;
          }
          /**
           * The encapsulated position.
           *
           * @public
           * @returns {Object}
           */
          get position() {
            return this._position;
          }
          /**
           * The {@link Currency} of the encapsulated position.
           *
           * @public
           * @returns {Object}
           */
          get currency() {
            return this._currency;
          }
          /**
           * Indicates if the position's symbol is invalid.
           *
           * @public
           * @returns {Boolean}
           */
          get invalid() {
            return this._invalid;
          }
          /**
           * The current summary of the encapsulated position.
           *
           * @public
           * @returns {Object}
           */
          get currentSummary() {
            return this._currentSummary;
          }
          /**
           * Previous summaries for the encapsulated position.
           *
           * @public
           * @returns {Object}
           */
          get previousSummaries() {
            return this._previousSummaries;
          }
          /**
           * Various data regarding the encapsulated position.
           *
           * @public
           * @returns {Object}
           */
          get data() {
            return this._data;
          }
          /**
           * The most recent quote for the symbol of the encapsulated position.
           *
           * @public
           * @returns {null|Object}
           */
          get quote() {
            return this._currentQuote;
          }
          /**
           * The second most recent quote for the symbol of the encapsulated position.
           *
           * @public
           * @returns {null|Object}
           */
          get previousQuote() {
            return this._previousQuote;
          }
          /**
           * The current price.
           *
           * @public
           * @return {null|Number}
           */
          get currentPrice() {
            return this._currentPrice;
          }
          updatePortfolio(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", Object);
            assert.argumentIsRequired(portfolio.portfolio, "portfolio.portfolio", String);
            if (portfolio.portfolio !== this._portfolio.portfolio) {
              throw new Error("Unable to move position into new portfolio.");
            }
            if (this._portfolio !== portfolio) {
              this._portfolioChangedEvent.fire(this._portfolio = portfolio);
            }
            this._priceSelctor = getPriceSelector(this._portfolio, this._position);
            if (this._currentQuote) {
              this.setQuote(this._currentQuote, true);
            }
          }
          /**
           * Sets the current quote -- causing position-level data (e.g. market value) to
           * be recalculated.
           *
           * @public
           * @param {Quote} quote
           * @param {Boolean=} force
           */
          setQuote(quote, force) {
            assert.argumentIsRequired(quote, "quote", Object);
            assert.argumentIsOptional(force, "force", Boolean);
            if (this.disposed) {
              return;
            }
            const priceToUse = this._priceSelctor(quote);
            if (!(this._currentPrice !== priceToUse || force)) {
              return;
            }
            if (quote.previousPrice) {
              this._data.previousPrice = quote.previousPrice;
            }
            calculatePriceData(this, priceToUse, calculateQuoteDay(quote), this._today);
            this._currentPrice = priceToUse;
            this._previousQuote = this._currentQuote;
            this._currentQuote = quote;
            this._quoteChangedEvent.fire(this._currentQuote);
          }
          /**
           * Sets the current exchange status -- causing position-level data (e.g. today's gain) to
           * be recalculated.
           *
           * @public
           * @param {ExchangeStatus} exchange
           */
          setExchangeStatus(exchange) {
            assert.argumentIsRequired(exchange, "exchange", Object);
            assert.argumentIsRequired(exchange.code, "exchange.code", String);
            assert.argumentIsRequired(exchange.currentDay, "exchange.currentDay", Day5, "Day");
            assert.argumentIsRequired(exchange.currentOpened, "exchange.currentOpened", Boolean);
            if (this._exchangeStatus === null || !(exchange.currentDay.getIsEqual(this._exchangeStatus.currentDay) && exchange.currentOpened === this._exchangeStatus.currentOpened)) {
              this._exchangeStatus = exchange;
              this._today = calculateToday(this._reportDate, this._exchangeStatus);
              if (this._currentQuote) {
                this.setQuote(this._currentQuote, true);
              }
            }
          }
          /**
           * Sets a flag which indicates if news article(s) exist for the encapsulated position's
           * symbol.
           *
           * @public
           * @param {Boolean} value
           */
          setNewsArticleExists(value) {
            assert.argumentIsRequired(value, "value", Boolean);
            if (this.disposed) {
              return;
            }
            if (this._data.newsExists !== value) {
              this._newsExistsChangedEvent.fire(this._data.newsExists = value);
            }
          }
          /**
           * Sets fundamental data for the position.
           *
           * @public
           * @param {Object} data
           */
          setPositionFundamentalData(data) {
            assert.argumentIsRequired(data, "data", Object);
            if (this.disposed) {
              return;
            }
            this._fundamentalDataChangedEvent.fire(this._data.fundamental = data);
          }
          /**
           * Sets a position's lock status.
           *
           * @public
           * @param {Object} position
           */
          setPositionLock(position) {
            assert.argumentIsRequired(position, "position");
            if (this.disposed) {
              return;
            }
            const value = getIsLocked(position);
            if (this._data.locked !== value) {
              this._lockChangedEvent.fire(this._data.locked = value);
            }
          }
          /**
           * Sets a position's calculating status.
           *
           * @public
           * @param {Object} position
           */
          setPositionCalculating(position) {
            assert.argumentIsRequired(position, "position", Object);
            if (this.disposed) {
              return;
            }
            const value = getIsCalculating(position);
            if (this._data.calculating !== value) {
              this._calculatingChangedEvent.fire(this._data.calculating = value);
            }
          }
          /**
           * Registers an observer for quote changes, which is fired after internal recalculations
           * of position data are complete.
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerQuoteChangeHandler(handler) {
            return this._quoteChangedEvent.register(handler);
          }
          /**
           * Registers an observer changes to the status of news existence.
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerNewsExistsChangeHandler(handler) {
            return this._newsExistsChangedEvent.register(handler);
          }
          /**
           * Registers an observer for fundamental data changes.
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerFundamentalDataChangeHandler(handler) {
            return this._fundamentalDataChangedEvent.register(handler);
          }
          /**
           * Registers an observer for position lock changes.
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerLockChangeHandler(handler) {
            return this._lockChangedEvent.register(handler);
          }
          /**
           * Registers an observer for position calculating changes.
           *
           * @public
           * @param {Function} handler
           * @return {Disposable}
           */
          registerCalculatingChangeHandler(handler) {
            return this._calculatingChangedEvent.register(handler);
          }
          /**
           * Registers an observer for changes to portfolio metadata.
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerPortfolioChangeHandler(handler) {
            return this._portfolioChangedEvent.register(handler);
          }
          /**
           * Registers an observer for object disposal.
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerPositionItemDisposeHandler(handler) {
            return this._positionItemDisposeEvent.register(handler);
          }
          _onDispose() {
            this._positionItemDisposeEvent.fire(this);
            this._quoteChangedEvent.clear();
            this._newsExistsChangedEvent.clear();
            this._fundamentalDataChangedEvent.clear();
            this._lockChangedEvent.clear();
            this._calculatingChangedEvent.clear();
            this._portfolioChangedEvent.clear();
            this._positionItemDisposeEvent.clear();
          }
          toString() {
            return "[PositionItem]";
          }
        }
        function calculateStaticData(item) {
          const position = item.position;
          const currentSummary = item.currentSummary;
          const previousSummary1 = getPreviousSummary(item.previousSummaries, 1);
          const previousSummary2 = getPreviousSummary(item.previousSummaries, 2);
          const previousSummary3 = getPreviousSummary(item.previousSummaries, 3);
          const snapshot = getSnapshot(position, currentSummary, item._reporting);
          const data = item._data;
          data.initiate = guessInitialDirection(position, item.previousSummaries, item.currentSummary);
          data.quantity = snapshot.open;
          data.previousPrice = position.previous || null;
          let basis;
          if (snapshot.basis) {
            basis = snapshot.basis.opposite();
          } else {
            basis = Decimal6.ZERO;
          }
          data.basis = basis;
          data.realized = snapshot.gain;
          data.unrealized = Decimal6.ZERO;
          data.income = snapshot.income;
          data.marketPrevious = previousSummary1 === null ? Decimal6.ZERO : previousSummary1.end.value;
          data.marketPrevious2 = previousSummary2 === null ? Decimal6.ZERO : previousSummary2.end.value;
          data.quantityPrevious = previousSummary1 === null ? Decimal6.ZERO : previousSummary1.end.open;
          data.periodGain = calculatePeriodGain(position.instrument, data.initiate, currentSummary, previousSummary1);
          data.periodGainPrevious = calculatePeriodGain(position.instrument, data.initiate, previousSummary1, previousSummary2);
          data.periodGainPrevious2 = calculatePeriodGain(position.instrument, data.initiate, previousSummary2, previousSummary3);
          data.periodIncome = currentSummary !== null ? currentSummary.period.income : Decimal6.ZERO;
          data.periodRealized = currentSummary !== null ? currentSummary.period.realized : Decimal6.ZERO;
          data.periodUnrealized = calculatePeriodUnrealized(position.instrument.type, data.periodGain, data.periodRealized, data.periodIncome);
          data.periodDivisor = calculatePeriodDivisor(position.instrument.type, data.initiate, currentSummary, previousSummary1);
          data.periodDivisorPrevious = calculatePeriodDivisor(position.instrument.type, data.initiate, previousSummary1, previousSummary2);
          data.periodDivisorPrevious2 = calculatePeriodDivisor(position.instrument.type, data.initiate, previousSummary2, previousSummary3);
          data.basisPrice = AveragePriceCalculator2.calculate(position.instrument, data.basis, snapshot.open) || Decimal6.ZERO;
          data.basisPrice = data.basisPrice.opposite();
          if (currentSummary && !currentSummary.end.open.getIsZero()) {
            data.periodPrice = currentSummary.end.value.divide(currentSummary.end.open);
          } else {
            data.periodPrice = null;
          }
          if (previousSummary1 && !previousSummary1.end.open.getIsZero()) {
            data.periodPricePrevious = previousSummary1.end.value.divide(previousSummary1.end.open);
          } else {
            data.periodPricePrevious = null;
          }
          data.totalDivisor = calculateTotalDivisor(position.instrument.type, data.initiate, position);
        }
        function calculatePriceData(item, price, day, today) {
          const position = item.position;
          const snapshot = getSnapshot(position, item.currentSummary, item._reporting);
          const data = item._data;
          const worthless = data.expired && (position.instrument.type === InstrumentType4.EQUITY_OPTION || position.instrument.type === InstrumentType4.FUTURE_OPTION);
          let market;
          if (position.instrument.type === InstrumentType4.OTHER) {
            market = snapshot.value;
          } else if (position.instrument.type === InstrumentType4.CASH) {
            market = snapshot.open;
          } else {
            let priceToUse;
            if (worthless) {
              priceToUse = Decimal6.ZERO;
            } else {
              priceToUse = price;
            }
            market = ValuationCalculator2.calculate(position.instrument, priceToUse, snapshot.open) || snapshot.value;
          }
          let marketChange;
          if (data.market === null) {
            marketChange = market;
          } else {
            marketChange = market.subtract(data.market);
          }
          data.market = market;
          data.marketChange = marketChange;
          let marketAbsolute = market.absolute();
          let marketAbsoluteChange;
          if (data.marketAbsolute === null) {
            marketAbsoluteChange = marketAbsolute;
          } else {
            marketAbsoluteChange = marketAbsolute.subtract(data.marketAbsolute);
          }
          data.marketAbsolute = marketAbsolute;
          data.marketAbsoluteChange = marketAbsoluteChange;
          data.todayQuote = day || null;
          data.todayExchange = today || null;
          let unrealizedToday;
          let unrealizedTodayChange;
          const priceIsToday = day && today.getIsEqual(day);
          if (priceIsToday && data.previousPrice && price) {
            const unrealizedTodayBase = ValuationCalculator2.calculate(position.instrument, data.previousPrice, snapshot.open);
            unrealizedToday = market.subtract(unrealizedTodayBase);
          } else {
            unrealizedToday = Decimal6.ZERO;
          }
          if (data.unrealizedToday !== null) {
            unrealizedTodayChange = unrealizedToday.subtract(data.unrealizedToday);
          } else {
            unrealizedTodayChange = unrealizedToday;
          }
          data.unrealizedToday = unrealizedToday;
          data.unrealizedTodayChange = unrealizedTodayChange;
          if (priceIsToday && price) {
            data.todayPrice = price;
            if (data.previousPrice) {
              data.todayPricePrevious = data.previousPrice;
            }
          } else {
            data.todayPrice = null;
            data.todayPricePrevious = null;
          }
          let realizedToday;
          let realizedTodayChange;
          if (position.latest && position.latest.gain && position.latest.date && today && position.latest.date.getIsEqual(today)) {
            realizedToday = position.latest.gain;
          } else {
            realizedToday = Decimal6.ZERO;
          }
          if (data.realizedToday) {
            realizedTodayChange = realizedToday.subtract(data.realizedToday);
          } else {
            realizedTodayChange = realizedToday;
          }
          data.realizedToday = realizedToday;
          data.realizedTodayChange = realizedTodayChange;
          const currentSummary = item.currentSummary;
          const previousSummary = getPreviousSummary(item.previousSummaries, 1);
          if (currentSummary && position.instrument.type !== InstrumentType4.CASH) {
            let priceToUse;
            if (worthless) {
              priceToUse = Decimal6.ZERO;
            } else if (price) {
              priceToUse = price;
            } else if (data.previousPrice) {
              priceToUse = new Decimal6(data.previousPrice);
            } else if (!currentSummary.end.open.getIsZero()) {
              priceToUse = AveragePriceCalculator2.calculate(position.instrument, currentSummary.end.value, currentSummary.end.open) || Decimal6.ZERO;
              priceToUse = priceToUse.opposite();
            } else {
              priceToUse = null;
            }
            if (priceToUse !== null) {
              const unrealized = ValuationCalculator2.calculate(position.instrument, priceToUse, currentSummary.end.open).add(currentSummary.end.basis);
              let unrealizedChange;
              if (data.unrealized !== null) {
                unrealizedChange = unrealized.subtract(data.unrealized);
              } else {
                unrealizedChange = Decimal6.ZERO;
              }
              data.unrealized = unrealized;
              data.unrealizedChange = unrealizedChange;
              let periodGain = calculatePeriodGain(position.instrument, data.initiate, currentSummary, previousSummary, priceToUse);
              let periodGainChange;
              if (data.periodGain !== null) {
                periodGainChange = periodGain.subtract(data.periodGain);
              } else {
                periodGainChange = Decimal6.ZERO;
              }
              data.periodGain = periodGain;
              data.periodGainChange = periodGainChange;
              let periodUnrealized = calculatePeriodUnrealized(position.instrument.type, data.periodGain, data.periodRealized, data.periodIncome);
              let periodUnrealizedChange;
              if (data.periodUnrealized !== null) {
                periodUnrealizedChange = periodUnrealized.subtract(data.periodUnrealized);
              } else {
                periodUnrealizedChange = Decimal6.ZERO;
              }
              data.periodUnrealized = periodUnrealized;
              data.periodUnrealizedChange = periodUnrealizedChange;
              if (snapshot.open.getIsZero()) {
                data.unrealizedPrice = null;
              } else {
                data.unrealizedPrice = data.basisPrice.opposite().add(priceToUse);
              }
            } else {
              data.unrealizedChange = Decimal6.ZERO;
              data.periodUnrealizedChange = Decimal6.ZERO;
              data.periodGainChange = Decimal6.ZERO;
            }
          } else {
            data.unrealizedChange = Decimal6.ZERO;
            data.periodUnrealizedChange = Decimal6.ZERO;
            data.periodGainChange = Decimal6.ZERO;
          }
        }
        function guessInitialDirection(position, previousSummaries, currentSummary) {
          if (position.snapshot.initial) {
            return position.snapshot.initial;
          }
          const summaries = previousSummaries.concat(currentSummary);
          const direction = summaries.reduce((accumulator, summary) => {
            let returnRef = accumulator;
            if (summary !== null && summary.start.direction !== PositionDirection.EVEN) {
              returnRef = summary.start.direction;
            }
            if (summary !== null && summary.end.direction !== PositionDirection.EVEN) {
              returnRef = summary.end.direction;
            }
            return returnRef;
          }, null);
          return direction || PositionDirection.LONG;
        }
        function calculatePeriodGain(instrument, direction, currentSummary, previousSummary, overridePrice) {
          let returnRef;
          const type = instrument.type;
          if (currentSummary && type !== InstrumentType4.CASH) {
            let startValue;
            if (previousSummary) {
              startValue = previousSummary.end.value;
            } else {
              startValue = Decimal6.ZERO;
            }
            let endValue;
            if (overridePrice) {
              endValue = ValuationCalculator2.calculate(instrument, overridePrice, currentSummary.end.open);
            } else {
              endValue = currentSummary.end.value;
            }
            const valueChange = endValue.subtract(startValue);
            const tradeChange = currentSummary.period.sells.subtract(currentSummary.period.buys.opposite());
            const incomeChange = currentSummary.period.income;
            returnRef = valueChange.add(tradeChange).add(incomeChange);
          } else {
            returnRef = Decimal6.ZERO;
          }
          return returnRef;
        }
        function calculatePeriodDivisor(type, direction, currentSummary, previousSummary) {
          let returnRef;
          if (currentSummary && type !== InstrumentType4.CASH) {
            let startValue;
            if (previousSummary) {
              startValue = previousSummary.end.value;
            } else {
              startValue = Decimal6.ZERO;
            }
            if (direction === PositionDirection.SHORT) {
              returnRef = startValue.opposite().add(currentSummary.period.sells);
            } else {
              returnRef = startValue.add(currentSummary.period.buys.opposite());
            }
          } else {
            returnRef = Decimal6.ZERO;
          }
          return returnRef;
        }
        function calculatePeriodUnrealized(type, periodGain, periodRealized, periodIncome) {
          let returnRef;
          if (type !== InstrumentType4.CASH) {
            returnRef = periodRealized.add(periodIncome).subtract(periodGain).opposite();
          } else {
            returnRef = Decimal6.ZERO;
          }
          return returnRef;
        }
        function calculateTotalDivisor(type, direction, position) {
          if (type === InstrumentType4.CASH) {
            return Decimal6.ZERO;
          }
          let divisor;
          if (direction === PositionDirection.SHORT) {
            divisor = position.snapshot.sells;
          } else if (direction === PositionDirection.LONG) {
            divisor = position.snapshot.buys.opposite();
          } else {
            divisor = Decimal6.ZERO;
          }
          return divisor;
        }
        function getPreviousSummary(previousSummaries, count) {
          const index = previousSummaries.length - count;
          let summary;
          if (!(index < 0)) {
            summary = previousSummaries[index];
          } else {
            summary = null;
          }
          return summary;
        }
        function getIsLocked(position) {
          assert.argumentIsRequired(position, "position");
          return is.object(position.system) && is.boolean(position.system.locked) && position.system.locked;
        }
        function getIsCalculating(position) {
          assert.argumentIsRequired(position, "position");
          return is.object(position.system) && is.object(position.system.calculate) && is.number(position.system.calculate.processors) && position.system.calculate.processors > 0;
        }
        function getIsExpired(position, day) {
          assert.argumentIsRequired(position, "position");
          const type = position.instrument.type;
          let expiration;
          if (type === InstrumentType4.FUTURE) {
            expiration = position.instrument.future.expiration;
          } else if (type === InstrumentType4.FUTURE_OPTION || type === InstrumentType4.EQUITY_OPTION) {
            expiration = position.instrument.option.expiration;
          } else {
            expiration = null;
          }
          return expiration !== null && expiration.getIsBefore(day);
        }
        function getSnapshot(position, currentSummary, reporting) {
          let snapshot;
          if (reporting) {
            snapshot = {};
            snapshot.date = currentSummary.end.date;
            snapshot.open = currentSummary.end.open;
            snapshot.direction = currentSummary.end.direction;
            snapshot.buys = currentSummary.period.buys;
            snapshot.sells = currentSummary.period.sells;
            snapshot.gain = currentSummary.period.realized;
            snapshot.basis = currentSummary.end.basis;
            snapshot.income = currentSummary.period.income;
            snapshot.value = currentSummary.end.value;
          } else {
            snapshot = position.snapshot;
          }
          return snapshot;
        }
        function calculateToday(reportDate, exchangeStatus) {
          if (reportDate instanceof Day5) {
            return reportDate;
          }
          if (exchangeStatus && exchangeStatus.currentDay instanceof Day5) {
            return exchangeStatus.currentDay;
          }
          return Day5.getToday();
        }
        function calculateQuoteDay(quote) {
          if (quote && quote.lastDay instanceof Day5) {
            return quote.lastDay;
          }
          return null;
        }
        function selectPriceFromLastPrice(quote) {
          return quote.lastPrice;
        }
        function selectPriceFromMidpoint(quote) {
          let price = null;
          if (is.number(quote.askPrice) && is.number(quote.bidPrice)) {
            price = (quote.askPrice + quote.bidPrice) / 2;
          }
          if (price === null || price === 0) {
            price = quote.lastPrice;
          }
          return price;
        }
        function getPriceSelector(portfolio, position) {
          let type = null;
          if (portfolio.miscellany && portfolio.miscellany.data && portfolio.miscellany.data.optionsValuation) {
            type = OptionsValuationType.parse(portfolio.miscellany.data.optionsValuation);
          }
          if (type === null) {
            type = OptionsValuationType.LAST_TRADE;
          }
          if (position.instrument.type.option && type === OptionsValuationType.MIDPOINT) {
            return selectPriceFromMidpoint;
          }
          return selectPriceFromLastPrice;
        }
        return PositionItem3;
      })();
    }
  });

  // lib/processing/PositionContainer.js
  var require_PositionContainer = __commonJS({
    "lib/processing/PositionContainer.js"(exports, module) {
      var array = require_array();
      var assert = require_assert();
      var ComparatorBuilder = require_ComparatorBuilder();
      var comparators = require_comparators();
      var Currency5 = require_Currency();
      var CurrencyTranslator2 = require_CurrencyTranslator();
      var Day5 = require_Day();
      var Decimal6 = require_Decimal();
      var Disposable = require_Disposable();
      var DisposableStack = require_DisposableStack();
      var Event = require_Event();
      var is = require_is();
      var Rate = require_Rate();
      var BindingTree2 = require_BindingTree();
      var PositionSummaryFrame5 = require_PositionSummaryFrame();
      var PositionLevelDefinition5 = require_PositionLevelDefinition();
      var PositionLevelType5 = require_PositionLevelType();
      var PositionTreeDefinition3 = require_PositionTreeDefinition();
      var PositionGroup2 = require_PositionGroup();
      var PositionItem3 = require_PositionItem();
      module.exports = (() => {
        "use strict";
        const DEFAULT_CURRENCY = Currency5.USD;
        const SUPPORTED_CURRENCIES = [
          Currency5.AUD,
          Currency5.CAD,
          Currency5.CHF,
          Currency5.CZK,
          Currency5.DKK,
          Currency5.GBP,
          Currency5.GBX,
          Currency5.EUR,
          Currency5.HKD,
          Currency5.JPY,
          Currency5.NOK,
          Currency5.SEK,
          Currency5.USD
        ];
        const STATIC_RATES = [
          Rate.fromPair(0.01, "^GBXGBP")
        ];
        class PositionContainer2 {
          constructor(definitions, portfolios, positions, summaries, reportFrame, reportDate, currencyPairs) {
            assert.argumentIsArray(definitions, "definitions", PositionTreeDefinition3, "PositionTreeDefinition");
            assert.argumentIsArray(portfolios, "portfolios");
            assert.argumentIsArray(positions, "positions");
            assert.argumentIsArray(summaries, "summaries");
            assert.argumentIsOptional(reportFrame, "reportFrame", PositionSummaryFrame5, "PositionSummaryFrame");
            if (reportFrame) {
              assert.argumentIsRequired(reportDate, "reportDate", Day5, "Day");
            }
            if (currencyPairs) {
              assert.argumentIsArray(currencyPairs, "currencyPairs");
              currencyPairs.forEach((currencyPair) => {
                assert.argumentIsArray(currencyPair, "currencyPair", Currency5, "Currency");
                assert.argumentIsValid(currencyPair.length, "currencyPair.length", (l) => l === 2, "has two items");
              });
            }
            this._definitions = definitions;
            this._groupObservers = {};
            this._calculationSuspensions = /* @__PURE__ */ new Set();
            this._suspendedForexQuotes = /* @__PURE__ */ new Map();
            this._suspendedPositionQuotes = /* @__PURE__ */ new Map();
            this._reporting = reportFrame instanceof PositionSummaryFrame5;
            this._useBarchartPriceFormattingRules = false;
            this._positionSymbolAddedEvent = new Event(this);
            this._positionSymbolRemovedEvent = new Event(this);
            this._exchanges = {};
            this._portfolios = portfolios.reduce((map, portfolio) => {
              map[portfolio.portfolio] = portfolio;
              return map;
            }, {});
            this._portfolioBindings = Object.keys(this._portfolios).map((key) => this._portfolios[key]);
            if (reportFrame) {
              this._reportDate = reportDate;
              this._currentSummaryFrame = reportFrame;
              this._currentSummaryRange = array.last(this._currentSummaryFrame.getPriorRanges(reportDate, 0));
              this._previousSummaryFrame = reportFrame;
              this._previousSummaryRanges = this._currentSummaryFrame.getPriorRanges(reportDate, 3);
              this._previousSummaryRanges.pop();
            } else {
              this._reportDate = null;
              this._currentSummaryFrame = PositionSummaryFrame5.YTD;
              this._currentSummaryRange = array.first(this._currentSummaryFrame.getRecentRanges(0));
              this._previousSummaryFrame = PositionSummaryFrame5.YEARLY;
              this._previousSummaryRanges = this._previousSummaryFrame.getRecentRanges(3);
              this._previousSummaryRanges.shift();
            }
            this._summariesCurrent = summaries.reduce((map, summary) => {
              addSummaryCurrent(map, summary, this._currentSummaryFrame, this._currentSummaryRange);
              return map;
            }, {});
            this._summariesPrevious = summaries.reduce((map, summary) => {
              addSummaryPrevious(map, summary, this._previousSummaryFrame, this._previousSummaryRanges);
              return map;
            }, {});
            this._items = positions.reduce((items, position) => {
              const item = createPositionItem.call(this, position, !!reportFrame);
              if (item) {
                items.push(item);
              }
              return items;
            }, []);
            this._symbols = this._items.reduce((map, item) => {
              addBarchartSymbol(map, item);
              return map;
            }, {});
            this._symbolsDisplay = this._items.reduce((map, item) => {
              addDisplaySymbol(map, item);
              return map;
            }, {});
            if (is.array(currencyPairs)) {
              currencyPairs.forEach((currencyPair) => {
                currencyPair.sort((a, b) => comparators.compareStrings(a.code, b.code));
              });
              this._forexSymbols = array.unique(currencyPairs.map((currencyPair) => {
                return `^${currencyPair[0].code}${currencyPair[1].code}`;
              }));
            } else {
              this._forexSymbols = SUPPORTED_CURRENCIES.reduce((symbols, currency) => {
                if (currency === DEFAULT_CURRENCY || currency === Currency5.GBX) {
                  return symbols;
                }
                symbols.push(`^${DEFAULT_CURRENCY.code}${currency.code}`);
                return symbols;
              }, []);
            }
            this._currencyTranslator = new CurrencyTranslator2(this._forexSymbols.concat(STATIC_RATES.map((r) => r.getSymbol())));
            const forexQuotes = this._forexSymbols.map((symbol) => {
              return Rate.fromPair(Decimal6.ONE, symbol);
            });
            this._currencyTranslator.setRates(forexQuotes.concat(STATIC_RATES));
            this._nodes = {};
            this._trees = this._definitions.reduce((map, treeDefinition) => {
              const tree = new BindingTree2();
              createGroups.call(this, tree, this._items, treeDefinition, treeDefinition.definitions);
              map[treeDefinition.name] = tree;
              return map;
            }, {});
            Object.keys(this._portfolios).forEach((key) => updateEmptyPortfolioGroups.call(this, this._portfolios[key]));
            recalculatePercentages.call(this);
          }
          /**
           * Suspends recalculation of aggregated position data.
           *
           * @public
           * @returns {Disposable}
           */
          suspendCalculations() {
            const token = {};
            const disposable = Disposable.fromAction(() => {
              if (this._calculationSuspensions.delete(token) && this._calculationSuspensions.size === 0) {
                const positionQuotes = [...this._suspendedPositionQuotes.values()];
                const forexQuotes = [...this._suspendedForexQuotes.values()];
                this._suspendedPositionQuotes = /* @__PURE__ */ new Map();
                this._suspendedForexQuotes = /* @__PURE__ */ new Map();
                Object.keys(this._trees).forEach((key) => {
                  this._trees[key].walk((group) => group.resumeCalculations(), false, false);
                });
                this.setQuotes(positionQuotes, forexQuotes);
              }
            });
            this._calculationSuspensions.add(token);
            if (this._calculationSuspensions.size === 1) {
              Object.keys(this._trees).forEach((key) => {
                this._trees[key].walk((group) => group.suspendCalculations(), false, false);
              });
              recalculatePercentages.call(this);
            }
            return disposable;
          }
          getCalculationsSuspended() {
            return this._calculationSuspensions.size !== 0;
          }
          /**
           * Returns Barchart's user identifier for the container's portfolios. If
           * the container has no portfolios, a null value is returned.
           *
           * @public
           * @returns {String|null}
           */
          getBarchartUserId() {
            const keys = Object.keys(this._portfolios);
            if (keys.length > 0) {
              const firstKey = keys[0];
              const firstPortfolio = this._portfolios[firstKey];
              return firstPortfolio.user;
            }
            return null;
          }
          /**
           * Returns customer's user identifier for the container's portfolios. If
           * the container has no portfolios, or if the portfolio(s) are not owned
           * by a remote customer, a null value is returned.
           *
           * @public
           * @returns {String|null}
           */
          getCustomerUserId() {
            const keys = Object.keys(this._portfolios);
            if (keys.length > 0) {
              const firstKey = keys[0];
              const firstPortfolio = this._portfolios[firstKey];
              if (firstPortfolio.legacy && firstPortfolio.legacy.user) {
                return firstPortfolio.legacy.user;
              }
            }
            return null;
          }
          /**
           * Indicates if a portfolio has been added to the container.
           *
           * @public
           * @param {Object} portfolio
           * @returns {boolean}
           */
          hasPortfolio(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", Object);
            assert.argumentIsRequired(portfolio.portfolio, "portfolio.portfolio", String);
            const key = portfolio.portfolio;
            return this._portfolios.hasOwnProperty(key);
          }
          /**
           * Adds a new portfolio to the container, injecting it into aggregation
           * trees, as necessary.
           *
           * @public
           * @param {Object} portfolio
           */
          addPortfolio(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", Object);
            assert.argumentIsRequired(portfolio.portfolio, "portfolio.portfolio", String);
            assert.argumentIsRequired(portfolio.name, "portfolio.name", String);
            if (this.hasPortfolio(portfolio)) {
              return;
            }
            const key = portfolio.portfolio;
            this._portfolios = Object.assign({}, this._portfolios, { [key]: portfolio });
            this._portfolioBindings.push(portfolio);
            this._definitions.forEach((treeDefinition) => {
              const tree = this._trees[treeDefinition.name];
              const levelDefinitions = treeDefinition.definitions;
              let portfolioRequiredGroup = null;
              let portfolioLevelDefinition = null;
              let portfolioLevelDefinitionIndex = null;
              levelDefinitions.forEach((levelDefinition, i) => {
                if (portfolioRequiredGroup === null) {
                  portfolioRequiredGroup = levelDefinition.generateRequiredGroup(portfolio);
                  if (portfolioRequiredGroup !== null) {
                    portfolioLevelDefinition = levelDefinition;
                    portfolioLevelDefinitionIndex = i;
                  }
                }
              });
              if (portfolioRequiredGroup !== null) {
                let parentTrees = [];
                if (portfolioLevelDefinitionIndex === 0) {
                  parentTrees.push(tree);
                } else {
                  const parentLevelDefinition = levelDefinitions[portfolioLevelDefinitionIndex - 1];
                  tree.walk((group, groupTree) => {
                    if (group.definition === parentLevelDefinition) {
                      parentTrees.push(groupTree);
                    }
                  }, false, false);
                }
                const overrideRequiredGroups = [portfolioRequiredGroup];
                parentTrees.forEach((t) => {
                  createGroups.call(this, t, [], treeDefinition, levelDefinitions.slice(portfolioLevelDefinitionIndex), overrideRequiredGroups);
                });
              }
            });
            updateEmptyPortfolioGroups.call(this, portfolio);
          }
          /**
           * Updates the portfolio data. For example, a portfolio's name might change.
           *
           * @public
           * @param {Object} portfolio
           */
          updatePortfolio(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", Object);
            assert.argumentIsRequired(portfolio.portfolio, "portfolio.portfolio", String);
            if (!this.hasPortfolio(portfolio)) {
              return;
            }
            this._portfolios[portfolio.portfolio] = portfolio;
            const portfolioIndex = this._portfolioBindings.findIndex((candidate) => candidate.portfolio === portfolio.portfolio);
            if (!(portfolioIndex < 0)) {
              this._portfolioBindings.splice(portfolioIndex, 1, portfolio);
            }
            getPositionItemsForPortfolio(this._items, portfolio.portfolio).forEach((item) => item.updatePortfolio(portfolio));
            updateEmptyPortfolioGroups.call(this, portfolio);
          }
          /**
           * Removes an existing portfolio, and all of its positions, from the container. This
           * also triggers removal of the portfolio and its positions from any applicable
           * aggregation trees.
           *
           * @public
           * @param {Object} portfolio
           */
          removePortfolio(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", Object);
            assert.argumentIsRequired(portfolio.portfolio, "portfolio.portfolio", String);
            if (!this.hasPortfolio(portfolio)) {
              return;
            }
            getPositionItemsForPortfolio(this._items, portfolio.portfolio).forEach((item) => removePositionItem.call(this, item));
            delete this._portfolios[portfolio.portfolio];
            this._portfolios = Object.assign({}, this._portfolios);
            array.remove(this._portfolioBindings, (candidate) => candidate.portfolio === portfolio.portfolio);
            Object.keys(this._trees).forEach((key) => {
              this._trees[key].walk((group, groupNode) => {
                if (group.definition.type === PositionLevelType5.PORTFOLIO && group.key === PositionLevelDefinition5.getKeyForPortfolioGroup(portfolio)) {
                  severGroupNode.call(this, groupNode);
                }
              }, true, false);
            });
            recalculatePercentages.call(this);
          }
          /**
           * Adds a new position to the container or updates an existing position already
           * in the container.
           *
           * @public
           * @param {Object} position
           * @param {Object[]} summaries
           */
          updatePosition(position, summaries) {
            assert.argumentIsRequired(position, "position", Object);
            assert.argumentIsRequired(position.position, "position.position", String);
            assert.argumentIsRequired(position.portfolio, "position.portfolio", String);
            assert.argumentIsArray(summaries, "summaries");
            if (!this._portfolios.hasOwnProperty(position.portfolio)) {
              return;
            }
            const existingBarchartSymbols = this.getPositionSymbols(false, false);
            let exchangeCode = extractExchangeCode(position);
            let exchange = null;
            if (exchangeCode !== null) {
              exchange = this._exchanges[exchangeCode] || null;
            }
            let currentQuote = null;
            let previousQuote = null;
            if (extractSymbolForBarchart(position)) {
              const similarPositionItem = this._items.find((item2) => extractSymbolForBarchart(item2.position) === extractSymbolForBarchart(position)) || null;
              if (similarPositionItem !== null) {
                currentQuote = similarPositionItem.quote || null;
                previousQuote = similarPositionItem.previousQuote || null;
              }
            }
            removePositionItem.call(this, this._items.find((item2) => item2.position.position === position.position));
            summaries.forEach((summary) => {
              addSummaryCurrent(this._summariesCurrent, summary, this._currentSummaryFrame, this._currentSummaryRange);
              addSummaryPrevious(this._summariesPrevious, summary, this._previousSummaryFrame, this._previousSummaryRanges);
            });
            const item = createPositionItem.call(this, position, false);
            addBarchartSymbol(this._symbols, item);
            addDisplaySymbol(this._symbolsDisplay, item);
            this._items.push(item);
            const createGroupOrInjectItem = (parentTree, treeDefinition, levelDefinitions) => {
              if (levelDefinitions.length === 0) {
                return;
              }
              const levelDefinition = levelDefinitions[0];
              const levelKey = levelDefinition.keySelector(item);
              let groupTree;
              if (parentTree.getChildren().length > 0) {
                groupTree = parentTree.findChild((childGroup) => childGroup.key === levelKey) || null;
              } else {
                groupTree = null;
              }
              if (groupTree !== null) {
                groupTree.getValue().addItem(item);
                createGroupOrInjectItem(groupTree, treeDefinition, array.dropLeft(levelDefinitions));
              } else {
                createGroups.call(this, parentTree, [item], treeDefinition, levelDefinitions, []);
              }
            };
            this._definitions.forEach((definition) => createGroupOrInjectItem(this._trees[definition.name], definition, definition.definitions));
            const addedBarchartSymbol = extractSymbolForBarchart(item.position);
            if (addedBarchartSymbol !== null && !existingBarchartSymbols.some((existingBarchartSymbol) => existingBarchartSymbol === addedBarchartSymbol)) {
              this._positionSymbolAddedEvent.fire(addedBarchartSymbol);
            }
            if (exchange !== null) {
              item.setExchangeStatus(exchange);
            }
            if (previousQuote !== null) {
              item.setQuote(previousQuote);
            }
            if (currentQuote !== null) {
              item.setQuote(currentQuote);
            }
            recalculatePercentages.call(this);
          }
          /**
           * Removes a single position from the container.
           *
           * @public
           * @param {Object} position
           */
          removePosition(position) {
            assert.argumentIsRequired(position, "position", Object);
            assert.argumentIsRequired(position.position, "position.position", String);
            const positionItemToRemove = this._items.find((item) => item.position.position === position.position);
            const positionToRemove = positionItemToRemove ? positionItemToRemove.position || null : null;
            removePositionItem.call(this, positionItemToRemove);
            recalculatePercentages.call(this);
            if (positionToRemove) {
              const existingBarchartSymbols = this.getPositionSymbols(false, false);
              const removedBarchartSymbol = extractSymbolForBarchart(positionToRemove);
              if (removedBarchartSymbol !== null && !existingBarchartSymbols.some((existingBarchartSymbol) => existingBarchartSymbol === removedBarchartSymbol)) {
                this._positionSymbolRemovedEvent.fire(removedBarchartSymbol);
              }
            }
          }
          /**
           * Returns a distinct list of all symbols used by the positions
           * within the container.
           *
           * @public
           * @param {Boolean} display - If true, all "display" symbols are returned; otherwise Barchart symbols are returned.
           * @param {Boolean} excludeExpired - If true, only symbols for non-expired positions will be returned.
           * @returns {String[]}
           */
          getPositionSymbols(display, excludeExpired) {
            let items = this._items;
            if (excludeExpired) {
              items = items.filter((item) => !item.data.expired);
            }
            const symbols = items.reduce((symbols2, item) => {
              const position = item.position;
              let symbol;
              if (display) {
                symbol = extractSymbolForDisplay(position);
              } else {
                symbol = extractSymbolForBarchart(position);
              }
              if (symbol !== null) {
                symbols2.push(symbol);
              }
              return symbols2;
            }, []);
            return array.unique(symbols);
          }
          /**
           * Causes a position to be flagged as locked (for editing).
           *
           * @public
           * @param {Object} position
           */
          setPositionLock(position) {
            if (position) {
              assert.argumentIsRequired(position, "position", Object);
              assert.argumentIsRequired(position.position, "position.position", String);
              const item = this._items.find((i) => i.position.position === position.position);
              if (item) {
                item.setPositionLock(position);
              }
            }
          }
          /**
           * Returns a position's lock status.
           *
           * @public
           * @param {Object} position
           * @returns {Boolean}
           */
          getPositionLock(position) {
            assert.argumentIsRequired(position, "position", Object);
            assert.argumentIsRequired(position.position, "position.position", String);
            const item = this._items.find((i) => i.position.position === position.position);
            return is.object(item) && item.data.locked;
          }
          /**
           * Causes a position to be flagged as calculating.
           *
           * @public
           * @param {Object} position
           */
          setPositionCalculating(position) {
            if (position) {
              assert.argumentIsRequired(position, "position", Object);
              assert.argumentIsRequired(position.position, "position.position", String);
              const item = this._items.find((i) => i.position.position === position.position);
              if (item) {
                item.setPositionCalculating(position);
              }
            }
          }
          /**
           * Returns a position's calculating status.
           *
           * @public
           * @param {Object} position
           * @returns {Boolean}
           */
          getPositionCalculating(position) {
            assert.argumentIsRequired(position, "position", Object);
            assert.argumentIsRequired(position.position, "position.position", String);
            const item = this._items.find((i) => i.position.position === position.position);
            return is.object(item) && item.data.calculating;
          }
          /**
           * Performs a batch update of both position quotes and forex quotes,
           * triggering updates to position(s) and data aggregation(s).
           *
           * @public
           * @param {Quote[]} positionQuotes
           * @param {Quote[]} forexQuotes
           * @param {Boolean=} force
           */
          setQuotes(positionQuotes, forexQuotes, force) {
            assert.argumentIsArray(positionQuotes, "positionQuotes");
            assert.argumentIsArray(forexQuotes, "forexQuotes");
            assert.argumentIsOptional(force, "force", Boolean);
            if (this.getCalculationsSuspended()) {
              forexQuotes.forEach((quote) => {
                const symbol = quote.symbol;
                this._suspendedForexQuotes.set(symbol, quote);
              });
              positionQuotes.forEach((quote) => {
                const symbol = quote.symbol;
                this._suspendedPositionQuotes.set(symbol, quote);
              });
              return;
            }
            if (forexQuotes.length !== 0) {
              forexQuotes.forEach((quote) => {
                const symbol = quote.symbol;
                if (symbol) {
                  const rate = Rate.fromPair(quote.lastPrice, symbol);
                  this._currencyTranslator.setRate(rate);
                }
              });
              Object.keys(this._trees).forEach((key) => {
                this._trees[key].walk((group) => group.refreshTranslations(), true, false);
              });
            }
            if (positionQuotes.length !== 0) {
              positionQuotes.forEach((quote) => {
                const symbol = quote.symbol;
                if (symbol) {
                  if (this._symbols.hasOwnProperty(symbol)) {
                    this._symbols[symbol].forEach((item) => item.setQuote(quote, force || false));
                  }
                }
              });
            }
            if (positionQuotes.length !== 0 || forexQuotes.length !== 0) {
              recalculatePercentages.call(this);
            }
          }
          /**
           * Performs an update of an exchange's status, triggering updates to position(s) and
           * data aggregation(s).
           *
           * @public
           * @param {ExchangeStatus} exchange
           */
          setExchangeStatus(exchange) {
            assert.argumentIsRequired(exchange, "exchange", Object);
            assert.argumentIsRequired(exchange.code, "exchange.code", String);
            assert.argumentIsRequired(exchange.currentDay, "exchange.currentDay", Day5, "Day");
            assert.argumentIsRequired(exchange.currentOpened, "exchange.currentOpened", Boolean);
            const code = exchange.code;
            this._exchanges[code] = exchange;
            this._items.forEach((item) => {
              if (extractExchangeCode(item.position) === code) {
                item.setExchangeStatus(exchange);
              }
            });
          }
          /**
           * Returns current price for symbol provided.
           *
           * @public
           * @param {String} symbol
           * @returns {null|Number}
           */
          getCurrentPrice(symbol) {
            assert.argumentIsRequired(symbol, "symbol", String);
            let price;
            if (this._symbols.hasOwnProperty(symbol) && this._symbols[symbol].length > 0) {
              price = this._symbols[symbol][0].currentPrice;
            } else {
              price = null;
            }
            return price;
          }
          /**
           * Returns the exchange code for the symbol
           *
           * @public
           * @param {string} symbol
           * @returns {string|null}
           */
          getExchangeCode(symbol) {
            assert.argumentIsRequired(symbol, "symbol", String);
            let code;
            if (this._symbols.hasOwnProperty(symbol) && this._symbols[symbol].length > 0) {
              code = extractExchangeCode(this._symbols[symbol][0].position);
            } else {
              code = null;
            }
            return code;
          }
          /**
           * Returns all forex symbols that are required to do currency translations.
           *
           * @public
           * @returns {String[]}
           */
          getForexSymbols() {
            return this._forexSymbols;
          }
          /**
           * Updates fundamental data for a single symbol.
           *
           * @public
           * @param {String} symbol
           * @param {Boolean} display
           * @param {Object} data
           */
          setPositionFundamentalData(symbol, display, data) {
            assert.argumentIsRequired(symbol, "symbol", String);
            assert.argumentIsRequired(display, "display", Boolean);
            assert.argumentIsRequired(data, "data", Object);
            let map;
            if (display) {
              map = this._symbolsDisplay;
            } else {
              map = this._symbols;
            }
            if (map.hasOwnProperty(symbol)) {
              map[symbol].forEach((item) => item.setPositionFundamentalData(data));
            }
          }
          /**
           * Indicates if a news article exists for a symbol.
           *
           * @public
           * @param {String} symbol
           * @param {Boolean} display
           * @param {Boolean} exists
           */
          setNewsArticleExists(symbol, display, exists) {
            assert.argumentIsRequired(symbol, "symbol", String);
            assert.argumentIsRequired(display, "display", Boolean);
            assert.argumentIsRequired(exists, "exists", Boolean);
            let map;
            if (display) {
              map = this._symbolsDisplay;
            } else {
              map = this._symbols;
            }
            if (map.hasOwnProperty(symbol)) {
              map[symbol].forEach((item) => item.setNewsArticleExists(exists));
            }
          }
          /**
           * Returns a single level of grouping from one of the internal trees.
           *
           * @public
           * @param {String} name
           * @param {String[]} keys
           * @returns {PositionGroupBinding}
           */
          getGroup(name, keys) {
            assert.argumentIsRequired(name, "name", String);
            assert.argumentIsArray(keys, "keys", String);
            return findNode(this._trees[name], keys).getValue().binding;
          }
          /**
           * Returns all child groups from a level of grouping within one of
           * the internal trees.
           *
           * @public
           * @param {String} name
           * @param {String[]} keys
           * @returns {PositionGroupBinding[]}
           */
          getGroups(name, keys) {
            assert.argumentIsRequired(name, "name", String);
            assert.argumentIsArray(keys, "keys", String);
            return findNode(this._trees[name], keys).getChildren2();
          }
          /**
           * Returns the immediate parent {@link PositionGroup} of a {@link PositionGroup}.
           *
           * @public
           * @param {PositionGroup} group
           * @returns {PositionGroup|null}
           */
          getParentGroup(group) {
            assert.argumentIsRequired(group, "group", PositionGroup2, "PositionGroup");
            return findParentGroup.call(this, group, (candidate) => true);
          }
          /**
           * Returns the parent {@link PositionGroup} which represents a portfolio.
           *
           * @public
           * @param {PositionGroup} group
           * @returns {PositionGroup|null}
           */
          getParentGroupForPortfolio(group) {
            assert.argumentIsRequired(group, "group", PositionGroup2, "PositionGroup");
            return findParentGroup.call(this, group, (candidate) => candidate.definition.type === PositionLevelType5.PORTFOLIO);
          }
          /**
           * Returns all portfolios in the container.
           *
           * @public
           * @returns {Object[]}
           */
          getPortfolios() {
            return this._portfolioBindings;
          }
          /**
           * Returns all positions for the given portfolio.
           *
           * @public
           * @param {String} portfolio
           * @returns {Object[]}
           */
          getPositions(portfolio) {
            assert.argumentIsRequired(portfolio, "portfolio", String);
            return getPositionItemsForPortfolio(this._items, portfolio).map((item) => {
              return item.position;
            });
          }
          /**
           * Returns a single position for a portfolio.
           *
           * @public
           * @param {String} portfolio
           * @param {String} position
           * @returns {Object|null}
           */
          getPosition(portfolio, position) {
            assert.argumentIsRequired(position, "position", String);
            return this.getPositions(portfolio).find((p) => p.position === position) || null;
          }
          /**
           * Registers an observer for symbol addition (this occurs when a new position is added
           * for a symbol that does not already exist in the container). This event only fires
           * after the constructor completes (and initial positions have been added).
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerPositionSymbolAddedHandler(handler) {
            return this._positionSymbolAddedEvent.register(handler);
          }
          /**
           * Registers an observer for symbol removal (this occurs when the last position for a
           * symbol is removed from the container).
           *
           * @public
           * @param {Function} handler
           * @returns {Disposable}
           */
          registerPositionSymbolRemovedHandler(handler) {
            return this._positionSymbolRemovedEvent.register(handler);
          }
          /**
           * Changes rules for price formatting.
           *
           * @public
           * @param {boolean} value
           */
          setBarchartPriceFormattingRules(value) {
            assert.argumentIsRequired(value, "value", Boolean);
            if (this._useBarchartPriceFormattingRules !== value) {
              this._useBarchartPriceFormattingRules = value;
              Object.keys(this._trees).forEach((key) => {
                this._trees[key].walk((group) => group.setBarchartPriceFormattingRules(this._useBarchartPriceFormattingRules));
              });
            }
          }
          toString() {
            return "[PositionContainer]";
          }
        }
        function findNode(tree, keys) {
          return keys.reduce((tree2, key) => tree2.findChild((group) => group.key === key), tree);
        }
        function findParentGroup(group, predicate) {
          const groupNode = this._nodes[group.id];
          if (groupNode) {
            const resultNode = groupNode.findParent((candidateGroup, candidateNode) => !candidateNode.getIsRoot() && predicate(candidateGroup));
            if (resultNode) {
              return resultNode.getValue();
            }
          }
          return null;
        }
        function extractSymbolForBarchart(position) {
          if (position.instrument && position.instrument.symbol && position.instrument.symbol.barchart) {
            return position.instrument.symbol.barchart;
          }
          return null;
        }
        function extractSymbolForDisplay(position) {
          if (position.instrument && position.instrument.symbol && position.instrument.symbol.display) {
            return position.instrument.symbol.display;
          }
          return null;
        }
        function extractExchangeCode(position) {
          if (position.instrument && position.instrument.exchange) {
            return position.instrument.exchange;
          }
          return null;
        }
        function addGroupObserver(group, disposable) {
          const id = group.id;
          if (!this._groupObservers.hasOwnProperty(id)) {
            this._groupObservers[id] = new DisposableStack();
          }
          this._groupObservers[id].push(disposable);
        }
        function initializeGroupObservers(groupTree, treeDefinition) {
          const group = groupTree.getValue();
          addGroupObserver.call(this, group, group.registerGroupExcludedChangeHandler(() => {
            groupTree.climb((parentGroup, parentTree) => {
              if (parentGroup) {
                let excludedItems = [];
                parentTree.walk((childGroup) => {
                  if (childGroup.excluded) {
                    excludedItems = excludedItems.concat(childGroup.items);
                  }
                }, false, false);
                parentGroup.setExcludedItems(array.unique(excludedItems));
              }
            }, false);
            if (treeDefinition.exclusionDependencies.length > 0) {
              const dependantTrees = treeDefinition.exclusionDependencies.reduce((trees, name) => {
                if (this._trees.hasOwnProperty(name)) {
                  trees.push(this._trees[name]);
                }
                return trees;
              }, []);
              if (dependantTrees.length > 0) {
                let excludedItems = [];
                groupTree.getRoot().walk((childGroup) => {
                  if (childGroup.excluded) {
                    excludedItems = excludedItems.concat(childGroup.items);
                  }
                }, false, false);
                dependantTrees.forEach((dependantTrees2) => {
                  dependantTrees2.walk((childGroup) => {
                    childGroup.setExcludedItems(excludedItems);
                  }, false, false);
                });
              }
            }
            recalculatePercentages.call(this);
          }));
        }
        function createGroups(parentTree, items, treeDefinition, levelDefinitions, overrideRequiredGroups) {
          if (levelDefinitions.length === 0) {
            return;
          }
          const currencyTranslator = this._currencyTranslator;
          const levelDefinition = levelDefinitions[0];
          const populatedObjects = array.groupBy(items, levelDefinition.keySelector);
          const populatedGroups = Object.keys(populatedObjects).reduce((list, key) => {
            const items2 = populatedObjects[key];
            const first = items2[0];
            const group = new PositionGroup2(levelDefinition, items2, levelDefinition.currencySelector(first), currencyTranslator, key, levelDefinition.descriptionSelector(first), this.getCalculationsSuspended());
            group.setBarchartPriceFormattingRules(this._useBarchartPriceFormattingRules);
            list.push(group);
            return list;
          }, []);
          const requiredGroupsToUse = overrideRequiredGroups || levelDefinition.requiredGroups;
          const missingGroups = array.difference(requiredGroupsToUse.map((group) => group.key), populatedGroups.map((group) => group.key)).map((key) => {
            return requiredGroupsToUse.find((g) => g.key === key);
          });
          const emptyGroups = missingGroups.map((group) => {
            const empty = new PositionGroup2(levelDefinition, [], group.currency, currencyTranslator, group.key, group.description, this.getCalculationsSuspended());
            empty.setBarchartPriceFormattingRules(this._useBarchartPriceFormattingRules);
            return empty;
          });
          const compositeGroups = populatedGroups.concat(emptyGroups);
          let builder;
          if (requiredGroupsToUse.length !== 0) {
            const ordering = requiredGroupsToUse.reduce((map, group, index) => {
              map[group.description] = index;
              return map;
            }, {});
            const getIndex = (description) => {
              if (ordering.hasOwnProperty(description)) {
                return ordering[description];
              } else {
                return Number.MAX_VALUE;
              }
            };
            builder = ComparatorBuilder.startWith((a, b) => {
              return comparators.compareNumbers(getIndex(a.description), getIndex(b.description));
            }).thenBy((a, b) => {
              return comparators.compareStrings(a.description, b.description);
            });
          } else {
            builder = ComparatorBuilder.startWith((a, b) => {
              return comparators.compareStrings(a.description, b.description);
            });
          }
          compositeGroups.sort(builder.toComparator());
          compositeGroups.forEach((group) => {
            const childTree = parentTree.addChild(group);
            this._nodes[group.id] = childTree;
            group.setParentGroup(this.getParentGroup(group));
            group.setPortfolioGroup(this.getParentGroupForPortfolio(group));
            initializeGroupObservers.call(this, childTree, treeDefinition);
            createGroups.call(this, childTree, group.items, treeDefinition, array.dropLeft(levelDefinitions));
          });
        }
        function updateEmptyPortfolioGroups(portfolio) {
          Object.keys(this._trees).forEach((key) => {
            this._trees[key].walk((group) => {
              if (group.definition.type === PositionLevelType5.PORTFOLIO && group.key === PositionLevelDefinition5.getKeyForPortfolioGroup(portfolio) && group.getIsEmpty()) {
                group.updatePortfolio(portfolio);
              }
            }, true, false);
          });
        }
        function getPositionItemsForPortfolio(items, portfolio) {
          return items.reduce((positionItems, item) => {
            if (item.position.portfolio === portfolio) {
              positionItems.push(item);
            }
            return positionItems;
          }, []);
        }
        function getSummaryArray(ranges) {
          return ranges.map((range) => null);
        }
        function addSummaryCurrent(map, summary, currentSummaryFrame, currentSummaryRange) {
          if (summary.frame === currentSummaryFrame && currentSummaryRange.start.getIsEqual(summary.start.date) && currentSummaryRange.end.getIsEqual(summary.end.date)) {
            const key = summary.position;
            map[key] = summary;
          }
        }
        function addSummaryPrevious(map, summary, previousSummaryFrame, previousSummaryRanges) {
          if (summary.frame === previousSummaryFrame) {
            const key = summary.position;
            if (!map.hasOwnProperty(key)) {
              map[key] = getSummaryArray(previousSummaryRanges);
            }
            const index = previousSummaryRanges.findIndex((r) => r.start.getIsEqual(summary.start.date) && r.end.getIsEqual(summary.end.date));
            if (!(index < 0)) {
              map[key][index] = summary;
            }
          }
        }
        function addBarchartSymbol(map, item) {
          const barchartSymbol = extractSymbolForBarchart(item.position);
          if (barchartSymbol) {
            if (!map.hasOwnProperty(barchartSymbol)) {
              map[barchartSymbol] = [];
            }
            map[barchartSymbol].push(item);
          }
        }
        function addDisplaySymbol(map, item) {
          const displaySymbol = extractSymbolForDisplay(item.position);
          if (displaySymbol) {
            if (!map.hasOwnProperty(displaySymbol)) {
              map[displaySymbol] = [];
            }
            map[displaySymbol].push(item);
          }
        }
        function createPositionItem(position, requireCurrentSummary) {
          const portfolio = this._portfolios[position.portfolio];
          if (portfolio) {
            const currentSummary = this._summariesCurrent[position.position] || null;
            const previousSummaries = this._summariesPrevious[position.position] || getSummaryArray(this._previousSummaryRanges);
            if (!requireCurrentSummary || currentSummary !== null) {
              return new PositionItem3(portfolio, position, currentSummary, previousSummaries, this._reporting, this._reportDate);
            }
          }
          return null;
        }
        function removePositionItem(positionItem) {
          if (!positionItem) {
            return;
          }
          delete this._summariesCurrent[positionItem.position.position];
          delete this._summariesPrevious[positionItem.position.position];
          array.remove(this._items, (i) => i === positionItem);
          const barchartSymbol = extractSymbolForBarchart(positionItem.position);
          if (this._symbols.hasOwnProperty(barchartSymbol)) {
            array.remove(this._symbols[barchartSymbol], (i) => i === positionItem);
          }
          const displaySymbol = extractSymbolForDisplay(positionItem.position);
          if (this._symbolsDisplay.hasOwnProperty(displaySymbol)) {
            array.remove(this._symbolsDisplay[displaySymbol], (i) => i === positionItem);
          }
          Object.keys(this._trees).forEach((key) => {
            this._trees[key].walk((group, groupNode) => {
              if (group.definition.type === PositionLevelType5.POSITION && group.key === positionItem.position.position) {
                severGroupNode.call(this, groupNode);
              }
            }, true, false);
          });
          positionItem.dispose();
        }
        function severGroupNode(groupNodeToSever) {
          groupNodeToSever.sever();
          groupNodeToSever.walk((group) => {
            delete this._nodes[group.id];
            if (this._groupObservers.hasOwnProperty(group.id)) {
              const disposable = this._groupObservers[group.id];
              delete this._groupObservers[group.id];
              disposable.dispose();
            }
          }, false, true);
        }
        function recalculatePercentages() {
          if (this.getCalculationsSuspended()) {
            return;
          }
          Object.keys(this._trees).forEach((key) => {
            this._trees[key].walk((group) => group.refreshMarketPercent(), false, false);
          });
        }
        return PositionContainer2;
      })();
    }
  });

  // test/utils/processing/PositionTestFactory.js
  var require_PositionTestFactory = __commonJS({
    "test/utils/processing/PositionTestFactory.js"(exports, module) {
      var Currency5 = require_Currency();
      var Decimal6 = require_Decimal();
      var InstrumentType4 = require_InstrumentType();
      var PositionDirection = require_PositionDirection();
      var positionCounter = 0;
      function resetPositionCounter() {
        positionCounter = 0;
      }
      function createPortfolio(portfolio, name, overrides) {
        return Object.assign({
          portfolio: portfolio || "My Portfolio",
          name: name || "Portfolio"
        }, overrides || {});
      }
      function createPosition(portfolio, symbol, currency, overrides) {
        return Object.assign({
          portfolio,
          position: (positionCounter++).toString(),
          instrument: {
            symbol: {
              barchart: symbol
            },
            currency: currency || Currency5.USD,
            type: InstrumentType4.EQUITY
          },
          snapshot: {
            basis: new Decimal6(123),
            value: new Decimal6(456),
            open: new Decimal6(1),
            direction: PositionDirection.LONG,
            income: new Decimal6(0),
            gain: new Decimal6(0),
            buys: new Decimal6(50),
            sells: new Decimal6(0)
          }
        }, overrides || {});
      }
      function createSummaries(position, frame, count) {
        const ranges = frame.getRecentRanges(count - 1);
        return ranges.map((range) => {
          return {
            portfolio: position.portfolio,
            position: position.position,
            frame,
            start: {
              date: range.start,
              open: position.snapshot.open,
              value: position.snapshot.value,
              basis: position.snapshot.basis
            },
            end: {
              date: range.end,
              open: position.snapshot.open,
              value: position.snapshot.value,
              basis: position.snapshot.basis
            },
            period: {
              buys: new Decimal6(0),
              sells: new Decimal6(0),
              income: new Decimal6(0),
              realized: new Decimal6(0),
              unrealized: new Decimal6(0)
            }
          };
        });
      }
      module.exports = {
        createPortfolio,
        createPosition,
        createSummaries,
        resetPositionCounter
      };
    }
  });

  // node_modules/axios/lib/helpers/bind.js
  var require_bind = __commonJS({
    "node_modules/axios/lib/helpers/bind.js"(exports, module) {
      "use strict";
      module.exports = function bind(fn, thisArg) {
        return function wrap() {
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          return fn.apply(thisArg, args);
        };
      };
    }
  });

  // node_modules/axios/lib/utils.js
  var require_utils = __commonJS({
    "node_modules/axios/lib/utils.js"(exports, module) {
      "use strict";
      var bind = require_bind();
      var toString = Object.prototype.toString;
      function isArray(val) {
        return toString.call(val) === "[object Array]";
      }
      function isUndefined(val) {
        return typeof val === "undefined";
      }
      function isBuffer(val) {
        return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
      }
      function isArrayBuffer(val) {
        return toString.call(val) === "[object ArrayBuffer]";
      }
      function isFormData(val) {
        return typeof FormData !== "undefined" && val instanceof FormData;
      }
      function isArrayBufferView(val) {
        var result;
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          result = ArrayBuffer.isView(val);
        } else {
          result = val && val.buffer && val.buffer instanceof ArrayBuffer;
        }
        return result;
      }
      function isString(val) {
        return typeof val === "string";
      }
      function isNumber(val) {
        return typeof val === "number";
      }
      function isObject(val) {
        return val !== null && typeof val === "object";
      }
      function isPlainObject(val) {
        if (toString.call(val) !== "[object Object]") {
          return false;
        }
        var prototype = Object.getPrototypeOf(val);
        return prototype === null || prototype === Object.prototype;
      }
      function isDate(val) {
        return toString.call(val) === "[object Date]";
      }
      function isFile(val) {
        return toString.call(val) === "[object File]";
      }
      function isBlob(val) {
        return toString.call(val) === "[object Blob]";
      }
      function isFunction(val) {
        return toString.call(val) === "[object Function]";
      }
      function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
      }
      function isURLSearchParams(val) {
        return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
      }
      function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
      }
      function isStandardBrowserEnv() {
        if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
          return false;
        }
        return typeof window !== "undefined" && typeof document !== "undefined";
      }
      function forEach(obj, fn) {
        if (obj === null || typeof obj === "undefined") {
          return;
        }
        if (typeof obj !== "object") {
          obj = [obj];
        }
        if (isArray(obj)) {
          for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              fn.call(null, obj[key], key, obj);
            }
          }
        }
      }
      function merge() {
        var result = {};
        function assignValue(val, key) {
          if (isPlainObject(result[key]) && isPlainObject(val)) {
            result[key] = merge(result[key], val);
          } else if (isPlainObject(val)) {
            result[key] = merge({}, val);
          } else if (isArray(val)) {
            result[key] = val.slice();
          } else {
            result[key] = val;
          }
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
          forEach(arguments[i], assignValue);
        }
        return result;
      }
      function extend(a, b, thisArg) {
        forEach(b, function assignValue(val, key) {
          if (thisArg && typeof val === "function") {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
        });
        return a;
      }
      function stripBOM(content) {
        if (content.charCodeAt(0) === 65279) {
          content = content.slice(1);
        }
        return content;
      }
      module.exports = {
        isArray,
        isArrayBuffer,
        isBuffer,
        isFormData,
        isArrayBufferView,
        isString,
        isNumber,
        isObject,
        isPlainObject,
        isUndefined,
        isDate,
        isFile,
        isBlob,
        isFunction,
        isStream,
        isURLSearchParams,
        isStandardBrowserEnv,
        forEach,
        merge,
        extend,
        trim,
        stripBOM
      };
    }
  });

  // node_modules/axios/lib/helpers/buildURL.js
  var require_buildURL = __commonJS({
    "node_modules/axios/lib/helpers/buildURL.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      function encode(val) {
        return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      module.exports = function buildURL(url, params, paramsSerializer) {
        if (!params) {
          return url;
        }
        var serializedParams;
        if (paramsSerializer) {
          serializedParams = paramsSerializer(params);
        } else if (utils.isURLSearchParams(params)) {
          serializedParams = params.toString();
        } else {
          var parts = [];
          utils.forEach(params, function serialize(val, key) {
            if (val === null || typeof val === "undefined") {
              return;
            }
            if (utils.isArray(val)) {
              key = key + "[]";
            } else {
              val = [val];
            }
            utils.forEach(val, function parseValue(v) {
              if (utils.isDate(v)) {
                v = v.toISOString();
              } else if (utils.isObject(v)) {
                v = JSON.stringify(v);
              }
              parts.push(encode(key) + "=" + encode(v));
            });
          });
          serializedParams = parts.join("&");
        }
        if (serializedParams) {
          var hashmarkIndex = url.indexOf("#");
          if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
          }
          url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
        }
        return url;
      };
    }
  });

  // node_modules/axios/lib/core/InterceptorManager.js
  var require_InterceptorManager = __commonJS({
    "node_modules/axios/lib/core/InterceptorManager.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      function InterceptorManager() {
        this.handlers = [];
      }
      InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      };
      InterceptorManager.prototype.eject = function eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      };
      InterceptorManager.prototype.forEach = function forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      };
      module.exports = InterceptorManager;
    }
  });

  // node_modules/axios/lib/helpers/normalizeHeaderName.js
  var require_normalizeHeaderName = __commonJS({
    "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = function normalizeHeaderName(headers, normalizedName) {
        utils.forEach(headers, function processHeader(value, name) {
          if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = value;
            delete headers[name];
          }
        });
      };
    }
  });

  // node_modules/axios/lib/core/enhanceError.js
  var require_enhanceError = __commonJS({
    "node_modules/axios/lib/core/enhanceError.js"(exports, module) {
      "use strict";
      module.exports = function enhanceError(error, config, code, request, response) {
        error.config = config;
        if (code) {
          error.code = code;
        }
        error.request = request;
        error.response = response;
        error.isAxiosError = true;
        error.toJSON = function toJSON() {
          return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: this.config,
            code: this.code
          };
        };
        return error;
      };
    }
  });

  // node_modules/axios/lib/core/createError.js
  var require_createError = __commonJS({
    "node_modules/axios/lib/core/createError.js"(exports, module) {
      "use strict";
      var enhanceError = require_enhanceError();
      module.exports = function createError(message, config, code, request, response) {
        var error = new Error(message);
        return enhanceError(error, config, code, request, response);
      };
    }
  });

  // node_modules/axios/lib/core/settle.js
  var require_settle = __commonJS({
    "node_modules/axios/lib/core/settle.js"(exports, module) {
      "use strict";
      var createError = require_createError();
      module.exports = function settle(resolve, reject, response) {
        var validateStatus = response.config.validateStatus;
        if (!response.status || !validateStatus || validateStatus(response.status)) {
          resolve(response);
        } else {
          reject(createError(
            "Request failed with status code " + response.status,
            response.config,
            null,
            response.request,
            response
          ));
        }
      };
    }
  });

  // node_modules/axios/lib/helpers/cookies.js
  var require_cookies = __commonJS({
    "node_modules/axios/lib/helpers/cookies.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = utils.isStandardBrowserEnv() ? (
        // Standard browser envs support document.cookie
        /* @__PURE__ */ (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + "=" + encodeURIComponent(value));
              if (utils.isNumber(expires)) {
                cookie.push("expires=" + new Date(expires).toGMTString());
              }
              if (utils.isString(path)) {
                cookie.push("path=" + path);
              }
              if (utils.isString(domain)) {
                cookie.push("domain=" + domain);
              }
              if (secure === true) {
                cookie.push("secure");
              }
              document.cookie = cookie.join("; ");
            },
            read: function read(name) {
              var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
              return match ? decodeURIComponent(match[3]) : null;
            },
            remove: function remove(name) {
              this.write(name, "", Date.now() - 864e5);
            }
          };
        })()
      ) : (
        // Non standard browser env (web workers, react-native) lack needed support.
        /* @__PURE__ */ (function nonStandardBrowserEnv() {
          return {
            write: function write() {
            },
            read: function read() {
              return null;
            },
            remove: function remove() {
            }
          };
        })()
      );
    }
  });

  // node_modules/axios/lib/helpers/isAbsoluteURL.js
  var require_isAbsoluteURL = __commonJS({
    "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module) {
      "use strict";
      module.exports = function isAbsoluteURL(url) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
      };
    }
  });

  // node_modules/axios/lib/helpers/combineURLs.js
  var require_combineURLs = __commonJS({
    "node_modules/axios/lib/helpers/combineURLs.js"(exports, module) {
      "use strict";
      module.exports = function combineURLs(baseURL, relativeURL) {
        return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
      };
    }
  });

  // node_modules/axios/lib/core/buildFullPath.js
  var require_buildFullPath = __commonJS({
    "node_modules/axios/lib/core/buildFullPath.js"(exports, module) {
      "use strict";
      var isAbsoluteURL = require_isAbsoluteURL();
      var combineURLs = require_combineURLs();
      module.exports = function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
          return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
      };
    }
  });

  // node_modules/axios/lib/helpers/parseHeaders.js
  var require_parseHeaders = __commonJS({
    "node_modules/axios/lib/helpers/parseHeaders.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var ignoreDuplicateOf = [
        "age",
        "authorization",
        "content-length",
        "content-type",
        "etag",
        "expires",
        "from",
        "host",
        "if-modified-since",
        "if-unmodified-since",
        "last-modified",
        "location",
        "max-forwards",
        "proxy-authorization",
        "referer",
        "retry-after",
        "user-agent"
      ];
      module.exports = function parseHeaders(headers) {
        var parsed = {};
        var key;
        var val;
        var i;
        if (!headers) {
          return parsed;
        }
        utils.forEach(headers.split("\n"), function parser(line) {
          i = line.indexOf(":");
          key = utils.trim(line.substr(0, i)).toLowerCase();
          val = utils.trim(line.substr(i + 1));
          if (key) {
            if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
              return;
            }
            if (key === "set-cookie") {
              parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
            } else {
              parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
            }
          }
        });
        return parsed;
      };
    }
  });

  // node_modules/axios/lib/helpers/isURLSameOrigin.js
  var require_isURLSameOrigin = __commonJS({
    "node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = utils.isStandardBrowserEnv() ? (
        // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement("a");
          var originURL;
          function resolveURL(url) {
            var href = url;
            if (msie) {
              urlParsingNode.setAttribute("href", href);
              href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute("href", href);
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
            };
          }
          originURL = resolveURL(window.location.href);
          return function isURLSameOrigin(requestURL) {
            var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
            return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
          };
        })()
      ) : (
        // Non standard browser envs (web workers, react-native) lack needed support.
        /* @__PURE__ */ (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
      );
    }
  });

  // node_modules/axios/lib/adapters/xhr.js
  var require_xhr = __commonJS({
    "node_modules/axios/lib/adapters/xhr.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var settle = require_settle();
      var cookies = require_cookies();
      var buildURL = require_buildURL();
      var buildFullPath = require_buildFullPath();
      var parseHeaders = require_parseHeaders();
      var isURLSameOrigin = require_isURLSameOrigin();
      var createError = require_createError();
      module.exports = function xhrAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
          var requestData = config.data;
          var requestHeaders = config.headers;
          var responseType = config.responseType;
          if (utils.isFormData(requestData)) {
            delete requestHeaders["Content-Type"];
          }
          var request = new XMLHttpRequest();
          if (config.auth) {
            var username = config.auth.username || "";
            var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
            requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
          }
          var fullPath = buildFullPath(config.baseURL, config.url);
          request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
          request.timeout = config.timeout;
          function onloadend() {
            if (!request) {
              return;
            }
            var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
            var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
            var response = {
              data: responseData,
              status: request.status,
              statusText: request.statusText,
              headers: responseHeaders,
              config,
              request
            };
            settle(resolve, reject, response);
            request = null;
          }
          if ("onloadend" in request) {
            request.onloadend = onloadend;
          } else {
            request.onreadystatechange = function handleLoad() {
              if (!request || request.readyState !== 4) {
                return;
              }
              if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                return;
              }
              setTimeout(onloadend);
            };
          }
          request.onabort = function handleAbort() {
            if (!request) {
              return;
            }
            reject(createError("Request aborted", config, "ECONNABORTED", request));
            request = null;
          };
          request.onerror = function handleError() {
            reject(createError("Network Error", config, null, request));
            request = null;
          };
          request.ontimeout = function handleTimeout() {
            var timeoutErrorMessage = "timeout of " + config.timeout + "ms exceeded";
            if (config.timeoutErrorMessage) {
              timeoutErrorMessage = config.timeoutErrorMessage;
            }
            reject(createError(
              timeoutErrorMessage,
              config,
              config.transitional && config.transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
              request
            ));
            request = null;
          };
          if (utils.isStandardBrowserEnv()) {
            var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
            if (xsrfValue) {
              requestHeaders[config.xsrfHeaderName] = xsrfValue;
            }
          }
          if ("setRequestHeader" in request) {
            utils.forEach(requestHeaders, function setRequestHeader(val, key) {
              if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
                delete requestHeaders[key];
              } else {
                request.setRequestHeader(key, val);
              }
            });
          }
          if (!utils.isUndefined(config.withCredentials)) {
            request.withCredentials = !!config.withCredentials;
          }
          if (responseType && responseType !== "json") {
            request.responseType = config.responseType;
          }
          if (typeof config.onDownloadProgress === "function") {
            request.addEventListener("progress", config.onDownloadProgress);
          }
          if (typeof config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener("progress", config.onUploadProgress);
          }
          if (config.cancelToken) {
            config.cancelToken.promise.then(function onCanceled(cancel) {
              if (!request) {
                return;
              }
              request.abort();
              reject(cancel);
              request = null;
            });
          }
          if (!requestData) {
            requestData = null;
          }
          request.send(requestData);
        });
      };
    }
  });

  // node_modules/axios/lib/defaults.js
  var require_defaults = __commonJS({
    "node_modules/axios/lib/defaults.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var normalizeHeaderName = require_normalizeHeaderName();
      var enhanceError = require_enhanceError();
      var DEFAULT_CONTENT_TYPE = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      function setContentTypeIfUnset(headers, value) {
        if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
          headers["Content-Type"] = value;
        }
      }
      function getDefaultAdapter() {
        var adapter;
        if (typeof XMLHttpRequest !== "undefined") {
          adapter = require_xhr();
        } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
          adapter = require_xhr();
        }
        return adapter;
      }
      function stringifySafely(rawValue, parser, encoder) {
        if (utils.isString(rawValue)) {
          try {
            (parser || JSON.parse)(rawValue);
            return utils.trim(rawValue);
          } catch (e) {
            if (e.name !== "SyntaxError") {
              throw e;
            }
          }
        }
        return (encoder || JSON.stringify)(rawValue);
      }
      var defaults = {
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false
        },
        adapter: getDefaultAdapter(),
        transformRequest: [function transformRequest(data, headers) {
          normalizeHeaderName(headers, "Accept");
          normalizeHeaderName(headers, "Content-Type");
          if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
            return data;
          }
          if (utils.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
            return data.toString();
          }
          if (utils.isObject(data) || headers && headers["Content-Type"] === "application/json") {
            setContentTypeIfUnset(headers, "application/json");
            return stringifySafely(data);
          }
          return data;
        }],
        transformResponse: [function transformResponse(data) {
          var transitional = this.transitional;
          var silentJSONParsing = transitional && transitional.silentJSONParsing;
          var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
          var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
          if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
            try {
              return JSON.parse(data);
            } catch (e) {
              if (strictJSONParsing) {
                if (e.name === "SyntaxError") {
                  throw enhanceError(e, this, "E_JSON_PARSE");
                }
                throw e;
              }
            }
          }
          return data;
        }],
        /**
         * A timeout in milliseconds to abort a request. If set to 0 (default) a
         * timeout is not created.
         */
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        validateStatus: function validateStatus(status) {
          return status >= 200 && status < 300;
        }
      };
      defaults.headers = {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      };
      utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
        defaults.headers[method] = {};
      });
      utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
        defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
      });
      module.exports = defaults;
    }
  });

  // node_modules/axios/lib/core/transformData.js
  var require_transformData = __commonJS({
    "node_modules/axios/lib/core/transformData.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var defaults = require_defaults();
      module.exports = function transformData(data, headers, fns) {
        var context = this || defaults;
        utils.forEach(fns, function transform(fn) {
          data = fn.call(context, data, headers);
        });
        return data;
      };
    }
  });

  // node_modules/axios/lib/cancel/isCancel.js
  var require_isCancel = __commonJS({
    "node_modules/axios/lib/cancel/isCancel.js"(exports, module) {
      "use strict";
      module.exports = function isCancel(value) {
        return !!(value && value.__CANCEL__);
      };
    }
  });

  // node_modules/axios/lib/core/dispatchRequest.js
  var require_dispatchRequest = __commonJS({
    "node_modules/axios/lib/core/dispatchRequest.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var transformData = require_transformData();
      var isCancel = require_isCancel();
      var defaults = require_defaults();
      function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
          config.cancelToken.throwIfRequested();
        }
      }
      module.exports = function dispatchRequest(config) {
        throwIfCancellationRequested(config);
        config.headers = config.headers || {};
        config.data = transformData.call(
          config,
          config.data,
          config.headers,
          config.transformRequest
        );
        config.headers = utils.merge(
          config.headers.common || {},
          config.headers[config.method] || {},
          config.headers
        );
        utils.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          function cleanHeaderConfig(method) {
            delete config.headers[method];
          }
        );
        var adapter = config.adapter || defaults.adapter;
        return adapter(config).then(function onAdapterResolution(response) {
          throwIfCancellationRequested(config);
          response.data = transformData.call(
            config,
            response.data,
            response.headers,
            config.transformResponse
          );
          return response;
        }, function onAdapterRejection(reason) {
          if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
            if (reason && reason.response) {
              reason.response.data = transformData.call(
                config,
                reason.response.data,
                reason.response.headers,
                config.transformResponse
              );
            }
          }
          return Promise.reject(reason);
        });
      };
    }
  });

  // node_modules/axios/lib/core/mergeConfig.js
  var require_mergeConfig = __commonJS({
    "node_modules/axios/lib/core/mergeConfig.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      module.exports = function mergeConfig(config1, config2) {
        config2 = config2 || {};
        var config = {};
        var valueFromConfig2Keys = ["url", "method", "data"];
        var mergeDeepPropertiesKeys = ["headers", "auth", "proxy", "params"];
        var defaultToConfig2Keys = [
          "baseURL",
          "transformRequest",
          "transformResponse",
          "paramsSerializer",
          "timeout",
          "timeoutMessage",
          "withCredentials",
          "adapter",
          "responseType",
          "xsrfCookieName",
          "xsrfHeaderName",
          "onUploadProgress",
          "onDownloadProgress",
          "decompress",
          "maxContentLength",
          "maxBodyLength",
          "maxRedirects",
          "transport",
          "httpAgent",
          "httpsAgent",
          "cancelToken",
          "socketPath",
          "responseEncoding"
        ];
        var directMergeKeys = ["validateStatus"];
        function getMergedValue(target, source) {
          if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
            return utils.merge(target, source);
          } else if (utils.isPlainObject(source)) {
            return utils.merge({}, source);
          } else if (utils.isArray(source)) {
            return source.slice();
          }
          return source;
        }
        function mergeDeepProperties(prop) {
          if (!utils.isUndefined(config2[prop])) {
            config[prop] = getMergedValue(config1[prop], config2[prop]);
          } else if (!utils.isUndefined(config1[prop])) {
            config[prop] = getMergedValue(void 0, config1[prop]);
          }
        }
        utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
          if (!utils.isUndefined(config2[prop])) {
            config[prop] = getMergedValue(void 0, config2[prop]);
          }
        });
        utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
        utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
          if (!utils.isUndefined(config2[prop])) {
            config[prop] = getMergedValue(void 0, config2[prop]);
          } else if (!utils.isUndefined(config1[prop])) {
            config[prop] = getMergedValue(void 0, config1[prop]);
          }
        });
        utils.forEach(directMergeKeys, function merge(prop) {
          if (prop in config2) {
            config[prop] = getMergedValue(config1[prop], config2[prop]);
          } else if (prop in config1) {
            config[prop] = getMergedValue(void 0, config1[prop]);
          }
        });
        var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
        var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
          return axiosKeys.indexOf(key) === -1;
        });
        utils.forEach(otherKeys, mergeDeepProperties);
        return config;
      };
    }
  });

  // node_modules/axios/package.json
  var require_package = __commonJS({
    "node_modules/axios/package.json"(exports, module) {
      module.exports = {
        name: "axios",
        version: "0.21.4",
        description: "Promise based HTTP client for the browser and node.js",
        main: "index.js",
        scripts: {
          test: "grunt test",
          start: "node ./sandbox/server.js",
          build: "NODE_ENV=production grunt build",
          preversion: "npm test",
          version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
          postversion: "git push && git push --tags",
          examples: "node ./examples/server.js",
          coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
          fix: "eslint --fix lib/**/*.js"
        },
        repository: {
          type: "git",
          url: "https://github.com/axios/axios.git"
        },
        keywords: [
          "xhr",
          "http",
          "ajax",
          "promise",
          "node"
        ],
        author: "Matt Zabriskie",
        license: "MIT",
        bugs: {
          url: "https://github.com/axios/axios/issues"
        },
        homepage: "https://axios-http.com",
        devDependencies: {
          coveralls: "^3.0.0",
          "es6-promise": "^4.2.4",
          grunt: "^1.3.0",
          "grunt-banner": "^0.6.0",
          "grunt-cli": "^1.2.0",
          "grunt-contrib-clean": "^1.1.0",
          "grunt-contrib-watch": "^1.0.0",
          "grunt-eslint": "^23.0.0",
          "grunt-karma": "^4.0.0",
          "grunt-mocha-test": "^0.13.3",
          "grunt-ts": "^6.0.0-beta.19",
          "grunt-webpack": "^4.0.2",
          "istanbul-instrumenter-loader": "^1.0.0",
          "jasmine-core": "^2.4.1",
          karma: "^6.3.2",
          "karma-chrome-launcher": "^3.1.0",
          "karma-firefox-launcher": "^2.1.0",
          "karma-jasmine": "^1.1.1",
          "karma-jasmine-ajax": "^0.1.13",
          "karma-safari-launcher": "^1.0.0",
          "karma-sauce-launcher": "^4.3.6",
          "karma-sinon": "^1.0.5",
          "karma-sourcemap-loader": "^0.3.8",
          "karma-webpack": "^4.0.2",
          "load-grunt-tasks": "^3.5.2",
          minimist: "^1.2.0",
          mocha: "^8.2.1",
          sinon: "^4.5.0",
          "terser-webpack-plugin": "^4.2.3",
          typescript: "^4.0.5",
          "url-search-params": "^0.10.0",
          webpack: "^4.44.2",
          "webpack-dev-server": "^3.11.0"
        },
        browser: {
          "./lib/adapters/http.js": "./lib/adapters/xhr.js"
        },
        jsdelivr: "dist/axios.min.js",
        unpkg: "dist/axios.min.js",
        typings: "./index.d.ts",
        dependencies: {
          "follow-redirects": "^1.14.0"
        },
        bundlesize: [
          {
            path: "./dist/axios.min.js",
            threshold: "5kB"
          }
        ]
      };
    }
  });

  // node_modules/axios/lib/helpers/validator.js
  var require_validator = __commonJS({
    "node_modules/axios/lib/helpers/validator.js"(exports, module) {
      "use strict";
      var pkg = require_package();
      var validators = {};
      ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
        validators[type] = function validator(thing) {
          return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
        };
      });
      var deprecatedWarnings = {};
      var currentVerArr = pkg.version.split(".");
      function isOlderVersion(version, thanVersion) {
        var pkgVersionArr = thanVersion ? thanVersion.split(".") : currentVerArr;
        var destVer = version.split(".");
        for (var i = 0; i < 3; i++) {
          if (pkgVersionArr[i] > destVer[i]) {
            return true;
          } else if (pkgVersionArr[i] < destVer[i]) {
            return false;
          }
        }
        return false;
      }
      validators.transitional = function transitional(validator, version, message) {
        var isDeprecated = version && isOlderVersion(version);
        function formatMessage(opt, desc) {
          return "[Axios v" + pkg.version + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
        }
        return function(value, opt, opts) {
          if (validator === false) {
            throw new Error(formatMessage(opt, " has been removed in " + version));
          }
          if (isDeprecated && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            console.warn(
              formatMessage(
                opt,
                " has been deprecated since v" + version + " and will be removed in the near future"
              )
            );
          }
          return validator ? validator(value, opt, opts) : true;
        };
      };
      function assertOptions(options, schema, allowUnknown) {
        if (typeof options !== "object") {
          throw new TypeError("options must be an object");
        }
        var keys = Object.keys(options);
        var i = keys.length;
        while (i-- > 0) {
          var opt = keys[i];
          var validator = schema[opt];
          if (validator) {
            var value = options[opt];
            var result = value === void 0 || validator(value, opt, options);
            if (result !== true) {
              throw new TypeError("option " + opt + " must be " + result);
            }
            continue;
          }
          if (allowUnknown !== true) {
            throw Error("Unknown option " + opt);
          }
        }
      }
      module.exports = {
        isOlderVersion,
        assertOptions,
        validators
      };
    }
  });

  // node_modules/axios/lib/core/Axios.js
  var require_Axios = __commonJS({
    "node_modules/axios/lib/core/Axios.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var buildURL = require_buildURL();
      var InterceptorManager = require_InterceptorManager();
      var dispatchRequest = require_dispatchRequest();
      var mergeConfig = require_mergeConfig();
      var validator = require_validator();
      var validators = validator.validators;
      function Axios(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager()
        };
      }
      Axios.prototype.request = function request(config) {
        if (typeof config === "string") {
          config = arguments[1] || {};
          config.url = arguments[0];
        } else {
          config = config || {};
        }
        config = mergeConfig(this.defaults, config);
        if (config.method) {
          config.method = config.method.toLowerCase();
        } else if (this.defaults.method) {
          config.method = this.defaults.method.toLowerCase();
        } else {
          config.method = "get";
        }
        var transitional = config.transitional;
        if (transitional !== void 0) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean, "1.0.0"),
            forcedJSONParsing: validators.transitional(validators.boolean, "1.0.0"),
            clarifyTimeoutError: validators.transitional(validators.boolean, "1.0.0")
          }, false);
        }
        var requestInterceptorChain = [];
        var synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
            return;
          }
          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        var responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        var promise;
        if (!synchronousRequestInterceptors) {
          var chain = [dispatchRequest, void 0];
          Array.prototype.unshift.apply(chain, requestInterceptorChain);
          chain = chain.concat(responseInterceptorChain);
          promise = Promise.resolve(config);
          while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
          }
          return promise;
        }
        var newConfig = config;
        while (requestInterceptorChain.length) {
          var onFulfilled = requestInterceptorChain.shift();
          var onRejected = requestInterceptorChain.shift();
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected(error);
            break;
          }
        }
        try {
          promise = dispatchRequest(newConfig);
        } catch (error) {
          return Promise.reject(error);
        }
        while (responseInterceptorChain.length) {
          promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
        }
        return promise;
      };
      Axios.prototype.getUri = function getUri(config) {
        config = mergeConfig(this.defaults, config);
        return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
      };
      utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
        Axios.prototype[method] = function(url, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            url,
            data: (config || {}).data
          }));
        };
      });
      utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
        Axios.prototype[method] = function(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            url,
            data
          }));
        };
      });
      module.exports = Axios;
    }
  });

  // node_modules/axios/lib/cancel/Cancel.js
  var require_Cancel = __commonJS({
    "node_modules/axios/lib/cancel/Cancel.js"(exports, module) {
      "use strict";
      function Cancel(message) {
        this.message = message;
      }
      Cancel.prototype.toString = function toString() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      };
      Cancel.prototype.__CANCEL__ = true;
      module.exports = Cancel;
    }
  });

  // node_modules/axios/lib/cancel/CancelToken.js
  var require_CancelToken = __commonJS({
    "node_modules/axios/lib/cancel/CancelToken.js"(exports, module) {
      "use strict";
      var Cancel = require_Cancel();
      function CancelToken(executor) {
        if (typeof executor !== "function") {
          throw new TypeError("executor must be a function.");
        }
        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });
        var token = this;
        executor(function cancel(message) {
          if (token.reason) {
            return;
          }
          token.reason = new Cancel(message);
          resolvePromise(token.reason);
        });
      }
      CancelToken.prototype.throwIfRequested = function throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      };
      CancelToken.source = function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      };
      module.exports = CancelToken;
    }
  });

  // node_modules/axios/lib/helpers/spread.js
  var require_spread = __commonJS({
    "node_modules/axios/lib/helpers/spread.js"(exports, module) {
      "use strict";
      module.exports = function spread(callback) {
        return function wrap(arr) {
          return callback.apply(null, arr);
        };
      };
    }
  });

  // node_modules/axios/lib/helpers/isAxiosError.js
  var require_isAxiosError = __commonJS({
    "node_modules/axios/lib/helpers/isAxiosError.js"(exports, module) {
      "use strict";
      module.exports = function isAxiosError(payload) {
        return typeof payload === "object" && payload.isAxiosError === true;
      };
    }
  });

  // node_modules/axios/lib/axios.js
  var require_axios = __commonJS({
    "node_modules/axios/lib/axios.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var bind = require_bind();
      var Axios = require_Axios();
      var mergeConfig = require_mergeConfig();
      var defaults = require_defaults();
      function createInstance(defaultConfig) {
        var context = new Axios(defaultConfig);
        var instance = bind(Axios.prototype.request, context);
        utils.extend(instance, Axios.prototype, context);
        utils.extend(instance, context);
        return instance;
      }
      var axios = createInstance(defaults);
      axios.Axios = Axios;
      axios.create = function create(instanceConfig) {
        return createInstance(mergeConfig(axios.defaults, instanceConfig));
      };
      axios.Cancel = require_Cancel();
      axios.CancelToken = require_CancelToken();
      axios.isCancel = require_isCancel();
      axios.all = function all(promises) {
        return Promise.all(promises);
      };
      axios.spread = require_spread();
      axios.isAxiosError = require_isAxiosError();
      module.exports = axios;
      module.exports.default = axios;
    }
  });

  // node_modules/axios/index.js
  var require_axios2 = __commonJS({
    "node_modules/axios/index.js"(exports, module) {
      module.exports = require_axios();
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/attributes.js
  var require_attributes = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/attributes.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var attributes_exports = {};
      __export(attributes_exports, {
        erase: () => erase,
        has: () => has,
        read: () => read,
        write: () => write
      });
      module.exports = __toCommonJS(attributes_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      function getPropertyNameArray(propertyNames, separator = ".") {
        let returnRef;
        if (is.array(propertyNames)) {
          returnRef = propertyNames;
        } else {
          returnRef = propertyNames.split(separator);
        }
        return returnRef;
      }
      function getPropertyTarget(target, propertyNameArray, create) {
        let propertyTarget = target;
        for (let i = 0; i < propertyNameArray.length - 1; i++) {
          let propertyName = propertyNameArray[i];
          if (Object.prototype.hasOwnProperty.call(propertyTarget, propertyName) && !is.nil(propertyTarget[propertyName]) && !is.undef(propertyTarget[propertyName])) {
            propertyTarget = propertyTarget[propertyName];
          } else if (create) {
            propertyTarget = propertyTarget[propertyName] = {};
          } else {
            propertyTarget = null;
            break;
          }
        }
        return propertyTarget;
      }
      function last(array) {
        if (array.length !== 0) {
          return array[array.length - 1];
        } else {
          return null;
        }
      }
      function has(target, propertyNames, separator) {
        assert.argumentIsRequired(target, "target", Object);
        if (is.array(propertyNames)) {
          assert.argumentIsArray(propertyNames, "propertyNames", String);
        } else {
          assert.argumentIsRequired(propertyNames, "propertyNames", String);
        }
        const propertyNameArray = getPropertyNameArray(propertyNames, separator);
        const propertyTarget = getPropertyTarget(target, propertyNameArray, false);
        return propertyTarget !== null && Object.prototype.hasOwnProperty.call(propertyTarget, last(propertyNameArray));
      }
      function read(target, propertyNames, separator) {
        assert.argumentIsRequired(target, "target", Object);
        if (is.array(propertyNames)) {
          assert.argumentIsArray(propertyNames, "propertyNames", String);
        } else {
          assert.argumentIsRequired(propertyNames, "propertyNames", String);
        }
        const propertyNameArray = getPropertyNameArray(propertyNames, separator);
        const propertyTarget = getPropertyTarget(target, propertyNameArray, false);
        let returnRef;
        if (propertyTarget) {
          const propertyName = last(propertyNameArray);
          returnRef = propertyTarget[propertyName];
        } else {
          returnRef = void 0;
        }
        return returnRef;
      }
      function write(target, propertyNames, value, separator) {
        assert.argumentIsRequired(target, "target", Object);
        if (is.array(propertyNames)) {
          assert.argumentIsArray(propertyNames, "propertyNames", String);
        } else {
          assert.argumentIsRequired(propertyNames, "propertyNames", String);
        }
        const propertyNameArray = getPropertyNameArray(propertyNames, separator);
        const propertyTarget = getPropertyTarget(target, propertyNameArray, true);
        const propertyName = last(propertyNameArray);
        propertyTarget[propertyName] = value;
      }
      function erase(target, propertyNames, separator) {
        if (!has(target, propertyNames)) {
          return;
        }
        const propertyNameArray = getPropertyNameArray(propertyNames, separator);
        const propertyTarget = getPropertyTarget(target, propertyNameArray, true);
        const propertyName = last(propertyNameArray);
        delete propertyTarget[propertyName];
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/promise.js
  var require_promise = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/promise.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var promise_exports = {};
      __export(promise_exports, {
        build: () => build,
        first: () => first,
        map: () => map,
        pipeline: () => pipeline,
        timeout: () => timeout
      });
      module.exports = __toCommonJS(promise_exports);
      var assert = __toESM(require_assert());
      async function timeout(promise, milliseconds, description) {
        assert.argumentIsRequired(promise, "promise", Promise, "Promise");
        assert.argumentIsRequired(milliseconds, "milliseconds", Number);
        assert.argumentIsOptional(description, "description", String);
        if (!(milliseconds > 0)) {
          throw 'Unable to configure promise timeout, the "milliseconds" argument must be positive';
        }
        let timeoutToken = null;
        const timeoutPromise = build((resolveCallback, rejectCallback) => {
          timeoutToken = setTimeout(() => {
            rejectCallback(description || `Promise timed out after ${milliseconds} milliseconds`);
          }, milliseconds);
        });
        const userPromise = (async () => {
          try {
            const result = await promise;
            if (timeoutToken !== null) {
              clearTimeout(timeoutToken);
            }
            return result;
          } catch (e) {
            if (timeoutToken !== null) {
              clearTimeout(timeoutToken);
            }
            throw e;
          }
        })();
        return Promise.race([userPromise, timeoutPromise]);
      }
      async function map(items, mapper, concurrency) {
        assert.argumentIsArray(items, "items");
        assert.argumentIsRequired(mapper, "mapper", Function);
        assert.argumentIsOptional(concurrency, "concurrency", Number);
        const c = Math.max(0, concurrency || 0);
        let mapPromise;
        if (c === 0 || items.length === 0) {
          mapPromise = Promise.all(items.map((item) => mapper(item)));
        } else {
          const total = items.length;
          let active = 0;
          let complete = 0;
          let failure = false;
          const results = Array.of(total);
          const executors = items.map((item, index) => {
            return async () => {
              const result = await mapper(item);
              results[index] = result;
            };
          });
          mapPromise = build((resolveCallback, rejectCallback) => {
            const execute = () => {
              if (!(executors.length > 0 && c > active && !failure)) {
                return;
              }
              active = active + 1;
              const executor = executors.shift();
              (async () => {
                try {
                  await executor();
                  if (failure) {
                    return;
                  }
                  active = active - 1;
                  complete = complete + 1;
                  if (complete < total) {
                    execute();
                  } else {
                    resolveCallback(results);
                  }
                } catch (error) {
                  failure = true;
                  rejectCallback(error);
                }
              })();
              execute();
            };
            execute();
          });
        }
        return mapPromise;
      }
      async function pipeline(functions, input) {
        assert.argumentIsArray(functions, "functions", Function);
        let result = input;
        for (let i = 0; i < functions.length; i++) {
          result = await functions[i](result);
        }
        return result;
      }
      async function first(executors) {
        assert.argumentIsArray(executors, "executors", Function);
        let result = null;
        for (let i = 0; i < executors.length && result === null; i++) {
          try {
            result = await executors[i]();
          } catch {
            result = null;
          }
        }
        return result;
      }
      async function build(executor) {
        return new Promise((resolve, reject) => {
          try {
            executor(resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Parameter.js
  var require_Parameter = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Parameter.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Parameter_exports = {};
      __export(Parameter_exports, {
        default: () => Parameter
      });
      module.exports = __toCommonJS(Parameter_exports);
      var is = __toESM(require_is());
      var Parameter = class {
        #description;
        #key;
        #extractor;
        #optional;
        /**
         * @param {string} description
         * @param {string} key
         * @param {parameterValueCallback} extractor
         * @param {boolean=} optional
         */
        constructor(description, key, extractor, optional) {
          this.#description = description || null;
          this.#key = key || null;
          this.#extractor = extractor || null;
          this.#optional = is.boolean(optional) && optional;
        }
        /**
         * The human-readable description of the parameter.
         *
         * @public
         * @returns {string}
         */
        get description() {
          return this.#description;
        }
        /**
         * The name of the parameter.
         *
         * @public
         * @returns {string}
         */
        get key() {
          return this.#key;
        }
        /**
         * A function for extracting the parameter's value.
         *
         * @public
         * @returns {parameterValueCallback}
         */
        get extractor() {
          return this.#extractor;
        }
        /**
         * Indicates if the parameter is required.
         *
         * @public
         * @returns {boolean}
         */
        get optional() {
          return this.#optional;
        }
        /**
         * Throws an {@link Error} if the instance is invalid.
         *
         * @public
         */
        validate() {
          if (!is.string(this.key) || this.key.length === 0) {
            throw new Error("Parameter key must be a non-zero length string");
          }
          if (!is.fn(this.#extractor)) {
            throw new Error("Parameter extractor must be a function.");
          }
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Parameter]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Parameters.js
  var require_Parameters = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Parameters.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Parameters_exports = {};
      __export(Parameters_exports, {
        default: () => Parameters
      });
      module.exports = __toCommonJS(Parameters_exports);
      var is = __toESM(require_is());
      var import_Parameter = __toESM(require_Parameter());
      var Parameters = class _Parameters {
        #parameters;
        /**
         * @param {Parameter[]=} parameters
         */
        constructor(parameters) {
          this.#parameters = parameters || [];
        }
        /**
         * The list of {@link Parameter} items.
         *
         * @public
         * @returns {Parameter[]}
         */
        get parameters() {
          return this.#parameters;
        }
        /**
         * Throws an {@link Error} if the instance is invalid.
         *
         * @public
         */
        validate() {
          if (!is.array(this.#parameters)) {
            throw new Error("Parameters must be an array.");
          }
          if (this.#parameters.some((p) => !(p instanceof import_Parameter.default))) {
            throw new Error("All parameter items must be instances of Parameters.");
          }
          this.#parameters.forEach((p) => p.validate());
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Parameters]`;
        }
        /**
         * Merges two {@link Parameters} collections.
         *
         * @public
         * @static
         * @param {Parameters} a
         * @param {Parameters} b
         * @returns {Parameters}
         */
        static merge(a, b) {
          return new _Parameters(a.parameters.slice(0).concat(b.parameters.filter((candidate) => !a.parameters.some((existing) => existing.key === candidate.key))));
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/definitions/ProtocolType.js
  var require_ProtocolType = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/definitions/ProtocolType.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var ProtocolType_exports = {};
      __export(ProtocolType_exports, {
        default: () => ProtocolType
      });
      module.exports = __toCommonJS(ProtocolType_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_Enum = __toESM(require_Enum());
      var ProtocolType = class _ProtocolType extends import_Enum.default {
        #defaultPort;
        #prefix;
        /**
         * @param {string} code
         * @param {number} defaultPort
         * @param {string} prefix
         */
        constructor(code, defaultPort, prefix) {
          super(code, code);
          assert.argumentIsRequired(prefix, "prefix", String);
          assert.argumentIsValid(defaultPort, "defaultPort", (p) => is.integer(p) && !(p < 0 || p > 65535));
          this.#defaultPort = defaultPort;
          this.#prefix = prefix;
        }
        /**
         * Returns the default TCP port used by the protocol.
         *
         * @public
         * @returns {number}
         */
        get defaultPort() {
          return this.#defaultPort;
        }
        /**
         * Returns the prefix used to compose a URL.
         *
         * @public
         * @returns {string}
         */
        get prefix() {
          return this.#prefix;
        }
        /**
         * Returns the {@link ProtocolType} associated with a specific code.
         *
         * @public
         * @static
         * @param {string} code
         * @returns {ProtocolType|null}
         */
        static parse(code) {
          const value = import_Enum.default.fromCode(_ProtocolType, code);
          return value instanceof _ProtocolType ? value : null;
        }
        /**
         * HTTP.
         *
         * @static
         * @returns {ProtocolType}
         */
        static get HTTP() {
          return protocolTypeHttp;
        }
        /**
         * HTTPS.
         *
         * @static
         * @returns {ProtocolType}
         */
        static get HTTPS() {
          return protocolTypeHttps;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[ProtocolType (description=${this.description})]`;
        }
      };
      var protocolTypeHttp = new ProtocolType("HTTP", 80, "http://");
      var protocolTypeHttps = new ProtocolType("HTTPS", 443, "https://");
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/definitions/VerbType.js
  var require_VerbType = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/definitions/VerbType.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var VerbType_exports = {};
      __export(VerbType_exports, {
        default: () => VerbType
      });
      module.exports = __toCommonJS(VerbType_exports);
      var import_Enum = __toESM(require_Enum());
      var VerbType = class extends import_Enum.default {
        /**
         * @param {string} description
         */
        constructor(description) {
          super(description, description);
        }
        /**
         * DELETE.
         *
         * @static
         * @returns {VerbType}
         */
        static get DELETE() {
          return verbTypeDelete;
        }
        /**
         * GET.
         *
         * @static
         * @returns {VerbType}
         */
        static get GET() {
          return verbTypeGet;
        }
        /**
         * POST.
         *
         * @static
         * @returns {VerbType}
         */
        static get POST() {
          return verbTypePost;
        }
        /**
         * PUT.
         *
         * @static
         * @returns {VerbType}
         */
        static get PUT() {
          return verbTypePut;
        }
        /**
         * PATCH.
         *
         * @static
         * @returns {VerbType}
         */
        static get PATCH() {
          return verbTypePatch;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[VerbType (description=${this.description})]`;
        }
      };
      var verbTypeDelete = new VerbType("DELETE");
      var verbTypeGet = new VerbType("GET");
      var verbTypePost = new VerbType("POST");
      var verbTypePut = new VerbType("PUT");
      var verbTypePatch = new VerbType("PATCH");
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/failures/FailureType.js
  var require_FailureType = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/failures/FailureType.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var FailureType_exports = {};
      __export(FailureType_exports, {
        default: () => FailureType
      });
      module.exports = __toCommonJS(FailureType_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_Enum = __toESM(require_Enum());
      var FailureType = class _FailureType extends import_Enum.default {
        #template;
        #severe;
        #error;
        #verbose;
        /**
         * @param {string} code - The enumeration code (and description).
         * @param {string} template - The template string for formatting human-readable messages.
         * @param {boolean=} severe - Indicates if the failure is severe (default is true).
         * @param {number=} error - The HTTP error code which should be used as part of an HTTP response.
         * @param {boolean=} verbose - Indicates if data object should be included when serialized.
         */
        constructor(code, template, severe, error, verbose) {
          super(code, code);
          assert.argumentIsRequired(template, "template", String);
          assert.argumentIsOptional(severe, "severe", Boolean);
          assert.argumentIsOptional(error, "error", Number);
          assert.argumentIsOptional(verbose, "verbose", Boolean);
          this.#template = template;
          if (is.boolean(severe)) {
            this.#severe = severe;
          } else {
            this.#severe = true;
          }
          this.#error = error || null;
          this.#verbose = verbose || false;
        }
        /**
         * The template string for formatting human-readable messages.
         *
         * @public
         * @returns {string}
         */
        get template() {
          return this.#template;
        }
        /**
         * Indicates if the failure is serious.
         *
         * @public
         * @return {boolean}
         */
        get severe() {
          return this.#severe;
        }
        /**
         * The HTTP error code which should be used as part of an HTTP response.
         *
         * @public
         * @return {number|null}
         */
        get error() {
          return this.#error;
        }
        /**
         * Indicates if data object should be included when serialized.
         *
         * @public
         * @return {boolean}
         */
        get verbose() {
          return this.#verbose;
        }
        /**
         * One or more data points is missing.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get REQUEST_CONSTRUCTION_FAILURE() {
          return requestConstructionFailure;
        }
        /**
         * A data point is missing.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get REQUEST_PARAMETER_MISSING() {
          return requestParameterMissing;
        }
        /**
         * A data point is malformed.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get REQUEST_PARAMETER_MALFORMED() {
          return requestParameterMalformed;
        }
        /**
         * User identity could not be determined.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get REQUEST_IDENTITY_FAILURE() {
          return requestIdentifyFailure;
        }
        /**
         * User authorization failed.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get REQUEST_AUTHORIZATION_FAILURE() {
          return requestAuthorizationFailure;
        }
        /**
         * The request data cannot be parsed or interpreted.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get REQUEST_INPUT_MALFORMED() {
          return requestInputMalformed;
        }
        /**
         * The request failed for unspecified reasons.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get SCHEMA_VALIDATION_FAILURE() {
          return schemaValidationFailure;
        }
        /**
         * The request failed for unspecified reasons.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get REQUEST_GENERAL_FAILURE() {
          return requestGeneralFailure;
        }
        /**
         * Insufficient permission level to access the resource.
         *
         * @public
         * @static
         * @returns {FailureType}
         */
        static get ENTITLEMENTS_FAILED() {
          return entitlementsFailed;
        }
        /**
         * Returns an HTTP status code that would be suitable for use with the
         * failure type.
         *
         * @public
         * @static
         * @param {FailureType} type
         * @returns {number}
         */
        static getHttpStatusCode(type) {
          assert.argumentIsRequired(type, "type", _FailureType, "FailureType");
          let returnVal;
          if (type === _FailureType.REQUEST_IDENTITY_FAILURE) {
            returnVal = 401;
          } else if (type === _FailureType.REQUEST_AUTHORIZATION_FAILURE) {
            returnVal = 403;
          } else {
            returnVal = 400;
          }
          return returnVal;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[FailureType (code=${this.code})]`;
        }
      };
      var requestConstructionFailure = new FailureType("REQUEST_CONSTRUCTION_FAILURE", "An attempt to {L|root.endpoint.description} failed because some required information is missing.");
      var requestParameterMissing = new FailureType("REQUEST_PARAMETER_MISSING", 'The "{L|name}" field is required.');
      var requestParameterMalformed = new FailureType("REQUEST_PARAMETER_MALFORMED", 'The "{L|name}" field cannot be interpreted.');
      var requestIdentifyFailure = new FailureType("REQUEST_IDENTITY_FAILURE", "An attempt to {L|root.endpoint.description} failed because your identity could not be determined.");
      var requestAuthorizationFailure = new FailureType("REQUEST_AUTHORIZATION_FAILURE", "An attempt to {L|root.endpoint.description} failed. You are not authorized to perform this action.");
      var requestInputMalformed = new FailureType("REQUEST_INPUT_MALFORMED", "An attempt to {L|root.endpoint.description} failed, the data structure is invalid.");
      var schemaValidationFailure = new FailureType("SCHEMA_VALIDATION_FAILURE", 'An attempt to read {U|schema} data failed (found "{L|key}" when expecting "{L|name}")');
      var requestGeneralFailure = new FailureType("REQUEST_GENERAL_FAILURE", "An attempt to {L|root.endpoint.description} failed for unspecified reason(s).");
      var entitlementsFailed = new FailureType("ENTITLEMENTS_FAILED", "Action blocked. The current user requires elevated permissions or the current user has exceeded a quota.", false, 403, true);
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/failures/FailureReasonItem.js
  var require_FailureReasonItem = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/failures/FailureReasonItem.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var FailureReasonItem_exports = {};
      __export(FailureReasonItem_exports, {
        default: () => FailureReasonItem
      });
      module.exports = __toCommonJS(FailureReasonItem_exports);
      var assert = __toESM(require_assert());
      var attributes = __toESM(require_attributes());
      var import_FailureType = __toESM(require_FailureType());
      var FailureReasonItem = class {
        #type;
        #data;
        /**
         * @param {FailureType} type
         * @param {object=} data
         */
        constructor(type, data) {
          assert.argumentIsRequired(type, "type", import_FailureType.default, "FailureType");
          this.#type = type;
          this.#data = data || null;
        }
        /**
         * The {@link FailureType} of the item.
         *
         * @public
         * @returns {FailureType}
         */
        get type() {
          return this.#type;
        }
        /**
         * The data.
         *
         * @public
         * @return {object}
         */
        get data() {
          return this.#data;
        }
        /**
         * Formats a human-readable message, describing the failure.
         *
         * @public
         * @param {object=} root - Root data from the {@link FailureReason}.
         * @returns {string}
         */
        format(root) {
          return this.#type.template.replace(tokenRegex, (full, ignored, casing, token) => {
            let tokenToUse;
            let dataToRead;
            if (token.startsWith(rootPrefix)) {
              tokenToUse = token.slice(rootLength);
              dataToRead = root;
            } else {
              tokenToUse = token;
              dataToRead = this.#data;
            }
            let replacement = attributes.read(dataToRead, tokenToUse);
            if (replacement) {
              if (casing === "l") {
                replacement = `${replacement.slice(0, 1).toLowerCase()}${replacement.slice(1)}`;
              } else if (casing === "u") {
                replacement = `${replacement.slice(0, 1).toUpperCase()}${replacement.slice(1)}`;
              } else if (casing === "U") {
                replacement = `${replacement.toUpperCase()}`;
              } else if (casing === "L") {
                replacement = `${replacement.toLowerCase()}`;
              }
            }
            return replacement;
          });
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[FailureReasonItem]";
        }
      };
      var tokenRegex = /{(([U|L|l|u])\|)?([a-zA-Z.]*)}/g;
      var rootPrefix = "root.";
      var rootLength = rootPrefix.length;
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/functions.js
  var require_functions = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/functions.js"(exports, module) {
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var functions_exports = {};
      __export(functions_exports, {
        getEmpty: () => getEmpty,
        getTautology: () => getTautology
      });
      module.exports = __toCommonJS(functions_exports);
      function tautology(x) {
        return x;
      }
      function empty() {
        return;
      }
      function getTautology() {
        return tautology;
      }
      function getEmpty() {
        return empty;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/collections/LinkedList.js
  var require_LinkedList = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/collections/LinkedList.js"(exports, module) {
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var LinkedList_exports = {};
      __export(LinkedList_exports, {
        default: () => LinkedList
      });
      module.exports = __toCommonJS(LinkedList_exports);
      var LinkedList = class _LinkedList {
        #value;
        #next;
        /**
         * @param {*} value - The value of current node.
         */
        constructor(value) {
          this.#value = value;
          this.#next = null;
        }
        /**
         * Returns the value associated with the current node.
         *
         * @public
         * @returns {*}
         */
        getValue() {
          return this.#value;
        }
        /**
         * Returns the next node, if it exists; otherwise a null value is returned.
         *
         * @public
         * @returns {LinkedList|null}
         */
        getNext() {
          return this.#next;
        }
        /**
         * Returns true, if the node is the last one in the list.
         *
         * @public
         * @returns {boolean}
         */
        getIsTail() {
          return this.#next === null;
        }
        /**
         * Adds (or inserts) a value after the current node and returns
         * the newly added node.
         *
         * @public
         * @param {*} value
         * @returns {LinkedList}
         */
        insert(value) {
          const next = new _LinkedList(value);
          if (this.#next) {
            next.#next = this.#next;
          }
          this.#next = next;
          return next;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[LinkedList]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/serialization/json/Schema.js
  var require_Schema = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/serialization/json/Schema.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Schema_exports = {};
      __export(Schema_exports, {
        default: () => Schema
      });
      module.exports = __toCommonJS(Schema_exports);
      var attributes = __toESM(require_attributes());
      var functions = __toESM(require_functions());
      var is = __toESM(require_is());
      var import_LinkedList = __toESM(require_LinkedList());
      var import_Tree = __toESM(require_Tree());
      var Schema = class {
        #name;
        #fields;
        #components;
        #strict;
        #revivers;
        /**
         * @param {string} name - The name of the schema
         * @param {Field[]=} fields
         * @param {Component[]=} components
         * @param {boolean=} strict
         */
        constructor(name, fields, components, strict) {
          this.#name = name;
          this.#fields = fields || [];
          this.#components = components || [];
          this.#strict = is.boolean(strict) && strict;
          this.#revivers = getReviverItems(this.#fields, this.#components);
        }
        /**
         * Accepts data and returns a new object which (should) conform to
         * the schema.
         *
         * @public
         * @param {object} data
         * @returns {object}
         */
        format(data) {
          const returnRef = {};
          this.#fields.forEach((field) => {
            formatField(returnRef, field, data);
          });
          this.#components.forEach((component) => {
            component.fields.forEach((field) => {
              formatField(returnRef, field, data);
            });
          });
          return returnRef;
        }
        /**
         * Name of the table.
         *
         * @public
         * @returns {string}
         */
        get name() {
          return this.#name;
        }
        /**
         * The fields of the table.
         *
         * @public
         * @returns {Array<Field>}
         */
        get fields() {
          return [...this.#fields];
        }
        /**
         * The components of the table.
         *
         * @public
         * @returns {Array<Component>}
         */
        get components() {
          return [...this.#components];
        }
        /**
         * If true, only the explicitly defined fields and components will
         * be serialized.
         *
         * @public
         * @returns {boolean}
         */
        get strict() {
          return this.#strict;
        }
        /**
         * Returns true, if an object complies with the schema.
         *
         * @public
         * @param {*} candidate
         * @returns {boolean}
         */
        validate(candidate) {
          return !getCandidateIsInvalid(candidate) && this.getInvalidFields(candidate).length === 0;
        }
        /**
         * Returns an array of {@link Field} objects from the schema for which the
         * candidate object does not comply with.
         *
         * @public
         * @param {*} candidate
         * @returns {Field[]}
         */
        getInvalidFields(candidate) {
          if (getCandidateIsInvalid(candidate)) {
            return this.fields.filter((f) => !f.optional);
          }
          return this.fields.reduce((problems, field) => {
            let check = !field.optional || attributes.has(candidate, field.name);
            if (check) {
              const valid = field.dataType.validator.call(this, attributes.read(candidate, field.name));
              if (!valid) {
                problems.push(field);
              }
            }
            return problems;
          }, []);
        }
        /**
         * Generates a function suitable for use by {@link JSON.parse}.
         *
         * @public
         * @returns {Function}
         */
        getReviver() {
          let head = this.#revivers;
          let node = null;
          const advance = (key) => {
            const previous = node;
            if (node === null) {
              node = head;
            } else {
              node = node.getNext();
            }
            const item = node.getValue();
            if (key === item.name) {
              return item;
            } else if (item.reset || key === "" && node === head) {
              node = null;
              return item;
            } else if (item.array && is.integer(parseInt(key))) {
              node = previous;
              return item;
            } else if (item.optional) {
              return advance(key);
            } else {
              throw new SchemaError(key, item.name, `Schema parsing is using strict mode, unexpected key found [ found: ${key}, expected: ${item.name} ]`);
            }
          };
          return (key, value) => {
            const item = advance(key);
            if (key === "" || item.array && key === item.name) {
              return value;
            } else {
              return item.reviver(value);
            }
          };
        }
        /**
         * Returns a function that will generate a *new* reviver function
         * (see {@link Schema#getReviver}).
         *
         * @public
         * @returns {Function}
         */
        getReviverFactory() {
          return () => this.getReviver();
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Schema (name=${this.#name})]`;
        }
      };
      var SchemaError = class extends Error {
        constructor(key, name, message) {
          super(message);
          this.key = key;
          this.name = name;
        }
        toString() {
          return `[SchemaError]`;
        }
      };
      var ReviverItem = class {
        #name;
        #reviver;
        #optional;
        #reset;
        #array;
        constructor(name, reviver, optional, reset, array) {
          this.#name = name;
          this.#reviver = reviver || functions.getTautology();
          this.#optional = is.boolean(optional) && optional;
          this.#reset = is.boolean(reset) && reset;
          this.#array = is.boolean(array) && array;
        }
        get name() {
          return this.#name;
        }
        get reviver() {
          return this.#reviver;
        }
        get optional() {
          return this.#optional;
        }
        get reset() {
          return this.#reset;
        }
        get array() {
          return this.#array;
        }
      };
      function getReviverItems(fields, components) {
        const root = new import_Tree.default(new ReviverItem(null, null, false, true));
        fields.forEach((field) => {
          const names = field.name.split(".");
          let node = root;
          names.forEach((name, i) => {
            if (names.length === i + 1) {
              node.addChild(new ReviverItem(name, field.dataType.reviver, field.optional, false, field.array));
            } else {
              let child = node.findChild((n) => n.name === name);
              if (!child) {
                child = node.addChild(new ReviverItem(name));
              }
              node = child;
            }
          });
        });
        components.forEach((component) => {
          let node = root;
          const names = component.name.split(".");
          names.forEach((name, i) => {
            if (names.length === i + 1) {
              node = node.addChild(new ReviverItem(name, component.reviver));
            } else {
              let child = node.findChild((n) => n.name === name);
              if (!child) {
                child = node.addChild(new ReviverItem(name));
              }
              node = child;
            }
          });
          component.fields.forEach((f) => node.addChild(new ReviverItem(f.name, f.dataType.reviver)));
        });
        let head = null;
        let current = null;
        const addItemToList = (item, node) => {
          let itemToUse = item;
          if (!node.getIsLeaf()) {
            const required = node.search((i, n) => n.getIsLeaf() && !i.optional, true, false) !== null;
            if (!required) {
              itemToUse = new ReviverItem(item.name, item.reviver, true, item.reset, item.array);
            }
          } else {
            itemToUse = item;
          }
          if (current === null) {
            current = head = new import_LinkedList.default(itemToUse);
          } else {
            current = current.insert(itemToUse);
          }
        };
        root.walk(addItemToList, false, true);
        return head;
      }
      function formatField(target, field, data) {
        if (attributes.has(data, field.name)) {
          attributes.write(target, field.name, field.dataType.convert(attributes.read(data, field.name)));
        }
      }
      function getCandidateIsInvalid(candidate) {
        return is.undef(candidate) || is.nil(candidate) || !is.object(candidate);
      }
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/failures/FailureReason.js
  var require_FailureReason = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/failures/FailureReason.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var FailureReason_exports = {};
      __export(FailureReason_exports, {
        default: () => FailureReason
      });
      module.exports = __toCommonJS(FailureReason_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_FailureReasonItem = __toESM(require_FailureReasonItem());
      var import_FailureType = __toESM(require_FailureType());
      var import_Schema = __toESM(require_Schema());
      var import_Tree = __toESM(require_Tree());
      var FailureReason = class _FailureReason {
        #data;
        #root;
        #current;
        /**
         * @param {object=} data - Data regarding the API request itself, likely independent of the failure data maintained in the tree structure.
         */
        constructor(data) {
          this.#data = data || null;
          this.#root = new import_Tree.default(null);
          this.#current = this.#root;
        }
        /**
         * Adds a {@link FailureReasonItem} to the tree of reasons at the current node.
         *
         * @public
         * @param {FailureType} type - The failure type.
         * @param {object=} data - The data associated with the failure type.
         * @param {boolean=} group - Whether the newly added item is expected to have children.
         * @returns {FailureReason} The current instance, allowing for method chaining.
         */
        addItem(type, data, group) {
          assert.argumentIsRequired(type, "type", import_FailureType.default, "FailureType");
          assert.argumentIsOptional(group, "group", Boolean);
          const node = this.#current.addChild(new import_FailureReasonItem.default(type, data));
          if (is.boolean(group) && group) {
            this.#current = node;
          }
          return this;
        }
        /**
         * Resets the current node to the head of the tree.
         *
         * @public
         * @param {boolean=} previous
         * @returns {FailureReason} The current instance, allowing for method chaining.
         */
        reset(previous) {
          assert.argumentIsOptional(previous, "previous", Boolean);
          let node;
          if (previous && this.#current.getIsInner()) {
            node = this.#current.getParent();
          } else {
            node = this.#root;
          }
          this.#current = node;
          return this;
        }
        /**
         * Returns a tree of strings describing the reasons for API failure.
         *
         * @public
         * @returns {Array}
         */
        format() {
          const reasons = this.#root.toJSObj((item) => {
            const formatted = {};
            formatted.code = item ? item.type.code : null;
            formatted.message = item ? item.format(this.#data) : null;
            if (item && item.type.verbose) {
              formatted.data = item.data;
            }
            return formatted;
          }, true);
          return reasons.children;
        }
        /**
         * Indicates whether the tree of {@link FailureReasonItem} instances
         * contains at least one item with a matching {@link FailureType}.
         *
         * @public
         * @param {FailureType} type
         * @returns {boolean}
         */
        hasFailureType(type) {
          assert.argumentIsRequired(type, "type", import_FailureType.default, "FailureType");
          return this.#root.search((item) => item.type === type, false, false) !== null;
        }
        /**
         * Indicates whether the tree of {@link FailureReasonItem} instances
         * contains at least one item considered severe.
         *
         * @public
         * @returns {boolean}
         */
        getIsSevere() {
          return this.#root.search((item) => item.type.severe, false, false) !== null;
        }
        /**
         * Searches the tree of {@link FailureReasonItem} instances for a
         * non-standard HTTP error code.
         *
         * @public
         * @returns {number|null}
         */
        getErrorCode() {
          const node = this.#root.search((item) => item.type.error !== null, true, false);
          if (node === null) {
            return null;
          }
          return node.getValue().type.error;
        }
        /**
         * A convenience function for creating a new {@link FailureReason}
         * with a single {@link FailureType}.
         *
         * @public
         * @static
         * @param {FailureType} type
         * @param {object=} data
         * @returns {FailureReason}
         */
        static from(type, data) {
          const reason = new _FailureReason();
          return reason.addItem(type, data);
        }
        /**
         * Factory function for creating instances of {@link FailureReason}.
         *
         * @public
         * @static
         * @param {object=} data
         * @returns {FailureReason}
         */
        static forRequest(data) {
          return new _FailureReason(data);
        }
        /**
         * Returns a JSON representation of the failure reason.
         *
         * @public
         * @returns {Array}
         */
        toJSON() {
          return this.format();
        }
        /**
         * Returns an HTTP status code suitable for use with the failure reason.
         *
         * @public
         * @static
         * @param {FailureReason} reason
         * @returns {number|null}
         */
        static getHttpStatusCode(reason) {
          assert.argumentIsRequired(reason, "reason", _FailureReason, "FailureReason");
          let returnValue = null;
          reason.#root.walk((item) => {
            const code = import_FailureType.default.getHttpStatusCode(item.type);
            if (returnValue === null || returnValue !== 400) {
              returnValue = code;
            }
          }, false, false);
          return returnValue;
        }
        /**
         * Validates that a candidate conforms to a schema, returning a rejected
         * promise with a serialized {@link FailureReason} if a problem exists.
         *
         * The schema argument can be either a {@link Schema} instance or an
         * {@link Enum} instance that exposes a Schema through its schema property.
         *
         * @public
         * @static
         * @async
         * @param {Schema|EnumWithSchema} schema
         * @param {object} candidate
         * @param {string=} description
         * @returns {Promise<null>}
         */
        static async validateSchema(schema, candidate, description) {
          let schemaToUse;
          if (schema instanceof import_Schema.default) {
            schemaToUse = schema;
          } else if (schema.schema && schema.schema instanceof import_Schema.default) {
            schemaToUse = schema.schema;
          } else {
            throw new TypeError("The schema argument must be a Schema instance or an Enum instance containing a Schema.");
          }
          const fields = schemaToUse.getInvalidFields(candidate);
          if (fields.length === 0) {
            return null;
          }
          let failure = _FailureReason.forRequest({ endpoint: { description: description || `serialize data into ${schemaToUse.name}` } }).addItem(import_FailureType.default.REQUEST_INPUT_MALFORMED, {}, true);
          failure = fields.reduce((accumulator, field) => {
            accumulator.addItem(import_FailureType.default.REQUEST_PARAMETER_MALFORMED, { name: field.name });
            return accumulator;
          }, failure);
          throw failure.format();
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[FailureReason]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/ErrorInterceptor.js
  var require_ErrorInterceptor = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/ErrorInterceptor.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var ErrorInterceptor_exports = {};
      __export(ErrorInterceptor_exports, {
        default: () => ErrorInterceptor
      });
      module.exports = __toCommonJS(ErrorInterceptor_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_FailureReason = __toESM(require_FailureReason());
      var import_FailureType = __toESM(require_FailureType());
      var ErrorInterceptor = class {
        constructor() {
        }
        /**
         * Adjusts incoming error before the response is forwarded
         * back to the original caller.
         *
         * @public
         * @async
         * @param {object} error
         * @param {Endpoint} endpoint - The endpoint which is originating the request.
         * @returns {Promise<*>}
         */
        async process(error, endpoint) {
          return this._onProcess(error, endpoint);
        }
        /**
         * @protected
         * @async
         * @param {object} error
         * @param {Endpoint} endpoint
         * @returns {Promise<*>}
         */
        async _onProcess(error, endpoint) {
          throw error;
        }
        /**
         * A no-op error interceptor which rejects using raw response data.
         *
         * @public
         * @static
         * @returns {ErrorInterceptor}
         */
        static get EMPTY() {
          return errorInterceptorEmpty;
        }
        /**
         * An error interceptor that handles most server-side issues and rejects
         * using formatted {@link FailureReason} when an error is detected.
         *
         * @public
         * @static
         * @returns {ErrorInterceptor}
         */
        static get GENERAL() {
          return errorInterceptorGeneral;
        }
        /**
         * Returns a new {@link ErrorInterceptor} which delegates its work to another function.
         *
         * @public
         * @static
         * @param {Function} delegate
         * @returns {ErrorInterceptor}
         */
        static fromDelegate(delegate) {
          return new DelegateErrorInterceptor(delegate);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[ErrorInterceptor]";
        }
      };
      var DelegateErrorInterceptor = class extends ErrorInterceptor {
        #delegate;
        /**
         * @param {Function} delegate
         */
        constructor(delegate) {
          super();
          assert.argumentIsRequired(delegate, "delegate", Function);
          this.#delegate = delegate;
        }
        /**
         * @protected
         * @override
         * @param {object} error
         * @param {Endpoint} endpoint
         * @returns {*}
         */
        _onProcess(error, endpoint) {
          return this.#delegate(error, endpoint);
        }
        toString() {
          return "[DelegateErrorInterceptor]";
        }
      };
      var errorInterceptorEmpty = new ErrorInterceptor();
      var errorInterceptorGeneral = new DelegateErrorInterceptor(async (error, endpoint) => {
        const response = error.response;
        let rejection = null;
        if (is.object(response) && is.object(response.headers) && response.headers["content-type"] === "application/json") {
          let deserialized = null;
          if (is.object(response.data)) {
            deserialized = response.data;
          } else {
            try {
              deserialized = JSON.parse(response.data);
            } catch {
              deserialized = null;
            }
          }
          if (deserialized !== null) {
            rejection = deserialized;
          }
        }
        if (rejection === null && is.undef(response) && error.message === "Network Error") {
          rejection = import_FailureReason.default.forRequest({ endpoint }).addItem(import_FailureType.default.REQUEST_AUTHORIZATION_FAILURE).format();
        }
        if (rejection === null) {
          rejection = import_FailureReason.default.forRequest({ endpoint }).addItem(import_FailureType.default.REQUEST_GENERAL_FAILURE).format();
        }
        throw rejection;
      });
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/RequestInterceptor.js
  var require_RequestInterceptor = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/RequestInterceptor.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var RequestInterceptor_exports = {};
      __export(RequestInterceptor_exports, {
        default: () => RequestInterceptor
      });
      module.exports = __toCommonJS(RequestInterceptor_exports);
      var assert = __toESM(require_assert());
      var RequestInterceptor = class {
        constructor() {
        }
        /**
         * Adjusts outgoing requests data before the request is transmitted.
         *
         * @public
         * @async
         * @param {object} request
         * @param {Endpoint} endpoint - The endpoint which is originating the request.
         * @returns {Promise<*>}
         */
        async process(request, endpoint) {
          return this._onProcess(request, endpoint);
        }
        /**
         * @protected
         * @param {object} request
         * @param {Endpoint} endpoint
         * @returns {*}
         */
        _onProcess(request, endpoint) {
          return request;
        }
        /**
         * A no-op request interceptor.
         *
         * @public
         * @static
         * @returns {RequestInterceptor}
         */
        static get EMPTY() {
          return requestInterceptorEmpty;
        }
        /**
         * Returns a new {@link RequestInterceptor} which delegates its work to another function.
         *
         * @public
         * @static
         * @param {Function} delegate
         * @returns {RequestInterceptor}
         */
        static fromDelegate(delegate) {
          return new DelegateRequestInterceptor(delegate);
        }
        /**
         * A request interceptor that instructs the framework to skip parsing
         * of the response's data.
         *
         * @public
         * @static
         * @returns {RequestInterceptor}
         */
        static get PLAIN_TEXT_RESPONSE() {
          return requestInterceptorPlain;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[RequestInterceptor]";
        }
      };
      var DelegateRequestInterceptor = class extends RequestInterceptor {
        #delegate;
        /**
         * @param {Function} delegate
         */
        constructor(delegate) {
          super();
          assert.argumentIsRequired(delegate, "delegate", Function);
          this.#delegate = delegate;
        }
        /**
         * @protected
         * @override
         * @param {object} request
         * @param {Endpoint} endpoint
         * @returns {*}
         */
        _onProcess(request, endpoint) {
          return this.#delegate(request, endpoint);
        }
        toString() {
          return "[DelegateRequestInterceptor]";
        }
      };
      var requestInterceptorEmpty = new RequestInterceptor();
      var requestInterceptorPlain = new DelegateRequestInterceptor((request) => {
        request.transformResponse = (data) => data;
        return request;
      });
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/ResponseInterceptor.js
  var require_ResponseInterceptor = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/ResponseInterceptor.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var ResponseInterceptor_exports = {};
      __export(ResponseInterceptor_exports, {
        default: () => ResponseInterceptor
      });
      module.exports = __toCommonJS(ResponseInterceptor_exports);
      var assert = __toESM(require_assert());
      var ResponseInterceptor = class {
        constructor() {
        }
        /**
         * Adjusts incoming response data before the response is forwarded
         * back to the original caller.
         *
         * @public
         * @async
         * @param {object} response
         * @param {Endpoint} endpoint - The endpoint which is originating the request.
         * @returns {Promise<*>}
         */
        async process(response, endpoint) {
          return this._onProcess(response, endpoint);
        }
        /**
         * @protected
         * @param {object} response
         * @param {Endpoint} endpoint
         * @returns {*}
         */
        _onProcess(response, endpoint) {
          return response;
        }
        /**
         * A no-op request interceptor (which will return the raw response).
         *
         * @public
         * @static
         * @returns {ResponseInterceptor}
         */
        static get EMPTY() {
          return responseInterceptorEmpty;
        }
        /**
         * A response interceptor returns only the data payload in the format
         * specified by the response's "content-type" header.
         *
         * @public
         * @static
         * @returns {ResponseInterceptor}
         */
        static get DATA() {
          return responseInterceptorData;
        }
        /**
         * Returns a new {@link ResponseInterceptor} which delegates its work to another function.
         *
         * @public
         * @static
         * @param {Function} delegate
         * @returns {ResponseInterceptor}
         */
        static fromDelegate(delegate) {
          return new DelegateResponseInterceptor(delegate);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[ResponseInterceptor]";
        }
      };
      var DelegateResponseInterceptor = class extends ResponseInterceptor {
        #delegate;
        /**
         * @param {Function} delegate
         */
        constructor(delegate) {
          super();
          assert.argumentIsRequired(delegate, "delegate", Function);
          this.#delegate = delegate;
        }
        /**
         * @protected
         * @override
         * @param {object} response
         * @param {Endpoint} endpoint
         * @returns {*}
         */
        _onProcess(response, endpoint) {
          return this.#delegate(response, endpoint);
        }
        toString() {
          return "[DelegateResponseInterceptor]";
        }
      };
      var responseInterceptorEmpty = new ResponseInterceptor();
      var responseInterceptorData = new DelegateResponseInterceptor((response, ignored) => {
        return response.data;
      });
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Endpoint.js
  var require_Endpoint = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Endpoint.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Endpoint_exports = {};
      __export(Endpoint_exports, {
        default: () => Endpoint
      });
      module.exports = __toCommonJS(Endpoint_exports);
      var is = __toESM(require_is());
      var import_Parameters = __toESM(require_Parameters());
      var import_ProtocolType = __toESM(require_ProtocolType());
      var import_VerbType = __toESM(require_VerbType());
      var import_ErrorInterceptor = __toESM(require_ErrorInterceptor());
      var import_RequestInterceptor = __toESM(require_RequestInterceptor());
      var import_ResponseInterceptor = __toESM(require_ResponseInterceptor());
      var Endpoint = class {
        #name;
        #description;
        #verb;
        #protocol;
        #host;
        #port;
        #path;
        #query;
        #headers;
        #body;
        #credentials;
        #requestInterceptor;
        #responseInterceptor;
        #errorInterceptor;
        /**
         * @param {string=} name
         * @param {string=} description
         * @param {VerbType=} verb
         * @param {ProtocolType=} protocol
         * @param {string=} host
         * @param {number=} port
         * @param {Parameters=} path
         * @param {Parameters=} query
         * @param {Parameters=} headers
         * @param {Parameters=} body
         * @param {Credentials=} credentials
         * @param {RequestInterceptor=} requestInterceptor
         * @param {ResponseInterceptor=} responseInterceptor
         * @param {ErrorInterceptor=} errorInterceptor
         */
        constructor(name, description, verb, protocol, host, port, path, query, headers, body, credentials, requestInterceptor, responseInterceptor, errorInterceptor) {
          this.#name = name || null;
          this.#description = description || null;
          this.#verb = verb || import_VerbType.default.GET;
          this.#protocol = protocol || import_ProtocolType.default.HTTPS;
          this.#host = host || null;
          this.#port = port || this.#protocol.defaultPort;
          this.#path = path || new import_Parameters.default();
          this.#query = query || new import_Parameters.default();
          this.#headers = headers || new import_Parameters.default();
          this.#body = body || new import_Parameters.default();
          this.#credentials = credentials || null;
          this.#requestInterceptor = requestInterceptor || import_RequestInterceptor.default.EMPTY;
          this.#responseInterceptor = responseInterceptor || import_ResponseInterceptor.default.EMPTY;
          this.#errorInterceptor = errorInterceptor || import_ErrorInterceptor.default.EMPTY;
        }
        /**
         * The name of the endpoint (used for internal purposes only).
         *
         * @public
         * @returns {string}
         */
        get name() {
          return this.#name;
        }
        /**
         * A description of the action performed by the endpoint, suitable for display to users.
         *
         * @public
         * @returns {string}
         */
        get description() {
          return this.#description;
        }
        /**
         * The verb to use when making the request.
         *
         * @public
         * @returns {VerbType}
         */
        get verb() {
          return this.#verb;
        }
        /**
         * The protocol to use with the endpoint.
         *
         * @public
         * @returns {ProtocolType}
         */
        get protocol() {
          return this.#protocol;
        }
        /**
         * The host of the endpoint.
         *
         * @public
         * @returns {string}
         */
        get host() {
          return this.#host;
        }
        /**
         * The host of the endpoint.
         *
         * @public
         * @returns {number}
         */
        get port() {
          return this.#port;
        }
        /**
         * The path definition of the endpoint.
         *
         * @public
         * @returns {Parameters}
         */
        get path() {
          return this.#path;
        }
        /**
         * The query definition of the endpoint.
         *
         * @public
         * @returns {Parameters}
         */
        get query() {
          return this.#query;
        }
        /**
         * The header definition of the endpoint.
         *
         * @public
         * @returns {Parameters}
         */
        get headers() {
          return this.#headers;
        }
        /**
         * The body definition of the endpoint.
         *
         * @public
         * @returns {Parameters}
         */
        get body() {
          return this.#body;
        }
        /**
         * Credentials for the request.
         *
         * @public
         * @return {Credentials}
         */
        get credentials() {
          return this.#credentials;
        }
        /**
         * The request interceptor of the endpoint.
         *
         * @public
         * @returns {RequestInterceptor|null}
         */
        get requestInterceptor() {
          return this.#requestInterceptor;
        }
        /**
         * The response interceptor of the endpoint.
         *
         * @public
         * @returns {ResponseInterceptor|null}
         */
        get responseInterceptor() {
          return this.#responseInterceptor;
        }
        /**
         * The error interceptor of the endpoint.
         *
         * @public
         * @returns {ErrorInterceptor|null}
         */
        get errorInterceptor() {
          return this.#errorInterceptor;
        }
        /**
         * Throws an {@link Error} if the instance is invalid.
         *
         * @public
         */
        validate() {
          if (!(this.protocol instanceof import_ProtocolType.default)) {
            throw new Error("Endpoint protocol must be an instance of ProtocolType.");
          }
          if (!is.string(this.#host) || this.#host.length === 0) {
            throw new Error("Endpoint host is invalid.");
          }
          if (!is.integer(this.#port) || this.#port < 0 || this.#port > 65535) {
            throw new Error("Endpoint port range is invalid.");
          }
          if (!(this.path instanceof import_Parameters.default)) {
            throw new Error("The path must be a Parameters collection.");
          }
          this.path.validate();
          if (!(this.query instanceof import_Parameters.default)) {
            throw new Error("The query must be a Parameters collection.");
          }
          this.query.validate();
          if (!(this.headers instanceof import_Parameters.default)) {
            throw new Error("The headers must be a Parameters collection.");
          }
          this.headers.validate();
          if (!(this.body instanceof import_Parameters.default)) {
            throw new Error("The body must be a Parameters collection.");
          }
          this.body.validate();
          if (this.credentials) {
            this.credentials.validate();
          }
          if (this.requestInterceptor && !(this.requestInterceptor instanceof import_RequestInterceptor.default)) {
            throw new Error("Endpoint request interceptor must be an instance of RequestInterceptor.");
          }
          if (this.responseInterceptor && !(this.responseInterceptor instanceof import_ResponseInterceptor.default)) {
            throw new Error("Endpoint response interceptor must be an instance of ResponseInterceptor.");
          }
          if (this.errorInterceptor && !(this.errorInterceptor instanceof import_ErrorInterceptor.default)) {
            throw new Error("Endpoint error interceptor must be an instance of ErrorInterceptor.");
          }
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Endpoint (name=${this.#name})]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/Gateway.js
  var require_Gateway = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/Gateway.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Gateway_exports = {};
      __export(Gateway_exports, {
        default: () => Gateway2
      });
      module.exports = __toCommonJS(Gateway_exports);
      var import_axios = __toESM(require_axios2());
      var array = __toESM(require_array());
      var assert = __toESM(require_assert());
      var attributes = __toESM(require_attributes());
      var is = __toESM(require_is());
      var promise = __toESM(require_promise());
      var import_Endpoint = __toESM(require_Endpoint());
      var import_VerbType = __toESM(require_VerbType());
      var import_FailureReason = __toESM(require_FailureReason());
      var import_FailureType = __toESM(require_FailureType());
      var Gateway2 = class {
        constructor() {
        }
        /**
         * Invokes a web service endpoint, given the payload supplied.
         *
         * @public
         * @static
         * @async
         * @param {Endpoint} endpoint
         * @param {*=} payload
         * @returns {Promise<object>}
         */
        static async invoke(endpoint, payload) {
          assert.argumentIsRequired(endpoint, "endpoint", import_Endpoint.default, "Endpoint");
          const pathParameters = endpoint.path.parameters;
          const headerParameters = endpoint.headers.parameters;
          const queryParameters = endpoint.query.parameters;
          const bodyParameters = endpoint.body.parameters;
          const extractParameter = async (parameter) => {
            try {
              const value = await parameter.extractor(payload);
              return value;
            } catch {
              return null;
            }
          };
          const groups = await Promise.all([
            promise.map(pathParameters, extractParameter),
            promise.map(headerParameters, extractParameter),
            promise.map(queryParameters, extractParameter),
            promise.map(bodyParameters, extractParameter)
          ]);
          const pathValues = groups[0];
          const headerValues = groups[1];
          const queryValues = groups[2];
          const bodyValues = groups[3];
          const parameters = array.flatten([pathParameters, headerParameters, queryParameters, bodyParameters]);
          const values = array.flatten([pathValues, headerValues, queryValues, bodyValues]);
          const failure = values.reduce((accumulator, value, index) => {
            let updatedFailure = accumulator;
            const parameter = parameters[index];
            if (value === null && !parameter.optional) {
              if (accumulator === null) {
                updatedFailure = import_FailureReason.default.forRequest({ endpoint }).addItem(import_FailureType.default.REQUEST_CONSTRUCTION_FAILURE, null, true);
              }
              updatedFailure.addItem(import_FailureType.default.REQUEST_PARAMETER_MISSING, { name: parameter.description });
            }
            return updatedFailure;
          }, null);
          if (failure !== null) {
            throw failure.format();
          }
          const options = {};
          const url = [];
          url.push(endpoint.protocol.prefix);
          url.push(endpoint.host);
          if (endpoint.port !== endpoint.protocol.defaultPort) {
            url.push(":");
            url.push(endpoint.port);
          }
          url.push("/");
          const paths = await promise.pipeline(pathValues.map((value) => (previous) => {
            let encodedValue;
            if (is.nil(value) || is.undef(value)) {
              encodedValue = value;
            } else {
              encodedValue = value.toString().replace(/\//g, "%2F");
            }
            previous.push(encodedValue);
            return previous;
          }), []);
          url.push(paths.join("/"));
          options.method = verbs.get(endpoint.verb);
          options.url = url.join("");
          if (headerParameters.length !== 0) {
            const headers = await promise.pipeline(headerValues.map((value, i) => (accumulator) => {
              const parameter = headerParameters[i];
              accumulator[parameter.key] = value;
              return accumulator;
            }), {});
            if (headers.length !== 0) {
              options.headers = headers;
            }
          }
          if (queryParameters.length !== 0) {
            const query = await promise.pipeline(queryValues.map((value, i) => (accumulator) => {
              const parameter = queryParameters[i];
              accumulator[parameter.key] = value;
              return accumulator;
            }), {});
            if (query.length !== 0) {
              options.params = query;
            }
          }
          if (bodyParameters.length !== 0) {
            const body = await promise.pipeline(bodyValues.map((value, i) => (accumulator) => {
              const parameter = bodyParameters[i];
              attributes.write(accumulator, parameter.key, value);
              return accumulator;
            }), {});
            options.data = body.body;
          }
          if (endpoint.credentials) {
            const credentials = await Promise.all([
              endpoint.credentials.usernameExtractor(payload),
              endpoint.credentials.passwordExtractor(payload)
            ]);
            options.auth = {
              username: credentials[0],
              password: credentials[1]
            };
          }
          const request = endpoint.requestInterceptor ? await endpoint.requestInterceptor.process(options, endpoint) : options;
          try {
            const response = await import_axios.default.request(request);
            if (endpoint.responseInterceptor) {
              return endpoint.responseInterceptor.process(response, endpoint);
            }
            return response;
          } catch (error) {
            if (endpoint.errorInterceptor) {
              return endpoint.errorInterceptor.process(error, endpoint);
            }
            throw error;
          }
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Gateway]";
        }
      };
      var verbs = /* @__PURE__ */ new Map();
      verbs.set(import_VerbType.default.GET, "get");
      verbs.set(import_VerbType.default.DELETE, "delete");
      verbs.set(import_VerbType.default.POST, "post");
      verbs.set(import_VerbType.default.PUT, "put");
      verbs.set(import_VerbType.default.PATCH, "patch");
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Credentials.js
  var require_Credentials = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/definitions/Credentials.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Credentials_exports = {};
      __export(Credentials_exports, {
        default: () => Credentials
      });
      module.exports = __toCommonJS(Credentials_exports);
      var is = __toESM(require_is());
      var Credentials = class {
        #usernameExtractor;
        #passwordExtractor;
        /**
         * @param {Function=} usernameExtractor
         * @param {Function=} passwordExtractor
         */
        constructor(usernameExtractor, passwordExtractor) {
          this.#usernameExtractor = usernameExtractor;
          this.#passwordExtractor = passwordExtractor;
        }
        /**
         * The password extractor.
         *
         * @public
         * @returns {Function}
         */
        get usernameExtractor() {
          return this.#usernameExtractor;
        }
        /**
         * The password extractor.
         *
         * @public
         * @returns {Function}
         */
        get passwordExtractor() {
          return this.#passwordExtractor;
        }
        /**
         * Throws an {@link Error} if the instance is invalid.
         *
         * @public
         */
        validate() {
          if (!is.fn(this.usernameExtractor)) {
            throw new Error("Credentials username extractor must be a function.");
          }
          if (!is.fn(this.passwordExtractor)) {
            throw new Error("Credentials password extractor must be a function.");
          }
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Credentials]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/builders/CredentialsBuilder.js
  var require_CredentialsBuilder = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/builders/CredentialsBuilder.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var CredentialsBuilder_exports = {};
      __export(CredentialsBuilder_exports, {
        default: () => CredentialsBuilder
      });
      module.exports = __toCommonJS(CredentialsBuilder_exports);
      var assert = __toESM(require_assert());
      var import_Credentials = __toESM(require_Credentials());
      var CredentialsBuilder = class {
        #credentials;
        constructor() {
          this.#credentials = new import_Credentials.default();
        }
        /**
         * The {@link Credentials} object, given all the information provided thus far.
         *
         * @public
         * @returns {Credentials}
         */
        get credentials() {
          return this.#credentials;
        }
        /**
         * Sets a literal username.
         *
         * @public
         * @param {string} username
         * @returns {CredentialsBuilder}
         */
        withLiteralUsername(username) {
          assert.argumentIsOptional(username, "username", String);
          return this.withDelegateUsername((ignored) => username);
        }
        /**
         * Sets a function which returns a username.
         *
         * @public
         * @param {Function} delegate
         * @returns {CredentialsBuilder}
         */
        withDelegateUsername(delegate) {
          this.#credentials = new import_Credentials.default(delegate, this.#credentials.passwordExtractor);
          return this;
        }
        /**
         * Sets a literal password.
         *
         * @public
         * @param {string} password
         * @returns {CredentialsBuilder}
         */
        withLiteralPassword(password) {
          assert.argumentIsOptional(password, "password", String);
          return this.withDelegatePassword((ignored) => password);
        }
        /**
         * Sets a function which returns a password.
         *
         * @public
         * @param {Function} delegate
         * @returns {CredentialsBuilder}
         */
        withDelegatePassword(delegate) {
          this.#credentials = new import_Credentials.default(this.#credentials.usernameExtractor, delegate);
          return this;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[CredentialsBuilder]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/builders/ParametersBuilder.js
  var require_ParametersBuilder = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/builders/ParametersBuilder.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var ParametersBuilder_exports = {};
      __export(ParametersBuilder_exports, {
        default: () => ParametersBuilder
      });
      module.exports = __toCommonJS(ParametersBuilder_exports);
      var assert = __toESM(require_assert());
      var attributes = __toESM(require_attributes());
      var is = __toESM(require_is());
      var import_Parameter = __toESM(require_Parameter());
      var import_Parameters = __toESM(require_Parameters());
      var ParametersBuilder = class {
        #parameters;
        #required;
        /**
         * @param {boolean=} required - If true, all parameters will be marked as required.
         */
        constructor(required) {
          this.#parameters = new import_Parameters.default();
          this.#required = is.boolean(required) && required;
        }
        /**
         * The {@link Parameters} collection, given all the information provided thus far.
         *
         * @public
         * @returns {Parameters}
         */
        get parameters() {
          return this.#parameters;
        }
        /**
         * Adds a new parameter that extracts its value from a delegate.
         *
         * @param {string} description
         * @param {string} key
         * @param {Function} delegate
         * @param {boolean=} optional
         * @param {Function=} serializer
         * @returns {ParametersBuilder}
         */
        withDelegateParameter(description, key, delegate, optional, serializer) {
          this.#addParameter(new import_Parameter.default(description, key, buildDelegateExtractor(delegate, buildSerializer(serializer)), optional || this.#required));
          return this;
        }
        /**
         * Adds a new parameter with a literal value.
         *
         * @param {string} description
         * @param {string} key
         * @param {*=} value
         * @param {boolean=} optional
         * @returns {ParametersBuilder}
         */
        withLiteralParameter(description, key, value, optional) {
          this.#addParameter(new import_Parameter.default(description, key, buildLiteralExtractor(value || key), optional || this.#required));
          return this;
        }
        /**
         * Adds a new parameter that reads its value from the variable
         * on the request payload.
         *
         * @param {string} description
         * @param {string} key
         * @param {string} variable
         * @param {boolean=} optional
         * @param {Function=} serializer
         * @returns {ParametersBuilder}
         */
        withVariableParameter(description, key, variable, optional, serializer) {
          this.#addParameter(new import_Parameter.default(description, key, buildVariableExtractor(variable, buildSerializer(serializer)), optional || this.#required));
          return this;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[ParametersBuilder]";
        }
        #addParameter(parameter) {
          const items = this.#parameters.parameters.slice(0);
          items.push(parameter);
          this.#parameters = new import_Parameters.default(items);
        }
      };
      function buildSerializer(serializer) {
        let returnRef;
        if (is.fn(serializer)) {
          returnRef = serializer;
        } else {
          returnRef = (x) => x;
        }
        return returnRef;
      }
      function buildDelegateExtractor(fn, serializer) {
        assert.argumentIsRequired(fn, "fn", Function);
        return async (payload) => {
          return serializer(fn(payload));
        };
      }
      function buildLiteralExtractor(value) {
        assert.argumentIsRequired(value, "value", String);
        return async () => value;
      }
      function buildVariableExtractor(variable, serializer) {
        assert.argumentIsRequired(variable, "variable", String);
        return buildDelegateExtractor((payload) => {
          if (is.object(payload) && attributes.has(payload, variable)) {
            return attributes.read(payload, variable);
          } else {
            return null;
          }
        }, serializer);
      }
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/CompositeErrorInterceptor.js
  var require_CompositeErrorInterceptor = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/CompositeErrorInterceptor.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var CompositeErrorInterceptor_exports = {};
      __export(CompositeErrorInterceptor_exports, {
        default: () => CompositeErrorInterceptor
      });
      module.exports = __toCommonJS(CompositeErrorInterceptor_exports);
      var assert = __toESM(require_assert());
      var import_ErrorInterceptor = __toESM(require_ErrorInterceptor());
      var CompositeErrorInterceptor = class extends import_ErrorInterceptor.default {
        #a;
        #b;
        /**
         * @param {ErrorInterceptor} a - The first interceptor to process.
         * @param {ErrorInterceptor} b - The second interceptor to process.
         */
        constructor(a, b) {
          super();
          assert.argumentIsRequired(a, "a", import_ErrorInterceptor.default, "ErrorInterceptor");
          assert.argumentIsRequired(b, "b", import_ErrorInterceptor.default, "ErrorInterceptor");
          this.#a = a;
          this.#b = b;
        }
        /**
         * @protected
         * @override
         * @async
         * @param {object} error
         * @param {*} endpoint
         * @returns {Promise<*>}
         */
        async _onProcess(error, endpoint) {
          try {
            const result = await this.#a.process(error, endpoint);
            return result;
          } catch (adjusted) {
            return this.#b.process(adjusted, endpoint);
          }
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[CompositeErrorInterceptor]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/CompositeResponseInterceptor.js
  var require_CompositeResponseInterceptor = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/CompositeResponseInterceptor.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var CompositeResponseInterceptor_exports = {};
      __export(CompositeResponseInterceptor_exports, {
        default: () => CompositeResponseInterceptor
      });
      module.exports = __toCommonJS(CompositeResponseInterceptor_exports);
      var assert = __toESM(require_assert());
      var import_ResponseInterceptor = __toESM(require_ResponseInterceptor());
      var CompositeResponseInterceptor = class extends import_ResponseInterceptor.default {
        #a;
        #b;
        /**
         * @param {ResponseInterceptor} a - The first interceptor to process.
         * @param {ResponseInterceptor} b - The second interceptor to process.
         */
        constructor(a, b) {
          super();
          assert.argumentIsRequired(a, "a", import_ResponseInterceptor.default, "ResponseInterceptor");
          assert.argumentIsRequired(b, "b", import_ResponseInterceptor.default, "ResponseInterceptor");
          this.#a = a;
          this.#b = b;
        }
        /**
         * @protected
         * @override
         * @async
         * @param {object} response
         * @param {Endpoint} endpoint
         * @returns {Promise<*>}
         */
        async _onProcess(response, endpoint) {
          const adjusted = await this.#a.process(response, endpoint);
          return this.#b.process(adjusted, endpoint);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[CompositeResponseInterceptor]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/CompositeRequestInterceptor.js
  var require_CompositeRequestInterceptor = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/interceptors/CompositeRequestInterceptor.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var CompositeRequestInterceptor_exports = {};
      __export(CompositeRequestInterceptor_exports, {
        default: () => CompositeRequestInterceptor
      });
      module.exports = __toCommonJS(CompositeRequestInterceptor_exports);
      var assert = __toESM(require_assert());
      var import_RequestInterceptor = __toESM(require_RequestInterceptor());
      var CompositeRequestInterceptor = class extends import_RequestInterceptor.default {
        #a;
        #b;
        /**
         * @param {RequestInterceptor} a - The first interceptor to process.
         * @param {RequestInterceptor} b - The second interceptor to process.
         */
        constructor(a, b) {
          super();
          assert.argumentIsRequired(a, "a", import_RequestInterceptor.default, "RequestInterceptor");
          assert.argumentIsRequired(b, "b", import_RequestInterceptor.default, "RequestInterceptor");
          this.#a = a;
          this.#b = b;
        }
        /**
         * @protected
         * @override
         * @async
         * @param {object} request
         * @param {Endpoint} endpoint
         * @returns {Promise<*>}
         */
        async _onProcess(request, endpoint) {
          const adjusted = await this.#a.process(request, endpoint);
          return this.#b.process(adjusted, endpoint);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[CompositeRequestInterceptor]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/api/http/builders/EndpointBuilder.js
  var require_EndpointBuilder = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/api/http/builders/EndpointBuilder.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var EndpointBuilder_exports = {};
      __export(EndpointBuilder_exports, {
        default: () => EndpointBuilder
      });
      module.exports = __toCommonJS(EndpointBuilder_exports);
      var assert = __toESM(require_assert());
      var import_CredentialsBuilder = __toESM(require_CredentialsBuilder());
      var import_ParametersBuilder = __toESM(require_ParametersBuilder());
      var import_Endpoint = __toESM(require_Endpoint());
      var import_ProtocolType = __toESM(require_ProtocolType());
      var import_VerbType = __toESM(require_VerbType());
      var import_CompositeErrorInterceptor = __toESM(require_CompositeErrorInterceptor());
      var import_CompositeResponseInterceptor = __toESM(require_CompositeResponseInterceptor());
      var import_CompositeRequestInterceptor = __toESM(require_CompositeRequestInterceptor());
      var import_ErrorInterceptor = __toESM(require_ErrorInterceptor());
      var import_ResponseInterceptor = __toESM(require_ResponseInterceptor());
      var import_RequestInterceptor = __toESM(require_RequestInterceptor());
      var EndpointBuilder = class _EndpointBuilder {
        #endpoint;
        /**
         * @param {string} name
         * @param {string=} description
         */
        constructor(name, description) {
          assert.argumentIsRequired(name, "name", String);
          assert.argumentIsOptional(description, "description", String);
          this.#endpoint = new import_Endpoint.default(name, description);
        }
        /**
         * The {@link Endpoint}, given all the information provided thus far.
         *
         * @public
         * @returns {Endpoint}
         */
        get endpoint() {
          return this.#endpoint;
        }
        /**
         * Sets the verb.
         *
         * @public
         * @param {VerbType} verb
         * @returns {EndpointBuilder}
         */
        withVerb(verb) {
          assert.argumentIsRequired(verb, "verb", import_VerbType.default, "VerbType");
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Sets the host.
         *
         * @public
         * @param {ProtocolType} protocol
         * @returns {EndpointBuilder}
         */
        withProtocol(protocol) {
          assert.argumentIsRequired(protocol, "protocol", import_ProtocolType.default, "ProtocolType");
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Sets the host.
         *
         * @public
         * @param {string} host
         * @returns {EndpointBuilder}
         */
        withHost(host) {
          assert.argumentIsRequired(host, "host", String);
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Sets the port.
         *
         * @public
         * @param {number} port
         * @returns {EndpointBuilder}
         */
        withPort(port) {
          assert.argumentIsRequired(port, "port", Number);
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a {@link Parameters} collection, describing the request headers, using a callback.
         *
         * @public
         * @param {parametersBuilderCallback} callback
         * @returns {EndpointBuilder}
         */
        withHeadersBuilder(callback) {
          assert.argumentIsRequired(callback, "callback", Function);
          const builder = new import_ParametersBuilder.default();
          callback(builder);
          const headers = builder.parameters;
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a {@link Parameters} collection, describing the request path, using a callback.
         *
         * @public
         * @param {parametersBuilderCallback} callback
         * @returns {EndpointBuilder}
         */
        withPathBuilder(callback) {
          assert.argumentIsRequired(callback, "callback", Function);
          const builder = new import_ParametersBuilder.default(true);
          callback(builder);
          const path = builder.parameters;
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a {@link Parameters} collection, describing the request querystring, using a callback.
         *
         * @public
         * @param {parametersBuilderCallback} callback
         * @returns {EndpointBuilder}
         */
        withQueryBuilder(callback) {
          assert.argumentIsRequired(callback, "callback", Function);
          const builder = new import_ParametersBuilder.default();
          callback(builder);
          const query = builder.parameters;
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a {@link Parameters} collection, describing the request body, using a callback.
         *
         * @public
         * @param {parametersBuilderCallback} callback
         * @returns {EndpointBuilder}
         */
        withBodyBuilder(callback) {
          assert.argumentIsRequired(callback, "callback", Function);
          const builder = new import_ParametersBuilder.default();
          callback(builder);
          const body = builder.parameters;
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a body to the request.
         *
         * @public
         * @param {string=} description - The human-readable description of the request body.
         * @returns {EndpointBuilder}
         */
        withBody(description) {
          assert.argumentIsOptional(description, "description", String);
          return this.withBodyBuilder((bodyBuilder) => {
            bodyBuilder.withDelegateParameter(description || "request payload", "body", (x) => x);
          });
        }
        /**
         * Adds basic authentication to the request.
         *
         * @public
         * @param {string} username
         * @param {string} password
         * @returns {EndpointBuilder}
         */
        withBasicAuthentication(username, password) {
          assert.argumentIsRequired(username, "username", String);
          assert.argumentIsRequired(password, "password", String);
          return this.withBasicAuthenticationBuilder((credentialsBuilder) => {
            credentialsBuilder.withLiteralUsername(username);
            credentialsBuilder.withLiteralPassword(password);
          });
        }
        /**
         * Adds basic authentication to the request, using a callback.
         *
         * @public
         * @param {Function} callback
         * @returns {EndpointBuilder}
         */
        withBasicAuthenticationBuilder(callback) {
          assert.argumentIsRequired(callback, "callback", Function);
          const builder = new import_CredentialsBuilder.default();
          callback(builder);
          const credentials = builder.credentials;
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a {@link RequestInterceptor}.
         *
         * @public
         * @param {RequestInterceptor} requestInterceptor
         * @returns {EndpointBuilder}
         */
        withRequestInterceptor(requestInterceptor) {
          assert.argumentIsRequired(requestInterceptor, "requestInterceptor", import_RequestInterceptor.default, "RequestInterceptor");
          let existingRequestInterceptor = this.endpoint.requestInterceptor;
          let updatedRequestInterceptor;
          if (existingRequestInterceptor && existingRequestInterceptor !== import_RequestInterceptor.default.EMPTY) {
            updatedRequestInterceptor = new import_CompositeRequestInterceptor.default(existingRequestInterceptor, requestInterceptor);
          } else {
            updatedRequestInterceptor = requestInterceptor;
          }
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, updatedRequestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a {@link ResponseInterceptor} for successful web service responses.
         *
         * @public
         * @param {ResponseInterceptor} responseInterceptor
         * @returns {EndpointBuilder}
         */
        withResponseInterceptor(responseInterceptor) {
          assert.argumentIsRequired(responseInterceptor, "responseInterceptor", import_ResponseInterceptor.default, "ResponseInterceptor");
          let existingResponseInterceptor = this.endpoint.responseInterceptor;
          let updatedResponseInterceptor;
          if (existingResponseInterceptor && existingResponseInterceptor !== import_ResponseInterceptor.default.EMPTY) {
            updatedResponseInterceptor = new import_CompositeResponseInterceptor.default(existingResponseInterceptor, responseInterceptor);
          } else {
            updatedResponseInterceptor = responseInterceptor;
          }
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, updatedResponseInterceptor, this.endpoint.errorInterceptor);
          return this;
        }
        /**
         * Adds a {@link ErrorInterceptor} for handling remote web service errors.
         *
         * @public
         * @param {ErrorInterceptor} errorInterceptor
         * @returns {EndpointBuilder}
         */
        withErrorInterceptor(errorInterceptor) {
          assert.argumentIsRequired(errorInterceptor, "errorInterceptor", import_ErrorInterceptor.default, "ErrorInterceptor");
          let existingErrorInterceptor = this.endpoint.errorInterceptor;
          let updatedErrorInterceptor;
          if (existingErrorInterceptor && existingErrorInterceptor !== import_ErrorInterceptor.default.EMPTY) {
            updatedErrorInterceptor = new import_CompositeErrorInterceptor.default(existingErrorInterceptor, errorInterceptor);
          } else {
            updatedErrorInterceptor = errorInterceptor;
          }
          this.#endpoint = new import_Endpoint.default(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, updatedErrorInterceptor);
          return this;
        }
        /**
         * Factory function for creating an {@link EndpointBuilder} instance.
         *
         * @public
         * @static
         * @param {string} name
         * @param {string=} description
         * @returns {EndpointBuilder}
         */
        static for(name, description) {
          return new _EndpointBuilder(name, description);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[EndpointBuilder]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // lib/providers/InstrumentProvider.js
  var require_InstrumentProvider = __commonJS({
    "lib/providers/InstrumentProvider.js"(exports, module) {
      var assert = require_assert();
      var is = require_is();
      var promise = require_promise();
      var EndpointBuilder = require_EndpointBuilder();
      var ErrorInterceptor = require_ErrorInterceptor();
      var Gateway2 = require_Gateway();
      var ProtocolType = require_ProtocolType();
      var ResponseInterceptor = require_ResponseInterceptor();
      var VerbType = require_VerbType();
      module.exports = (() => {
        "use strict";
        const DEFAULT_MAXIMUM_WAIT_BEFORE_TIMEOUT_IN_MILLISECONDS = 3 * 1e3;
        const regex = {};
        regex.crypto = {};
        regex.crypto.token = /^(.*) - (USD)$/i;
        class InstrumentProvider2 {
          constructor(waitInMilliseconds) {
            assert.argumentIsOptional(waitInMilliseconds, "waitInMillis", Number);
            this._waitInMilliseconds = waitInMilliseconds || DEFAULT_MAXIMUM_WAIT_BEFORE_TIMEOUT_IN_MILLISECONDS;
          }
          /**
           * Returns a promise for instrument metadata (i.e. "profile" data). If no instrument
           * can be found with a matching symbol, the promise is rejected.
           *
           * @public
           * @async
           * @param {String} symbol
           * @returns {Promise<Object>}
           */
          async getInstrument(symbol) {
            assert.argumentIsRequired(symbol, "symbol", String);
            return promise.timeout(Gateway2.invoke(instrumentLookupEndpoint, { symbol }), this._waitInMilliseconds, "instrument lookup").catch((e) => {
              let message;
              if (is.string(e) && e === "timeout") {
                message = `Instrument lookup for [ ${symbol} ] failed due to timed out`;
              } else {
                message = `Instrument lookup for [ ${symbol} ] failed due to an unspecified error`;
              }
              return Promise.reject(message);
            }).then((result) => {
              if (result.instrument === null) {
                return Promise.reject(`Instrument lookup for [ ${symbol} ] failed, the instrument does not exist`);
              }
              normalizeInstrument(result.instrument);
              return result;
            });
          }
          /**
           * Returns a promise for metadata for multiple instruments.
           *
           * @public
           * @async
           * @param {String[]} symbols
           * @returns {Promise<Object>}
           */
          async getInstruments(symbols) {
            assert.argumentIsArray(symbols, "symbols", String);
            assert.argumentIsValid(symbols.length, "symbols.length", (x) => x > 0, "is greater than zero");
            const symbolList = symbols.join(",");
            return promise.timeout(Gateway2.invoke(instrumentsLookupEndpoint, { symbols: symbolList }), this._waitInMilliseconds, "instrument lookup").catch((e) => {
              let message;
              if (is.string(e) && e === "timeout") {
                message = `Instrument lookup for [ ${symbolList} ] failed due to timed out`;
              } else {
                message = `Instrument lookup for [ ${symbolList} ] failed due to an unspecified error`;
              }
              return Promise.reject(message);
            }).then((result) => {
              if (result.instruments === null) {
                return Promise.reject(`Instrument lookup for [ ${symbolList} ] failed, no instruments were returned`);
              }
              if (is.array(result.instruments)) {
                result.instruments.forEach(normalizeInstrument);
              }
              return result;
            });
          }
          toString() {
            return "[InstrumentProvider]";
          }
        }
        const instrumentLookupEndpoint = EndpointBuilder.for("query-instrument", "query instrument").withVerb(VerbType.GET).withProtocol(ProtocolType.HTTPS).withHost("instruments-prod.aws.barchart.com").withPort(443).withPathBuilder((pb) => {
          pb.withLiteralParameter("instruments", "instruments").withVariableParameter("symbol", "symbol", "symbol");
        }).withResponseInterceptor(ResponseInterceptor.DATA).withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;
        const instrumentsLookupEndpoint = EndpointBuilder.for("query-instruments", "query instruments").withVerb(VerbType.GET).withProtocol(ProtocolType.HTTPS).withHost("instruments-prod.aws.barchart.com").withPort(443).withPathBuilder((pb) => {
          pb.withLiteralParameter("instruments", "instruments");
        }).withQueryBuilder((qb) => {
          qb.withVariableParameter("symbols", "symbols", "symbols");
        }).withResponseInterceptor(ResponseInterceptor.DATA).withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;
        function normalizeInstrument(instrument) {
          if (instrument && instrument.symbolType === 18) {
            const match = instrument.name.match(regex.crypto.token) || null;
            if (match !== null) {
              instrument.name = match[1];
              instrument.currency = "USD";
              instrument.symbolType = 999;
            }
          }
        }
        return InstrumentProvider2;
      })();
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/AdHoc.js
  var require_AdHoc = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/AdHoc.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var AdHoc_exports = {};
      __export(AdHoc_exports, {
        default: () => AdHoc
      });
      module.exports = __toCommonJS(AdHoc_exports);
      var assert = __toESM(require_assert());
      var AdHoc = class _AdHoc {
        #data;
        /**
         * @param {object} data
         */
        constructor(data) {
          this.#data = data || {};
        }
        /**
         * The data.
         *
         * @public
         * @returns {object}
         */
        get data() {
          return this.#data;
        }
        /**
         * The data.
         *
         * @public
         * @param {object} data
         */
        set data(data) {
          assert.argumentIsRequired(data, "data", Object);
          this.#data = data;
        }
        /**
         * Returns the JSON representation.
         *
         * @public
         * @returns {*}
         */
        toJSON() {
          return JSON.stringify(this.#data);
        }
        /**
         * Converts a JSON-serialized object into an {@link AdHoc} instance.
         *
         * @public
         * @static
         * @param {string} serialized
         * @returns {AdHoc}
         */
        static parse(serialized) {
          return new _AdHoc(JSON.parse(serialized));
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[AdHoc]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Timestamp.js
  var require_Timestamp = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Timestamp.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Timestamp_exports = {};
      __export(Timestamp_exports, {
        default: () => Timestamp
      });
      module.exports = __toCommonJS(Timestamp_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var MILLISECONDS_PER_SECOND = 1e3;
      var Timestamp = class _Timestamp {
        #timestamp;
        /**
         * @param {number} timestamp
         */
        constructor(timestamp) {
          assert.argumentIsValid(timestamp, "timestamp", is.large, "is an integer");
          this.#timestamp = timestamp;
        }
        /**
         * The timestamp (milliseconds since epoch).
         *
         * @public
         * @returns {number}
         */
        get timestamp() {
          return this.#timestamp;
        }
        /**
         * Returns a new {@link Timestamp} instance shifted forward by a specific
         * number of milliseconds.
         *
         * @public
         * @param {number} milliseconds
         * @returns {Timestamp}
         */
        add(milliseconds) {
          assert.argumentIsRequired(milliseconds, "milliseconds", Number);
          return new _Timestamp(this.#timestamp + milliseconds);
        }
        /**
         * Returns a new {@link Timestamp} instance shifted backwards by a specific
         * number of milliseconds.
         *
         * @public
         * @param {number} milliseconds
         * @returns {Timestamp}
         */
        subtract(milliseconds) {
          assert.argumentIsRequired(milliseconds, "milliseconds", Number);
          return new _Timestamp(this.#timestamp - milliseconds);
        }
        /**
         * Returns a new {@link Timestamp} instance shifted forward by a specific
         * number of seconds.
         *
         * @public
         * @param {number} seconds
         * @returns {Timestamp}
         */
        addSeconds(seconds) {
          assert.argumentIsRequired(seconds, "seconds", Number);
          return this.add(seconds * MILLISECONDS_PER_SECOND);
        }
        /**
         * Returns a new {@link Timestamp} instance shifted backwards by a specific
         * number of seconds.
         *
         * @public
         * @param {number} seconds
         * @returns {Timestamp}
         */
        subtractSeconds(seconds) {
          assert.argumentIsRequired(seconds, "seconds", Number);
          return this.subtract(seconds * MILLISECONDS_PER_SECOND);
        }
        /**
         * Indicates if the current {@link Timestamp} instance occurs before another timestamp.
         *
         * @public
         * @param {Timestamp} other
         * @returns {boolean}
         */
        getIsBefore(other) {
          return _Timestamp.compareTimestamps(this, other) < 0;
        }
        /**
         * Indicates if the current {@link Timestamp} instance occurs after another timestamp.
         *
         * @public
         * @param {Timestamp} other
         * @returns {boolean}
         */
        getIsAfter(other) {
          return _Timestamp.compareTimestamps(this, other) > 0;
        }
        /**
         * Indicates if another {@link Timestamp} refers to the same moment.
         *
         * @public
         * @param {Timestamp} other
         * @returns {boolean}
         */
        getIsEqual(other) {
          return _Timestamp.compareTimestamps(this, other) === 0;
        }
        /**
         * Returns the JSON representation.
         *
         * @public
         * @returns {number}
         */
        toJSON() {
          return this.timestamp;
        }
        /**
         * Clones a {@link Timestamp} instance.
         *
         * @public
         * @static
         * @param {Timestamp} other
         * @returns {Timestamp}
         */
        static clone(other) {
          assert.argumentIsRequired(other, "other", _Timestamp, "Timestamp");
          return new _Timestamp(other.#timestamp);
        }
        /**
         * Parses the value emitted by {@link Timestamp#toJSON}.
         *
         * @public
         * @static
         * @param {number} value
         * @returns {Timestamp}
         */
        static parse(value) {
          return new _Timestamp(value);
        }
        /**
         * Returns a new {@link Timestamp} instance, representing the current moment.
         *
         * @public
         * @static
         * @returns {Timestamp}
         */
        static now() {
          return new _Timestamp((/* @__PURE__ */ new Date()).getTime());
        }
        /**
         * A comparator function for {@link Timestamp} instances.
         *
         * @public
         * @static
         * @param {Timestamp} a
         * @param {Timestamp} b
         * @returns {number}
         */
        static compareTimestamps(a, b) {
          assert.argumentIsRequired(a, "a", _Timestamp, "Timestamp");
          assert.argumentIsRequired(b, "b", _Timestamp, "Timestamp");
          return a.timestamp - b.timestamp;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return "[Timestamp]";
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/serialization/json/DataType.js
  var require_DataType = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/serialization/json/DataType.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var DataType_exports = {};
      __export(DataType_exports, {
        default: () => DataType
      });
      module.exports = __toCommonJS(DataType_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_AdHoc = __toESM(require_AdHoc());
      var import_Day = __toESM(require_Day());
      var import_Decimal = __toESM(require_Decimal());
      var import_Enum = __toESM(require_Enum());
      var import_Timestamp = __toESM(require_Timestamp());
      var DataType = class _DataType {
        #description;
        #enumerationType;
        #reviver;
        #validator;
        #builder;
        /**
         * @param {string} description
         * @param {Function=} enumerationType
         * @param {Function=} reviver
         * @param {Function=} validator
         * @param {Function=} builder
         */
        constructor(description, enumerationType, reviver, validator, builder) {
          assert.argumentIsRequired(description, "description", String);
          assert.argumentIsOptional(enumerationType, "enumerationType", Function);
          assert.argumentIsOptional(reviver, "reviver", Function);
          assert.argumentIsOptional(validator, "validator", Function);
          assert.argumentIsOptional(builder, "builder", Function);
          if (enumerationType) {
            assert.argumentIsValid(enumerationType, "enumerationType", extendsEnumeration, "is an enumeration");
          }
          this.#description = description;
          this.#enumerationType = enumerationType || null;
          let reviverToUse;
          if (reviver) {
            reviverToUse = reviver;
          } else if (enumerationType) {
            reviverToUse = (x) => import_Enum.default.fromCode(enumerationType, x);
          } else {
            reviverToUse = (x) => x;
          }
          this.#reviver = reviverToUse;
          let validatorToUse;
          if (validator) {
            validatorToUse = validator;
          } else {
            validatorToUse = (candidate) => true;
          }
          this.#validator = validatorToUse;
          let builderToUse;
          if (builder) {
            builderToUse = builder;
          } else {
            builderToUse = (data) => data;
          }
          this.#builder = builderToUse;
        }
        /**
         * A function that converts data into the desired format.
         *
         * @public
         * @param {*} data
         * @returns {*}
         */
        convert(data) {
          return this.#builder(data);
        }
        /**
         * Description of the data type.
         *
         * @public
         * @returns {string}
         */
        get description() {
          return this.#description;
        }
        /**
         * The {@Enum} type, if applicable.
         *
         * @public
         * @returns {Function|null}
         */
        get enumerationType() {
          return this.#enumerationType;
        }
        /**
         * A function which "revives" a value after serialization to JSON.
         *
         * @public
         * @returns {Function}
         */
        get reviver() {
          return this.#reviver;
        }
        /**
         * A function validates data, returning true or false.
         *
         * @public
         * @returns {Function}
         */
        get validator() {
          return this.#validator;
        }
        /**
         * Return a {@link DataType} instance for use with an {@link @Enum}.
         *
         * @public
         * @static
         * @param {Function} enumerationType - A class that extends {@link Enum}
         * @param description - The description
         * @returns {DataType}
         */
        static forEnum(enumerationType, description) {
          return new _DataType(description, enumerationType, null, (x) => x instanceof enumerationType, getBuilder(getEnumerationBuilder(enumerationType)));
        }
        /**
         * References a string.
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get STRING() {
          return dataTypeString;
        }
        /**
         * References a number.
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get NUMBER() {
          return dataTypeNumber;
        }
        /**
         * References a boolean value.
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get BOOLEAN() {
          return dataTypeBoolean;
        }
        /**
         * References an object (serialized as JSON).
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get OBJECT() {
          return dataTypeObject;
        }
        /**
         * References an array.
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get ARRAY() {
          return dataTypeArray;
        }
        /**
         * References a {@link Decimal} instance.
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get DECIMAL() {
          return dataTypeDecimal;
        }
        /**
         * References a {@link Day} instance.
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get DAY() {
          return dataTypeDay;
        }
        /**
         * References a {@link Timestamp} instance.
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get TIMESTAMP() {
          return dataTypeTimestamp;
        }
        /**
         * References an object whose internal properties are not important (for
         * serialization and deserialization purposes).
         *
         * @public
         * @static
         * @returns {DataType}
         */
        static get AD_HOC() {
          return dataTypeAdHoc;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[DataType (description=${this.#description})]`;
        }
      };
      function extendsEnumeration(EnumerationType) {
        return is.extension(import_Enum.default, EnumerationType);
      }
      var dataTypeString = new DataType("String", null, null, is.string);
      var dataTypeNumber = new DataType("Number", null, null, is.number);
      var dataTypeBoolean = new DataType("Boolean", null, null, is.boolean);
      var dataTypeObject = new DataType("Object", null, null, is.object);
      var dataTypeArray = new DataType("Array", null, null, is.array);
      var dataTypeDecimal = new DataType("Decimal", null, (x) => import_Decimal.default.parse(x), (x) => x instanceof import_Decimal.default, getBuilder(buildDecimal));
      var dataTypeDay = new DataType("Day", null, (x) => import_Day.default.parse(x), (x) => x instanceof import_Day.default, getBuilder(buildDay));
      var dataTypeTimestamp = new DataType("Timestamp", null, (x) => import_Timestamp.default.parse(x), (x) => x instanceof import_Timestamp.default, getBuilder(buildTimestamp));
      var dataTypeAdHoc = new DataType("AdHoc", null, (x) => import_AdHoc.default.parse(x), (x) => x instanceof import_AdHoc.default, getBuilder(buildAdHoc));
      function getBuilder(builder) {
        return (data) => {
          try {
            return builder(data);
          } catch (e) {
            return data;
          }
        };
      }
      function buildDecimal(data) {
        return new import_Decimal.default(data);
      }
      function buildDay(data) {
        if (data instanceof import_Day.default) {
          return new import_Day.default(data.year, data.month, data.day);
        } else if (is.date(data)) {
          return import_Day.default.fromDate(data);
        } else if (is.string(data)) {
          return import_Day.default.parse(data);
        } else {
          return data;
        }
      }
      function buildTimestamp(data) {
        return new import_Timestamp.default(data);
      }
      function buildAdHoc(data) {
        if (data instanceof import_AdHoc.default) {
          return new import_AdHoc.default(data.data);
        } else if (is.object(data)) {
          return new import_AdHoc.default(data);
        }
      }
      function getEnumerationBuilder(enumerationType) {
        return (data) => {
          if (is.string(data)) {
            return import_Enum.default.fromCode(enumerationType, data);
          } else {
            return data;
          }
        };
      }
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/lang/Money.js
  var require_Money = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/lang/Money.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Money_exports = {};
      __export(Money_exports, {
        default: () => Money
      });
      module.exports = __toCommonJS(Money_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_Decimal = __toESM(require_Decimal());
      var import_Currency = __toESM(require_Currency());
      var Money = class _Money {
        #decimal;
        #currency;
        /**
         * @param {Decimal|number|string} value - A amount, which can be parsed as a {@link Decimal}
         * @param {Currency} currency - The currency.
         */
        constructor(value, currency) {
          assert.argumentIsRequired(currency, "currency", import_Currency.default, "Currency");
          this.#decimal = getDecimal(value);
          this.#currency = currency;
        }
        /**
         * The currency amount.
         *
         * @public
         * @returns {Decimal}
         */
        get decimal() {
          return this.#decimal;
        }
        /**
         * The currency.
         *
         * @public
         * @returns {Currency}
         */
        get currency() {
          return this.#currency;
        }
        /**
         * @public
         * @param {*} places
         * @param {*} mode
         * @returns {Money}
         */
        toAmount(places, mode) {
          return new _Money(this.#decimal.round(getPlaces(places), mode), this.#currency);
        }
        /**
         * Returns the JSON representation.
         *
         * @public
         * @returns {object}
         */
        toJSON() {
          return {
            decimal: this.#decimal,
            currency: this.#currency
          };
        }
        /**
         * Parses the value emitted by {@link Decimal#toJSON}.
         *
         * @public
         * @static
         * @param {object} value
         * @returns {Money}
         */
        static parse(value) {
          return new _Money(value.decimal, value.currency);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Money]`;
        }
      };
      function getDecimal(value) {
        if (value instanceof import_Decimal.default) {
          return value;
        } else {
          return new import_Decimal.default(value);
        }
      }
      function getPlaces(value) {
        if (is.integer(value) && !(value < 0)) {
          return value;
        } else {
          return 2;
        }
      }
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/serialization/json/Field.js
  var require_Field = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/serialization/json/Field.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Field_exports = {};
      __export(Field_exports, {
        default: () => Field
      });
      module.exports = __toCommonJS(Field_exports);
      var assert = __toESM(require_assert());
      var is = __toESM(require_is());
      var import_DataType = __toESM(require_DataType());
      var Field = class {
        #name;
        #dataType;
        #optional;
        #array;
        /**
         * @param {string} name
         * @param {DataType} dataType
         * @param {boolean=} optional
         * @param {boolean=} array
         */
        constructor(name, dataType, optional, array) {
          assert.argumentIsRequired(name, "name", String);
          assert.argumentIsRequired(dataType, "dataType", import_DataType.default, "DataType");
          assert.argumentIsOptional(optional, "optional", Boolean);
          assert.argumentIsOptional(array, "array", Boolean);
          this.#name = name;
          this.#dataType = dataType;
          this.#optional = is.boolean(optional) && optional;
          this.#array = is.boolean(array) && array;
        }
        /**
         * Name of the field.
         *
         * @public
         * @returns {string}
         */
        get name() {
          return this.#name;
        }
        /**
         * Type of the field.
         *
         * @public
         * @returns {DataType}
         */
        get dataType() {
          return this.#dataType;
        }
        /**
         * Indicates if the field can be omitted without violating the schema.
         *
         * @public
         * @returns {boolean}
         */
        get optional() {
          return this.#optional;
        }
        /**
         * Indicates if the field is an array.
         *
         * @public
         * @returns {boolean}
         */
        get array() {
          return this.#array;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Field (name=${this.#name})]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/serialization/json/Component.js
  var require_Component = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/serialization/json/Component.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var Component_exports = {};
      __export(Component_exports, {
        default: () => Component
      });
      module.exports = __toCommonJS(Component_exports);
      var import_Currency = __toESM(require_Currency());
      var import_Money = __toESM(require_Money());
      var import_DataType = __toESM(require_DataType());
      var import_Field = __toESM(require_Field());
      var Component = class _Component {
        #name;
        #fields;
        #reviver;
        /**
         * @param {string} name
         * @param {Array<Field>=} fields
         * @param {Function=} reviver
         */
        constructor(name, fields, reviver) {
          this.#name = name;
          this.#fields = fields || [];
          this.#reviver = reviver;
        }
        /**
         * Name of the component.
         *
         * @public
         * @returns {string}
         */
        get name() {
          return this.#name;
        }
        /**
         * Type of the component.
         *
         * @public
         * @returns {Array<Field>}
         */
        get fields() {
          return this.#fields;
        }
        /**
         * The reviver used to rebuild the entire component.
         *
         * @returns {Function}
         */
        get reviver() {
          return this.#reviver;
        }
        /**
         * The builds a {@link Component} for {@link Money}.
         *
         * @public
         * @static
         * @param {string} name
         * @returns {Component}
         */
        static forMoney(name) {
          return new _Component(name, [new import_Field.default("decimal", import_DataType.default.DECIMAL), new import_Field.default("currency", import_DataType.default.forEnum(import_Currency.default, "Currency"))], (x) => import_Money.default.parse(x));
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[Component (name=${this.#name})]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/serialization/json/builders/ComponentBuilder.js
  var require_ComponentBuilder = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/serialization/json/builders/ComponentBuilder.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var ComponentBuilder_exports = {};
      __export(ComponentBuilder_exports, {
        default: () => ComponentBuilder
      });
      module.exports = __toCommonJS(ComponentBuilder_exports);
      var assert = __toESM(require_assert());
      var import_Component = __toESM(require_Component());
      var import_DataType = __toESM(require_DataType());
      var import_Field = __toESM(require_Field());
      var ComponentBuilder = class {
        #component;
        #name;
        /**
         * @param {string} name - The name of the schema
         */
        constructor(name) {
          this.#component = new import_Component.default(name);
        }
        /**
         * The {@link Schema} current schema instance.
         *
         * @public
         * @returns {Component}
         */
        get component() {
          return this.#component;
        }
        /**
         * Adds a new {@link Field} to the schema and returns the current instance.
         *
         * @public
         * @param {string} name
         * @param {DataType} dataType
         * @returns {ComponentBuilder}
         */
        withField(name, dataType) {
          assert.argumentIsRequired(name, "name", String);
          assert.argumentIsRequired(dataType, "dataType", import_DataType.default, "DataType");
          const fields = this.#component.fields.concat([new import_Field.default(name, dataType)]);
          this.#component = new import_Component.default(this.#component.name, fields, this.#component.reviver);
          return this;
        }
        /**
         * Adds a "reviver" function for use with JSON.parse.
         *
         * @public
         * @param {Function} reviver
         * @returns {ComponentBuilder}
         */
        withReviver(reviver) {
          assert.argumentIsRequired(reviver, "reviver", Function);
          this.#component = new import_Component.default(this.#component.name, this.#component.fields, reviver);
          return this;
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[ComponentBuilder (name=${this.#name})]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/common-js/dist/cjs/serialization/json/builders/SchemaBuilder.js
  var require_SchemaBuilder = __commonJS({
    "node_modules/@barchart/common-js/dist/cjs/serialization/json/builders/SchemaBuilder.js"(exports, module) {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
      var SchemaBuilder_exports = {};
      __export(SchemaBuilder_exports, {
        default: () => SchemaBuilder
      });
      module.exports = __toCommonJS(SchemaBuilder_exports);
      var assert = __toESM(require_assert());
      var import_Component = __toESM(require_Component());
      var import_DataType = __toESM(require_DataType());
      var import_Field = __toESM(require_Field());
      var import_Schema = __toESM(require_Schema());
      var import_ComponentBuilder = __toESM(require_ComponentBuilder());
      var SchemaBuilder = class _SchemaBuilder {
        #schema;
        #name;
        /**
         * @param {string} name - The name of the schema
         */
        constructor(name) {
          this.#name = name;
          this.#schema = new import_Schema.default(name);
        }
        /**
         * The {@link Schema} current schema instance.
         *
         * @public
         * @returns {Schema}
         */
        get schema() {
          return this.#schema;
        }
        /**
         * Adds a new {@link Field} to the schema and returns the current instance.
         *
         * @public
         * @param {string} name - The name of the new field.
         * @param {DataType} dataType - The type of the new field.
         * @param {boolean=} optional - If true, the field is not required and may be omitted.
         * @returns {SchemaBuilder}
         */
        withField(name, dataType, optional) {
          assert.argumentIsRequired(name, "name", String);
          assert.argumentIsRequired(dataType, "dataType", import_DataType.default, "DataType");
          assert.argumentIsOptional(optional, "optional", Boolean);
          const fields = this.#schema.fields.concat([new import_Field.default(name, dataType, optional, false)]);
          this.#schema = new import_Schema.default(this.#schema.name, fields, this.#schema.components, this.#schema.strict);
          return this;
        }
        /**
         * Adds a new {@link Field} to the schema (where the field is an array) and returns the current instance.
         *
         * @public
         * @param {string} name - The name of the new field.
         * @param {DataType} dataType - The type of the new field.
         * @param {boolean=} optional - If true, the field is not required and may be omitted.
         * @returns {SchemaBuilder}
         */
        withArray(name, dataType, optional) {
          assert.argumentIsRequired(name, "name", String);
          assert.argumentIsRequired(dataType, "dataType", import_DataType.default, "DataType");
          assert.argumentIsOptional(optional, "optional", Boolean);
          const fields = this.#schema.fields.concat([new import_Field.default(name, dataType, optional, true)]);
          this.#schema = new import_Schema.default(this.#schema.name, fields, this.#schema.components, this.#schema.strict);
          return this;
        }
        /**
         * Adds a new {@link Component} to the schema and returns the current instance.
         *
         * @public
         * @param {Component} component - The new component to add.
         * @returns {SchemaBuilder}
         */
        withComponent(component) {
          assert.argumentIsRequired(component, "component", import_Component.default, "Component");
          const components = this.#schema.components.concat([component]);
          this.#schema = new import_Schema.default(this.#schema.name, this.#schema.fields, components, this.#schema.strict);
          return this;
        }
        /**
         * Adds a new {@link Component} to the schema, using a {@link ComponentBuilder}
         * and returns the current instance.
         *
         * @public
         * @param {string} name - The name of the new component.
         * @param {Function} callback - A callback to which the {@link ComponentBuilder} is passed synchronously.
         * @returns {SchemaBuilder}
         */
        withComponentBuilder(name, callback) {
          assert.argumentIsRequired(name, "name", String);
          const componentBuilder = new import_ComponentBuilder.default(name);
          callback(componentBuilder);
          return this.withComponent(componentBuilder.component);
        }
        /**
         * Creates a new {@link SchemaBuilder}.
         *
         * @public
         * @static
         * @param {string} name
         * @returns {SchemaBuilder}
         */
        static withName(name) {
          assert.argumentIsRequired(name, "name", String);
          return new _SchemaBuilder(name);
        }
        /**
         * Returns a string representation.
         *
         * @public
         * @returns {string}
         */
        toString() {
          return `[SchemaBuilder (name=${this.#name})]`;
        }
      };
      {
        const cjsExports = module.exports;
        const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;
        if (cjsDefaultExport && (typeof cjsDefaultExport === "function" || typeof cjsDefaultExport === "object")) {
          Object.keys(cjsExports).forEach((key) => {
            if (key !== "default" && key !== "__esModule") {
              cjsDefaultExport[key] = cjsExports[key];
            }
          });
        }
        module.exports = cjsDefaultExport;
      }
    }
  });

  // node_modules/@barchart/marketdata-api-js/lib/utilities/data/UnitCode.js
  var require_UnitCode = __commonJS({
    "node_modules/@barchart/marketdata-api-js/lib/utilities/data/UnitCode.js"(exports, module) {
      var assert = require_assert();
      var Decimal6 = require_Decimal();
      var is = require_is();
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class UnitCode extends Enum {
          constructor(code, baseCode, decimalDigits, supportsFractions, fractionFactor, fractionDigits, fractionFactorSpecial, fractionDigitsSpecial) {
            super(code, code);
            this._baseCode = baseCode;
            this._decimalDigits = decimalDigits;
            this._supportsFractions = supportsFractions;
            if (supportsFractions) {
              this._fractionFactor = fractionFactor;
              this._fractionDigits = fractionDigits;
              this._fractionFactorSpecial = fractionFactorSpecial || fractionFactor;
              this._fractionDigitsSpecial = fractionDigitsSpecial || fractionDigits;
            } else {
              this._fractionFactor = void 0;
              this._fractionDigits = void 0;
              this._fractionFactorSpecial = void 0;
              this._fractionDigitsSpecial = void 0;
            }
          }
          /**
           * The numeric counterpart of a "unit" code.
           *
           * @public
           * @returns {Number}
           */
          get baseCode() {
            return this._baseCode;
          }
          /**
           * The single character "unit" code.
           *
           * @public
           * @returns {String}
           */
          get unitCode() {
            return this._code;
          }
          /**
           * When formatting in decimal mode, the number of digits to show after the
           * decimal point.
           *
           * @public
           * @returns {Number}
           */
          get decimalDigits() {
            return this._decimalDigits;
          }
          /**
           * Indicates if formatting can use the alternative to decimal notation -- that
           * is, fractional notation.
           *
           * @public
           * @returns {Boolean}
           */
          get supportsFractions() {
            return this._supportsFractions;
          }
          /**
           * The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided
           * into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875
           * equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32
           * is implied).
           *
           * @public
           * @returns {Number|undefined}
           */
          get fractionFactor() {
            return this._fractionFactor;
          }
          /**
           * The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is
           * shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
           *
           * @public
           * @returns {Number|undefined}
           */
          get fractionDigits() {
            return this._fractionDigits;
          }
          /**
           * Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)).
           *
           * @public
           * @returns {Number|undefined}
           */
          get fractionFactorSpecial() {
            return this._fractionFactorSpecial;
          }
          /**
           * Same as {@link UnitCode#fractionDigits} for "special" fractions.
           *
           * @public
           * @returns {Number|undefined}
           */
          get fractionDigitsSpecial() {
            return this._fractionDigitsSpecial;
          }
          /**
           * The number of digits of the fraction's numerator to display, when formatting
           * in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates
           * to the fraction of 16.375/32. This notation is limited to three digits (163)
           * and omits the trailing two digits (75).
           *
           * @public
           * @param {Boolean=} special
           * @returns {Number|undefined}
           */
          getFractionFactor(special) {
            return special === true ? this._fractionFactorSpecial : this._fractionFactor;
          }
          /**
           * Returns the {@link UnitCode#fractionDigits} or {@link UnitCode#fractionDigitsSpecial} value.
           *
           * @public
           * @param {Boolean=} special
           * @returns {Number|undefined}
           */
          getFractionDigits(special) {
            return special === true ? this._fractionDigitsSpecial : this._fractionDigits;
          }
          /**
           * Determines the minimum price fluctuation. In other words, multiples
           * of this value determine the set of valid quote and trade prices
           * for an instrument.
           *
           * @public
           * @param {Number} tickIncrement - Taken from a {@link Profile} instance.
           * @returns {Number}
           */
          getMinimumTick(tickIncrement) {
            assert.argumentIsValid(tickIncrement, "tickIncrement", is.integer, "must be an integer");
            const one = new Decimal6(1);
            const ten = new Decimal6(10);
            let discretePrice;
            if (this.supportsFractions) {
              discretePrice = one.divide(this._fractionFactor);
            } else {
              discretePrice = one.divide(ten.raise(this._decimalDigits));
            }
            const minimumTick = discretePrice.multiply(tickIncrement);
            return minimumTick.toFloat();
          }
          /**
           * Returns the change in value of a position when the instrument's price moves
           * up by the minimum tick.
           *
           * @public
           * @param {Number} tickIncrement - Taken from a {@link Profile} instance.
           * @param {Number} pointValue - Taken from a {@link Profile} instance.
           * @returns {Number}
           */
          getMinimumTickValue(tickIncrement, pointValue) {
            assert.argumentIsValid(tickIncrement, "tickIncrement", is.integer, "must be an integer");
            assert.argumentIsValid(pointValue, "pointValue", is.number, "must be a number");
            const minimumTick = new Decimal6(this.getMinimumTick(tickIncrement));
            const minimumTickValue = minimumTick.multiply(pointValue);
            return minimumTickValue.toFloat();
          }
          /**
           * Rounds a value to the nearest valid tick.
           *
           * @param {Number|Decimal} value - The price to round.
           * @param {Number|Decimal} minimumTick - The minimum tick size (see {@link UnitCode#getMinimumTick})
           * @param {Boolean=} roundToZero - When true, the rounding will always go towards zero.
           * @returns {Number}
           */
          roundToNearestTick(value, minimumTick, roundToZero) {
            assert.argumentIsValid(value, "value", (x) => is.number(x) || x instanceof Decimal6, "must be a number primitive or a Decimal instance");
            assert.argumentIsValid(minimumTick, "minimumTick", (x) => is.number(x) || x instanceof Decimal6, "must be a number primitive or a Decimal instance");
            assert.argumentIsOptional(roundToZero, "roundToZero", Boolean);
            let valueToUse;
            if (value instanceof Decimal6) {
              valueToUse = value;
            } else {
              valueToUse = new Decimal6(value);
            }
            let ticks = valueToUse.divide(minimumTick);
            let remainder = valueToUse.mod(minimumTick);
            if (!remainder.getIsZero()) {
              ticks = ticks.round(0, is.boolean(roundToZero) && roundToZero ? Decimal6.ROUNDING_MODE.DOWN : Decimal6.ROUNDING_MODE.NORMAL);
            }
            return ticks.multiply(minimumTick).toFloat();
          }
          toString() {
            return `[UnitCode (code=${this.code})]`;
          }
          /**
           * Converts a unit code character into a {@link UnitCode} enumeration item.
           *
           * @public
           * @static
           * @param {String} code
           * @returns {UnitCode|null}
           */
          static parse(code) {
            return Enum.fromCode(UnitCode, code);
          }
          /**
           * Converts a numeric "base" code into a {@link UnitCode} item.
           *
           * @public
           * @static
           * @param {Number} code
           * @returns {UnitCode|null}
           */
          static fromBaseCode(code) {
            return Enum.getItems(UnitCode).find((x) => x.baseCode === code) || null;
          }
        }
        const TWO = new UnitCode("2", -1, 3, true, 8, 1);
        const THREE = new UnitCode("3", -2, 4, true, 16, 2);
        const FOUR = new UnitCode("4", -3, 5, true, 32, 2);
        const FIVE = new UnitCode("5", -4, 6, true, 64, 2, 320, 3);
        const SIX = new UnitCode("6", -5, 7, true, 128, 3, 320, 3);
        const SEVEN = new UnitCode("7", -6, 8, true, 256, 3, 320, 3);
        const EIGHT = new UnitCode("8", 0, 0, false);
        const NINE = new UnitCode("9", 1, 1, false);
        const A = new UnitCode("A", 2, 2, false);
        const B = new UnitCode("B", 3, 3, false);
        const C = new UnitCode("C", 4, 4, false);
        const D = new UnitCode("D", 5, 5, false);
        const E = new UnitCode("E", 6, 6, false);
        const F = new UnitCode("F", 7, 7, false);
        return UnitCode;
      })();
    }
  });

  // lib/data/OptionSide.js
  var require_OptionSide = __commonJS({
    "lib/data/OptionSide.js"(exports, module) {
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class OptionSide extends Enum {
          constructor(code, description) {
            super(code, description);
          }
          /**
           * The right to buy the underlying instrument.
           *
           * @public
           * @static
           * @returns {OptionSide}
           */
          static get CALL() {
            return call;
          }
          /**
           * The right to sell the underlying instrument.
           *
           * @public
           * @static
           * @returns {OptionSide}
           */
          static get PUT() {
            return put;
          }
          /**
           * @public
           * @static
           * @param {String} code
           * @returns {OptionSide|null}
           */
          static parse(code) {
            return Enum.fromCode(OptionSide, code);
          }
          toString() {
            return `[OptionSide (code=${this.code})]`;
          }
        }
        const put = new OptionSide("PUT", "Put");
        const call = new OptionSide("CALL", "Call");
        return OptionSide;
      })();
    }
  });

  // lib/data/ValuationType.js
  var require_ValuationType = __commonJS({
    "lib/data/ValuationType.js"(exports, module) {
      var Enum = require_Enum();
      module.exports = (() => {
        "use strict";
        class ValuationType extends Enum {
          constructor(code, description) {
            super(code, description);
          }
          /**
           * A valuation method that uses average costing.
           *
           * @public
           * @returns {ValuationType}
           */
          static get AVERAGE_COST() {
            return averageCost;
          }
          /**
           * A valuation method that uses first-in, first-out methodology.
           *
           * @public
           * @returns {ValuationType}
           */
          static get FIFO() {
            return fifo;
          }
          /**
           * Given a code, returns the enumeration item.
           *
           * @public
           * @param {String} code
           * @returns {ValuationType|null}
           */
          static parse(code) {
            return Enum.fromCode(ValuationType, code);
          }
          toString() {
            return `[ValuationType (code=${this.code})]`;
          }
        }
        const fifo = new ValuationType("FIFO", "first in, first out");
        const averageCost = new ValuationType("AVG", "average cost");
        return ValuationType;
      })();
    }
  });

  // lib/serialization/PositionSchema.js
  var require_PositionSchema = __commonJS({
    "lib/serialization/PositionSchema.js"(exports, module) {
      var Currency5 = require_Currency();
      var DataType = require_DataType();
      var Enum = require_Enum();
      var SchemaBuilder = require_SchemaBuilder();
      var UnitCode = require_UnitCode();
      var InstrumentType4 = require_InstrumentType();
      var OptionSide = require_OptionSide();
      var PositionDirection = require_PositionDirection();
      var ValuationType = require_ValuationType();
      module.exports = (() => {
        "use strict";
        class PositionSchema2 extends Enum {
          constructor(schema) {
            super(schema.name, schema.name);
            this._schema = schema;
          }
          /**
           * The actual {@link Schema}.
           *
           * @public
           * @returns {Schema}
           */
          get schema() {
            return this._schema;
          }
          /**
           * The complete position schema.
           *
           * @static
           * @public
           * @returns {PositionSchema}
           */
          static get COMPLETE() {
            return complete;
          }
          /**
           * Position data transmitted to the client, omitting some system data.
           *
           * @static
           * @public
           * @returns {PositionSchema}
           */
          static get CLIENT() {
            return client;
          }
          /**
           * Data required to update a position.
           *
           * @static
           * @public
           * @returns {PositionSchema}
           */
          static get UPDATE() {
            return update;
          }
          /**
           * Result item for query of positions by symbol.
           *
           * @static
           * @public
           * @returns {PositionSchema}
           */
          static get SIMPLE() {
            return simple;
          }
          toString() {
            return "[PositionSchema]";
          }
        }
        const complete = new PositionSchema2(
          SchemaBuilder.withName("complete").withField("user", DataType.STRING).withField("portfolio", DataType.STRING).withField("instrument.id", DataType.STRING).withField("instrument.name", DataType.STRING).withField("instrument.type", DataType.forEnum(InstrumentType4, "InstrumentType")).withField("instrument.code", DataType.forEnum(UnitCode, "UnitCode"), true).withField("instrument.currency", DataType.forEnum(Currency5, "Currency")).withField("instrument.exchange", DataType.STRING, true).withField("instrument.delist", DataType.DAY, true).withField("instrument.future.expiration", DataType.DAY, true).withField("instrument.future.tick", DataType.DECIMAL, true).withField("instrument.future.value", DataType.DECIMAL, true).withField("instrument.option.expiration", DataType.DAY, true).withField("instrument.option.side", DataType.forEnum(OptionSide, "OptionSide"), true).withField("instrument.option.strike", DataType.DECIMAL, true).withField("instrument.option.multiplier", DataType.DECIMAL, true).withField("instrument.option.tick", DataType.DECIMAL, true).withField("instrument.option.value", DataType.DECIMAL, true).withField("instrument.symbol.barchart", DataType.STRING, true).withField("instrument.symbol.display", DataType.STRING, true).withField("position", DataType.STRING).withField("transaction", DataType.NUMBER).withField("cash", DataType.BOOLEAN, true).withField("reinvest", DataType.BOOLEAN, true).withField("valuation", DataType.forEnum(ValuationType, "ValuationType")).withField("snapshot.date", DataType.DAY).withField("snapshot.open", DataType.DECIMAL).withField("snapshot.direction", DataType.forEnum(PositionDirection, "PositionDirection")).withField("snapshot.buys", DataType.DECIMAL).withField("snapshot.sells", DataType.DECIMAL).withField("snapshot.gain", DataType.DECIMAL).withField("snapshot.basis", DataType.DECIMAL).withField("snapshot.income", DataType.DECIMAL).withField("snapshot.value", DataType.DECIMAL).withField("snapshot.initial", DataType.forEnum(PositionDirection, "PositionDirection"), true).withField("latest.date", DataType.DAY).withField("latest.gain", DataType.DECIMAL).withField("legacy.system", DataType.STRING, true).withField("legacy.user", DataType.STRING, true).withField("legacy.portfolio", DataType.STRING, true).withField("legacy.position", DataType.STRING, true).withField("system.version", DataType.NUMBER, true).withField("system.calculate.processors", DataType.NUMBER, true).withField("system.locked", DataType.BOOLEAN, true).withField("root", DataType.STRING, true).schema
        );
        const client = new PositionSchema2(
          SchemaBuilder.withName("client").withField("user", DataType.STRING).withField("portfolio", DataType.STRING).withField("instrument.id", DataType.STRING).withField("instrument.name", DataType.STRING).withField("instrument.type", DataType.forEnum(InstrumentType4, "InstrumentType")).withField("instrument.code", DataType.forEnum(UnitCode, "UnitCode"), true).withField("instrument.currency", DataType.forEnum(Currency5, "Currency")).withField("instrument.exchange", DataType.STRING, true).withField("instrument.delist", DataType.DAY, true).withField("instrument.future.expiration", DataType.DAY, true).withField("instrument.future.tick", DataType.DECIMAL, true).withField("instrument.future.value", DataType.DECIMAL, true).withField("instrument.option.expiration", DataType.DAY, true).withField("instrument.option.side", DataType.forEnum(OptionSide, "OptionSide"), true).withField("instrument.option.strike", DataType.DECIMAL, true).withField("instrument.option.multiplier", DataType.DECIMAL, true).withField("instrument.option.tick", DataType.DECIMAL, true).withField("instrument.option.value", DataType.DECIMAL, true).withField("instrument.symbol.barchart", DataType.STRING, true).withField("instrument.symbol.display", DataType.STRING, true).withField("position", DataType.STRING).withField("transaction", DataType.NUMBER).withField("cash", DataType.BOOLEAN, true).withField("reinvest", DataType.BOOLEAN, true).withField("valuation", DataType.forEnum(ValuationType, "ValuationType")).withField("snapshot.date", DataType.DAY).withField("snapshot.open", DataType.DECIMAL).withField("snapshot.direction", DataType.forEnum(PositionDirection, "PositionDirection")).withField("snapshot.buys", DataType.DECIMAL).withField("snapshot.sells", DataType.DECIMAL).withField("snapshot.gain", DataType.DECIMAL).withField("snapshot.basis", DataType.DECIMAL).withField("snapshot.income", DataType.DECIMAL).withField("snapshot.value", DataType.DECIMAL).withField("snapshot.initial", DataType.forEnum(PositionDirection, "PositionDirection"), true).withField("latest.date", DataType.DAY).withField("latest.gain", DataType.DECIMAL).withField("system.calculate.processors", DataType.NUMBER, true).withField("system.locked", DataType.BOOLEAN, true).withField("previous", DataType.NUMBER, true).schema
        );
        const update = new PositionSchema2(
          SchemaBuilder.withName("update").withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("mapping.name", DataType.STRING, true).withField("mapping.type", DataType.forEnum(InstrumentType4, "InstrumentType"), true).withField("mapping.currency", DataType.forEnum(Currency5, "Currency"), true).withField("mapping.symbol.barchart", DataType.STRING, true).withField("mapping.symbol.display", DataType.STRING, true).withField("cash", DataType.BOOLEAN, true).withField("reinvest", DataType.BOOLEAN, true).schema
        );
        const simple = new PositionSchema2(
          SchemaBuilder.withName("simple").withField("user", DataType.STRING).withField("portfolio", DataType.STRING).withField("instrument.id", DataType.STRING).withField("instrument.name", DataType.STRING).withField("instrument.symbol.barchart", DataType.STRING, true).withField("instrument.symbol.display", DataType.STRING, true).withField("position", DataType.STRING).schema
        );
        return PositionSchema2;
      })();
    }
  });

  // lib/serialization/TransactionSchema.js
  var require_TransactionSchema = __commonJS({
    "lib/serialization/TransactionSchema.js"(exports, module) {
      var is = require_is();
      var Currency5 = require_Currency();
      var DataType = require_DataType();
      var Enum = require_Enum();
      var SchemaBuilder = require_SchemaBuilder();
      var InstrumentType4 = require_InstrumentType();
      var PositionDirection = require_PositionDirection();
      var TransactionType4 = require_TransactionType();
      module.exports = (() => {
        "use strict";
        class TransactionSchema2 extends Enum {
          constructor(schema) {
            super(schema.name, schema.name);
            this._schema = schema;
          }
          /**
           * The actual {@link Schema}.
           *
           * @public
           * @returns {Schema}
           */
          get schema() {
            return this._schema;
          }
          /**
           * Returns the appropriate schema for creating a transaction of the
           * supplied type.
           *
           * @public
           * @static
           * @param {String|TransactionType} transactionType
           * @returns {TransactionSchema|null}
           */
          static forCreate(transactionType) {
            let code;
            if (transactionType instanceof TransactionType4) {
              code = transactionType.code;
            } else {
              code = transactionType;
            }
            let schema;
            if (is.string(code)) {
              schema = Enum.fromCode(TransactionSchema2, code);
            } else {
              schema = null;
            }
            return schema;
          }
          /**
           * The complete transaction schema.
           *
           * @static
           * @public
           * @returns {TransactionSchema}
           */
          static get COMPLETE() {
            return complete;
          }
          /**
           * Transaction data transmitted to the client, omitting some system data.
           *
           * @static
           * @public
           * @returns {TransactionSchema}
           */
          static get CLIENT() {
            return client;
          }
          static get BUY() {
            return buy;
          }
          static get SELL() {
            return sell;
          }
          static get BUY_SHORT() {
            return buyShort;
          }
          static get SELL_SHORT() {
            return sellShort;
          }
          static get DEPOSIT() {
            return deposit;
          }
          static get WITHDRAWAL() {
            return withdrawal;
          }
          static get VALUATION() {
            return valuation;
          }
          static get DELIST() {
            return delist;
          }
          static get INCOME() {
            return income;
          }
          toString() {
            return `[TransactionSchema (code=${this.code})]`;
          }
        }
        const complete = new TransactionSchema2(
          SchemaBuilder.withName("complete").withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("transaction", DataType.STRING).withField("sequence", DataType.NUMBER).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("description", DataType.STRING, true).withField("amount", DataType.DECIMAL).withField("quantity", DataType.DECIMAL).withField("fee", DataType.DECIMAL, true).withField("gain", DataType.DECIMAL).withField("reference.position", DataType.STRING, true).withField("reference.transaction", DataType.STRING, true).withField("snapshot.open", DataType.DECIMAL).withField("snapshot.direction", DataType.forEnum(PositionDirection, "PositionDirection")).withField("snapshot.buys", DataType.DECIMAL).withField("snapshot.sells", DataType.DECIMAL).withField("snapshot.gain", DataType.DECIMAL).withField("snapshot.basis", DataType.DECIMAL).withField("snapshot.income", DataType.DECIMAL).withField("snapshot.value", DataType.DECIMAL).withField("legacy.system", DataType.STRING, true).withField("legacy.user", DataType.STRING, true).withField("legacy.portfolio", DataType.STRING).withField("legacy.position", DataType.STRING, true).withField("legacy.transaction", DataType.STRING, true).withField("trade.price", DataType.DECIMAL, true).withField("dividend.rate", DataType.DECIMAL, true).withField("dividend.effective", DataType.DAY, true).withField("dividend.price", DataType.DECIMAL, true).withField("dividend.amount", DataType.DECIMAL, true).withField("dividend.reference", DataType.STRING, true).withField("split.numerator", DataType.DECIMAL, true).withField("split.denominator", DataType.DECIMAL, true).withField("split.effective", DataType.DAY, true).withField("split.reference", DataType.STRING, true).withField("merger.numerator", DataType.DECIMAL, true).withField("merger.denominator", DataType.DECIMAL, true).withField("spinoff.numerator", DataType.DECIMAL, true).withField("spinoff.denominator", DataType.DECIMAL, true).withField("charge.amount", DataType.DECIMAL, true).withField("income.amount", DataType.DECIMAL, true).withField("valuation.rate", DataType.DECIMAL, true).withField("valuation.value", DataType.DECIMAL, true).withField("system.sequence", DataType.NUMBER).withField("system.version", DataType.STRING).withField("system.timestamp", DataType.TIMESTAMP).schema
        );
        const client = new TransactionSchema2(
          SchemaBuilder.withName("client").withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("transaction", DataType.STRING).withField("sequence", DataType.NUMBER).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("description", DataType.STRING, true).withField("amount", DataType.DECIMAL).withField("quantity", DataType.DECIMAL).withField("fee", DataType.DECIMAL, true).withField("gain", DataType.DECIMAL).withField("reference.position", DataType.STRING, true).withField("reference.transaction", DataType.NUMBER, true).withField("snapshot.open", DataType.DECIMAL).withField("snapshot.direction", DataType.forEnum(PositionDirection, "PositionDirection")).withField("snapshot.buys", DataType.DECIMAL).withField("snapshot.sells", DataType.DECIMAL).withField("snapshot.gain", DataType.DECIMAL).withField("snapshot.basis", DataType.DECIMAL).withField("snapshot.income", DataType.DECIMAL).withField("snapshot.value", DataType.DECIMAL).withField("trade.price", DataType.DECIMAL, true).withField("dividend.rate", DataType.DECIMAL, true).withField("dividend.effective", DataType.DAY, true).withField("dividend.price", DataType.DECIMAL, true).withField("dividend.amount", DataType.DECIMAL, true).withField("split.numerator", DataType.DECIMAL, true).withField("split.denominator", DataType.DECIMAL, true).withField("split.effective", DataType.DAY, true).withField("split.reference", DataType.STRING, true).withField("merger.numerator", DataType.DECIMAL, true).withField("merger.denominator", DataType.DECIMAL, true).withField("spinoff.numerator", DataType.DECIMAL, true).withField("spinoff.denominator", DataType.DECIMAL, true).withField("charge.amount", DataType.DECIMAL, true).withField("income.amount", DataType.DECIMAL, true).withField("valuation.rate", DataType.DECIMAL, true).withField("valuation.value", DataType.DECIMAL, true).schema
        );
        const buy = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.BUY.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("instrument.id", DataType.STRING, true).withField("instrument.name", DataType.STRING, true).withField("instrument.exchange", DataType.STRING, true).withField("instrument.code", DataType.NUMBER, true).withField("instrument.type", DataType.forEnum(InstrumentType4, "InstrumentType"), true).withField("instrument.currency", DataType.forEnum(Currency5, "Currency"), true).withField("instrument.exchange", DataType.STRING, true).withField("instrument.symbol.barchart", DataType.STRING, true).withField("instrument.symbol.display", DataType.STRING, true).withField("date", DataType.DAY).withField("price", DataType.DECIMAL, true).withField("quantity", DataType.DECIMAL).withField("fee", DataType.DECIMAL, true).withField("reinvest", DataType.BOOLEAN, true).withField("cash", DataType.BOOLEAN, true).withField("force", DataType.BOOLEAN, true).schema
        );
        const sell = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.SELL.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("price", DataType.DECIMAL, true).withField("quantity", DataType.DECIMAL, true).withField("fee", DataType.DECIMAL, true).withField("force", DataType.BOOLEAN, true).withField("close", DataType.BOOLEAN, true).schema
        );
        const buyShort = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.BUY_SHORT.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("price", DataType.DECIMAL).withField("quantity", DataType.DECIMAL, true).withField("fee", DataType.DECIMAL, true).withField("force", DataType.BOOLEAN, true).withField("close", DataType.BOOLEAN, true).schema
        );
        const sellShort = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.SELL_SHORT.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("instrument.id", DataType.STRING, true).withField("instrument.name", DataType.STRING, true).withField("instrument.exchange", DataType.STRING, true).withField("instrument.code", DataType.NUMBER, true).withField("instrument.type", DataType.forEnum(InstrumentType4, "InstrumentType"), true).withField("instrument.currency", DataType.forEnum(Currency5, "Currency"), true).withField("instrument.exchange", DataType.STRING, true).withField("instrument.symbol.barchart", DataType.STRING, true).withField("instrument.symbol.display", DataType.STRING, true).withField("date", DataType.DAY).withField("price", DataType.DECIMAL).withField("quantity", DataType.DECIMAL).withField("fee", DataType.DECIMAL, true).withField("reinvest", DataType.BOOLEAN, true).withField("cash", DataType.BOOLEAN, true).withField("force", DataType.BOOLEAN, true).schema
        );
        const fee = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.FEE.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("fee", DataType.DECIMAL).withField("force", DataType.BOOLEAN, true).schema
        );
        const deposit = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.DEPOSIT.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("instrument.type", DataType.forEnum(InstrumentType4, "InstrumentType"), true).withField("instrument.currency", DataType.forEnum(Currency5, "Currency"), true).withField("date", DataType.DAY).withField("amount", DataType.DECIMAL).withField("force", DataType.BOOLEAN, true).schema
        );
        const withdrawal = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.WITHDRAWAL.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("instrument.type", DataType.forEnum(InstrumentType4, "InstrumentType"), true).withField("instrument.currency", DataType.forEnum(Currency5, "Currency"), true).withField("date", DataType.DAY).withField("amount", DataType.DECIMAL).withField("force", DataType.BOOLEAN, true).schema
        );
        const valuation = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.VALUATION.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("rate", DataType.DECIMAL, true).withField("value", DataType.DECIMAL, true).withField("force", DataType.BOOLEAN, true).schema
        );
        const delist = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.DELIST.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("force", DataType.BOOLEAN, true).schema
        );
        const income = new TransactionSchema2(
          SchemaBuilder.withName(TransactionType4.INCOME.code).withField("portfolio", DataType.STRING).withField("position", DataType.STRING).withField("sequence", DataType.NUMBER, true).withField("type", DataType.forEnum(TransactionType4, "TransactionType")).withField("date", DataType.DAY).withField("income", DataType.DECIMAL).withField("fee", DataType.DECIMAL, true).withField("force", DataType.BOOLEAN, true).schema
        );
        return TransactionSchema2;
      })();
    }
  });

  // test/specs/calculators/AveragePriceCalculatorSpec.js
  var Decimal = require_Decimal();
  var InstrumentType = require_InstrumentType();
  var AveragePriceCalculator = require_AveragePriceCalculator();
  describe("When calculating the value of a cash", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType.CASH };
    });
    it("A balance of $0 balance should have an average cost of $1", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 0).toFloat()).toEqual(1);
    });
    it("A balance of $100 balance should have an average cost of $1", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 100).toFloat()).toEqual(1);
    });
    it("A balance of ($100) balance should have an average cost of $1", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, -100).toFloat()).toEqual(1);
    });
  });
  describe("When calculating the value of an equity", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType.EQUITY };
    });
    it("An even position should have no average cost", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
    });
    it("A long position of 100 shares with a basis of $(5,000) should have an average cost of $50", () => {
      expect(AveragePriceCalculator.calculate(instrument, -5e3, 100).toFloat()).toEqual(50);
    });
    it("A short position of 100 shares with a basis of $5,000 should have an average cost of $50", () => {
      expect(AveragePriceCalculator.calculate(instrument, 5e3, -100).toFloat()).toEqual(50);
    });
  });
  describe("When calculating the value of an equity option (with a multiplier of 100)", () => {
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType.EQUITY_OPTION, option: { multiplier: 100 } };
    });
    it("An even position should have no average cost", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
    });
    it("A long position of 2 contracts with a basis of $(800) should have an average cost of $4", () => {
      expect(AveragePriceCalculator.calculate(instrument, -800, 2).toFloat()).toEqual(4);
    });
    it("A short position of 2 contracts with a basis of $72,675 should have an average cost of $484.50", () => {
      expect(AveragePriceCalculator.calculate(instrument, 800, -2).toFloat()).toEqual(4);
    });
  });
  describe("When calculating the value of a fund", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType.FUND };
    });
    it("An even position should have no average cost", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
    });
    it("A long position of 100 shares with a basis of $(5,000) should have an average cost of $50", () => {
      expect(AveragePriceCalculator.calculate(instrument, -5e3, 100).toFloat()).toEqual(50);
    });
  });
  describe("When calculating the value of a future (with a minimum tick of 0.25 tick, and each tick valued at $12.50 each)", () => {
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType.FUTURE, future: { tick: 0.25, value: 12.5 } };
    });
    it("An even position should have no average cost", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
    });
    it("A long position of 3 contracts with a basis of $(72,675) should have an average cost of $484.50", () => {
      expect(AveragePriceCalculator.calculate(instrument, -72675, 3).toFloat()).toEqual(484.5);
    });
    it("A short position of 3 contracts with a basis of $72,675 should have an average cost of $484.50", () => {
      expect(AveragePriceCalculator.calculate(instrument, 72675, -3).toFloat()).toEqual(484.5);
    });
  });
  describe("When calculating the value of a futures option (with a minimum tick of 0.125 tick, and each tick valued at $6.25 each)", () => {
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType.FUTURE_OPTION, option: { tick: 0.125, value: 6.25 } };
    });
    it("An even position should have no average cost", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
    });
    it("A long position of 5 contracts with a basis of $(4,937.5) should have an average cost of $484.50", () => {
      expect(AveragePriceCalculator.calculate(instrument, -4937.5, 5).toFloat()).toEqual(19.75);
    });
    it("A short position of 5 contracts with a basis of $4,937.5 should have an average cost of $484.50", () => {
      expect(AveragePriceCalculator.calculate(instrument, 4937.5, -5).toFloat()).toEqual(19.75);
    });
  });
  describe('When calculating the value of an "other" item"', () => {
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType.OTHER };
    });
    it("An even position should have no average cost", () => {
      expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
    });
    it("A long position of 2 items with a basis of $(800,000) should have an average cost of $400,000", () => {
      expect(AveragePriceCalculator.calculate(instrument, -8e5, 2).toFloat()).toEqual(4e5);
    });
  });

  // test/specs/calculators/ValuationCalculatorSpec.js
  var Decimal2 = require_Decimal();
  var InstrumentType2 = require_InstrumentType();
  var ValuationCalculator = require_ValuationCalculator();
  describe("When calculating the value of a cash", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType2.CASH };
    });
    it("$100 should equal $100 (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 0, 100).toFloat()).toEqual(100);
    });
    it("$100 should equal $100 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, 0, new Decimal2(100)).toFloat()).toEqual(100);
    });
    it("$100 valued at an undefined price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, void 0, 100)).toBe(null);
    });
    it("$100 shares at a null price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, null, 100)).toBe(null);
    });
  });
  describe("When calculating the value of an equity", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType2.EQUITY };
    });
    it("100 shares (long) @ $17.50 should equal $1,750 (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 17.5, 100).toFloat()).toEqual(1750);
    });
    it("100 shares (long) @ $17.50 should equal $1,750 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(17.5), new Decimal2(100)).toFloat()).toEqual(1750);
    });
    it("100 shares (long) @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(100)).toFloat()).toEqual(0);
    });
    it("50 shares (short) @ $17.50 should equal ($875) (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 17.5, -50).toFloat()).toEqual(-875);
    });
    it("50 shares (short) @ $17.50 should equal ($875) (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(17.5), new Decimal2(-50)).toFloat()).toEqual(-875);
    });
    it("50 shares (short) @ $0 should equal 0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(-50)).toFloat()).toEqual(0);
    });
    it("100 shares (long) valued at an undefined price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, void 0, 100)).toBe(null);
    });
    it("100 shares (long) valued at a null price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, null, 100)).toBe(null);
    });
  });
  describe("When calculating the value of an equity option (with a multiplier of 100)", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType2.EQUITY_OPTION, option: { multiplier: 100 } };
    });
    it("2 contracts (long) @ $1.75 should equal $350 (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 1.75, 2).toFloat()).toEqual(350);
    });
    it("2 contracts (long) @ $1.75 should equal $350 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(1.75), new Decimal2(2)).toFloat()).toEqual(350);
    });
    it("2 contracts (long) @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(2)).toFloat()).toEqual(0);
    });
    it("2 contracts (short) @ $1.75 should equal ($350) (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 1.75, -2).toFloat()).toEqual(-350);
    });
    it("2 contracts (short) @ $1.75 should equal ($350) (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(1.75), new Decimal2(-2)).toFloat()).toEqual(-350);
    });
    it("2 contracts (short) @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(-2)).toFloat()).toEqual(0);
    });
    it("2 contracts (long) valued at an undefined price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, void 0, 2)).toBe(null);
    });
    it("2 contracts (long) valued at a null price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, null, 2)).toBe(null);
    });
  });
  describe("When calculating the value of a fund", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType2.FUND };
    });
    it("100 units @ $17.50 should equal $1,750 (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 17.5, 100).toFloat()).toEqual(1750);
    });
    it("100 units @ $17.50 should equal $1,750 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(17.5), new Decimal2(100)).toFloat()).toEqual(1750);
    });
    it("100 units @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(100)).toFloat()).toEqual(0);
    });
    it("100 units valued at an undefined price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, void 0, 100)).toBe(null);
    });
    it("100 units valued at a null price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, null, 100)).toBe(null);
    });
  });
  describe("When calculating the value of a future (with a minimum tick of 0.25 tick, and each tick valued at $12.50 each)", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType2.FUTURE, future: { tick: 0.25, value: 12.5 } };
    });
    it("3 contracts (long) @ $461.75 should equal $69,262.50 (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 461.75, 3).toFloat()).toEqual(69262.5);
    });
    it("3 contracts (long) @ $461.75 should equal $69,262.50 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(461.75), new Decimal2(3)).toFloat()).toEqual(69262.5);
    });
    it("3 contracts (long) @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(3)).toFloat()).toEqual(0);
    });
    it("3 contracts (short) @ $461.75 should equal ($69,262.50) (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 461.75, -3).toFloat()).toEqual(-69262.5);
    });
    it("3 contracts (short) @ $461.75 should equal ($69,262.50) (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(461.75), new Decimal2(-3)).toFloat()).toEqual(-69262.5);
    });
    it("3 contracts (short) @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(-3)).toFloat()).toEqual(0);
    });
    it("3 contracts (long) valued at an undefined price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, void 0, 3)).toBe(null);
    });
    it("3 contracts (long) valued at a null price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, null, 3)).toBe(null);
    });
  });
  describe("When calculating the value of a futures option (with a minimum tick of 0.125 tick, and each tick valued at $6.5 each)", () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType2.FUTURE_OPTION, option: { tick: 0.125, value: 6.5 } };
    });
    it("5 contracts (long) @ $20.75 should equal $5,395.00 (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 20.75, 5).toFloat()).toEqual(5395);
    });
    it("5 contracts (long) @ $20.75 should equal $5,395.00 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(20.75), new Decimal2(5)).toFloat()).toEqual(5395);
    });
    it("5 contracts (long) @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(5)).toFloat()).toEqual(0);
    });
    it("5 contracts (short) @ $20.75 should equal ($5,395.00) (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 20.75, -5).toFloat()).toEqual(-5395);
    });
    it("5 contracts (short) @ $20.75 should equal ($5,395.00) (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(20.75), new Decimal2(-5)).toFloat()).toEqual(-5395);
    });
    it("5 contracts (short) @ $0 should equal $0 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(0), new Decimal2(-5)).toFloat()).toEqual(0);
    });
    it("5 contracts (long) valued at an undefined price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, void 0, 5)).toBe(null);
    });
    it("5 contracts (long) valued at a null price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, null, 5)).toBe(null);
    });
  });
  describe('When calculating the value of an "other" item"', () => {
    "use strict";
    let instrument;
    beforeEach(() => {
      instrument = { type: InstrumentType2.OTHER };
    });
    it("4 units @ $200,000 should equal $800,000 (using numbers)", () => {
      expect(ValuationCalculator.calculate(instrument, 2e5, 4).toFloat()).toEqual(8e5);
    });
    it("4 units @ $200,000 should equal $1,750 (using decimals)", () => {
      expect(ValuationCalculator.calculate(instrument, new Decimal2(2e5), new Decimal2(4)).toFloat()).toEqual(8e5);
    });
    it("4 units valued at an undefined price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, void 0, 4)).toBe(null);
    });
    it("4 units valued at a null price should return null", () => {
      expect(ValuationCalculator.calculate(instrument, null, 4)).toBe(null);
    });
  });

  // test/specs/data/PositionSummaryFrameSpec.js
  var Day = require_Day();
  var Decimal3 = require_Decimal();
  var PositionSummaryFrame = require_PositionSummaryFrame();
  var TransactionType = require_TransactionType();
  describe("After the PositionSummaryFrame enumeration is initialized", () => {
    "use strict";
    function formatRange(range) {
      return {
        end: range.end.format(),
        start: range.start.format()
      };
    }
    describe("and yearly position summary ranges are processed for a transaction set that does not close", () => {
      let ranges;
      beforeEach(() => {
        let getFullYear = Date.prototype.getFullYear;
        Date.prototype.getFullYear = () => {
          return 2021;
        };
        const transactions = [
          {
            date: new Day(2015, 10, 20),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2016, 11, 21),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          }
        ];
        ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
        Date.prototype.getFullYear = getFullYear;
      });
      it("should have six ranges (assuming the current year is 2021)", () => {
        expect(ranges.length).toEqual(6);
      });
      it("the first range should be from 12-31-2014 to 12-31-2015", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2015-12-31", start: "2014-12-31" });
      });
      it("the second range should be from 12-31-2015 to 12-31-2016", () => {
        expect(formatRange(ranges[1])).toEqual({ end: "2016-12-31", start: "2015-12-31" });
      });
      it("the third range should be from 12-31-2016 to 12-31-2017", () => {
        expect(formatRange(ranges[2])).toEqual({ end: "2017-12-31", start: "2016-12-31" });
      });
      it("the fourth range should be from 12-31-2017 to 12-31-2018", () => {
        expect(formatRange(ranges[3])).toEqual({ end: "2018-12-31", start: "2017-12-31" });
      });
      it("the fifth range should be from 12-31-2018 to 12-31-2019", () => {
        expect(formatRange(ranges[4])).toEqual({ end: "2019-12-31", start: "2018-12-31" });
      });
    });
    describe("and yearly position summary ranges are processed for a transaction set closes the same year", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2015, 10, 20),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2015, 11, 21),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          }
        ];
        ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
      });
      it("should have one range", () => {
        expect(ranges.length).toEqual(1);
      });
      it("the first range should be from 12-31-2014 to 12-31-2015", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2015-12-31", start: "2014-12-31" });
      });
    });
    describe("and yearly position summary ranges are processed for a transaction set closes the next year", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2015, 10, 20),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2016, 11, 21),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          }
        ];
        ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
      });
      it("should have two ranges", () => {
        expect(ranges.length).toEqual(2);
      });
      it("the first range should be from 12-31-2014 to 12-31-2015", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2015-12-31", start: "2014-12-31" });
      });
      it("the second range should be from 12-31-2015 to 12-31-2016", () => {
        expect(formatRange(ranges[1])).toEqual({ end: "2016-12-31", start: "2015-12-31" });
      });
    });
    describe("and yearly position summary ranges are processed for a transaction set that opens in 2015 and closes in 2017", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2015, 10, 20),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2017, 11, 21),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          }
        ];
        ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
      });
      it("should have three ranges", () => {
        expect(ranges.length).toEqual(3);
      });
      it("the first range should be from 12-31-2014 to 12-31-2015", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2015-12-31", start: "2014-12-31" });
      });
      it("the second range should be from 12-31-2015 to 12-31-2016", () => {
        expect(formatRange(ranges[1])).toEqual({ end: "2016-12-31", start: "2015-12-31" });
      });
      it("the third range should be from 12-31-2015 to 12-31-2016", () => {
        expect(formatRange(ranges[2])).toEqual({ end: "2017-12-31", start: "2016-12-31" });
      });
    });
    describe("and yearly position summary ranges are processed for a transaction set that opens in 2015 and closes in 2016, but has after-the-fact superfluous valuations in 2017 and 2018", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2015, 10, 20),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2016, 11, 21),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          },
          {
            date: new Day(2017, 11, 21),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.VALUATION
          },
          {
            date: new Day(2017, 11, 21),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.VALUATION
          }
        ];
        ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
      });
      it("should have two ranges", () => {
        expect(ranges.length).toEqual(2);
      });
      it("the first range should be from 12-31-2014 to 12-31-2015", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2015-12-31", start: "2014-12-31" });
      });
      it("the second range should be from 12-31-2015 to 12-31-2016", () => {
        expect(formatRange(ranges[1])).toEqual({ end: "2016-12-31", start: "2015-12-31" });
      });
    });
    describe("and yearly position summary ranges are processed for a transaction set that opens in the current year", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: Day.getToday(),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          }
        ];
        ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
      });
      it("should have zero ranges", () => {
        expect(ranges.length).toEqual(0);
      });
    });
    describe("and monthly position summary ranges are processed for a transaction set that does not close", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2018, 12, 20),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2019, 2, 21),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          }
        ];
        ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
      });
      it("should have at least two ranges", () => {
        expect(ranges.length > 1).toEqual(true);
      });
      it("the first range should be from 11-30-2018 to 12-31-2018", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2018-12-31", start: "2018-11-30" });
      });
      it("the last range should be for the previous month", () => {
        const today = Day.getToday();
        expect(formatRange(ranges[ranges.length - 1])).toEqual({
          end: today.subtractMonths(1).getEndOfMonth().format(),
          start: today.subtractMonths(2).getEndOfMonth().format()
        });
      });
    });
    describe("and monthly position summary ranges are processed for a transaction set closes the same month", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2018, 12, 1),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2018, 12, 31),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          }
        ];
        ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
      });
      it("should have one range", () => {
        expect(ranges.length).toEqual(1);
      });
      it("the first range should be from 11-30-2018 to 12-31-2018", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2018-12-31", start: "2018-11-30" });
      });
    });
    describe("and monthly position summary ranges are processed for a transaction set closes the next month", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2015, 10, 20),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2015, 11, 20),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          }
        ];
        ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
      });
      it("should have two ranges", () => {
        expect(ranges.length).toEqual(2);
      });
      it("the first range should be from 09-30-2015 to 10-31-2015", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2015-10-31", start: "2015-09-30" });
      });
      it("the second range should be from 10-31-2015 to 11-30-2015", () => {
        expect(formatRange(ranges[1])).toEqual({ end: "2015-11-30", start: "2015-10-31" });
      });
    });
    describe("and monthly position summary ranges are processed for a transaction set that opens in the current month", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: Day.getToday(),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          }
        ];
        ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
      });
      it("should have zero ranges", () => {
        expect(ranges.length).toEqual(0);
      });
    });
    describe("and a year-to-date position summary ranges are processed for a transaction set that closed in 2017", () => {
      let ranges;
      beforeEach(() => {
        const transactions = [
          {
            date: new Day(2017, 1, 1),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2017, 1, 2),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          }
        ];
        ranges = PositionSummaryFrame.YTD.getRanges(transactions);
      });
      it("should have no ranges", () => {
        expect(ranges.length).toEqual(0);
      });
    });
    describe("and a year-to-date position summary ranges are processed for a transaction set that opened last year and has not yet closed (assuming its 2021)", () => {
      let ranges;
      beforeEach(() => {
        let getFullYear = Date.prototype.getFullYear;
        Date.prototype.getFullYear = () => {
          return 2021;
        };
        const transactions = [
          {
            date: new Day(2019, 1, 1),
            snapshot: {
              open: new Decimal3(100)
            },
            type: TransactionType.BUY
          }
        ];
        ranges = PositionSummaryFrame.YTD.getRanges(transactions);
        Date.prototype.getFullYear = getFullYear;
      });
      it("should have one range", () => {
        expect(ranges.length).toEqual(1);
      });
      it("the first range should be from 12-31-2020 to 12-31-2021", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2021-12-31", start: "2020-12-31" });
      });
    });
    describe("and a year-to-date position summary ranges are processed for a transaction set that that opened and closed in 2020", () => {
      let ranges;
      beforeEach(() => {
        let getFullYear = Date.prototype.getFullYear;
        Date.prototype.getFullYear = () => {
          return 2021;
        };
        const transactions = [
          {
            date: new Day(2021, 1, 1),
            snapshot: {
              open: new Decimal3(1)
            },
            type: TransactionType.BUY
          },
          {
            date: new Day(2021, 1, 2),
            snapshot: {
              open: new Decimal3(0)
            },
            type: TransactionType.SELL
          }
        ];
        ranges = PositionSummaryFrame.YTD.getRanges(transactions);
        Date.prototype.getFullYear = getFullYear;
      });
      it("should have one range", () => {
        expect(ranges.length).toEqual(1);
      });
      it("the first range should be from 12-31-2020 to 12-31-2021", () => {
        expect(formatRange(ranges[0])).toEqual({ end: "2021-12-31", start: "2020-12-31" });
      });
    });
    describe("and getting the start date for yearly frames", () => {
      describe("for one year ago", () => {
        let start;
        let today;
        beforeEach(() => {
          start = PositionSummaryFrame.YEARLY.getStartDate(1);
          today = /* @__PURE__ */ new Date();
        });
        it("should be in December", () => {
          expect(start.month).toEqual(12);
        });
        it("should be on the 31st", () => {
          expect(start.day).toEqual(31);
        });
        it("should be two years ago", () => {
          expect(start.year).toEqual(today.getFullYear() - 2);
        });
      });
      describe("for two years ago", () => {
        let start;
        let today;
        beforeEach(() => {
          start = PositionSummaryFrame.YEARLY.getStartDate(2);
          today = /* @__PURE__ */ new Date();
        });
        it("should be in December", () => {
          expect(start.month).toEqual(12);
        });
        it("should be on the 31st", () => {
          expect(start.day).toEqual(31);
        });
        it("should be three years ago", () => {
          expect(start.year).toEqual(today.getFullYear() - 3);
        });
      });
    });
    describe("and recent ranges are calculated", () => {
      let todayYear;
      let todayMonth;
      let todayDay;
      beforeEach(() => {
        const today = /* @__PURE__ */ new Date();
        todayYear = today.getFullYear();
        todayMonth = today.getMonth() + 1;
        todayDay = today.getDate();
      });
      describe("the most recent YTD frame", () => {
        let ranges;
        beforeEach(() => {
          ranges = PositionSummaryFrame.YTD.getRecentRanges(0);
        });
        it("should contain one range", () => {
          expect(ranges.length).toEqual(1);
        });
        it("the range should begin at the end of last year", () => {
          expect(ranges[0].start.format()).toEqual(`${todayYear - 1}-12-31`);
        });
        it("the range should end at the end of this year", () => {
          expect(ranges[0].end.format()).toEqual(`${todayYear}-12-31`);
        });
      });
      describe("the three most recent YEARLY frames", () => {
        let ranges;
        beforeEach(() => {
          ranges = PositionSummaryFrame.YEARLY.getRecentRanges(2);
        });
        it("should contain three range", () => {
          expect(ranges.length).toEqual(3);
        });
        it("the first range should begin at the end of this year (minus three years)", () => {
          expect(ranges[0].start.format()).toEqual(`${todayYear - 4}-12-31`);
        });
        it("the first range should end at the end of this year (minus two years)", () => {
          expect(ranges[0].end.format()).toEqual(`${todayYear - 3}-12-31`);
        });
        it("the second range should begin at the end of this year (minus two years)", () => {
          expect(ranges[1].start.format()).toEqual(`${todayYear - 3}-12-31`);
        });
        it("the second range should end at the end of this year (minus one years)", () => {
          expect(ranges[1].end.format()).toEqual(`${todayYear - 2}-12-31`);
        });
        it("the third range should begin at the end of the year before last", () => {
          expect(ranges[2].start.format()).toEqual(`${todayYear - 2}-12-31`);
        });
        it("the third range should end at the end of last year", () => {
          expect(ranges[2].end.format()).toEqual(`${todayYear - 1}-12-31`);
        });
      });
    });
    describe("and prior ranges are calculated", () => {
      describe("for YEARLY ranges", () => {
        describe("from 2017-10-10, including one previous ranges", () => {
          let ranges;
          beforeEach(() => {
            ranges = PositionSummaryFrame.YEARLY.getPriorRanges(new Day(2015, 4, 20), 1);
          });
          it("should return two ranges", () => {
            expect(ranges.length).toEqual(2);
          });
          it("the first range should begin on 2013-12-31", () => {
            expect(ranges[0].start.getIsEqual(new Day(2013, 12, 31))).toEqual(true);
          });
          it("the first range should end on 2014-12-31", () => {
            expect(ranges[0].end.getIsEqual(new Day(2014, 12, 31))).toEqual(true);
          });
          it("the second range should begin on 2014-12-31", () => {
            expect(ranges[1].start.getIsEqual(new Day(2014, 12, 31))).toEqual(true);
          });
          it("the second range should end on 2015-12-31", () => {
            expect(ranges[1].end.getIsEqual(new Day(2015, 12, 31))).toEqual(true);
          });
        });
      });
    });
  });

  // test/specs/data/TransactionValidatorSpec.js
  var Day2 = require_Day();
  var Decimal4 = require_Decimal();
  var TransactionType2 = require_TransactionType();
  var TransactionValidator = require_TransactionValidator();
  var InstrumentType3 = require_InstrumentType();
  describe("When validating transaction order", () => {
    "use strict";
    const build = (sequence, day, type) => {
      return { sequence, date: Day2.parse(day), type: type || TransactionType2.BUY };
    };
    it("An array of zero transactions should be valid", () => {
      expect(TransactionValidator.validateOrder([])).toEqual(true);
    });
    it("An array of transactions with ordered sequences, on the same day should be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-04-30"), build(2, "2018-04-30"), build(3, "2018-04-30")])).toEqual(true);
    });
    it("An array of transactions with ordered sequences, on the same day should be valid, where a dividend occurs last, should be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-04-30"), build(2, "2018-04-30", TransactionType2.DIVIDEND)])).toEqual(true);
    });
    it("An array of transactions with ordered sequences, on the same day should be valid, where a dividend occurs first, in strict mode, should not be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-04-30", TransactionType2.DIVIDEND), build(2, "2018-04-30")], true)).toEqual(false);
    });
    it("An array of transactions with ordered sequences, on the same day should be valid, where a dividend occurs first, in non-strict mode, should be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-04-30", TransactionType2.DIVIDEND), build(2, "2018-04-30")], false)).toEqual(true);
    });
    it("An array of transactions with ordered sequences, on the sequential days should be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-04-30"), build(2, "2018-05-01"), build(3, "2018-05-02", TransactionType2.DIVIDEND)])).toEqual(true);
    });
    it("An array of transactions with ordered sequences (starting after one), on the same day should not be valid", () => {
      expect(TransactionValidator.validateOrder([build(3, "2018-04-30"), build(4, "2018-04-30"), build(5, "2018-04-30")])).toEqual(false);
    });
    it("An array of transactions with duplicate sequences, on the same day should not be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-04-30"), build(1, "2018-04-30")])).toEqual(false);
    });
    it("An array of transactions with with a gap in sequences, on the same day should not be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-04-30"), build(3, "2018-04-30")])).toEqual(false);
    });
    it("An array of transactions with with a reversed sequences, on the same subsequent days should not be valid", () => {
      expect(TransactionValidator.validateOrder([build(2, "2018-04-30"), build(1, "2018-05-01")])).toEqual(false);
    });
    it("An array of transactions with ordered sequences, on the reversed days should not be valid", () => {
      expect(TransactionValidator.validateOrder([build(1, "2018-05-02"), build(2, "2018-05-01"), build(3, "2018-04-30")])).toEqual(false);
    });
  });
  describe("When validating transaction references", () => {
    "use strict";
    const build = (root, transaction) => {
      return { reference: { root, transaction } };
    };
    it("An array of zero transactions should be valid", () => {
      expect(TransactionValidator.validateReferences([])).toEqual(true);
    });
    it("An array with no references should be valid", () => {
      expect(TransactionValidator.validateReferences([{}, {}])).toEqual(true);
    });
    it("An array with distinct references should be valid", () => {
      expect(TransactionValidator.validateReferences([build("a", "x"), build("a", "y"), build("b", "y")])).toEqual(true);
    });
    it("An array with non-distinct references should be not valid", () => {
      expect(TransactionValidator.validateReferences([build("a", "x"), build("a", "y"), build("b", "x"), build("a", "y")])).toEqual(false);
    });
  });
  describe("When requesting all the user-initiated transaction types", () => {
    "use strict";
    let userInitiated;
    beforeEach(() => {
      userInitiated = TransactionValidator.getUserInitiatedTransactionTypes();
    });
    it("Only nine types should be returned", () => {
      expect(userInitiated.length).toEqual(9);
    });
  });
  describe("When checking for a transaction that would switch position direction (without a position)", () => {
    "use strict";
    const instrumentType = InstrumentType3.EQUITY;
    describe("Where the transaction list only contains BUY transactions", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY, quantity: new Decimal4(2) },
          { type: TransactionType2.BUY, quantity: new Decimal4(3) }
        ];
      });
      it("No transaction should be identified which switches the position direction", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("Where the transaction list only contains SELL transactions (with positive quantities)", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(2) },
          { type: TransactionType2.SELL, quantity: new Decimal4(3) }
        ];
      });
      it("No transaction should be identified which switches the position direction", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("Where the transaction list only contains SELL_SHORT transactions", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(2) },
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(3) }
        ];
      });
      it("No transaction should be identified which switches the position direction", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("Where the transaction list buys 100 shares then sells 50 shares", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(100) },
          { type: TransactionType2.SELL, quantity: new Decimal4(50) }
        ];
      });
      it("No transaction should be identified", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("Where the transaction list sells 100 shares short then buys 50 shares to cover", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(100) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(50) }
        ];
      });
      it("No transaction should be identified", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("Where the transaction list sells 100 shares short then sells 50 shares short then buys 150 shares to cover", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(100) },
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(50) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(150) }
        ];
      });
      it("No transaction should be identified", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("Where the transaction list buys 100 shares then sells 200 shares", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(100) },
          { type: TransactionType2.SELL, quantity: new Decimal4(200) }
        ];
      });
      it("The second transaction should be identified as switching the direction", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(1);
      });
    });
    describe("Where the transaction list sells 100 shares short then sells 50 shares short then buys 151 shares to cover", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(100) },
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(50) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(151) }
        ];
      });
      it("The third transaction should be identified as switching the direction", () => {
        expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(2);
      });
    });
  });
  describe("When validating position violations", () => {
    "use strict";
    const instrumentType = InstrumentType3.EQUITY;
    describe("With all BUY transactions", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY, quantity: new Decimal4(2) }
        ];
      });
      it("Should return -1 (no violations)", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("With all SELL transactions", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(2) }
        ];
      });
      it("Should detect violation at index 0", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(0);
      });
    });
    describe("With invalid transition BUY \u2192 SELL_SHORT", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(10) },
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(5) }
        ];
      });
      it("Should detect violation at index 1", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(1);
      });
    });
    describe("With valid closing then switch LONG \u2192 SHORT", () => {
      let transactions;
      beforeEach(() => {
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(10) },
          { type: TransactionType2.SELL, quantity: new Decimal4(10) },
          { type: TransactionType2.SELL_SHORT, quantity: new Decimal4(5) }
        ];
      });
      it("Should return -1 (no violations)", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(-1);
      });
    });
    describe("With an open LONG position continuing correctly", () => {
      let transactions;
      let position;
      beforeEach(() => {
        position = {
          snapshot: {
            open: new Decimal4(100)
          }
        };
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(20) },
          { type: TransactionType2.SELL, quantity: new Decimal4(50) }
        ];
      });
      it("Should return -1 (no violations)", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(-1);
      });
    });
    describe("With an open SHORT position and invalid BUY", () => {
      let transactions;
      let position;
      beforeEach(() => {
        position = {
          snapshot: { open: new Decimal4(-50) }
        };
        transactions = [
          { type: TransactionType2.BUY, quantity: new Decimal4(10) }
        ];
      });
      it("Should detect violation at index 0", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(0);
      });
    });
    describe("Where the transaction list attempts to SELL too many shares", () => {
      let position;
      let transactions;
      beforeEach(() => {
        position = {
          snapshot: {
            open: new Decimal4(-5)
          }
        };
        transactions = [
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(1) },
          { type: TransactionType2.BUY_SHORT, quantity: new Decimal4(1) }
        ];
      });
      it("The sixth transaction should be identified as switching the direction", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(5);
      });
    });
    describe("Where the transaction list attempts to SELL too many shares", () => {
      let position;
      let transactions;
      beforeEach(() => {
        position = {
          snapshot: {
            open: new Decimal4(5)
          }
        };
        transactions = [
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(1) },
          { type: TransactionType2.SELL, quantity: new Decimal4(1) }
        ];
      });
      it("The sixth transaction should be identified as switching the direction", () => {
        expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(5);
      });
    });
  });

  // test/specs/processing/PositionContainerSpec.js
  var Currency = require_Currency();
  var PositionSummaryFrame2 = require_PositionSummaryFrame();
  var PositionContainer = require_PositionContainer();
  var PositionLevelDefinition = require_PositionLevelDefinition();
  var PositionLevelType = require_PositionLevelType();
  var PositionTreeDefinition = require_PositionTreeDefinition();
  var positionTestFactory = require_PositionTestFactory();
  describe("When a position container data is gathered", () => {
    "use strict";
    describe("for two portfolios, each with the same position, and the second portfolio with an addition position", () => {
      let portfolios;
      let positions;
      let summaries;
      beforeEach(() => {
        positionTestFactory.resetPositionCounter();
        portfolios = [
          positionTestFactory.createPortfolio("My First Portfolio", "a"),
          positionTestFactory.createPortfolio("My Second Portfolio", "b")
        ];
        positions = [
          positionTestFactory.createPosition("My First Portfolio", "AAPL"),
          positionTestFactory.createPosition("My Second Portfolio", "AAPL"),
          positionTestFactory.createPosition("My Second Portfolio", "TSLA")
        ];
        summaries = positions.reduce((accumulator, position) => {
          accumulator = accumulator.concat(positionTestFactory.createSummaries(position, PositionSummaryFrame2.YTD, 1));
          accumulator = accumulator.concat(positionTestFactory.createSummaries(position, PositionSummaryFrame2.YEARLY, 3));
          return accumulator;
        }, []);
      });
      describe("and a container is created grouping by total, portfolio, and instrument", () => {
        let name;
        let definitions;
        let container;
        beforeEach(() => {
          definitions = [
            new PositionTreeDefinition(name = "the only tree", [
              new PositionLevelDefinition("Total", PositionLevelType.OTHER, (x) => "totals", (x) => "Total", (x) => Currency.CAD),
              new PositionLevelDefinition("Portfolio", PositionLevelType.PORTFOLIO, (x) => x.portfolio.portfolio, (x) => x.portfolio.name, (x) => Currency.CAD),
              new PositionLevelDefinition("Position", PositionLevelType.POSITION, (x) => x.position.position, (x) => x.position.instrument.symbol.barchart, (x) => x.position.instrument.currency)
            ])
          ];
          try {
            container = new PositionContainer(definitions, portfolios, positions, summaries);
          } catch (e) {
            console.log(e);
          }
        });
        it('the "Total" group should have two children groups', () => {
          expect(container.getGroups(name, ["totals"]).length).toEqual(2);
        });
        it('the "Total" group should expose binding data, not raw position items', () => {
          const group = container.getGroup(name, ["totals"]);
          expect({
            description: group.formatted.description,
            items: group.items,
            positions: group.formatted.positions
          }).toEqual({
            description: "Total",
            items: void 0,
            positions: []
          });
        });
        it('The "a" portfolio group should have one child group', () => {
          expect(container.getGroups(name, ["totals", "My First Portfolio"]).length).toEqual(1);
        });
        it('the "a" position group should expose one formatted position', () => {
          const group = container.getGroup(name, ["totals", "My First Portfolio", positions[0].position]);
          expect(group.formatted.positions.map((position) => position.position)).toEqual([positions[0].position]);
        });
        it('The "b" portfolio group should have two child groups', () => {
          expect(container.getGroups(name, ["totals", "My Second Portfolio"]).length).toEqual(2);
        });
        it('the "b" portfolio group should expose two child bindings', () => {
          const groups = container.getGroups(name, ["totals", "My Second Portfolio"]);
          expect(groups.map((group) => group.formatted.position)).toEqual([positions[1].position, positions[2].position]);
        });
        it("the formatted position group binding should update after a quote change", () => {
          const group = container.getGroup(name, ["totals", "My First Portfolio", positions[0].position]);
          container.setQuotes([{ lastPrice: 200, symbol: "AAPL" }], []);
          expect(group.formatted.currentPrice).toEqual("200.00");
        });
        it("the formatted position group binding should update after a fundamental data change", () => {
          const group = container.getGroup(name, ["totals", "My First Portfolio", positions[0].position]);
          container.setPositionFundamentalData("AAPL", false, {
            raw: {
              percentChange1m: 0.01,
              percentChange1y: 0.02,
              percentChange3m: 0.03,
              percentChangeYtd: 0.04
            }
          });
          expect({
            fundamental: group.formatted.fundamental,
            percentChange1m: group.formatted.fundamental.raw.percentChange1m
          }).toEqual({
            fundamental: {
              raw: {
                percentChange1m: 0.01,
                percentChange1y: 0.02,
                percentChange3m: 0.03,
                percentChangeYtd: 0.04
              }
            },
            percentChange1m: 0.01
          });
        });
      });
    });
  });

  // test/specs/processing/PositionGroupSpec.js
  var Currency2 = require_Currency();
  var CurrencyTranslator = require_CurrencyTranslator();
  var Day3 = require_Day();
  var FilterMode = require_FilterMode();
  var PositionSummaryFrame3 = require_PositionSummaryFrame();
  var PositionGroup = require_PositionGroup();
  var PositionItem = require_PositionItem();
  var PositionLevelDefinition2 = require_PositionLevelDefinition();
  var PositionLevelType2 = require_PositionLevelType();
  var positionTestFactory2 = require_PositionTestFactory();
  describe("When a position group is used", () => {
    "use strict";
    function createItem(symbol, portfolioName) {
      const portfolio = positionTestFactory2.createPortfolio(portfolioName || "My Portfolio", portfolioName || "Portfolio");
      const position = positionTestFactory2.createPosition(portfolio.portfolio, symbol);
      const currentSummary = positionTestFactory2.createSummaries(position, PositionSummaryFrame3.YTD, 1)[0];
      const previousSummaries = positionTestFactory2.createSummaries(position, PositionSummaryFrame3.YEARLY, 3);
      return new PositionItem(portfolio, position, currentSummary, previousSummaries);
    }
    function createDefinition(type) {
      return new PositionLevelDefinition2(
        type.description,
        type,
        (item) => item.position.position,
        (item) => item.position.instrument.symbol.barchart,
        (item) => item.position.instrument.currency
      );
    }
    function createGroup(type, items) {
      const firstItem = items[0] || null;
      const key = firstItem ? firstItem.position.position : "group";
      const description = firstItem ? firstItem.position.instrument.symbol.barchart : "Group";
      return new PositionGroup(createDefinition(type), items, Currency2.USD, new CurrencyTranslator([]), key, description, false);
    }
    beforeEach(() => {
      positionTestFactory2.resetPositionCounter();
    });
    it("should expose binding data for the formatted group payload", () => {
      const item = createItem("AAPL");
      const group = createGroup(PositionLevelType2.POSITION, [item]);
      expect({
        data: group.binding.data,
        description: group.binding.description,
        formatted: group.binding.formatted,
        key: group.binding.key
      }).toEqual({
        data: group.data,
        description: group.description,
        formatted: group.data,
        key: group.key
      });
    });
    it("should execute group actions from the binding", () => {
      const item = createItem("AAPL");
      const group = createGroup(PositionLevelType2.POSITION, [item]);
      const excludedChanges = [];
      group.registerGroupExcludedChangeHandler((value) => excludedChanges.push(value));
      group.binding.setExcluded(true);
      group.binding.setFilterMode(FilterMode.CLOSED);
      expect({
        excluded: group.excluded,
        excludedChanges,
        formattedExcluded: group.data.excluded,
        filterModeCode: group.data.filterModeCode
      }).toEqual({
        excluded: true,
        excludedChanges: [true],
        formattedExcluded: true,
        filterModeCode: FilterMode.CLOSED.code
      });
    });
    it("should expose formatted position data for a single-position group", () => {
      const item = createItem("AAPL");
      const group = createGroup(PositionLevelType2.POSITION, [item]);
      expect({
        instruments: group.data.positions.map((position) => position.instrument),
        positions: group.data.positions.map((position) => position.position),
        single: group.single
      }).toEqual({
        instruments: [item.position.instrument],
        positions: [item.position.position],
        single: true
      });
    });
    it("should update quote fields when an item quote changes", () => {
      const item = createItem("AAPL");
      const group = createGroup(PositionLevelType2.POSITION, [item]);
      item.setQuote({
        highPrice: 205,
        lastPrice: 200,
        lowPrice: 195,
        openPrice: 198,
        previousPrice: 190,
        priceChange: 10,
        symbol: "AAPL"
      });
      expect({
        currentPrice: group.data.currentPrice,
        quoteChange: group.data.quoteChange,
        quoteHigh: group.data.quoteHigh,
        quoteLow: group.data.quoteLow,
        quoteOpen: group.data.quoteOpen
      }).toEqual({
        currentPrice: "200.00",
        quoteChange: "10.00",
        quoteHigh: "205.00",
        quoteLow: "195.00",
        quoteOpen: "198.00"
      });
    });
    it("should update today price fields for a homogeneous group when item quotes change", () => {
      const firstItem = createItem("AAPL", "First Portfolio");
      const secondItem = createItem("AAPL", "Second Portfolio");
      const group = createGroup(PositionLevelType2.INSTRUMENT, [firstItem, secondItem]);
      const today = Day3.getToday();
      const quote = {
        lastDay: today,
        lastPrice: 200,
        previousPrice: 190,
        symbol: "AAPL"
      };
      const exchange = {
        code: "NYSE",
        currentDay: today,
        currentOpened: true
      };
      firstItem.setExchangeStatus(exchange);
      secondItem.setExchangeStatus(exchange);
      firstItem.setQuote(quote);
      secondItem.setQuote(quote);
      expect({
        gainToday: group.data.gainToday,
        homogeneous: group.homogeneous,
        single: group.single,
        todayExchange: group.data.todayExchange,
        todayPrice: group.data.todayPrice,
        todayPricePrevious: group.data.todayPricePrevious,
        todayQuote: group.data.todayQuote,
        unrealizedToday: group.data.unrealizedToday
      }).toEqual({
        gainToday: "20.00",
        homogeneous: true,
        single: false,
        todayExchange: today.format(),
        todayPrice: "200.00",
        todayPricePrevious: "190.00",
        todayQuote: today.format(),
        unrealizedToday: "20.00"
      });
    });
    it("should format fundamental data for a single-position group", () => {
      const item = createItem("AAPL");
      const group = createGroup(PositionLevelType2.POSITION, [item]);
      item.setPositionFundamentalData({
        raw: {
          percentChange1m: 0.01,
          percentChange1y: 0.02,
          percentChange3m: 0.03,
          percentChangeYtd: 0.04
        }
      });
      expect({
        fundamental: group.data.fundamental,
        percentChange1m: group.data.fundamental.raw.percentChange1m,
        percentChange1y: group.data.fundamental.raw.percentChange1y,
        percentChange3m: group.data.fundamental.raw.percentChange3m,
        percentChangeYtd: group.data.fundamental.raw.percentChangeYtd
      }).toEqual({
        fundamental: {
          raw: {
            percentChange1m: 0.01,
            percentChange1y: 0.02,
            percentChange3m: 0.03,
            percentChangeYtd: 0.04
          }
        },
        percentChange1m: 0.01,
        percentChange1y: 0.02,
        percentChange3m: 0.03,
        percentChangeYtd: 0.04
      });
    });
    it("should average fundamental data for multi-position groups", () => {
      const firstItem = createItem("AAPL", "First Portfolio");
      const secondItem = createItem("MSFT", "Second Portfolio");
      const group = createGroup(PositionLevelType2.OTHER, [firstItem, secondItem]);
      firstItem.setPositionFundamentalData({
        raw: {
          percentChange1m: 0.01
        }
      });
      secondItem.setPositionFundamentalData({
        raw: {
          percentChange1m: 0.03
        }
      });
      expect({
        homogeneous: group.homogeneous,
        percentChange1m: group.data.fundamental.percentChange1m,
        single: group.single
      }).toEqual({
        homogeneous: false,
        percentChange1m: "+2.00%",
        single: false
      });
    });
  });

  // test/specs/processing/PositionItemSpec.js
  var PositionSummaryFrame4 = require_PositionSummaryFrame();
  var PositionItem2 = require_PositionItem();
  var positionTestFactory3 = require_PositionTestFactory();
  describe("When a position item is used", () => {
    "use strict";
    let portfolio;
    let position;
    let currentSummary;
    let previousSummaries;
    let item;
    beforeEach(() => {
      positionTestFactory3.resetPositionCounter();
      portfolio = positionTestFactory3.createPortfolio("My Portfolio", "Portfolio");
      position = positionTestFactory3.createPosition(portfolio.portfolio, "AAPL");
      currentSummary = positionTestFactory3.createSummaries(position, PositionSummaryFrame4.YTD, 1)[0];
      previousSummaries = positionTestFactory3.createSummaries(position, PositionSummaryFrame4.YEARLY, 3);
      item = new PositionItem2(portfolio, position, currentSummary, previousSummaries);
    });
    it("should expose the portfolio, position, currency, and summaries supplied to the constructor", () => {
      expect({
        currency: item.currency,
        currentSummary: item.currentSummary,
        portfolio: item.portfolio,
        position: item.position,
        previousSummaries: item.previousSummaries
      }).toEqual({
        currency: position.instrument.currency,
        currentSummary,
        portfolio,
        position,
        previousSummaries
      });
    });
    it("should update quote state and notify quote observers", () => {
      const changes = [];
      const firstQuote = { lastPrice: 200, symbol: "AAPL" };
      const duplicateQuote = { lastPrice: 200, symbol: "AAPL" };
      const secondQuote = { lastPrice: 201, symbol: "AAPL" };
      item.registerQuoteChangeHandler((quote) => changes.push(quote));
      item.setQuote(firstQuote);
      item.setQuote(duplicateQuote);
      item.setQuote(secondQuote);
      expect({
        changes,
        currentPrice: item.currentPrice,
        previousQuote: item.previousQuote,
        quote: item.quote
      }).toEqual({
        changes: [firstQuote, secondQuote],
        currentPrice: 201,
        previousQuote: firstQuote,
        quote: secondQuote
      });
    });
    it("should force a quote update when requested", () => {
      const changes = [];
      const firstQuote = { lastPrice: 200, symbol: "AAPL" };
      const duplicateQuote = { lastPrice: 200, symbol: "AAPL" };
      item.registerQuoteChangeHandler((quote) => changes.push(quote));
      item.setQuote(firstQuote);
      item.setQuote(duplicateQuote, true);
      expect({
        changes,
        previousQuote: item.previousQuote,
        quote: item.quote
      }).toEqual({
        changes: [firstQuote, duplicateQuote],
        previousQuote: firstQuote,
        quote: duplicateQuote
      });
    });
    it("should update observable status fields", () => {
      const newsChanges = [];
      const fundamentalChanges = [];
      const lockChanges = [];
      const calculatingChanges = [];
      const fundamental = {
        raw: {
          percentChange1m: 0.01
        }
      };
      item.registerNewsExistsChangeHandler((value) => newsChanges.push(value));
      item.registerFundamentalDataChangeHandler((value) => fundamentalChanges.push(value));
      item.registerLockChangeHandler((value) => lockChanges.push(value));
      item.registerCalculatingChangeHandler((value) => calculatingChanges.push(value));
      item.setNewsArticleExists(true);
      item.setPositionFundamentalData(fundamental);
      item.setPositionLock(Object.assign({}, position, { system: { locked: true } }));
      item.setPositionCalculating(Object.assign({}, position, { system: { calculate: { processors: 1 } } }));
      expect({
        calculating: item.data.calculating,
        calculatingChanges,
        fundamental: item.data.fundamental,
        fundamentalChanges,
        locked: item.data.locked,
        lockChanges,
        newsChanges,
        newsExists: item.data.newsExists
      }).toEqual({
        calculating: true,
        calculatingChanges: [true],
        fundamental,
        fundamentalChanges: [fundamental],
        locked: true,
        lockChanges: [true],
        newsChanges: [true],
        newsExists: true
      });
    });
    it("should reject portfolio updates which move the position to another portfolio", () => {
      expect(() => item.updatePortfolio(positionTestFactory3.createPortfolio("Other Portfolio", "Other"))).toThrow();
    });
  });

  // test/specs/processing/binding/BindingTreeSpec.js
  var BindingTree = require_BindingTree();
  describe("When a binding tree is used", () => {
    "use strict";
    function createValue(key) {
      return {
        key,
        binding: {
          key
        }
      };
    }
    it("should keep child nodes and child bindings in the same order", () => {
      const tree = new BindingTree();
      const valueA = createValue("a");
      const valueB = createValue("b");
      const childA = tree.addChild(valueA);
      const childB = tree.addChild(valueB);
      expect({
        children: tree.getChildren(),
        bindings: tree.getChildren2()
      }).toEqual({
        children: [childA, childB],
        bindings: [valueA.binding, valueB.binding]
      });
    });
    it("should remove the matching binding when a child node is removed", () => {
      const tree = new BindingTree();
      const value = createValue("a");
      const child = tree.addChild(value);
      child.addChild(createValue("a-1"));
      tree.removeChild(child);
      expect({
        childBindings: child.getChildren2(),
        childChildren: child.getChildren(),
        childParent: child.getParent(),
        treeBindings: tree.getChildren2(),
        treeChildren: tree.getChildren()
      }).toEqual({
        childBindings: [],
        childChildren: [],
        childParent: null,
        treeBindings: [],
        treeChildren: []
      });
    });
    it("should ignore removal of a node which is not a child", () => {
      const tree = new BindingTree();
      const child = tree.addChild(createValue("a"));
      const other = new BindingTree(createValue("b"));
      tree.removeChild(other);
      expect({
        children: tree.getChildren(),
        bindings: tree.getChildren2()
      }).toEqual({
        children: [child],
        bindings: [child.getValue().binding]
      });
    });
  });

  // test/specs/processing/definitions/PositionLevelDefinitionSpec.js
  var Currency3 = require_Currency();
  var PositionLevelDefinition3 = require_PositionLevelDefinition();
  var PositionLevelType3 = require_PositionLevelType();
  describe("When a position level definition is created", () => {
    "use strict";
    function createDefinition(requiredGroups, requiredGroupGenerator) {
      return new PositionLevelDefinition3(
        "Total",
        PositionLevelType3.OTHER,
        (item) => item.key,
        (item) => item.description,
        (item) => item.currency,
        requiredGroups,
        requiredGroupGenerator
      );
    }
    describe("with required groups", () => {
      it("should accept groups with a key, description, and currency", () => {
        const requiredGroups = [
          {
            key: "totals",
            description: "Total",
            currency: Currency3.USD
          }
        ];
        expect(() => createDefinition(requiredGroups)).not.toThrow();
      });
      it("should reject a group without a key", () => {
        const requiredGroups = [
          {
            description: "Total",
            currency: Currency3.USD
          }
        ];
        expect(() => createDefinition(requiredGroups)).toThrow();
      });
      it("should reject a group without a description", () => {
        const requiredGroups = [
          {
            key: "totals",
            currency: Currency3.USD
          }
        ];
        expect(() => createDefinition(requiredGroups)).toThrow();
      });
      it("should reject a group without a valid currency", () => {
        const requiredGroups = [
          {
            key: "totals",
            description: "Total",
            currency: "USD"
          }
        ];
        expect(() => createDefinition(requiredGroups)).toThrow();
      });
    });
    describe("with a required group generator", () => {
      it("should add a valid generated group", () => {
        const requiredGroup = {
          key: "totals",
          description: "Total",
          currency: Currency3.USD
        };
        const definition = createDefinition([], () => requiredGroup);
        expect({
          generated: definition.generateRequiredGroup(),
          requiredGroups: definition.requiredGroups
        }).toEqual({
          generated: requiredGroup,
          requiredGroups: [requiredGroup]
        });
      });
      it("should reject an invalid generated group", () => {
        const definition = createDefinition([], () => {
          return {
            key: "totals",
            description: "Total",
            currency: "USD"
          };
        });
        expect(() => {
          try {
            definition.generateRequiredGroup();
          } finally {
            if (definition.requiredGroups.length !== 0) {
              throw new Error("Required groups were updated.");
            }
          }
        }).toThrow();
      });
    });
  });

  // test/specs/processing/definitions/PositionTreeDefinitionSpec.js
  var Currency4 = require_Currency();
  var PositionLevelDefinition4 = require_PositionLevelDefinition();
  var PositionLevelType4 = require_PositionLevelType();
  var PositionTreeDefinition2 = require_PositionTreeDefinition();
  describe("When a position tree definition is created", () => {
    "use strict";
    function createLevelDefinition() {
      return new PositionLevelDefinition4(
        "Total",
        PositionLevelType4.OTHER,
        (item) => item.key,
        (item) => item.description,
        (item) => item.currency || Currency4.USD
      );
    }
    it("should expose the configured name, level definitions, and exclusion dependencies", () => {
      const definitions = [createLevelDefinition()];
      const exclusionDependencies = ["by portfolio"];
      const treeDefinition = new PositionTreeDefinition2("by position", definitions, exclusionDependencies);
      expect({
        definitions: treeDefinition.definitions,
        exclusionDependencies: treeDefinition.exclusionDependencies,
        name: treeDefinition.name
      }).toEqual({
        definitions,
        exclusionDependencies,
        name: "by position"
      });
    });
    it("should default exclusion dependencies to an empty array", () => {
      const treeDefinition = new PositionTreeDefinition2("by position", [createLevelDefinition()]);
      expect(treeDefinition.exclusionDependencies).toEqual([]);
    });
    it("should reject invalid level definitions", () => {
      expect(() => new PositionTreeDefinition2("by position", [{}])).toThrow();
    });
    it("should reject invalid exclusion dependencies", () => {
      expect(() => new PositionTreeDefinition2("by position", [createLevelDefinition()], "by portfolio")).toThrow();
    });
    it("should provide a string representation", () => {
      const treeDefinition = new PositionTreeDefinition2("by position", [createLevelDefinition()]);
      expect(treeDefinition.toString()).toEqual("[PositionTreeDefinitions]");
    });
  });

  // test/specs/providers/InstrumentProviderSpec.js
  var Gateway = require_Gateway();
  var InstrumentProvider = require_InstrumentProvider();
  describe("After the InstrumentProvider utility is initialized", () => {
    "use strict";
    describe("and a single instrument is requested", () => {
      let provider;
      let result;
      beforeEach(async () => {
        provider = new InstrumentProvider();
        spyOn(Gateway, "invoke").and.returnValue(Promise.resolve({
          instrument: {
            name: "Bitcoin - USD",
            symbolType: 18
          }
        }));
        result = await provider.getInstrument("XDTE");
      });
      it("should call the single-instrument endpoint with a path symbol parameter", () => {
        const endpoint = Gateway.invoke.calls.argsFor(0)[0];
        const payload = Gateway.invoke.calls.argsFor(0)[1];
        expect({
          pathKeys: endpoint.path.parameters.map((parameter) => parameter.key),
          queryKeys: endpoint.query.parameters.map((parameter) => parameter.key),
          symbol: payload.symbol
        }).toEqual({
          pathKeys: ["instruments", "symbol"],
          queryKeys: [],
          symbol: "XDTE"
        });
      });
      it("should normalize crypto instrument metadata in single-instrument responses", () => {
        expect(result.instrument).toEqual({
          currency: "USD",
          name: "Bitcoin",
          symbolType: 999
        });
      });
    });
    describe("and multiple instruments are requested", () => {
      let provider;
      let result;
      beforeEach(async () => {
        provider = new InstrumentProvider();
        spyOn(Gateway, "invoke").and.returnValue(Promise.resolve({
          instruments: [
            {
              name: "Bitcoin - USD",
              symbolType: 18
            },
            {
              name: "Tesla Inc.",
              symbolType: 1
            }
          ]
        }));
        result = await provider.getInstruments(["XDTE", "TSLA", "OIY00"]);
      });
      it("should call the instruments endpoint with a comma-separated symbols query parameter", () => {
        const endpoint = Gateway.invoke.calls.argsFor(0)[0];
        const payload = Gateway.invoke.calls.argsFor(0)[1];
        expect({
          pathKeys: endpoint.path.parameters.map((parameter) => parameter.key),
          queryKeys: endpoint.query.parameters.map((parameter) => parameter.key),
          symbols: payload.symbols
        }).toEqual({
          pathKeys: ["instruments"],
          queryKeys: ["symbols"],
          symbols: "XDTE,TSLA,OIY00"
        });
      });
      it("should normalize crypto instrument metadata in batch responses", () => {
        expect(result.instruments).toEqual([
          {
            currency: "USD",
            name: "Bitcoin",
            symbolType: 999
          },
          {
            name: "Tesla Inc.",
            symbolType: 1
          }
        ]);
      });
    });
  });

  // test/specs/serialization/PositionSchemaSpec.js
  var PositionSchema = require_PositionSchema();
  describe("When positions are serialized", () => {
    "use strict";
    describe("for a read operation (user error #1)", () => {
      let position;
      let serialized;
      beforeEach(() => {
        position = {
          "user": "855e15c0-9e32-40ac-9bd9-5f0cc2780111",
          "portfolio": "c2a743e8-8efa-4a88-9a6c-9202d3fec29f",
          "instrument": {
            "id": "TGAM-CASH-USD",
            "name": "US Dollar",
            "type": "CASH",
            "currency": "USD"
          },
          "position": "a5cdc2e8-d9c6-4a1f-8f05-e271a5824f87",
          "transaction": 2987,
          "cash": true,
          "valuation": "AVG",
          "snapshot": {
            "date": "2020-06-11",
            "open": "222105.56",
            "direction": "LONG",
            "buys": "0",
            "sells": "0",
            "gain": "0",
            "basis": "0",
            "income": "0",
            "value": "0"
          },
          latest: {
            date: "2020-06-11",
            gain: "0"
          },
          "system": {
            "calculate": {
              "processors": 1
            },
            "locked": false
          }
        };
        serialized = JSON.stringify(position);
      });
      describe("and the data is deserialized", () => {
        let deserialized;
        beforeEach(() => {
          const reviver = PositionSchema.CLIENT.schema.getReviver();
          deserialized = JSON.parse(serialized, reviver);
        });
        it("the deserialized data should be an object", () => {
          expect(typeof deserialized).toEqual("object");
        });
        it("the deserialized data should be correct", () => {
          expect(deserialized.position).toEqual(position.position);
        });
      });
    });
  });

  // test/specs/serialization/TransactionSchemaSpec.js
  var Day4 = require_Day();
  var Decimal5 = require_Decimal();
  var TransactionType3 = require_TransactionType();
  var TransactionSchema = require_TransactionSchema();
  describe("When transactions are serialized", () => {
    "use strict";
    function normalizeTransaction(transaction) {
      return {
        cash: transaction.cash,
        date: transaction.date.format(),
        fee: transaction.fee.toString(),
        portfolio: transaction.portfolio,
        position: transaction.position,
        price: transaction.price.toString(),
        quantity: transaction.quantity.toString(),
        reinvest: transaction.reinvest,
        sequence: transaction.sequence,
        type: transaction.type
      };
    }
    describe("for an edit operation (user error #1)", () => {
      let transaction;
      let serialized;
      beforeEach(() => {
        transaction = {};
        transaction.portfolio = "063e00ea-8d1b-4faa-aedf-f43bdf23590e";
        transaction.position = "c2eefcde-f8d0-438d-9414-28f307d7b544";
        transaction.sequence = 1;
        transaction.type = TransactionType3.BUY;
        transaction.date = new Day4(2018, 7, 9);
        transaction.price = new Decimal5(15.92);
        transaction.quantity = new Decimal5(100);
        transaction.fee = new Decimal5(9.95);
        transaction.reinvest = "default";
        transaction.cash = "default";
        const formatted = TransactionSchema.BUY.schema.format(transaction);
        serialized = JSON.stringify(formatted);
      });
      it("the serialized data should be correct", () => {
        expect(typeof serialized === "string").toEqual(true);
      });
      describe("and the data is deserialized", () => {
        let deserialized;
        beforeEach(() => {
          const reviver = TransactionSchema.BUY.schema.getReviver();
          deserialized = JSON.parse(serialized, reviver);
        });
        it("the deserialized data should be correct", () => {
          expect(normalizeTransaction(deserialized)).toEqual(normalizeTransaction(transaction));
        });
      });
    });
  });
})();
