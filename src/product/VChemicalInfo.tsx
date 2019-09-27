import * as React from 'react';
import { View } from 'tonva';
import { CProduct, productPropItem } from './CProduct';
import { observer } from 'mobx-react';

export class VChemicalInfo extends View<CProduct> {

    render(param: any): JSX.Element {
        let { id: productId } = param;
        let { controller } = this;
        controller.getChemicalInfo(productId);
        return <this.content productId={productId} />;
    }

    private content = observer((param: any) => {

        let { productId } = param;
        let { chemicalInfoContainer } = this.controller;
        let chemicalInfo = chemicalInfoContainer[productId];
        if (chemicalInfo !== undefined) {
            let { purity, CAS } = chemicalInfo;
            return <>
                {productPropItem('CAS', CAS)}
                {productPropItem('纯度', purity)}
            </>
        }
        return <></>;
    })
}
