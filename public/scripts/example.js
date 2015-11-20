
var getReq = function(url, func, verb) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status === 200) {
                func(req);
            }
        }
    };
    req.open(verb, url);
    req.send();
};

var Dialog = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        var dialog = this.props.dialog;
        return (
            <ul className={this.props.style} id="dialog" className={this.props.style}>
                <li className={function() { return (dialog === 'createuser') ? 'visible' : 'hidden'}() }>
                    <CreateUser openDialog={this.props.openDialog} closeDialog={this.props.handleCloseDialog} />
                </li>
                <li className={function() { return (dialog === 'createparty') ? 'visible' : 'hidden'}() }>
                    <CreateParty getUid={this.props.getUid} openDialog={this.props.openDialog} closeDialog={this.props.handleCloseDialog} />
                </li>
            </ul>
        )
    }
});

var CreateParty = React.createClass({
    getInitialState: function() {
        return {'invitedFriends': [], 'noLocation': false, 'noGuest': false};
    },
    componentDidMount: function() {
        var dataList = document.createElement('datalist');
        dataList.id = 'userlist';
        document.getElementById('createparty').appendChild(dataList);

    },
    updateUserList: function(dataList) {
        var id = this.props.getUid();
        var update = function(req) { 
            var friends = req.responseText.split(',');
            while (dataList.firstChild) { 
                dataList.removeChild(dataList.firstChild);
            }
            friends.map(function(item, index) {
                dataList.appendChild(new Option(item, item));
            });
        };

        getReq('/friends/' + id, update, 'GET'); 
    },
    handleCreateButton: function(e) {
        e.preventDefault();
        if (this.refs.location.getDOMNode().value.trim() !== '' && document.getElementById('invitedfriends').firstChild) {
            this.setState({'noLocation': false});
            getReq('/parties', this.tryCreateParty, 'POST');
        } else {
            if (this.refs.location.getDOMNode().value.trim() === '') {
                this.setState({'noLocation': true});
            } else {
                this.setState({'noLocation': false});
            }
            if (!document.getElementById('invitedfriends').firstChild) {
                this.setState({'noGuest': true});
            } else {
                this.setState({'noGuest': false});
            }
                
        }

        //this.setState({'location': this.refs.location.getDOMNode().value.trim()});

    },
    tryCreateParty: function(req) {

    },
    addInvite: function(guestField) {
        var friend = guestField.getDOMNode().value.trim();
        this.setState({'invitedFriends': this.state.invitedFriends.concat(friend)});
    },
    render: function() {
        var populateFriends = (function(res) {
            this.setState({'friendList': JSON.parse(res.responseText).data});
        }).bind(this);

        getReq('https://graph.facebook.com/' + uid + '/invitable_friends?access_token=' + accessToken, populateFriends, 'GET');
        return (
            <div>
                

                <p>Create a new party</p>
                
                <form id="createparty" list="userlist" onSubmit={this.handleCreateButton}>

                { (function(noLocation) {
                    if (noLocation) {
                        return <p>You must enter a location for your party!</p>
                    }

                }).bind(null, this.state.noLocation) () }

                <p>Locations</p>
                <input type="text" ref="location" />

                <p>Invites</p>
                { (function(noGuest) {
                    if (noGuest) {
                        return <p>You must invited someone to your party!</p>
                    }

                }).bind(null, this.state.noGuest) () }
                

                <ol>
                    { (function(friends) {
                        //console.log(friends);
                        if (friends) {
                            return friends.map(function(item) {
                                return <li> <PickFriend name={item.name} img={item.picture.data.url} /> </li>
                            });
                        }
                    }).bind(null, this.state.friendList) () }
                </ol>

                <input type="submit" value="Create Party" />

                </form> 
            </div>
        )
    }
});

var PickFriend = React.createClass({
    getInitialState: function() {
        return {'selected': ''};
    },
    toggleSelected: function() {
        if (this.state.selected) {
            this.setState({'selected': ''});
        } else {
            this.setState({'selected': 'selected'});
        }
    },
    render: function() {

        return (
            <div className={this.state.selected}>
                <a onClick={ this.toggleSelected }><img src={this.props.img} />  {this.props.name} </a>
            </div>
        )

    }

});


