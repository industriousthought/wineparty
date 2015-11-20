// page.jsx

import React from 'react';
import TopMenu from './topmenu';
import Dialog from './dialog';
import Alerts from './alerts';
import Data from './data';

class Page extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Dialog />
                <TopMenu />
                <Alerts />
            </div>
        )
    }
}

export default Page;
