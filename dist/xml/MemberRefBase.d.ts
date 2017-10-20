export declare class MemberRefBase<Member> {
    constructor(member: Member, min: number, max: number);
    member: Member;
    min: number;
    max: number;
    safeName: string;
    static optionalFlag: number;
    static arrayFlag: number;
}
