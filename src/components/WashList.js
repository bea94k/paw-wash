import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactNotifications from 'react-browser-notifications'
import fileDownload from 'js-file-download'
import papa from 'papaparse'
import PropTypes from 'prop-types'
import moment from 'moment'
import * as R from 'ramda'

import { withStyles } from '@material-ui/styles'

import SettingsDialog from './SettingsDialog'
import LogDialog from './LogDialog'

import { addEntry } from '../redux/washLog'

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

const styles = theme => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
})

class WashList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            now: moment(),
            lastNotification: moment(),
            selectedUser: 0,
            error: '',
            play: false,
            audio: new Audio('/sounds/when.mp3')
        }
        this.state.audio.addEventListener('ended', () => this.setState({ play: false }))
        setInterval(this.setNewTime, 5000) // call the new time regularly
    }

    spaceFunction = (event) => {
        if(event.keyCode === 32) {
            event.preventDefault()
            this.newWash(this.state.selectedUser)
        }
    }

    rightArrowFunction = (event) => {
        if(event.keyCode === 39) {
            this.changeUser()
        }
    }

    componentDidMount(){
        document.addEventListener('keydown', this.spaceFunction, false)
        document.addEventListener('keydown', this.rightArrowFunction, false)
    }

    componentWillUnmount(){
        document.removeEventListener('keydown', this.spaceFunction, false)
        document.removeEventListener('keydown', this.rightArrowFunction, false)
    }
    
    setNewTime = () => {
        this.setState({ now: moment() })
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
        this.n.close(event.target.tag) // close the notification
    }

    newWash(userIndex) {
        if (this.props.users.length !== 0)
            this.props.addEntry(userIndex)
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

    // The componentDidUpdate method is called after the component is updated in the DOM.
    componentDidUpdate() {
        let interval = moment.duration(this.props.reminderInterval)
        if (moment(this.state.lastNotification).add(interval).isBefore(this.state.now)) {
            this.showNotifications() // show notification at specified intervals
            this.setState({ lastNotification: moment() })
        }
    }

    openVideo() {
        window.open('https://www.youtube.com/watch?v=3PmVJQUCm4E','_blank')
    }

    render() {
        let { log, users, reminderInterval } = this.props
        let interval = moment.duration(reminderInterval)
        let i = 0
        return (
            <div className="grid-wrap grid-wrap-index">
                <button onClick={() => this.newWash(this.state.selectedUser)} className="btn hands-washed-btn">
                    <div className="big-btn-grid">
                        <div>{users[this.state.selectedUser]} washed hands</div>
                        <i className="fas fa-sign-language"></i>
                        <div>Press the button with your elbow</div>
                    </div>
                </button>

                <button onClick={() => this.changeUser()} className="btn change-users-btn">
                    <div className="big-btn-grid">
                        <div>Not you?</div>
                        <i className="fas fa-sync-alt"></i>
                        <div>Change user</div>
                    </div>
                </button>

                <img alt='PaWash Logo' className='logo grid-center' src='/assets/slider-thumb.svg' />

                <button className="btn yt-btn" onClick={() => this.openVideo()}>
                    <i className="fab fa-youtube"></i>
                </button>

                <LogDialog />
                <SettingsDialog />

                <div className="table-scroll">
                    <table className="log-table table">
                        <thead>
                            <tr className="table-titles">
                                <th>User</th>
                                <th>Last Hand Wash</th>
                                <th>Next Hand Wash</th>
                            </tr>
                        </thead>
                        <tbody className="worker-table">
                    
                            {
                                users.map(user => {
                                    i++
                                    let entry = R.findLast(R.propEq('username', user))(log)
                                    let lastWash = 'no washes yet'
                                    let nextWash = 'wash your hands now!'
                                    if (entry) {
                                        lastWash = `${moment(entry.time).from(this.state.now)}`
                                        nextWash = `${moment(entry.time).add(interval).from(this.state.now)}`
                                    }
                                    // return <p key={user}>{user} - { lastWash } - { nextWash }</p>
                                    return <tr className={i % 2 === 0 ? 'row row-primary-color' : 'row row-dark-color'} key={user}>
                                        <td>{ user }</td>
                                        <td>{ lastWash }</td>
                                        <td>{ nextWash }</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <ReactNotifications
                    onRef={ref => (this.n = ref)} // Required
                    title="PaWash Reminder" // Required
                    body={'Time to wash hands!'}
                    icon="./assets/slider-thumb.png"
                    tag="hands"
                    timeout="5000"
                    onClick={(event) => this.handleClick(event)}
                />
            </div>
        )
    }
}

WashList.propTypes = {
    log: PropTypes.array,
    users: PropTypes.array,
    reminderInterval: PropTypes.number,
    addEntry: PropTypes.func,
    classes: PropTypes.object.isRequired,
}

export default connect(
    (state) => ({
        log: state.log,
        users: state.users,
        reminderInterval: state.reminderInterval,
    }),
    { addEntry },
)(withStyles(styles)(WashList))
