import _ from 'lodash';
import { Tuid, Map } from 'tonva';
import { Loader } from 'tools/loader';
import { MainBrand, MainProductChemical } from './productModel';
import { CCustomerServiceApp } from 'CCustomerServiceApp';

export class LoaderBrand extends Loader<MainBrand> {
    constructor(cApp: CCustomerServiceApp) {
        super(cApp);
        this.initEntities();
    }
    private brandTuid: Tuid;

    protected initEntities() {
        let { cUqProduct } = this.cApp;
        this.brandTuid = cUqProduct.tuid('brand');
    }

    protected async loadToData(brandId: number, data: MainBrand): Promise<void> {
        let brand = await this.brandTuid.load(brandId);
        data.id = brand.id;
        data.name = brand.name;
    }

    protected initData(): MainBrand {
        return {} as MainBrand;
    }
}

export class LoaderProductChemical extends Loader<MainProductChemical>{
    constructor(cApp: CCustomerServiceApp) {
        super(cApp);
        this.initEntities();
    }
    private productTuid: Tuid;
    private productChemicalMap: Map;

    protected initEntities() {
        let { cUqProduct } = this.cApp;
        this.productTuid = cUqProduct.tuid('productx');
        this.productChemicalMap = cUqProduct.map('productChemical');
    }

    protected async loadToData(productId: number, data: MainProductChemical): Promise<void> {
        let product = await this.productTuid.load(productId);
        _.merge(data, product);

        let brandLoader = new LoaderBrand(this.cApp);
        data.brand = await brandLoader.load(data.brand.id);

        let productChemical = await this.productChemicalMap.obj({ product: productId });
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