import * as React from 'react';

export const invoiceTypeUI = {
    content: (values: any) => {
        let { id, description } = values;
        return <div className="flex-grow-1">
            {description}
        </div>
    }
}


export const invoiceInfoUI = {
    content: (values: any) => {
        let { title, taxNo } = values;
        return <div className="flex-grow-1">
            <b>
                {title}
            </b>
            &nbsp; {taxNo}
        </div>
    }
}
