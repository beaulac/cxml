"use strict";
// This file is part of cxml, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Should extend ItemBase instead of containing it.
// For now, TypeScript doesn't allow ItemBase to extend ItemContent.
/** Represents a child element or attribute. */
var MemberBase = (function () {
    function MemberBase(Item, name) {
        if (Item)
            this.item = new Item(this);
        this.name = name;
    }
    MemberBase.prototype.define = function () { };
    return MemberBase;
}());
MemberBase.abstractFlag = 1;
MemberBase.substitutedFlag = 2;
MemberBase.anyFlag = 4;
exports.MemberBase = MemberBase;
