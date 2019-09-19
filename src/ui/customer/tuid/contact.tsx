import * as React from 'react';
import { tv } from 'tonva';

export const contactUI = {
    content: (values: any) => {
        let { name, mobile, organizationName, address, addressString } = values;
        return <div className="flex-grow-1">
            <b>
                {name}
            </b>
            &nbsp; {mobile} &nbsp; {organizationName}<br />
            <small>{tv(address)} {addressString}</small>
        </div>
    }
}
