import { legacy_createStore as createStore } from 'redux'

const initialState = {
    isDarkMode: localStorage.getItem('theme') === 'dark',
    userToken: localStorage.getItem('auth'),
    userInfo: {},
}

const reducer = (state = initialState, { type, value }) => {
    switch (type) {
        case 'SET_THEME':
            localStorage.setItem('theme', value ? 'dark' : 'light')
            return { ...state, isDarkMode: value }
        case 'SET_TOKEN':
            value ? localStorage.setItem('auth', value) : localStorage.removeItem('auth')
            return { ...state, userToken: value }
        case 'SET_USER':
            return { ...state, userInfo: value }
        default:
            return state
    }
}

const store = createStore(reducer)

export default store
