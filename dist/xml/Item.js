"use strict";
// This file is part of cxml, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Type and member dependency helper. Implements Kahn's topological sort.
  * Member instead of parent class of both, due to TypeScript limitations
  * (cannot extend a class given as a generic parameter). */
var ItemBase = (function () {
    /** @param type Type or member instance containing this helper. */
    function ItemBase(type) {
        /** Track dependents for Kahn's topological sort algorithm. */
        this.dependentList = [];
        this.type = type;
    }
    /** Set parent type or substituted member. */
    ItemBase.prototype.setParent = function (parent) {
        this.parent = parent;
        if (parent.item.defined) {
            // Entire namespace for substituted member is already fully defined,
            // so the substituted member's dependentList won't get processed any more
            // and we should process this member immediately.
            this.define();
        }
        else if (parent != this.type)
            parent.item.dependentList.push(this.type);
    };
    /** Topological sort visitor. */
    ItemBase.prototype.define = function () {
        if (!this.defined) {
            this.defined = true;
            this.type.define();
        }
        for (var _i = 0, _a = this.dependentList; _i < _a.length; _i++) {
            var dependent = _a[_i];
            dependent.item.define();
        }
        this.dependentList = [];
    };
    return ItemBase;
}());
exports.ItemBase = ItemBase;
