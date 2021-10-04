import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

export interface ScrollbarComponentProps
{
    style?: React.CSSProperties;
    className?: string;
    disableHorizontal?: boolean;
}

export class ScrollbarComponent extends Component<ScrollbarComponentProps> {

    constructor(props : ScrollbarComponentProps | Readonly<ScrollbarComponentProps>) {
        super(props);
        this.state = { };
        this.renderThumb = this.renderThumb.bind(this);
        this.noopRenderTrack = this.noopRenderTrack.bind(this);
    }

    renderThumb({ style, ...props } : { style: any, [key: string] : any}) {
        const thumbStyle = {
            width: '2px',
            backgroundColor: 'rgb(252, 189, 63)'
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}/>
        );
    }

    noopRenderTrack({ style, ...props } : { style: any, [key: string] : any}) {
        return  <div {...props} style={{display: 'none'}} className="track-horizontal"/>
    }

    render()
    {
        return (
            <Scrollbars style={this.props.style}
                renderThumbVertical={this.renderThumb}
                renderTrackHorizontal={this.props.disableHorizontal ? this.noopRenderTrack : undefined}
                className={this.props.className}
                autoHide
                {...this.props}/>
        );
    }
}