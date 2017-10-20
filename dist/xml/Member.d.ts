import { Namespace } from './Namespace';
import { Type } from './Type';
import { TypeSpec } from './TypeSpec';
import { MemberBase } from './MemberBase';
import { MemberRef } from './MemberRef';
import { ItemBase } from './Item';
/** Tuple: name, type ID list, flags, substituted member ID */
export declare type RawMemberSpec = [string, number[], number, number];
/** Represents a child element or attribute. */
export declare class MemberSpec extends MemberBase<MemberSpec, Namespace, ItemBase<MemberSpec>> {
    constructor(spec: RawMemberSpec, namespace: Namespace);
    define(): void;
    typeNum: number;
    typeSpec: TypeSpec;
    type: Type;
    /** Substitution group virtual type,
      * containing all possible substitutes as children. */
    proxySpec: TypeSpec;
    /** All types containing this member, to be modified if more substitutions
      * for this member are declared later. */
    containingTypeList: {
        type: TypeSpec;
        head: MemberRef;
        proxy: MemberRef;
    }[];
}
