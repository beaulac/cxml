"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var MemberRefBase = (function () {
    function MemberRefBase(member, min, max) {
        this.member = member;
        this.min = min;
        this.max = max;
    }
    return MemberRefBase;
}());
MemberRefBase.optionalFlag = 1;
MemberRefBase.arrayFlag = 2;
exports.MemberRefBase = MemberRefBase;
