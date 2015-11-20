// topmenu.jsx

import React from 'react';
import MenuItem from './menuitem';
import Flux from './flux';

class TopMenu extends React.Component {
    constructor(props) {
        super(props);
        this.items = {
            'People': {
                sideEffect() { 
                    Flux.dispatch({
                        action: 'opendialog',
                        dialogName: 'peopledialog'
                    }); 
                },
                submenu: null
            },
            'Parties': {
                sideEffect: null,
                submenu: { 
                    'New Party': {
                        sideEffect() { 
                            Flux.dispatch({
                                action: 'opendialog',
                                dialogName: 'createparty'
                            }) 
                        },
                        submenu: null  
                    },
                    'Parties Coming Up' : {
                        sideEffect() {
                            Flux.dispatch({
                                action: 'opendialog',
                                dialogName: 'existingparties'
                            }) 
                        },
                        submenu: null  
                    },
                }
            },
            'Wines': {
                sideEffect() { 
                    Flux.dispatch({
                        action: 'opendialog',
                        dialogName: 'ratewine'
                    }) 
                },
                submenu: null
            },
        }
    }
    makeMenu(list) {
        let key;
        let menu = [];
        for (key in list) {
            menu.push( 
                <MenuItem 
                clickEvent={ list[key].sideEffect }
                submenu={ (() => { if (list[key].submenu) return this.makeMenu(list[key].submenu); }) () }
                label={key} 
                />
            )
        }

        return (
            <ul>
                {menu}
            </ul>
        );
    }
    render() {
        return this.makeMenu(this.items); 
    }
}

export default TopMenu;
