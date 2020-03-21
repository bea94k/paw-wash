import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactNotifications from 'react-browser-notifications'
import fileDownload from 'js-file-download';
import papa from 'papaparse'
import PropTypes from 'prop-types'
import moment from 'moment'
import * as R from 'ramda'

import { addEntry, addUser, deleteUser, deleteEntry, changeReminderInterval, purgeLog } from '../redux/washLog'

moment.updateLocale('en', {
    relativeTime : {
        future: 'in %s',
        past:   'was %s ago',
        s  : '%d seconds',
        ss : '%d seconds',
        m:  'a minute',
        mm: '%d minutes',
        h:  'an hour',
        hh: '%d hours',
        d:  'a day',
        dd: '%d days',
        M:  'a month',
        MM: '%d months',
        y:  'a year',
        yy: '%d years'
    }
})

class WashList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            now: moment(),
            username: '',
            deleteUser: '',
            lastNotification: moment(),
            selectedUser: 0,
            error: '',
            play: false,
            audio: new Audio('/sounds/when.mp3')
        }
        this.state.audio.addEventListener('ended', () => this.setState({ play: false }))
        setInterval(this.setNewTime, 5000) // call the new time regularly
    }
    
    setNewTime = () => {
        this.setState({ now: moment() });
    }

    togglePlay = () => { // play sound
        if (!this.state.play) {
            this.setState({ play: !this.state.play }, () => {
                this.state.play ? this.state.audio.play() : this.state.audio.pause()
            })
        }
    }

    showNotifications() {
        this.togglePlay()
        if(this.n.supported()) this.n.show()
    }

    handleClick(event) { // handle the notification click
        window.focus() // change to the tab if somewhere else
        this.n.close(event.target.tag); // close the notification
    }

    newWash(userIndex) {
        this.props.addEntry(userIndex)
    }

    newUser(username) {
        this.props.addUser(username)
    }

    download() {
        let { log } = this.props
        let trimmedLog = log.map(entry => R.pick(['username', 'time'], entry))
        fileDownload(papa.unparse(trimmedLog), moment().format('YYYY-MM-DD') + '-wash-log.csv')
    }

    changeUser() {
        let { users } = this.props // get the current users list
        let selected = this.state.selectedUser // get the current selected user index
        selected++ // increment the index by one
        if (users[selected] !== undefined) { // the index has a user in it
            this.setState({ selectedUser: selected }) // select that as the user
        } else {
            this.setState({ selectedUser: 0 }) // otherwise, start from the first index
        }
    }

    changeInterval(interval) {
        if (interval > 86400000) {
            this.setState({error: 'Wash your hands at least once per day'})
        } else if (interval < 60000) {
            this.setState({error: 'You are washing your hands too much and wasting water'})
        } else {
            this.setState({error: ''})
            this.props.changeReminderInterval(interval)
        }
    }

    // The componentDidUpdate method is called after the component is updated in the DOM.
    componentDidUpdate() {
        let interval = moment.duration(this.props.reminderInterval)
        if (moment(this.state.lastNotification).add(interval).isBefore(this.state.now)) {
            this.showNotifications() // show notification at specified intervals
            this.setState({ lastNotification: moment() })
        }
    }

    render() {
        let { log, users, reminderInterval, purgeLog } = this.props
        let interval = moment.duration(reminderInterval)

        return (
            <div>
                <ReactNotifications
                    onRef={ref => (this.n = ref)} // Required
                    title="PaWash Reminder" // Required
                    body={'Time to wash hands!'}
                    icon="/logo192.png"
                    tag="hands"
                    timeout="5000"
                    onClick={(event) => this.handleClick(event)}
                />
                
                <h1>Main Page</h1>
                <p>Currently giving reminders every {interval.hours()} hours and {interval.minutes()} minutes </p>
                
                <button onClick={() => this.newWash(this.state.selectedUser)}>{users[this.state.selectedUser]} washed hands. Press the button with your elbow</button>
                <button onClick={() => this.changeUser()}>Not you? Change worker</button> 

                <h2>Last washes</h2>
                {
                    users.map(user => {
                        let entry = R.findLast(R.propEq('username', user))(log)
                        let lastWash = 'no washes yet'
                        let nextWash = 'wash your hands now!'
                        if (entry) {
                            lastWash = `last wash at ${moment(entry.time).from(this.state.now)}`
                            nextWash = `next wash ${moment(entry.time).add(interval).from(this.state.now)}`
                        }
                        return <p key={user}>{user} - { lastWash } - { nextWash }</p>
                    })
                }

                <h2>Log</h2>
                {
                    log.map(entry => {
                        return <p key={entry.id}>{entry.username} washed hands at {entry.time} <button onClick={() => this.props.deleteEntry(entry.id)}>Delete</button></p>
                    })
                }

                <button onClick={() => this.download()}>Download Log</button> 
                <button onClick={() => purgeLog()}>PURGE LOG</button> 
                <h2>Users</h2>
                {
                    users.map(user => {
                        return <p key={user}>{user}</p>
                    })
                }

                <h2>Settings</h2>

                <p>Reminder interval</p>
                <input id='reminderInterval' onChange={(e) => this.changeInterval(e.target.value)} />ms
                <p>{this.state.error}</p>
                
                <br/><br/>

                <input id='username' onChange={(e) => this.setState({username: e.target.value})} />
                <button onClick={() => this.newUser(this.state.username)}>Add User</button> 

                <br/><br/>

                <input id='deleteUser' onChange={(e) => this.setState({deleteUser: e.target.value})} />
                <button onClick={() => this.props.deleteUser(this.state.deleteUser)}>Delete User</button>
            </div>
        )
    }
}

WashList.propTypes = {
    log: PropTypes.array,
    users: PropTypes.array,
    reminderInterval: PropTypes.number,
    addEntry: PropTypes.func,
    addUser: PropTypes.func,
    deleteUser: PropTypes.func,
    deleteEntry: PropTypes.func,
    changeReminderInterval: PropTypes.func,
    purgeLog: PropTypes.func
}

export default connect(
    (state) => ({
        log: state.log,
        users: state.users,
        reminderInterval: state.reminderInterval,
    }),
    { addEntry, addUser, deleteUser, deleteEntry, changeReminderInterval, purgeLog },
)(WashList)
