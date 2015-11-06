// partiesmenu.jsx

import React from 'react';
import Menu from './menu';

class PartiesMenu extends React.Component {
    render() {
        return <Menu items={{'New Party': this.props.showDialog.bind(this.props.parent, 'createparty')  }} />
    }
}

export default PartiesMenu;
