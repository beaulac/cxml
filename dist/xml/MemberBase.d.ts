import { Item, ItemBase } from './Item';
/** Represents a child element or attribute. */
export declare class MemberBase<Member, Namespace, ItemContent extends ItemBase<Item<ItemContent>>> implements Item<ItemContent> {
    constructor(Item: {
        new (type: MemberBase<Member, Namespace, ItemContent>): ItemContent;
    }, name: string);
    define(): void;
    item: ItemContent;
    name: string;
    namespace: Namespace;
    safeName: string;
    isAbstract: boolean;
    isSubstituted: boolean;
    static abstractFlag: number;
    static substitutedFlag: number;
    static anyFlag: number;
}
