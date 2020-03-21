import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { addEntry, addUser, deleteUser, deleteEntry } from '../redux/washLog'

class WashList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            deleteUser: '',
            selectedUser: 0
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

    render() {
        let { log, users } = this.props

        return (
            <div>
                
                <h1>Main Page</h1>
                
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
    addEntry: PropTypes.func,
    addUser: PropTypes.func,
    deleteUser: PropTypes.func,
    deleteEntry: PropTypes.func
}

export default connect(
    (state) => ({
        log: state.log,
        users: state.users,
    }),
    { addEntry, addUser, deleteUser, deleteEntry },
)(WashList)