var CreateUser = React.createClass({
    getInitialState: function() {
        return {'userExists': false};
    },
     handleNewUserSubmit: function(e) {
        e.preventDefault();
        var newUser = '/users/' + this.refs.newUser.getDOMNode().value.trim();
        getReq(newUser, this.tryNewUser, 'POST');
    },
    tryNewUser: function(req) {
        var id = JSON.parse(req.responseText).status;
        if (id !== 'fail') {
            this.props.closeDialog();
        } else {
            this.setState({'userExists': true});
        }
    },
    render: function() {
        var userExists = this.state.userExists;
        return (
            <div>
                { (function() {
                    if (userExists) {
                        return <p>User Exists! Try a different login!</p>
                    }
                })() }
                <p>Creat a new user!</p>
                <form onSubmit={this.handleNewUserSubmit}>

                <input type="text" ref="newUser" />

                <input type="submit" value="Post" />
                </form> 
            </div>

        )
    }
});


var ScrollList = React.createClass({
    render: function() {
        return (
            <div>
                <ul className="scrollList">

                    { this.props.list.map(function(item, index) {

                        return <li key={index} className="listItem droplist"> {item} </li>;

                    } ) }

                </ul>
            </div>
        )
    }
});

var ViewMenu = React.createClass({
    render: function() {
        var buttons = ['People', 'Parties', 'Wines'];
        var menuButtonPress = this.props.menuButtonPress;
        var focus = this.props.focus;
        return (
            <div>
                <ul>
                    { buttons.map(function(name, index) {

                        var style = 'droplist';

                        if (focus === index) {
                            style += ' focusButton';
                        }

                        return <li key={index} className={style} onClick={ menuButtonPress.bind(null, index) }> {name} </li>

                    })  }

                </ul>

            </div>
        );
    }
});

var Wines = React.createClass({
    getInitialState: function() {
        return {'list': [<div onClick={this.handleTakeNote}> Take notes on a wine </div>]};
    },
    handleTakeNote: function() {
        this.setState({'list' : this.state.list.concat( <div> Took a new note on a wine! </div> )});
    },
    render: function() {
        return (
            <ScrollList list={this.state.list} />
        );
    }
});

var Parties = React.createClass({
    getInitialState: function() {
        return {'list': []};
    },
    componentDidMount: function() {
        var openDialog = this.props.openDialog;
        this.setState({'list': [<div onClick={ openDialog.bind(null, 'createparty') }> Host a Party </div>]});
    },
    render: function() {
        return (
            <ScrollList list={this.state.list} />
        );
    }
});

var People = React.createClass({
    getInitialState: function() {
        //var getReq()
        return {'list': [<div onClick={this.handleFriendSearch}> Search for friends </div>]};
    },
    handleFriendSearch: function() {
        this.setState({'list' : this.state.list.concat( <div> Added a friend! </div> )});
    },
    render: function() {
        return (
            <ScrollList list={this.state.list} />
        );
    }
});

var Views = React.createClass({
    render: function() {
        var focus = this.props.focus;
        return (
            <div>
                <ul>
                    <li className={(function() { return (focus === 0) ? 'view' : 'hidden' } )() }>
                        <People/>
                    </li>
                    <li className={(function() { return (focus === 1) ? 'view' : 'hidden' } )() }>
                        <Parties openDialog={this.props.openDialog} />
                    </li>
                    <li className={(function() { return (focus === 2) ? 'view' : 'hidden' } )() }>
                        <Wines/>
                    </li>
                </ul>
            </div>
        );
    }
});

var Page = React.createClass({
    getInitialState: function() {
        return {'focus': 0, 'dialog': null, id: uid};
    },
    menuButtonPress: function(index) {
        this.setState({'focus': index});
    },
    componentDidMount: function() {
    },
    handleOpenDialog: function(dialog) {
        this.setState({'dialog': dialog});
        var handleEvent = this.handleCloseDialog;
        var closeDialog = function(e) {
            if (e.keyCode === 27) {
                handleEvent();
                window.removeEventListener('keydown', closeDialog);
            }
        };

        window.addEventListener('keydown', closeDialog);
    },
    handleCloseDialog: function() {
        this.setState({'dialog': null});
    },
    getUid: function() {
        return this.state.id;
    },
    render: function() {
        var pageStyle = "";
        var dialogStyle = "hidden";
        if (this.state.dialog) {
            pageStyle = "faded";
            dialogStyle = "";
        }
        return (
            <div>
                <Dialog openDialog={this.handleOpenDialog} handleCloseDialog={this.handleCloseDialog} style={dialogStyle} dialog={this.state.dialog} getUid={this.getUid} />
                <div className={pageStyle} id="page">
                    <h1 id="title">Wineparty</h1>
                    <ViewMenu menuButtonPress={this.menuButtonPress} focus={this.state.focus}/>
                    <Views openDialog={this.handleOpenDialog} focus={this.state.focus} uid={this.state.uid}/>
                </div>
            </div>
        );
    }
});

React.render(
    <Page />,
    document.getElementById('content')
);

