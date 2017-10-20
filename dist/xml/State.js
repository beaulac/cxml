"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Parser state created for each input tag. */
var State = (function () {
    function State(parent, memberRef, type, item) {
        this.parent = parent;
        this.memberRef = memberRef;
        this.type = type;
        this.item = item;
        if (parent) {
            this.namespaceTbl = parent.namespaceTbl;
        }
        else {
            this.namespaceTbl = {};
        }
    }
    /** Add a new xmlns prefix recognized inside current tag and its children. */
    State.prototype.addNamespace = function (short, namespace) {
        var key;
        var namespaceTbl = this.namespaceTbl;
        if (this.parent && namespaceTbl == this.parent.namespaceTbl) {
            namespaceTbl = {};
            for (var _i = 0, _a = Object.keys(this.parent.namespaceTbl); _i < _a.length; _i++) {
                key = _a[_i];
                namespaceTbl[key] = this.parent.namespaceTbl[key];
            }
            this.namespaceTbl = namespaceTbl;
        }
        namespaceTbl[short] = [namespace, namespace.getPrefix()];
    };
    return State;
}());
exports.State = State;
