import React from 'react'

// no render because if there's a function that returns something, react knows it's a default render


// this is a dumb component. it doesn't know whether the app has any particular state or not - it just knows that it needs to create an li with the following data. it has no knowledge of the state of the app.
const Todo = ({ onClick, completed, text }) =>
// doing ternary on classname is kind of the equivalent of using ng-Style to dynamically assign classes
  <li className={completed ? 'completed-task' : 'incomplete-task'}>
    {text}
  </li>

const propTypes = {
  onClick: React.PropTypes.func.isRequired
  completed: React.PropTypes.bool.isRequired
  text: React.PropTypes.string.isRequired
}

export default Object.assign(Todo, propTypes)
