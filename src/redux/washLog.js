import * as R from 'ramda'
import moment from 'moment'
import { v4 as uuid } from 'uuid'

const initialState = {
    log: [],
    users: [],
    reminderInterval: 900000 // default reminder interval 15 minutes
}

// Actions
const CREATE_USER = 'users/CREATE'
const REMOVE_USER = 'users/DELETE'
const ADD_LOG_ENTRY = 'log/CREATE'
const REMOVE_LOG_ENTRY = 'log/DELETE'
const CHANGE_REMINDER_INTERVAL = 'reminderInterval/CHANGE'

// Reducer
export default (state = initialState, action) => {
    let now = moment().format()

    switch(action.type) {
    case CREATE_USER:
        return {
            ...state,
            users: R.uniq(R.append(action.username, state.users)) // initialize an empty list for user
        }

    case REMOVE_USER:
        return {
            ...state,
            users: R.without(action.username, state.users) // remove user from the log
        }

    case ADD_LOG_ENTRY:
        return {
            ...state,
            log: R.append({id: uuid(), time: now, username: state.users[action.userIndex]}, state.log) // push new entry to the log array of the user
        }

    case REMOVE_LOG_ENTRY:
        return {
            ...state,
            log: R.filter(entry => entry.id !== action.id, state.log) // filter out the id of the log entry for the given user
        }
    
    case CHANGE_REMINDER_INTERVAL:
        return {
            ...state,
            reminderInterval: Number.isInteger(Number(action.newInterval)) ? Number(action.newInterval) : initialState.reminderInterval
        }

    default:
        return state
    }
}

// Action Creators
export const addUser = (username) => ({
    type: CREATE_USER,
    username: username
})

export const deleteUser = (username) => ({
    type: REMOVE_USER,
    username: username
})

export const addEntry = (userIndex) => ({
    type: ADD_LOG_ENTRY,
    userIndex: userIndex
})

export const deleteEntry = (id) => ({
    type: REMOVE_LOG_ENTRY,
    id: id
})

export const changeReminderInterval = (newInterval) => ({
    type: CHANGE_REMINDER_INTERVAL,
    newInterval: newInterval
})