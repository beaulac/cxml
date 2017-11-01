"use strict";
// This file is part of cxml, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TypeSpec_1 = require("./TypeSpec");
var MemberBase_1 = require("./MemberBase");
var Item_1 = require("./Item");
var debug = require("debug");
/** Represents a child element or attribute. */
var MemberSpec = (function (_super) {
    __extends(MemberSpec, _super);
    function MemberSpec(spec, namespace) {
        var _this = this;
        var parts = TypeSpec_1.parseName(spec[0]);
        _this = _super.call(this, Item_1.ItemBase, parts.name) || this;
        _this.safeName = parts.safeName;
        _this.namespace = namespace;
        _this.item.parentNum = spec[3];
        var typeNumList = spec[1];
        var flags = spec[2];
        _this.isAbstract = !!(flags & MemberSpec.abstractFlag);
        _this.isSubstituted = !!(flags & MemberSpec.substitutedFlag);
        _this.isSubstituted = _this.isSubstituted || _this.isAbstract;
        if (_this.isSubstituted) {
            _this.containingTypeList = [];
        }
        if (typeNumList.length == 1) {
            _this.typeNum = typeNumList[0];
        }
        else {
            // TODO: What now? Make sure this is not reached.
            // Different types shouldn't be joined with | in .d.ts, instead
            // they should be converted to { TypeA: TypeA, TypeB: TypeB... }
            // Let's not pollute the log too much.
            debug('cxml')(spec);
        }
        return _this;
    }
    MemberSpec.prototype.define = function () {
        // Look up member type if available.
        // Sometimes abstract elements have no type.
        if (this.typeNum) {
            this.typeSpec = this.namespace.typeByNum(this.typeNum);
            this.type = this.typeSpec.getType();
        }
        if (this.isSubstituted) {
            this.proxySpec = new TypeSpec_1.TypeSpec([0, 0, [], []], this.namespace, '');
            this.proxySpec.substituteList = [];
            if (!this.isAbstract)
                this.proxySpec.addSubstitute(this, this);
        }
        if (this.item.parent) {
            // Parent is actually the substitution group base element.
            this.item.parent.proxySpec.addSubstitute(this.item.parent, this);
        }
    };
    return MemberSpec;
}(MemberBase_1.MemberBase));
exports.MemberSpec = MemberSpec;
