// menu.jsx

import React from 'react';

class MenuItem extends React.Component {
    render() {
        return (
            <li>
                {this.props.label}
                <div>
                    { (() => {
                        if (this.props.submenu) return this.props.submenu;
                    }) () }
                </div>
            </li>
        )
    }
}

export default MenuItem;
