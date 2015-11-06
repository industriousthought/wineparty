// topmenu.jsx

import React from 'react';
import Menu from './menu';
import People from './peoplemenu';
import PartiesMenu from './partiesmenu';
import Wines from './winesmenu';

class TopMenu extends React.Component {
    render() {
        return <Menu items={{
            'People': () => { console.log('hello') } , 
            'Parties': <PartiesMenu parent={this.props.parent} showDialog={this.props.showDialog} />, 
            'Wines': this.props.showDialog.bind(this.props.parent, 'ratewine') 
        }}/>;
    }
}

export default TopMenu;
