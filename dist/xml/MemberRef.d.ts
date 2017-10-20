import { Namespace } from './Namespace';
import { MemberSpec } from './Member';
import { MemberRefBase } from './MemberRefBase';
/** Tuple: member ID, flags, name */
export declare type RawRefSpec = [number | MemberSpec, number, string];
export declare class MemberRef extends MemberRefBase<MemberSpec> {
    constructor(spec: RawRefSpec, namespace: Namespace, proxy?: MemberRef);
    proxy: MemberRef;
}
