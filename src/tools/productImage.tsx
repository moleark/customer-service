import * as React from 'react';
import { Image } from 'tonva';

const imagePath = "http://www.jkchemical.com/static/Structure/";
const altimagePath = "http://www.jkchemical.com/static/Structure/999.png";
const pointProductImagePath = "https://www.jkchemical.com/static/images/pointshop";

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

export function PointProductImage(props: ProductImageProps) {
    let { style, className, chemicalId } = props;
    return <Image src={chemicalId && (pointProductImagePath + '/' + chemicalId + '.png')}
        style={style} className={className} altImage={altimagePath} />;
}