
export interface Id {
    id: number;
}

export interface MainBrand extends Id {
    name: string;
}

export interface MainProduct extends Id {
    origin: string;
    description: string;
    descriptionC: string;
    brand: MainBrand;
    imageUrl: string;
}

export interface MainProductChemical extends MainProduct {

    chemical: number;
    CAS: string;
    purity: string;
    molecularFomula: string;
    molecularWeight: string;
    packs: Pack[];
}

export interface Pack extends Id {
    radiox: number;
    radioy: number;
    unit: string;
}