// partyMenu.jsx

import React from 'react';
import Menu from './menu';

class WinesMenu extends React.Component {
    render() {
        return <Menu items={{'New Party': newParty }} />
    }
}

export default WinesMenu;
