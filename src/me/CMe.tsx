import * as React from 'react';
import { VMe } from './VMe';
import { CUqBase } from 'CBase';

export class CMe extends CUqBase {

    async internalStart(param?: any) {

    }

    private renderMe = () => {
        return this.renderView(VMe);
    }

    tab = () => <this.renderMe />
}
