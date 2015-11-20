import React from 'react';


class PickFriend extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div> <img src={this.props.img} />  {this.props.name} </div>
        )

    }

}


export default PickFriend;
