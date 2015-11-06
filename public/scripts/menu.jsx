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
                        let submenu;
                        let clickEvent;
                        if (items[key].type && items[key].type.name ) {
                            submenu = items[key];
                        } else {
                            clickEvent = items[key];
                        }

                        let item = <MenuItem label={key} submenu={submenu} clickEvent={clickEvent} />;
                        
                        menu.push(item);
                    }
                    return menu;
                }) () }
            </ul>
        )
    }
}

export default Menu;
