import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { actWith, countRenders } from './utils'
import { shouldUpdate, compose, withState } from '../'

test('shouldUpdate implements shouldComponentUpdate', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const initialTodos = ['eat', 'drink', 'sleep']
  const Todos = compose(
    withState('todos', 'updateTodos', initialTodos),
    shouldUpdate((props, nextProps) => props.todos !== nextProps.todos),
    countRenders
  )(component)

  expect(Todos.displayName).toBe(
    'withState(shouldUpdate(countRenders(component)))'
  )

  mount(<Todos />)
  const updateTodos = actWith(component.firstCall.args[0].updateTodos)

  expect(component.lastCall.args[0].todos).toBe(initialTodos)
  expect(component.lastCall.args[0].renderCount).toBe(1)

  // should not re-render
  updateTodos(initialTodos)
  expect(component.calledOnce).toBe(true)

  updateTodos(todos => todos.slice(0, -1))
  expect(component.calledTwice).toBe(true)
  expect(component.lastCall.args[0].todos).toEqual(['eat', 'drink'])
  expect(component.lastCall.args[0].renderCount).toBe(2)
})
