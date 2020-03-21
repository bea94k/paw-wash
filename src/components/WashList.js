import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import { addEntry, addUser, deleteUser, deleteEntry, changeReminderInterval } from '../redux/washLog'

class WashList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            deleteUser: '',
            selectedUser: 0,
            error: ''
        }
    }

    newWash(userIndex) {
        this.props.addEntry(userIndex)
    }

    newUser(username) {
        this.props.addUser(username)
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

    render() {
        let { log, users, reminderInterval } = this.props

        let interval = moment.duration(reminderInterval)

        return (
            <div>
                
                <h1>Main Page</h1>
                <p>Currently giving reminders every {interval.hours()} hours and { + interval.minutes()} minutes </p>
                
                <button onClick={() => this.newWash(this.state.selectedUser)}>{users[this.state.selectedUser]} washed hands. Press the button with your elbow</button>
                <button onClick={() => this.changeUser()}>Not you? Change worker</button> 
                <h2>Log</h2>
                {
                    log.map(entry => {
                        return <p key={entry.id}>{entry.username} washed hands at {entry.time} <button onClick={() => this.props.deleteEntry(entry.id)}>Delete</button></p>
                    })
                }
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
    changeReminderInterval: PropTypes.func
}

export default connect(
    (state) => ({
        log: state.log,
        users: state.users,
        reminderInterval: state.reminderInterval,
    }),
    { addEntry, addUser, deleteUser, deleteEntry, changeReminderInterval },
)(WashList)
