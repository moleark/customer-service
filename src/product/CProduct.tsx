import * as React from 'react';
import { observable } from 'mobx';
import { tv, BoxId } from 'tonva';
import classNames from 'classnames';
import { CUqBase } from '../CBase';
import { ProductImage } from '../tools/productImage';
import { VCartProuductView } from './VProductView';
import { VChemicalInfo } from './VChemicalInfo';

/**
 *
 */
export class CProduct extends CUqBase {
    @observable chemicalInfoContainer: { [productId: number]: any } = {};

    protected async internalStart(param: any) {
    }

    renderChemicalInfo = (product: BoxId) => {
        return this.renderView(VChemicalInfo, product);
    }

    getChemicalInfo = async (productId: number) => {
        if (this.chemicalInfoContainer[productId] === undefined) {
            this.chemicalInfoContainer[productId] = await this.uqs.product.ProductChemical.obj({ product: productId });
        }
    }

    renderCartProduct = (product: BoxId) => {
        return this.renderView(VCartProuductView, product);
    }
}

export function renderBrand(brand: any) {
    return productPropItem('品牌', brand.name);
}

export function productPropItem(caption: string, value: any, captionClass?: string) {
    if (value === null || value === undefined || value === '0') return null;
    let capClass = captionClass ? classNames(captionClass) : classNames("text-muted");
    let valClass = captionClass ? classNames(captionClass) : "";
    return <>
        <div className={classNames("col-6 col-sm-2 pr-0 small", capClass)}> {caption}</div>
        <div className={classNames("col-6 col-sm-4", valClass)}>{value}</div>
    </>;
}

export function renderProduct(product: any) {
    let { brand, description, descriptionC, CAS, purity, molecularFomula, molecularWeight, origin, imageUrl } = product;
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
                    {productPropItem('CAS', CAS)}
                    {productPropItem('产品编号', origin)}
                    {productPropItem('纯度', purity)}
                    {productPropItem('分子式', molecularFomula)}
                    {productPropItem('分子量', molecularWeight)}
                    {tv(brand, renderBrand)}
                </div>
            </div>
        </div>
    </div>
}