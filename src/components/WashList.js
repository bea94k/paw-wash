import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { addEntry, addUser, deleteUser, deleteEntry } from '../redux/washLog'

class WashList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
        }
    }

    newWash(username) {
        this.props.addEntry(username)
    }

    newUser(username) {
        this.props.addUser(username)
    }

    render() {
        let { log, users } = this.props

        return (
            <div>
                <input id='username' onChange={(e) => this.setState({username: e.target.value})} />
                <button onClick={() => this.newUser(this.state.username)}>Add User</button> 
                <button onClick={() => this.newWash(this.state.username)}>Add Wash</button>
                <button onClick={() => this.props.deleteUser(this.state.username)}>Delete User</button>
                <h2>Wash List</h2>
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
