"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Base class inherited by all schema type classes, not defining custom hooks. */
var TypeInstance = (function () {
    function TypeInstance() {
    }
    return TypeInstance;
}());
exports.TypeInstance = TypeInstance;
/** Parser rule, defines a handler class, valid attributes and children
  * for an XSD tag. */
var Type = (function () {
    function Type(handler) {
        /** Table of allowed attributes. */
        this.attributeTbl = {};
        this.handler = handler;
    }
    Type.prototype.addAttribute = function (ref) {
        this.attributeTbl[ref.member.namespace.getPrefix() + ref.member.name] = ref;
    };
    Type.prototype.addChild = function (ref) {
        this.childTbl[ref.member.namespace.getPrefix() + ref.member.name] = ref;
    };
    return Type;
}());
exports.Type = Type;
