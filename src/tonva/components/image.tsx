import * as React from 'react';
import classNames from 'classnames';
import { nav } from './nav';

export interface ImageProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
    altImage?: string;
}

export function Image(props: ImageProps) {
    let {className, style, src, altImage} = props;
    if (!src) {
        return <div className={classNames(className, 'image-none')} style={style}>
            <i className="fa fa-file-o" />
        </div>;
    }
    if (src.startsWith(':') === true) {
        src = nav.resUrl + src.substr(1);
    }
    return <img src={src} className={className} alt="img"
        style={style}
        onError={evt=>{
            if (altImage) evt.currentTarget.src=altImage;
            else evt.currentTarget.src = 'https://tv.jkchemical.com/imgs/0001.png';
        }} />;
}
