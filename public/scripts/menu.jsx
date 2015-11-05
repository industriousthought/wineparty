// menu.jsx

import React from 'react';
import MenuItem from './menuitem';

class Menu extends React.Component {
    render() {
        return (
            <ul>
                { (() => {
                    let key;
                    let menu = [];
                    let items = this.props.items;
                    for (key in items) {
                        let submenu = (items[key].render )? items[key] : null;
                        let item = <MenuItem label={key} submenu={submenu} />;
                        
                        menu.push(item);
                    }
                    return menu;
                }) () }
            </ul>
        )
    }
}

export default Menu;
