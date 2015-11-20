// alerts.jsx

import React from 'react';

class AlertItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <li className='alert'>
                {(() => {
                    switch (this.props.type) {

                        case 'invite': 
                            return (
                                <span>
                                    You've been invited to  {this.props.name}
                                    <br/> <a onClick={() => {console.log('clicked an alert!');}}> RSVP </a>
                                </span>
                            )
                            break;
                        case 'attending': 
                            return (
                                <span>
                                    You're now attending  {this.props.name}
                                    <br/> <a onClick={() => {console.log('clicked an alert!');}}> Register your wine </a>
                                </span>
                            )
                            break;

                    }
                })()}
            </li>
        )
    }
}
export default AlertItem;
