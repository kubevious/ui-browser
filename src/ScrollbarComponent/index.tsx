import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export class ScrollbarComponent extends Component {

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = { top: 0 };
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleUpdate(values) {
        const { top } = values;
        this.setState({ top });
    }

    renderThumb({ style, ...props }) {
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

    render() {
        return (
            <Scrollbars
                renderThumbHorizontal={this.renderThumb}
                renderThumbVertical={this.renderThumb}
                autoHide
                {...this.props}/>
        );
    }
}