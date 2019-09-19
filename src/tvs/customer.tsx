import * as React from 'react';
import { tv } from 'tonva';
import { tvAddress, tvCountry } from './common';

export const tvContact = (values: any) => {
    let { name, mobile, organizationName, address, addressString } = values;
    return <div className="flex-grow-1">
        <b>
            {name}
        </b>
        &nbsp; {mobile} &nbsp; {organizationName}<br />
        <small>{tv(address)} {addressString}</small>
    </div>
}

export const tvInvoiceType = (values: any) => {
    let { id, description } = values;
    return <div className="flex-grow-1">
        {description}
    </div>
}

export const tvInvoiceInfo = (values: any) => {
    let { title, taxNo } = values;
    return <div className="flex-grow-1">
        <b>
            {title}
        </b>
        &nbsp; {taxNo}
    </div>
}

export const customer = {
    contact: tvContact,
    address: tvAddress,
    country: tvCountry,
    province: tvCountry,
    city: tvCountry,
    county: tvCountry,
    invoiceInfo: tvInvoiceInfo,
    invoiceType: tvInvoiceType
}
