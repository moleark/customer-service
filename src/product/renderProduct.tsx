import * as React from 'react';
import { tv } from 'tonva';
import { ProductImage } from 'tools/productImage';

export function renderProduct(product: any, index: number) {
    let { brand, description, descriptionC, CAS, purity, molecularFomula, molecularWeight, origin, imageUrl } = product;
    return <div className="d-block mb-4 px-2">
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
                    {productPropItem('纯度', purity)}
                    {productPropItem('分子式', molecularFomula)}
                    {productPropItem('分子量', molecularWeight)}
                    {productPropItem('产品编号', origin)}
                    {tv(brand, renderBrand)}
                </div>
            </div>
        </div>
    </div>
}

export function productPropItem(caption: string, value: any) {
    if (value === null || value === undefined) return null;
    return <>
        <div className="col-4 col-sm-2 col-lg-4 text-muted pr-0 small">{caption}</div>
        <div className="col-8 col-sm-4 col-lg-8">{value}</div>
    </>;
}

export function renderBrand(brand: any) {
    return productPropItem('品牌', brand.name);
}