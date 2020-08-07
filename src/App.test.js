import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { shallow } from 'enzyme'
import Comments from './Comments'
import NewComment from './NewComment'
import {EventEmitter } from 'events' 

describe('<App />',() => {
  it('renders without crashing', () => {
    const database = {
      ref: jest.fn()
    }
    database.ref.mockReturnValue({
      on: jest.fn()
    })
    const wrapper = shallow(<App database={database}/>)
    expect(wrapper.find(Comments).length).toBe(1)
    expect(wrapper.find(NewComment).length).toBe(1)
    expect(wrapper.find('p').length).toBe(1)
  })

  it('add a new comment', () => {
    const database = {
      ref: jest.fn()
    }
    const child = jest.fn()
    database.ref.mockReturnValue({
      on: jest.fn(),
      child,
      update: jest.fn()
    })
    const push = jest.fn()
    child.mockReturnValue({
      push
    })
    push.mockReturnValue({
      key: '1'
    })
    const wrapper = shallow(<App database={database}/>)
    wrapper.instance().sendComment('new comment')
    expect(child.mock.calls)
  })
  it('renders comments from firebase', () => { //Verificando se esta tudo montado direitinho
    const database = {
      ref: jest.fn()
    }
    const eventEmmiter = new EventEmitter()
    database.ref.mockReturnValue(eventEmmiter)
    const wrapper = shallow(<App database={database}/>)
    //Não recebeu comments

    expect(wrapper.find(Comments).length).toBe(1)
    expect(wrapper.find(NewComment).length).toBe(1)
    expect(wrapper.find('p').length).toBe(1)
    //recebendo o value
    const comments = {
      a: {comment: 'comment 1'},
      b: {comment: 'comment 2'}
    }
    const val = jest.fn()
    val.mockReturnValue(comments)
    eventEmmiter.emit('value',{
      val
    })

    wrapper.update()
    //tests
    expect(wrapper.state().isLoading).toBeFalsy()
    expect(wrapper.state().comments).toBe(comments)
    expect(wrapper.find(Comments).get(0).props.comments).toBe(comments)
    expect(wrapper.find(NewComment).get(0).props.sendComment).toBe(wrapper.instance().sendComment)
    expect(wrapper.find('p').length).toBe(0)
  })
})

