let intervalVPChange = null
let vpChangeSpeed = 200

function updateVP(type, change) {
    if (type == 'steem') {
        var currentPercent = UserSettings.get('voteWeightSteem')
        var nextPercent = currentPercent+change
        if (nextPercent>100) nextPercent = 100
        if (nextPercent<1) nextPercent = 1
        UserSettings.set('voteWeightSteem', nextPercent)
    } else {
        var currentPercent = UserSettings.get('voteWeight')
        var nextPercent = currentPercent+change
        if (nextPercent>100) nextPercent = 100
        if (nextPercent<1) nextPercent = 1
        UserSettings.set('voteWeight', nextPercent)
    }
    if (nextPercent != 1 && nextPercent != 100) {
        clearTimeout(intervalVPChange)
        intervalVPChange = setTimeout(function() {
            if (vpChangeSpeed > 50)
            vpChangeSpeed = 0.90*vpChangeSpeed
            updateVP(type, change)
        }, vpChangeSpeed)
    }
}

Template.accountsdropdown.rendered = () => {
    $('.dropdownaccounts').dropdown({
        action: (text,value,e) => {
            if ($(e).hasClass('logOut') && $(e).hasClass('logOutAvalon'))
                Users.remove({username: Session.get('activeUsername'), network: 'avalon'}, () => Session.set('activeUsername', null))
            else if ($(e).hasClass('logOut') && $(e).hasClass('logOutSteem'))
                Users.remove({username: Session.get('activeUsernameSteem'), network: 'steem'}, () => Session.set('activeUsernameSteem', null))
        }
    })

    $('#dtcSwitch').prop('checked',!Session.get('isDTCDisabled'))
    $('#steemSwitch').prop('checked',!Session.get('isSteemDisabled'))

    $('.dtcSwitch').checkbox().first().checkbox({
        onChecked: () => {
            Session.set('isDTCDisabled', true)
        },
        onUnchecked: () => {
            Session.set('isDTCDisabled', false)
        }
    })

    $('.steemSwitch').checkbox().first().checkbox({
        onChecked: () => {
            Session.set('isSteemDisabled', true)
        },
        onUnchecked: () => {
            Session.set('isSteemDisabled', false)
        }
    })
}

Template.accountsdropdown.helpers({
    incompleteLogin: () => {
        if (!Session.get('activeUsernameSteem') || !Session.get('activeUsername')) return true
        else return false
    },
    mainUser: function() {
        return Users.findOne({username: Session.get('activeUsername')})
    },
    mainUserSteem: function() {
        return Users.findOne({username: Session.get('activeUsernameSteem')})
    },
    topbarAvatarUrl: () => {
        if (Session.get('activeUsername')) return 'https://image.d.tube/u/' + Session.get('activeUsername') + '/avatar'
        else if (Session.get('activeUsernameSteem')) return 'https://steemitimages.com/u/' + Session.get('activeUsernameSteem') + '/avatar'
        else return 'https://image.d.tube/u/null/avatar'
    },
    topbarUsername: () => {
        if (Session.get('activeUsername')) return Session.get('activeUsername')
        else if (Session.get('activeUsernameSteem')) return Session.get('activeUsernameSteem')
        else return ''
    },
    voteWeight: () => {
        return UserSettings.get('voteWeight');
    },
    voteWeightSteem: () => {
        return UserSettings.get('voteWeightSteem')
    }
})

Template.accountsdropdown.events({
    'mousedown #minus1vp': function() {
        updateVP('dtc', -1)
    },
    'mousedown #plus1vp': function() {
        updateVP('dtc', 1)
    },
    'mousedown #minus1vpsteem': function() {
        updateVP('steem', -1)
    },
    'mousedown #plus1vpsteem': function() {
        updateVP('steem', 1)
    },
    'touchstart #minus1vp': function() {
        updateVP('dtc', -1)
    },
    'touchstart #plus1vp': function() {
        updateVP('dtc', 1)
    },
    'touchstart #minus1vpsteem': function() {
        updateVP('steem', -1)
    },
    'touchstart #plus1vpsteem': function() {
        updateVP('steem', 1)
    },
    'mouseup #minus1vp, mouseup #plus1vp, mouseup #minus1vpsteem, mouseup #plus1vpsteem': function() {
        clearTimeout(intervalVPChange)
        vpChangeSpeed = 200
    },
    'touchend #minus1vp, touchend #plus1vp, touchend #minus1vpsteem, touchend #plus1vpsteem': function() {
        clearTimeout(intervalVPChange)
        vpChangeSpeed = 200
    }
})