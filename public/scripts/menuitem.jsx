// menuitem.jsx

import React from 'react';

class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visibility: 'collapsed'};
    }
    clickItem() {
        if (this.props.clickEvent) this.props.clickEvent();
        if (this.props.submenu) {
            this.toggleSubmenu();
        }
    }
    toggleSubmenu() {
        if (this.state.visibility === 'collapsed') {
            this.setState({visibility: ''});
        } else {
            this.setState({visibility: 'collapsed'});
        }
    }
    render() {
        return (
            <li> 
                <span onClick={this.clickItem.bind(this)}>
                    {this.props.label}
                </span>
                    { (() => {
                        if (this.props.submenu) return (
                            <div className={'subContainer ' + this.state.visibility}>
                                {this.props.submenu}
                            </div>
                        );
                    }) () }
            </li>
        )
    }
}

export default MenuItem;
