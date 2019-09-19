import * as React from 'react';
import { TuidUI, UqUI } from 'tonva';

export const webUserUI: TuidUI = {
    content: (values: any) => {
        let { firstName, salutation, organizationName, departmentName } = values;
        return <>
            <div className="mr-3"><strong>{firstName}</strong> <span className="small">{salutation}</span></div>
            <div className="small text-muted">{organizationName} &nbsp;{departmentName}</div>
        </>
    }
}

const uqUI: UqUI = {
    tuid: {
        webUser: webUserUI,
    }
}

export default uqUI;