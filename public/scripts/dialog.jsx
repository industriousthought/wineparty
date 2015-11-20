// dislog.jsx

import React from 'react';
import CreateParty from './createparty';
import RateWine from './ratewine';
import BringWine from './bringwine';
import ExistingParties from './existingparties';
import Flux from './flux';


class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: '',
            visibility: 'collapsed'
        };
        Flux.register('dialog', payload => {
            if (payload.action === 'opendialog') {
                this.showDialog(payload.dialogName);
            }
            if (payload.action === 'closedialog') {
                this.hideDialog();
            }
        });
        this.escapeHideDialog = e => {
            if (e.keyCode === 27) {
                this.hideDialog();
            }
        };
    }
    hideDialog() {
        this.setState({visibility: 'collapsed'});
        //window.removeEventListener('keydown', this.escapeHideDialog);
    }
    showDialog(display) {
        this.setState({visibility: 'expanded', display: display});
        //window.addEventListener('keydown', this.escapeHideDialog);
    }
    render() {
        let createParty = <CreateParty />;
        let rateWine = <RateWine />;
        let existingParties = <ExistingParties />;
        let bringWine = <BringWine />;
        return (
            <div className={'dialog ' + this.state.visibility}>
                <p className="closeDialog" onClick={this.hideDialog.bind(this)} > close </p>
                { ( () => {
                    switch (this.state.display) {
                        case 'createparty': 
                            return createParty;
                        case 'ratewine': 
                            return rateWine;
                        case 'existingparties': 
                            return existingParties;
                        case 'bringwine': 
                            return bringWine;
                    }
                } ) () }
            </div>

        )
    }
}

export default Dialog;
