import * as React from 'react';

export const tvWebUser = (value: any) => {
    let { id, firstName, salutation, organizationName, departmentName } = value;
    let showName = firstName || id;
    let showOranization = organizationName || '【未填写单位名称】';
    return <>
        <div className="mr-3"><strong>{showName}</strong> <span className="small">{salutation}</span></div>
        <div className="small text-muted">{showOranization} &nbsp;{departmentName}</div>
    </>
}

export const webuser = {
    webuser: tvWebUser
}