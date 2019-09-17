import _ from 'lodash';
import { Tuid, Map } from 'tonva';
import { Loader } from 'tools/loader';
import { MainBrand, MainProductChemical } from './productModel';

export class LoaderBrand extends Loader<MainBrand> {

    protected async loadToData(brandId: number, data: MainBrand): Promise<void> {
        let brand = await this.cApp.uqs.product.Brand.load(brandId);
        data.id = brand.id;
        data.name = brand.name;
    }

    protected initData(): MainBrand {
        return {} as MainBrand;
    }
}

export class LoaderProductChemical extends Loader<MainProductChemical>{
    private productTuid: Tuid;
    private productChemicalMap: Map;

    protected async loadToData(productId: number, data: MainProductChemical): Promise<void> {
        let product = await this.productTuid.load(productId);
        _.merge(data, product);

        let brandLoader = new LoaderBrand(this.cApp);
        data.brand = await brandLoader.load(data.brand.id);

        let productChemical = await this.cApp.uqs.product.ProductChemical.obj({ product: productId });
        if (productChemical) {
            let { chemical, purity, CAS, molecularFomula, molecularWeight } = productChemical;
            data.chemical = chemical;
            data.purity = purity;
            data.CAS = CAS;
            data.molecularFomula = molecularFomula;
            data.molecularWeight = molecularWeight;
        }

        data.packs = [];
        product.packx.forEach(e => {
            // let { id, radiox, radioy, unit } = e;
            data.packs.push(e);
        });
    }

    protected initData(): MainProductChemical {
        return {} as MainProductChemical;
    }
}