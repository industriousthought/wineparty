// dislog.jsx

import React from 'react';
import DateTime from 'react-datetimepicker';
import PickFriend from './pickfriend';
import Flux from './flux';
import req from './req';
import moment from 'moment';
window.req = req;

class CreateParty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pickedFriends: [],
            friendList: [],
            dateTime: ''
        };
        const populateFriends = res => {
            console.log(res);
            this.setState({ friendList: this.state.friendList.concat(JSON.parse(res.responseText).data) });
            window.data = this.state.friendList;
        };
        req('https://graph.facebook.com/' + uid + '/friends?access_token=' + accessToken, populateFriends, 'GET');
        req('https://graph.facebook.com/' + uid + '/invitable_friends?access_token=' + accessToken, populateFriends, 'GET');
        

    }
    toggleFriend(id) {
        const index = this.state.pickedFriends.indexOf(id);
        if (index >= 0) {
            this.setState(state => { pickedFriends: state.pickedFriends.splice(index, 1) })
        } else {
            this.setState(state => { pickedFriends: state.pickedFriends.push(id) })
        }
        window.picked = this.state.pickedFriends;
    }
    tryCreateParty(e) {
        e.preventDefault();
        Flux.dispatch({
            action: 'createparty',
            location: this.refs.location.getDOMNode().value.trim(),
            invites: this.state.pickedFriends.toString(),
            dateTime: this.state.dateTime
        });
    }
    render() {
        return (
            <div className='innerDialog'>
                <h2>Create a party!</h2>
                <form onSubmit={this.tryCreateParty.bind(this)}>
                    <DateTime 
                        onChange={(dateTime => {this.setState({dateTime: dateTime}); }).bind(this)} 
                        />
                    <input type="text" ref="location" />
                    <input type="submit" value="Create Party" />
                </form>
                <ul>
                    { (() => {
                        if (this.state.friendList,length > 0) {
                            return this.state.friendList.map(item => {
                                return <li 
                                    className={(() => { return (this.state.pickedFriends.indexOf(item.id) >= 0) ? 'pickedFriend friendItem' : 'friendItem'; } )()} 
                                    onClick={() => {this.toggleFriend(item.id);}} > 
                                        <PickFriend name={item.name} img={(() => { if (item.picture) { return item.picture.data.url} else { return 'https://graph.facebook.com/' + item.id + '/picture'} })()} /> 
                                    </li>
                            });
                        }
                    }) () }
                </ul>
            </div>

        )
    }
}

export default CreateParty;
