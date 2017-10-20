import { NamespaceBase } from './NamespaceBase';
/** XML parser context, holding definitions of all imported namespaces. */
export declare class ContextBase<Context extends ContextBase<Context, Namespace>, Namespace extends NamespaceBase<Context, Namespace>> {
    constructor(NamespaceType: {
        new (name: string, id: number, context: Context): Namespace;
    });
    getNamespace(name: string): Namespace;
    /** Create or look up a namespace by name in URI (URL or URN) format. */
    registerNamespace(name: string): Namespace;
    copyNamespace(other: NamespaceBase<any, any>): Namespace;
    /** Look up namespace by internal numeric surrogate key. */
    namespaceById(id: number): Namespace;
    /** Constructor for namespaces in this context. */
    private NamespaceType;
    /** Next available numeric surrogate key for new namespaces. */
    private namespaceKeyNext;
    /** List of namespaces indexed by a numeric surrogate key. */
    protected namespaceList: Namespace[];
    /** Table of namespaces by name in URI format (URL or URN).  */
    private namespaceNameTbl;
}
