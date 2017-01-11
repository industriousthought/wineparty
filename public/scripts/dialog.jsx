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
            visibility: 'collapsed',
            dialogProps: {}
        };
        Flux.register('dialog', payload => {
            if (payload.action === 'opendialog') {
                this.showDialog(payload.dialogName, payload.props);
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
    showDialog(display, props) {
        this.setState({visibility: 'expanded', display: display, dialogProps: props});
        //window.addEventListener('keydown', this.escapeHideDialog);
    }
    render() {
        return (
            <div className={'dialog ' + this.state.visibility}>
                <p className="closeDialog" onClick={this.hideDialog.bind(this)} > close </p>
                { ( () => {
                    switch (this.state.display) {
                        case 'ongoingparty':
                            return <OngoingParty id={this.state.dialogProps.id} />;
                        case 'createparty': 
                            return <CreateParty />;
                        case 'ratewine': 
                            return <RateWine />;
                        case 'existingparties': 
                            return <ExistingParties />;
                        case 'bringwine': 
                            return <BringWine id={this.state.dialogProps.id} name={this.state.dialogProps.name} />;

                    }
                } ) () }
            </div>

        )
    }
}

export default Dialog;
