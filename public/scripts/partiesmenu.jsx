// partyMenu.jsx

import React from 'react';
import Menu from './menu';

class PartiesMenu extends React.Component {
    render() {
        return <Menu items={{'New Party': () => {console.log('new party')}  }} />
    }
}

export default PartiesMenu;
