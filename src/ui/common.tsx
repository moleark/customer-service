import * as React from 'react';
import { TuidUI, tv, UqUI } from 'tonva';

export const addressUI: TuidUI = {
    content: (values: any) => {
        let { country, province, city, county } = values;
        return <>
            {tv(country)}{tv(province, undefined, undefined, () => <></>)}{tv(city, undefined, undefined, () => <></>)}{tv(county, undefined, undefined, () => <></>)}
        </>
    }
}

export const countryUI: TuidUI = {
    content: (values: any) => {
        return <> {values.chineseName} </>;
    }
}

export const currencyUI: TuidUI = {
    content: (values: any) => {
        return <> {values.name} </>;
    }
}

const uqUI: UqUI = {
    tuid: {
        address: addressUI,
        country: countryUI,
        province: countryUI,
        city: countryUI,
        county: countryUI,
        currency: currencyUI,
    },
}

export default uqUI;
