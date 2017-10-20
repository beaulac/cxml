import { Namespace } from './Namespace';
import { MemberSpec } from './Member';
import { MemberRef, RawRefSpec } from './MemberRef';
import { Type, TypeClass, TypeInstance } from './Type';
import { Item, ItemBase } from './Item';
/** Tuple: flags, parent type ID, child element list, attribute list.
  * Serialized JSON format. */
export declare type RawTypeSpec = [number, number, RawRefSpec[], RawRefSpec[]];
/** Parse name from schema in serialized JSON format.
  * If name used in XML is not a valid JavaScript identifier, the schema
  * definition will be in format <cleaned up name for JavaScript>:<XML name>. */
export declare function parseName(name: string): {
    name: string;
    safeName: string;
};
/** Represents the prototype of TypeClass.
  * Contains placeholders for any missing members. */
export interface TypeClassMembers {
    [name: string]: TypeInstance | TypeInstance[];
}
/** Type specification defining attributes and children. */
export declare class TypeSpec implements Item<ItemBase<TypeSpec>> {
    constructor(spec: RawTypeSpec, namespace: Namespace, name: string);
    getProto(): TypeClass;
    getType(): Type;
    define(): Type;
    private defineMember(ref);
    getSubstitutes(): MemberSpec[];
    defineMembers(): void;
    addSubstitutes(headRef: MemberRef, proxy: MemberRef): void;
    addChild(memberRef: MemberRef, proxy?: MemberRef): void;
    addSubstitute(head: MemberSpec, substitute: MemberSpec): void;
    /** Remove placeholders from instance prototype. They allow dereferencing
      * contents of missing optional child elements without throwing errors.
      * @param strict Also remove placeholders for mandatory child elements. */
    cleanPlaceholders(strict?: boolean): void;
    private static addSubstituteToProxy(substitute, type, head?);
    private static addSubstitutesToProxy(member, type);
    item: ItemBase<TypeSpec>;
    namespace: Namespace;
    name: string;
    safeName: string;
    flags: number;
    childSpecList: RawRefSpec[];
    attributeSpecList: RawRefSpec[];
    substituteList: MemberSpec[];
    optionalList: string[];
    requiredList: string[];
    private type;
    private proto;
    private placeHolder;
    /** Type contains text that gets parsed to JavaScript primitives. */
    static primitiveFlag: number;
    /** Type only contains text, no wrapper object is needed to hold its attributes. */
    static plainPrimitiveFlag: number;
    /** Type contains text with a list of whitespace-separated items. */
    static listFlag: number;
}
