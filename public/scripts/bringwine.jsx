// dislog.jsx

import React from 'react';
import Flux from './flux';


class BringWine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }
    submitWine(e) {
        e.preventDefault();
        Flux.dispatch({
            action: 'submitwine',
            partyId: this.props.id,
            vintner: this.refs.vintner.getDOMNode().value.trim(),
            year: this.refs.year.getDOMNode().value.trim(),
            grape: this.refs.grape.getDOMNode().value.trim()
        });
    }
    render() {
        return (
            <div className='innerDialog'>
            {console.log(this.props)}
                <h1>Brian a wine to: {this.props.name} </h1>

                <form onSubmit={this.submitWine.bind(this)} >
                    Vinter <br />
                    <input ref="vintner" type="text" /> <br />
                    Year <br />
                    <input ref="year" type="text" /> <br />
                    Grape <br />
                    <input ref="grape" type="text" /> <br />
                    <input type="submit" value="Save Wine!" />
                </form>

            </div>

        )
    }
}

export default BringWine;
