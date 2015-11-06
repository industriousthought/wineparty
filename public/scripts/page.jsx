// page.jsx

import React from 'react';
import TopMenu from './topmenu';
import Dialog from './dialog';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {dialog: 'collapsed'};
    }
    render() {
        let hideDialog = () => {
            this.setState({dialog: 'collapsed'});
        };
        let showDialog = display => {
            let escapeHideDialog = e => {
                if (e.keyCode === 27) {
                    hideDialog();
                    window.removeEventListener('keydown', escapeHideDialog);
                }
            };
            window.addEventListener('keydown', escapeHideDialog);
            this.setState({dialog: 'expanded', dialogDisplay: display});
        };
        return (
            <div>
                <Dialog display={this.state.dialogDisplay} visibility={this.state.dialog} />
                <TopMenu parent={this} showDialog={showDialog} />
            </div>
        )
    }
}

export default Page;
