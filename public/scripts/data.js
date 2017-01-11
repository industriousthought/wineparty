import Flux from './flux';
import req from './req';

let parties = {};

const populatePartyList = res => {
    parties = JSON.parse(res.responseText);
    let ongoing = [];
    for (let key in parties) {
        parties[key] = JSON.parse(parties[key]);
        parties[key].forEach(party => {

            if (party.started) ongoing.push(party);
            party.wines.forEach(wine => {
                const getUserName = res => {
                    res = JSON.parse(res.responseText);
                    wine.userName = res.first_name;
                };
                req('https://graph.facebook.com/' + wine.uid + '?access_token=' + accessToken, getUserName, 'GET');
            });
        });
    }
    parties.ongoing = ongoing;
    
    dispatchParties();
};

window.getLocalParty = id => {
    let party;
    for (let key in parties) {
        parties[key].forEach(item => {
            if (id === item._id) party = item;
        });
    }
    return party;
};

const dispatchParties = () => {
    Flux.dispatch({
        action: 'populateParties',
    });
};

Flux.register('startPartyListener', payload => {
    if (payload.action === 'startparty') {
        const startParty = res => {
            res = JSON.parse(res.responseText);
            if (res.started) { 
                let party = getLocalParty(payload.id);
                party.started = res.started;
                dispatchParties();
            }
        };

        req('/parties/hosting/' + payload.id, startParty, 'POST');
    }
});

Flux.register('deleteWineListener', payload => {
    if (payload.action === 'deleteWine') {
        const deleteWine = res => {
            res = JSON.parse(res.responseText);
            if (res.status === true) { 
                let party = getLocalParty(payload.party);
                let index;
                party.wines.forEach((wine, i) => {
                    if (wine.id === payload.wine) index = i;
                });
                party.wines.splice(index, 1);
                dispatchParties();
            }
        };
        const params = 'wineId=' + payload.wine + 
            '&partyId=' + payload.party;
        req('/parties/deletewine/', deleteWine, 'POST', params, 'application/x-www-form-urlencoded');
    }
});

Flux.register('submtWineListener', payload => {
    if (payload.action === 'submitwine') {
        const submitWineReq = res => {
            res = JSON.parse(res.responseText);
            if (res.status === true) {
                getLocalParty(payload.partyId).wines.push(JSON.parse(res.wine));
                dispatchParties();
            }
        };
        const params = 'vintner=' + payload.vintner + 
            '&year=' + payload.year + 
            '&partyId=' + payload.partyId + 
            '&grape=' + payload.grape;
        req('/parties/attending/', submitWineReq, 'POST', params, 'application/x-www-form-urlencoded');
    }
});

Flux.register('createPartyListener', payload => {
    if (payload.action === 'createparty') {
        console.log(payload);
        const partyCreated = res => {
            res = JSON.parse(res.responseText);
            if (res.status === true) {
                parties.hosting.push(JSON.parse(res.party));
                dispatchParties();
            }
        };
        FB.ui({method: 'apprequests',
            message: 'YOUR_MESSAGE_HERE',
            to: payload.invites
        }, response => {
            const params = 'location=' + payload.location +
                '&invites=' + payload.invites +
                '&dateTime=' + payload.dateTime;
            req('/parties/', partyCreated, 'POST', params, 'application/x-www-form-urlencoded');
        });
    }
});

Flux.register('bringWineListener', payload => {
    if (payload.action === 'bringWine') {
        Flux.dispatch({
            action: 'opendialog',
            dialogName: 'bringwine',
            props: {
                id: payload.id,
                name: payload.name
            }
        });
    }
});

Flux.register('RSVPToParty', payload => {
    if (payload.action === 'RSVPToParty') {
        const RSVP = res => {
            if (JSON.parse(res.responseText).status === true) {
                let index, party;
                parties.invited.forEach((item, i) => {
                    if (item._id === payload.id) index = i;
                });
                party = parties.invited.splice(index, 1);
                parties.RSVP.push(party);
                Flux.dispatch({
                    action: 'populateInvited',
                    list: parties.invited
                });
                Flux.dispatch({
                    action: 'populateRSVP',
                    list: parties.RSVP
                });
            }
        };
        req('/parties/invited/' + payload.id, RSVP, 'POST');
    }
});

Flux.register('deleteParty', payload => {
    if (payload.action === 'deleteParty') {
        const deletePartyItem = res => {
            if (JSON.parse(res.responseText).status === true) {
                let index;
                parties.hosting.forEach((item, i) => {
                    if (item._id === payload.id) index = i;
                });
                parties.hosting.splice(index, 1);
                Flux.dispatch({
                    action: 'populateHosting',
                    list: parties.hosting
                });
            } else {
                console.log('failed to delete');
            }
        };
        req('/parties/delete/' + payload.id, deletePartyItem, 'POST');
    }
});

req('/parties/', populatePartyList, 'GET');

const getData = () => {
    return parties;
};

export default getData;
