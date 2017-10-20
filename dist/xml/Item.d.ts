/** Type or member. */
export interface Item<ItemContent> {
    define(): void;
    item: ItemContent;
}
/** Type and member dependency helper. Implements Kahn's topological sort.
  * Member instead of parent class of both, due to TypeScript limitations
  * (cannot extend a class given as a generic parameter). */
export declare class ItemBase<Type extends Item<ItemBase<Type>>> {
    /** @param type Type or member instance containing this helper. */
    constructor(type: Type);
    /** Set parent type or substituted member. */
    setParent(parent: Type): void;
    /** Topological sort visitor. */
    define(): void;
    /** Type or member. */
    type: Type;
    /** Number of parent type or substituted member. */
    parentNum: number;
    /** Parent type or substituted member. */
    parent: Type;
    /** Track dependents for Kahn's topological sort algorithm. */
    private dependentList;
    /** Visited flag for topological sort. */
    defined: boolean;
}
