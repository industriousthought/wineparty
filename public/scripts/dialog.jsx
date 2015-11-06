// dislog.jsx

import React from 'react';
import CreateParty from './createparty';
import RateWine from './ratewine';


class Dialog extends React.Component {
    render() {
        let createParty = <CreateParty />;
        let rateWine = <RateWine />;
        return (
            <div className={'dialog ' + this.props.visibility}>
                { ( () => {
                    console.log('display value: ', this.props.display);
                    switch (this.props.display) {
                        case 'createparty': 
                            console.log('oarty!');
                            return createParty;
                        case 'ratewine': 
                            return rateWine;
                    }
                } ) () }
            </div>

        )
    }
}

export default Dialog;
