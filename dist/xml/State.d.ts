import { Namespace } from './Namespace';
import { Type, HandlerInstance } from './Type';
import { MemberRef } from './MemberRef';
/** Parser state created for each input tag. */
export declare class State {
    constructor(parent: State, memberRef: MemberRef, type: Type, item: HandlerInstance);
    /** Add a new xmlns prefix recognized inside current tag and its children. */
    addNamespace(short: string, namespace: Namespace): void;
    parent: State;
    /** Tag metadata in schema, defining name and occurrence count. */
    memberRef: MemberRef;
    /** Tag type in schema, defining attributes and children. */
    type: Type;
    /** Output object for contents of this tag. */
    item: HandlerInstance;
    /** Text content found inside the tag. */
    textList: string[];
    /** Recognized xmlns prefixes. */
    namespaceTbl: {
        [short: string]: [Namespace, string];
    };
}
