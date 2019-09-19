import * as React from 'react';
import { Image } from 'tonva';

const imagePath = "http://www.jkchemical.com/static/Structure/";
const altimagePath = "http://www.jkchemical.com/static/Structure/999.png";

interface ProductImageProps {
    className?: string;
    style?: React.CSSProperties;
    chemicalId: string;
}

export function ProductImage(props: ProductImageProps) {

    let { style, className, chemicalId } = props;
    return <Image src={chemicalId && (imagePath + chemicalId.substr(0, 3) + '/' + chemicalId + '.png')}
        style={style} className={className} altImage={altimagePath} />;
}
