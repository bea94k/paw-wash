import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'

import { addUser, deleteUser, changeReminderInterval } from '../redux/washLog'

const marks = [
    {
        value: 5,
        label: '5 min',
    },
    {
        value: 15,
        label: '15 min',
    },
    {
        value: 30,
        label: '30 min',
    },
    {
        value: 45,
        label: '45 min',
    },
    {
        value: 60,
        label: '60 min',
    },
]

function valuetext(value) {
    return `${value}m`
}

class SettingsDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            username: '',
            deleteUser: '',
            snackbarOpen: false
        }
    }

    handleClickOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open: false})
    }

    handleNewUser() {
        this.props.addUser(this.state.username)
        this.setState({username: '', snackbarOpen: true})
    }

    handleDelete() {
        this.props.deleteUser(this.state.deleteUser)
        this.setState({deleteUser: ''})
    }

    setUsername(username) {
        this.setState({ username: username })
    }

    changeInterval(interval) {
        this.props.changeReminderInterval(Number(interval) * 1000 * 60)
    }
    
    handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        this.setState({snackbarOpen: false})
    };

    render() {
        return (
            <React.Fragment>
                <button className="btn setting-btn" onClick={this.handleClickOpen}>
                    <i className="fas fa-cog"></i>
                </button>
                <Dialog
                    fullWidth={true}
                    maxWidth='lg'
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title">
                        <h2 className="heading">Settings</h2>
                        <button onClick={this.handleClose} className="btn close-btn">
                            <i className="fas fa-times"></i>
                        </button>
                    </DialogTitle>
                    <DialogContent>
                        <div className="grid-wrap grid-wrap-settings">
                            <div className="remind grid-center">Remind to wash hands every:</div>
                            <div className="remind-slider grid-center">
                                <Slider
                                    value={this.props.reminderInterval / 1000 / 60 }
                                    max={60}
                                    min={5}
                                    getAriaValueText={valuetext}
                                    aria-labelledby="discrete-slider-custom"
                                    step={5}
                                    onChange={(e,v) => this.changeInterval(v)}
                                    valueLabelDisplay="auto"
                                    marks={marks}
                                />
                            </div>
                            <div className="name-add-worker grid-center">Name:</div>
                            <input value={this.state.username} onChange={(e) => this.setUsername(e.target.value)} type="text" className="input-add-worker grid-center" />
                            <div className="name-rem-worker grid-center">Choose:</div>
                            <input
                                list="list-workers"
                                name="list-workers"
                                className="input-rem-worker grid-center"
                                value={this.state.deleteUser}
                                onChange={(e) => this.setState({ deleteUser: e.target.value })}
                            />
                            <datalist id="list-workers">
                                {
                                    this.props.users.map(user => {
                                        return <option key={user} value={user}></option>
                                    })
                                }
                            </datalist>
                            <button onClick={() => this.handleNewUser()} className="btn settings-action-btn add-worker-btn grid-center">Add user</button>
                            <button onClick={() => this.handleDelete()} className="btn settings-action-btn rem-worker-btn grid-center">Remove user</button>
                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                open={this.state.snackbarOpen}
                                autoHideDuration={6000}
                                onClose={this.handleSnackClose}
                                message="User added"
                                action={
                                    <React.Fragment>
                                        <Button size="small" color="inherit" onClick={this.handleSnackClose}>
                                            OK
                                        </Button>
                                    </React.Fragment>
                                }
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>

                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

SettingsDialog.propTypes = {
    users: PropTypes.array,
    reminderInterval: PropTypes.number,
    changeReminderInterval: PropTypes.func,
    addUser: PropTypes.func,
    deleteUser: PropTypes.func
}

export default connect(
    (state) => ({
        users: state.users,
        reminderInterval: state.reminderInterval,
    }),
    { addUser, deleteUser, changeReminderInterval },
)(SettingsDialog)
