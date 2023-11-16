import { legacy_createStore as createStore } from 'redux'

const initialState = {
    isDarkMode: localStorage.getItem('theme') === 'dark'
}

const reducer = (state = initialState, { type, value }) => {
    switch (type) {
        case 'SET_THEME':
            localStorage.setItem('theme', value ? 'dark' : 'light')
            document.body.style.backgroundColor = value ? '#000000' : '#F5F5F5'
            document.querySelector('meta[name="theme-color"]').setAttribute('content', value ? '#141414' : '#FFFFFF')
            return { ...state, isDarkMode: value }
        default:
            return state
    }
}

const store = createStore(reducer)

export default store
