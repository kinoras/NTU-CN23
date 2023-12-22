import { legacy_createStore as createStore } from 'redux'

const initialState = {
    isDarkMode: localStorage.getItem('theme') === 'dark',
    userToken: localStorage.getItem('auth'),
    userInfo: {},
    audio: null
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
        case 'SET_USER_NAME':
            return { ...state, userInfo: { ...state.userInfo, name: value } }
        case 'SET_AUDIO':
            if (state.audio === value) document.getElementById('audio')?.play()
            return { ...state, audio: value }
        default:
            return state
    }
}

const store = createStore(reducer)

export default store
