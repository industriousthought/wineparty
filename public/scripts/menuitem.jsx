// menuitem.jsx

import React from 'react';

class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visibility: 'collapsed'};
    }
    render() {
        let clickItem = () => {
            if (this.props.clickEvent) this.props.clickEvent();
            if (this.props.submenu) {
                if (this.state.visibility === 'collapsed') {
                    this.setState({visibility: ''});
                } else {
                    this.setState({visibility: 'collapsed'});
                }
            }
        };
        return (
            <li> 
                <span onClick={clickItem}>
                    {this.props.label}
                </span>
                <div className={'subContainer ' + this.state.visibility}>
                    { (() => {
                        if (this.props.submenu) return this.props.submenu;
                    }) () }
                </div>
            </li>
        )
    }
}

export default MenuItem;
