import React, { Component, ReactNode } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

export interface ScrollbarComponentProps
{
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode | undefined;
}

export class ScrollbarComponent extends Component<ScrollbarComponentProps> {

    constructor(props : ScrollbarComponentProps | Readonly<ScrollbarComponentProps>) {
        super(props);
        this.state = { };
        this.renderThumb = this.renderThumb.bind(this);
    }

    renderThumb({ style, ...props } : { style: any, [key: string] : any}) {
        const thumbStyle = {
            width: '2px',
            backgroundColor: 'rgb(252, 189, 63)'
        };
        return (
            <div style={{ ...style, ...thumbStyle }}
                 {...props}/>
        );
    }
    
    render()
    {
        return (
            <Scrollbars style={this.props.style}
                renderThumbVertical={this.renderThumb}
                className={this.props.className}
                autoHide
                >
                {this.props.children}
            </Scrollbars>
        );
    }

}