// menu.jsx

import React from 'react';
import Menu from './menu';
import People from './peoplemenu';
import Parties from './partiesmenu';
import Wines from './winesmenu';

class TopMenu extends React.Component {
    render() {
        return <Menu items={{'People': () => { console.log('hello') } , 'Parties': new Parties (), 'Wines': () => { console.log('hello') }}}/>;
    }
}

export default TopMenu;
