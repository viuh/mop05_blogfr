import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

configure({ adapter: new Adapter() })

const fu = () => {
  console.log('in a fu')
}



describe.only('<SimpleBlog />', () => {
  it('renders content, title, author, likes correctly', () => {
    const blog = {
      title: "testaanpa testailen 1",
      author: "N. Nobody",
      likes: 2
    }

    const blogComponent = shallow(<SimpleBlog blog={blog} onClick={fu} />)
    //console.log('x', blogComponent.debug())

    const contentDiv = blogComponent.find('.header')
    //console.log('!', contentDiv.text())
    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)

    const bodyDiv = blogComponent.find('.body')
    expect(bodyDiv.text()).toContain(blog.likes)


  })
})