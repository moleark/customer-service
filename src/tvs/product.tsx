import * as React from 'react';
import { tv } from 'tonva';
import { ProductImage } from 'tools/productImage';

export const tvProduct = (values: any) => {
    let product = values;
    let { brand, description, CAS, purity, molecularFomula, molecularWeight, origin, imageUrl } = product;
    return <div className="row d-flex">
        <div className="col-12">
            <div className="row py-2">
                <div className="col-12"><strong>{description}</strong></div>
            </div>
            <div className="row">
                <div className="col-3">
                    <ProductImage chemicalId={imageUrl} className="w-100" />
                </div>
                <div className="col-9">
                    <div className="row">
                        {item('CAS', CAS)}
                        {item('纯度', purity)}
                        {item('分子式', molecularFomula)}
                        {item('分子量', molecularWeight)}
                        {item('产品编号', origin)}
                        {tv(brand, (values: any) => <>{item("品牌", values.name)}</>)}
                    </div>
                </div>
            </div>
        </div>
    </div>
};

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}

function item(caption: string, value: any) {
    if (value === null || value === undefined) return null;
    return <>
        <div className="col-4 text-muted pr-0">{caption}:</div>
        <div className="col-8">{value}</div>
    </>;
}

const tvProductCategory = (values: any) => {
    let { children } = values;
    return <>
        aaa
    </>
};

export const product = {
    productx: tvProduct,
    packx: tvPackx,
    productCategory: tvProductCategory,
}
