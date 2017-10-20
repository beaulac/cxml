"use strict";
// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
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
var MemberRef_1 = require("./MemberRef");
var Type_1 = require("./Type");
var Item_1 = require("./Item");
/** Parse name from schema in serialized JSON format.
  * If name used in XML is not a valid JavaScript identifier, the schema
  * definition will be in format <cleaned up name for JavaScript>:<XML name>. */
function parseName(name) {
    var splitPos = name.indexOf(':');
    var safeName;
    if (splitPos >= 0) {
        safeName = name.substr(0, splitPos);
        name = name.substr(splitPos + 1);
    }
    else
        safeName = name;
    return ({
        name: name,
        safeName: safeName
    });
}
exports.parseName = parseName;
/** Create a new data object inheriting default values from another. */
function inherit(parentObject) {
    function Proxy() { }
    Proxy.prototype = parentObject;
    return (new Proxy());
}
function defineSubstitute(substitute, proxy) {
    var ref = new MemberRef_1.MemberRef([substitute, 0, substitute.safeName], substitute.namespace, proxy);
    return (ref);
}
/** Type specification defining attributes and children. */
var TypeSpec = (function () {
    function TypeSpec(spec, namespace, name) {
        // Initialize helper containing data and methods also applicable to members.
        this.optionalList = [];
        this.requiredList = [];
        this.item = new Item_1.ItemBase(this);
        if (name) {
            var parts = parseName(name);
            this.name = parts.name;
            this.safeName = parts.safeName;
        }
        this.namespace = namespace;
        this.flags = spec[0];
        this.item.parentNum = spec[1];
        this.childSpecList = spec[2];
        this.attributeSpecList = spec[3];
    }
    TypeSpec.prototype.getProto = function () { return (this.proto); };
    TypeSpec.prototype.getType = function () { return (this.type); };
    TypeSpec.prototype.define = function () {
        // This function hasn't been called for this type yet by setParent,
        // but something must by now have called it for the parent type.
        var parent = (this.item.parent && this.item.parent != this) ? this.item.parent.proto : Type_1.TypeInstance;
        this.proto = (function (_super) {
            __extends(XmlType, _super);
            function XmlType() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return XmlType;
        }(parent));
        var instanceProto = this.proto.prototype;
        instanceProto._exists = true;
        instanceProto._namespace = this.namespace.name;
        this.placeHolder = new this.proto();
        this.placeHolder._exists = false;
        this.type = new Type_1.Type(this.proto);
        this.proto.type = this.type;
        this.type.namespace = this.namespace;
        if (this.item.parent) {
            this.type.childTbl = inherit(this.item.parent.type.childTbl);
            this.type.attributeTbl = inherit(this.item.parent.type.attributeTbl);
        }
        else {
            this.type.attributeTbl = {};
            this.type.childTbl = {};
        }
        this.type.isPrimitive = !!(this.flags & TypeSpec.primitiveFlag);
        this.type.isPlainPrimitive = !!(this.flags & TypeSpec.plainPrimitiveFlag);
        this.type.isList = !!(this.flags & TypeSpec.listFlag);
        if (this.type.isPrimitive) {
            var primitiveType = this;
            var next;
            while ((next = primitiveType.item.parent) && next != primitiveType)
                primitiveType = next;
            this.type.primitiveType = primitiveType.safeName;
        }
        return (this.type);
    };
    TypeSpec.prototype.defineMember = function (ref) {
        var typeSpec = ref.member.typeSpec;
        var proxySpec = ref.member.proxySpec;
        if (proxySpec) {
            if (ref.max > 1) {
                typeSpec = proxySpec;
            }
            else {
                proxySpec = this;
                typeSpec = null;
            }
            TypeSpec.addSubstitutesToProxy(ref.member, proxySpec.proto.prototype);
        }
        if (typeSpec) {
            var memberType = typeSpec.placeHolder;
            var type = (this.proto.prototype);
            type[ref.safeName] = (ref.max > 1) ? [memberType] : memberType;
            if (ref.min < 1)
                this.optionalList.push(ref.safeName);
            else
                this.requiredList.push(ref.safeName);
        }
        return (ref);
    };
    TypeSpec.prototype.getSubstitutes = function () {
        return (this.substituteList);
    };
    TypeSpec.prototype.defineMembers = function () {
        var spec;
        for (var _i = 0, _a = this.childSpecList; _i < _a.length; _i++) {
            spec = _a[_i];
            var memberRef = new MemberRef_1.MemberRef(spec, this.namespace);
            this.addChild(memberRef);
            this.defineMember(memberRef);
        }
        for (var _b = 0, _c = this.attributeSpecList; _b < _c.length; _b++) {
            spec = _c[_b];
            var attributeRef = new MemberRef_1.MemberRef(spec, this.namespace);
            if (attributeRef.member.typeSpec)
                this.type.addAttribute(attributeRef);
            this.defineMember(attributeRef);
        }
    };
    TypeSpec.prototype.addSubstitutes = function (headRef, proxy) {
        headRef.member.containingTypeList.push({
            type: this,
            head: headRef,
            proxy: proxy
        });
        headRef.member.proxySpec.item.define();
        for (var _i = 0, _a = headRef.member.proxySpec.getSubstitutes(); _i < _a.length; _i++) {
            var substitute = _a[_i];
            if (substitute == headRef.member) {
                this.type.addChild(headRef);
            }
            else {
                var substituteRef = defineSubstitute(substitute, proxy);
                this.addChild(substituteRef, proxy);
            }
        }
    };
    TypeSpec.prototype.addChild = function (memberRef, proxy) {
        if (memberRef.member.proxySpec)
            this.addSubstitutes(memberRef, proxy || memberRef);
        else if (!memberRef.member.isAbstract)
            this.type.addChild(memberRef);
    };
    TypeSpec.prototype.addSubstitute = function (head, substitute) {
        if (this.item.defined && head.containingTypeList.length) {
            // The element's proxy type has already been defined
            // so we need to patch other types containing the element.
            for (var _i = 0, _a = head.containingTypeList; _i < _a.length; _i++) {
                var spec = _a[_i];
                var ref = defineSubstitute(substitute, spec.proxy);
                spec.type.addChild(ref, spec.proxy);
                if (spec.head.max <= 1) {
                    TypeSpec.addSubstituteToProxy(substitute, spec.type.proto.prototype);
                }
            }
            // Add the substitution to proxy type of the group head,
            // and loop if the head further substitutes something else.
            while (head) {
                TypeSpec.addSubstituteToProxy(substitute, head.proxySpec.proto.prototype);
                head = head.item.parent;
            }
        }
        this.substituteList.push(substitute);
    };
    /** Remove placeholders from instance prototype. They allow dereferencing
      * contents of missing optional child elements without throwing errors.
      * @param strict Also remove placeholders for mandatory child elements. */
    TypeSpec.prototype.cleanPlaceholders = function (strict) {
        var type = (this.proto.prototype);
        var nameList = this.optionalList;
        if (strict)
            nameList = nameList.concat(this.requiredList);
        for (var _i = 0, nameList_1 = nameList; _i < nameList_1.length; _i++) {
            var name = nameList_1[_i];
            delete (type[name]);
        }
    };
    TypeSpec.addSubstituteToProxy = function (substitute, type, head) {
        if (substitute == head || !substitute.proxySpec) {
            if (!substitute.isAbstract)
                type[substitute.safeName] = substitute.typeSpec.placeHolder;
        }
        else {
            TypeSpec.addSubstitutesToProxy(substitute, type);
        }
    };
    TypeSpec.addSubstitutesToProxy = function (member, type) {
        for (var _i = 0, _a = member.proxySpec.getSubstitutes(); _i < _a.length; _i++) {
            var substitute = _a[_i];
            TypeSpec.addSubstituteToProxy(substitute, type, member);
        }
    };
    return TypeSpec;
}());
/** Type contains text that gets parsed to JavaScript primitives. */
TypeSpec.primitiveFlag = 1;
/** Type only contains text, no wrapper object is needed to hold its attributes. */
TypeSpec.plainPrimitiveFlag = 2;
/** Type contains text with a list of whitespace-separated items. */
TypeSpec.listFlag = 4;
exports.TypeSpec = TypeSpec;
