import { legacy_createStore as createStore } from 'redux'

try {
    JSON.parse(localStorage.getItem('auth') ?? '{}')
} catch (err) {
    localStorage.removeItem('auth')
}

const initialState = {
    isDarkMode: localStorage.getItem('theme') === 'dark',
    userInfo: JSON.parse(localStorage.getItem('auth') ?? '{}')
}

const reducer = (state = initialState, { type, value }) => {
    switch (type) {
        case 'SET_THEME':
            localStorage.setItem('theme', value ? 'dark' : 'light')
            document.body.style.backgroundColor = value ? '#000000' : '#F5F5F5'
            document.querySelector('meta[name="theme-color"]').setAttribute('content', value ? '#141414' : '#FFFFFF')
            return { ...state, isDarkMode: value }
        case 'SET_USER':
            if (value?.token) localStorage.setItem('auth', JSON.stringify(value))
            else localStorage.removeItem('auth')
            return { ...state, userInfo: value }
        default:
            return state
    }
}

const store = createStore(reducer)

export default store
