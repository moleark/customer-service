import * as React from 'react';
import { TuidUI, UqUI } from 'tonva';

export const webUserUI: TuidUI = {
    content: (values: any) => {
        let { id, firstName, lastName, gender, salutation, organizationName, departmentName,
            telephone, mobile, email } = values;
        return <>
            <div className="d-flex">
                <div className="mr-3"><strong>{firstName}</strong> <span className="small">{salutation}</span></div>
                <strong className="mr-3">{mobile}</strong>
                <strong className="mr-3">{telephone}</strong>
            </div>
            <div className="small text-muted">{organizationName} &nbsp;{departmentName} &nbsp;{email}</div>
        </>
    }
}

const uqUI: UqUI = {
    tuid: {
        webUser: webUserUI,
    }
}

export default uqUI;