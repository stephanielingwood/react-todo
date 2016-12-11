// scope PropTypes into our current scope, instead of referencing it directly from the React object, eg. React.PropTypes.blahblah
import React, { PropTypes } from 'react'
import Todo from './Todo'

// todos are the ones coming from the store
const TodoList = ({ todos, onTodoClick }) =>
  <ul>
    {todos.map(todo) => {
      <Todo
        key={todo.id}
        // spread operator: passes in
        {...todo}
        onClick={onTodoClick}
      />
    }}
  </ul>

// props is how the thing passes state to the children components
const propTypes = {
  // define the shape of each item in the todos array
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired
  // ^^^ both the shape of the objects in the array, and the array itself, is required
  onTodoClick:PropTypes.func.isRequired
}

export default Todo
