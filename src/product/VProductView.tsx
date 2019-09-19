import * as React from 'react';
import { View, tv } from 'tonva';
import { CProduct, productPropItem, renderBrand } from './CProduct';
import { ProductImage } from 'tools/productImage';

export class VCartProuductView extends View<CProduct> {

    render(param: any): JSX.Element {
        return <>{tv(param, this.renderCartProduct)}</>;
    }


    private renderCartProduct = (product: any) => {
        let { id, brand, description, descriptionC, origin, imageUrl } = product;

        return <div className="row d-flex mb-3 px-2">
            <div className="col-12">
                <div className="py-2">
                    <strong>{description}</strong>
                </div>
                <div className="pb-2">
                    <strong>{descriptionC}</strong>
                </div>
                <div className="row">
                    <div className="col-3">
                        <ProductImage chemicalId={imageUrl} className="w-4c h-4c" />
                    </div>
                    <div className="col-9">
                        <div className="row">
                            {this.controller.renderChemicalInfo(product)}
                            {productPropItem('编号', origin)}
                            {tv(brand, renderBrand)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    };
}


export class VProuductView extends View<CProduct> {

    render(param: any): JSX.Element {
        return <>{tv(param, this.renderProduct)}</>;
    }

    private renderProduct = (product: any) => {
        let { brand, description, descriptionC, origin, imageUrl } = product;
        return <div className="d-block mb-4 px-3">
            <div className="py-2">
                <div><strong>{description}</strong></div>
                <div>{descriptionC}</div>
            </div>
            <div className="row">
                <div className="col-3">
                    <ProductImage chemicalId={imageUrl} className="w-100" />
                </div>
                <div className="col-9">
                    <div className="row">
                        {productPropItem('产品编号', origin)}
                        {tv(brand, renderBrand)}
                        {this.controller.renderChemicalInfo(product)}
                    </div>
                </div>
            </div>
        </div>
    }
}
