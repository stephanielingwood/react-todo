import React from 'react'
// only import the render function from react-dom
// in es6, {thing} is the shorthand for {thing: thing}
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers/todoApp'
import App from './components/App'

const store = createStore(todoApp, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


// redux is not aware of react by default. however, the react-redux package is a bunch of bindings; that lets every component of react be aware of the redux store. to connect the two, need to add store={store} (that's the store created above)
// provider references the provider imported from react-redux. that provides the bindings.
const wrappedApp = {
  <Provider store={store}>
    <App />
  </Provider>
}

// need to make the app aware of redux store
render ( wrappedApp, document.getElementById('app'))
