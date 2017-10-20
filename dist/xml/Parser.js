"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var sax = require("sax");
var State_1 = require("./State");
var JS_1 = require("../importer/JS");
var converterTbl = {
    Date: (function (item) {
        var dateParts = item.match(/([0-9]+)-([0-9]+)-([0-9]+)(?:T([0-9]+):([0-9]+):([0-9]+)(\.[0-9]+)?)?(?:Z|([+-][0-9]+):([0-9]+))?/);
        var offsetMinutes = +(dateParts[9] || '0');
        var offset = +(dateParts[8] || '0') * 60;
        if (offset < 0)
            offsetMinutes = -offsetMinutes;
        offset += offsetMinutes;
        var date = new Date(+dateParts[1], +dateParts[2] - 1, +dateParts[3], +(dateParts[4] || '0'), +(dateParts[5] || '0'), +(dateParts[6] || '0'), +(dateParts[7] || '0') * 1000);
        date.setTime(date.getTime() - (offset + date.getTimezoneOffset()) * 60000);
        date.cxmlTimezoneOffset = offset;
        return (date);
    }),
    boolean: (function (item) { return item == 'true'; }),
    string: (function (item) { return item; }),
    number: (function (item) { return +item; })
};
function convertPrimitive(text, type) {
    var converter = converterTbl[type.primitiveType];
    if (converter) {
        if (type.isList) {
            return (text.trim().split(/\s+/).map(converter));
        }
        else {
            return (converter(text.trim()));
        }
    }
    return (null);
}
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.attach = function (handler) {
        var proto = handler.prototype;
        var realHandler = handler.type.handler;
        var realProto = realHandler.prototype;
        for (var _i = 0, _a = Object.keys(proto); _i < _a.length; _i++) {
            var key = _a[_i];
            realProto[key] = proto[key];
        }
        realHandler._custom = true;
    };
    Parser.prototype.parse = function (stream, output, context) {
        var _this = this;
        return (new Promise(function (resolve, reject) {
            return _this._parse(stream, output, context, resolve, reject);
        }));
    };
    Parser.prototype._parse = function (stream, output, context, resolve, reject) {
        var _this = this;
        this.context = context || JS_1.defaultContext;
        var xml = sax.createStream(true, { position: true });
        var type = output.constructor.type;
        var xmlSpace = this.context.registerNamespace('http://www.w3.org/XML/1998/namespace');
        var state = new State_1.State(null, null, type, new type.handler());
        var rootState = state;
        state.addNamespace('', type.namespace);
        if (xmlSpace)
            state.addNamespace('xml', xmlSpace);
        xml.on('opentag', function (node) {
            var attrTbl = node.attributes;
            var attr;
            var nodePrefix = '';
            var name = node.name;
            var splitter = name.indexOf(':');
            var item = null;
            // Read xmlns namespace prefix definitions before parsing node name.
            for (var _i = 0, _a = Object.keys(attrTbl); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key.substr(0, 5) == 'xmlns') {
                    var nsParts = key.match(/^xmlns(:(.+))?$/);
                    if (nsParts) {
                        state.addNamespace(nsParts[2] || '', _this.context.registerNamespace(attrTbl[key]));
                    }
                }
            }
            // Parse node name and possible namespace prefix.
            if (splitter >= 0) {
                nodePrefix = name.substr(0, splitter);
                name = name.substr(splitter + 1);
            }
            // Add internal surrogate key namespace prefix to node name.
            var nodeNamespace = state.namespaceTbl[nodePrefix];
            name = nodeNamespace[1] + name;
            var child;
            var type;
            if (state.type) {
                child = state.type.childTbl[name];
                if (child) {
                    if (child.proxy) {
                        type = child.proxy.member.type;
                        state = new State_1.State(state, child.proxy, type, new type.handler());
                    }
                    type = child.member.type;
                }
            }
            if (type && !type.isPlainPrimitive) {
                item = new type.handler();
                // Parse all attributes.
                for (var _b = 0, _c = Object.keys(attrTbl); _b < _c.length; _b++) {
                    var key = _c[_b];
                    splitter = key.indexOf(':');
                    if (splitter >= 0) {
                        var attrPrefix = key.substr(0, splitter);
                        if (attrPrefix == 'xmlns')
                            continue;
                        var attrNamespace = state.namespaceTbl[attrPrefix];
                        if (attrNamespace) {
                            attr = attrNamespace[1] + key.substr(splitter + 1);
                        }
                        else {
                            console.log('Namespace not found for ' + key);
                            continue;
                        }
                    }
                    else {
                        attr = nodeNamespace[1] + key;
                    }
                    var ref = type.attributeTbl[attr];
                    if (ref && ref.member.type.isPlainPrimitive) {
                        item[ref.safeName] = convertPrimitive(attrTbl[key], ref.member.type);
                    }
                }
                if (item._before)
                    item._before();
            }
            state = new State_1.State(state, child, type, item);
        });
        xml.on('text', function (text) {
            if (state.type && state.type.isPrimitive) {
                if (!state.textList)
                    state.textList = [];
                state.textList.push(text);
            }
        });
        xml.on('closetag', function (name) {
            var member = state.memberRef;
            var obj = state.item;
            var item = obj;
            var text;
            if (state.type && state.type.isPrimitive)
                text = (state.textList || []).join('').trim();
            if (text) {
                var content = convertPrimitive(text, state.type);
                if (state.type.isPlainPrimitive)
                    item = content;
                else
                    obj.content = content;
            }
            if (obj && obj._after)
                obj._after();
            state = state.parent;
            if (member) {
                if (member.proxy) {
                    if (item)
                        state.item[member.safeName] = item;
                    item = state.item;
                    state = state.parent;
                    member = member.proxy;
                }
            }
            else
                console.warn("Unrecognized element: " + name);
            if (item) {
                var parent = state.item;
                if (parent) {
                    if (member.max > 1) {
                        if (!parent.hasOwnProperty(member.safeName))
                            parent[member.safeName] = [];
                        parent[member.safeName].push(item);
                    }
                    else
                        parent[member.safeName] = item;
                }
            }
        });
        xml.on('end', function () {
            resolve(rootState.item);
        });
        xml.on('error', function (err) {
            console.error(err);
        });
        if (typeof (stream) == 'string') {
            xml.write(stream);
            xml.end();
        }
        else
            stream.pipe(xml);
    };
    return Parser;
}());
exports.Parser = Parser;
