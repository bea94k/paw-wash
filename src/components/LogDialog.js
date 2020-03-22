import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import fileDownload from 'js-file-download'
import papa from 'papaparse'
import * as R from 'ramda'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { deleteEntry, purgeLog } from '../redux/washLog'

class LogDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    handleClickOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open: false})
    }

    download() {
        let { log } = this.props
        let trimmedLog = R.map(entry => {
            entry.dateTime = moment(entry.time).format('DD.MM.YYYY HH:mm:ss')
            return R.pick(['username', 'dateTime'], entry)
        }, log)
        fileDownload(papa.unparse(trimmedLog), moment().format('YYYY-MM-DD') + '-wash-log.csv')
    }

    render() {
        let { log, purgeLog } = this.props
        let i = 0
        return (
            <React.Fragment>
                <button className="btn log-btn" onClick={this.handleClickOpen}>
                    <i className="fas fa-clipboard-list"></i>
                </button>
                <Dialog
                    fullWidth={true}
                    maxWidth='lg'
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title">
                        <h2>Hand Washing Log</h2>
                        <button onClick={this.handleClose} className="btn close-btn">
                            <i className="fas fa-times"></i>
                        </button>
                    </DialogTitle>
                    <DialogContent>
                        <div className="grid-wrap grid-wrap-log">
                            <table className="log">
                                <thead>
                                    <tr className="table-titles">
                                        <th className="rad_left">User</th>
                                        <th>Time</th>
                                        <th>Date</th>
                                        <th className="rad_right">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="Worker-table">
                                    {
                                        log.map(entry => {
                                            i++
                                            return <tr className={i % 2 === 0 ? 'row row-primary-color' : 'row row-dark-color'} key={entry.id}>
                                                <td>{entry.username}</td>
                                                <td className="border">{moment(entry.time).format('HH:mm:ss')}</td>
                                                <td>{moment(entry.time).format('DD.MM.YYYY')}</td>
                                                <td><a onClick={() => this.props.deleteEntry(entry.id)}><i className="fas fa-times"></i></a></td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                    
                    
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={() => purgeLog()} className="btn clear-btn">Clear log</button>
                        <button onClick={() => this.download()} className="btn report-btn">Report</button>
                        
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

LogDialog.propTypes = {
    log: PropTypes.array,
    users: PropTypes.array,
    deleteEntry: PropTypes.func,
    purgeLog: PropTypes.func
}

export default connect(
    (state) => ({
        log: state.log,
        users: state.users
    }),
    { deleteEntry, purgeLog },
)(LogDialog)
