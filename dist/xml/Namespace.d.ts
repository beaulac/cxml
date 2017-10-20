import { NamespaceBase } from './NamespaceBase';
import { TypeSpec } from './TypeSpec';
import { MemberSpec } from './Member';
import { Context } from './Context';
export interface ModuleExports {
    [name: string]: any;
    _cxml: [Namespace];
}
/** Tuple: module exports object, list of imported type names */
export declare type ImportSpec = [ModuleExports, string[], string[]];
export declare class Namespace extends NamespaceBase<Context, Namespace> {
    init(importSpecList: ImportSpec[]): this;
    addType(spec: TypeSpec): void;
    addMember(spec: MemberSpec): void;
    typeByNum(num: number): TypeSpec;
    memberByNum(num: number): MemberSpec;
    link(): void;
    exportTypes(exports: ModuleExports): void;
    exportDocument(exports: ModuleExports): void;
    /** Get an internally used arbitrary prefix for fully qualified names
      * in this namespace. */
    getPrefix(): string;
    doc: TypeSpec;
    importSpecList: ImportSpec[];
    importNamespaceList: Namespace[];
    exportTypeNameList: string[];
    typeSpecList: TypeSpec[];
    memberSpecList: MemberSpec[];
    exportOffset: number;
    exportTypeTbl: {
        [name: string]: TypeSpec;
    };
    exportMemberTbl: {
        [name: string]: MemberSpec;
    };
}
