import { CSub, CBase } from "tonva";
import { UQs } from "./uqs";

export abstract class CUqBase extends CBase {
    protected readonly uqs: UQs;
}

export abstract class CUqSub extends CSub {
    protected readonly uqs: UQs;
    protected readonly owner: CUqBase;
}
