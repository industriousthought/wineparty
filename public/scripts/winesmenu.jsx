// partyMenu.jsx

import React from 'react';
import Menu from './menu';

class WinesMenu extends React.Component {
    render() {
        return <Menu items={{'New Party': () => { console.log('hello'); }  }} />
    }
}

export default WinesMenu;
