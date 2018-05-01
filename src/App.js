import React from 'react'
import Blog from './components/Blog'

import blogService from './services/blogs'
import userService from './services/users'
import Notification from './components/Notification'
//import noteService from './services/notes'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import TogglableDiv from './components/TogglableDiv'

import LoginForm from './components/LoginForm'
const jwt = require('jsonwebtoken')


const Blogy = ({blog, fu1}) => {
  return
  (
  <div className="blogbody">
  <a target="_new" href="`blog.url`">{blog.url}</a>
  <form onSubmit={fu1}>
  {blog.likes} likes <button>like</button><br/>
  </form>
  added by !!!{blog.user} .!!!
  </div>
  )
}

const showBlogsit = ({allblogs, blog, fu1, visibleOne}) => {
  
  return (
  <div>    
    <h2>Blogs</h2>
    {allblogs.map(blog => 
    <div  key={blog._id} id={blog._id} >
      <Blog key={blog._id} id={blog._id} blog={blog} />
      </div>
      )
    }
    </div>
  )
}




class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      blogs: [],
      error: '',  // also info msgs use this 
      user: null,
      currentuser: null,
      title: '',
      author:'',  
      url:'',
      blogvisible: false,
      blogvisibleid: '', 
      lastopened: null,
      clicksdone : 0
    }
  }

  addBlog = async (event) => {
    event.preventDefault()
    let tokeni = this.state.user.token

    let secru = "aksdjuioouimzxcvsdfd"

    try {

      //console.log('proces.secr', secru)
      const decodedToken = jwt.verify(tokeni, secru)

      console.log('Blogin lisaaja: ', decodedToken.id)
      let bname = this.state.title
  
      //console.log('Blogin luojanen:', createdBlog._id,':', this.state.currentuserid, 'Tai:', this.state.user)
 
      //let allusers = await userService.getAll()
      //let theOne = allusers.find({_id: decodedToken.id})
      //console.log('*** Usei', theOne)
      
      const miBlog = {
        title: this.state.title === null ? null : this.state.title,
        author: this.state.author,
        url: this.state.url,               
        user: decodedToken.id
      }
  
      const createdBlog = await blogService.create(miBlog)

      console.log('Luotiin?', createdBlog)
      //console.log('user data: ', allusers)
      let existingBlogs = this.state.blogs.concat(createdBlog)

      this.setState({
        title: '', author: '', url:''
      , blogs : existingBlogs,
        error: `Blog '${bname}' added.`,
        msgtype: 'info' 
      })
      setTimeout(() => {
        this.setState({ error:null, msgtype:null})
      }, 5000)
      
    }
    catch (exception) {
      this.setState({
        error: 'New blog could not be added',
        msgtype: 'error'
      })
      setTimeout(() => {
        this.setState({ error: null , msgtype:null })
      }, 5000)
      console.log('No blog added:', exception)
    }
  }

  login = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })


      window.localStorage.setItem('loggedappUser', JSON.stringify(user))
      
      blogService.setToken(user.token)

      //console.log('Useri:', user)

      this.setState({ currentuserid : user._id})
      this.setState({ currentuser : user.name})
      this.setState({ username: '', password: '', user: user })
    } catch (exception) {
      this.setState({
        msgtype: 'error',
        error: 'Username or password erroneous'
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleBlogFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  toggleVisible = () => {
    this.setState({ showAll: !this.state.showAll })
  }

  handleClick = (idx) => {
    //https://stackoverflow.com/a/47130799/364931
    //console.log("AAA",text,' id ',idx, ' eventti : ', event);
    //console.log('AAA', idx.id)

    let temp = idx.id
    let kliksui = this.state.clicksdone + 1

    this.setState({ blogvisibleid : idx.id,
      clicksdone: kliksui ,
      lastopened : temp
    })
  }


  async componentDidMount ()  {
    
//    blogService.getAll().then(blogs =>
//      this.setState({ blogs })
//    )
    let kama = await blogService.getAll()
    this.setState({blogs: kama})

   // const allBlogs = await blogService.getAll()
    //this.setState({allBlogs})

    const loggedUserJSON = window.localStorage.getItem('loggedappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user: user})   // user?
      blogService.setToken(user.token)
    }
  } 

  logout = async (event) => {
    window.localStorage.clear() // kaek pois!
  }

  render() {


    const showBlogs = () => (

      <div>
        <h2>Blogs</h2>
        {this.state.blogs.map(blog => 
          <Blog key={blog._id} id={blog._id} blog={blog}
          adder='tbs'
          fu1={()=>this.handleClick(blog)}
          visible={this.state.blogvisibleid}
          lastopened = {this.state.lastopened}
          counter = {this.state.clicksdone}
          />
        )}
      </div>
    )


    const showBlogs3 = () => (
      <div>    
        <h2>Blogs</h2>
        {this.state.blogs.map(blog => 
        
        <TogglableDiv key={blog._id} id={blog._id} ref={component => this.blogRow = component}>
          <Blog key={blog._id} id={blog._id} blog={blog} />
          </TogglableDiv>
          )
        }
        </div>
    )

    const showBlogs2 = () => (
      <div>    
        <h2>Blogs</h2>
        {this.state.blogs.map(blog => 
        
          <Blog key={blog._id} id={blog._id} blog={blog} 
          adder={blog.user===null ? 'none' : blog.user }
          fu1={(e)=>this.handleClick(e,blog._id)} 
          classStyle={this.state.blogvisible ? 'blogbody, visible':'blogbody, hidden'}
          
          />
          )
        }
        </div>
    )


    const showBlogs1 = () => (

      <div>
        <h2>Blogs</h2>
        {this.state.blogs.map(blog => 
          <Blog key={blog._id} id={blog._id} blog={blog}
          adder='tbd'
          fu1={(e)=>this.handleClick(e,blog._id)}
          />
        )}
      </div>
    )

    const addBlogForm = () => (
      <div>
      <h2>Create new</h2>
      <form onSubmit={this.addBlog}>
      <div>
        title
        <input
          type="text"
          name="title" 
          value={this.state.title}
          onChange={this.handleBlogFieldChange}
        /><br/>
        author
        <input
          type="text"
          name="author" 
          value={this.state.author}
          onChange={this.handleBlogFieldChange}
        /><br/>
        url
        <input
          type="text"
          name="url" 
          value={this.state.url}
          onChange={this.handleBlogFieldChange}
        /><br/>
      </div>
      <button>Create</button>
      </form>
      </div>
    )

    const loginForm = () => (
      <Togglable buttonLabel="login">
        <LoginForm
          visible={this.state.visible}
          username={this.state.username}
          password={this.state.password}
          handleChange={this.handleLoginFieldChange}
          handleSubmit={this.login}
        />
      </Togglable>
    )

    const loginFormOLD = () => (
      <div>
        <h2>Log in to application</h2>

        <form onSubmit={this.login}>
          <div>
            Username
            <input
              type="text"
              name="username" autoComplete="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              name="password" autoComplete="password"
              value={this.state.password}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <button>Log in</button>
        </form>
      </div>
    )



    return (
      <div>
      <Notification message={this.state.error} msgtype={this.state.msgtype} />


      <h2>Welcome to blog app</h2>
      {this.state.user === null ?
        loginForm() :
        <div>
          <p>{this.state.user.name} logged in &nbsp;</p>
          <form onSubmit={this.logout}><button>logout</button></form>
          {addBlogForm()}

          {showBlogs()}
        </div>
      }

      </div>
    );
  }
}

export default App;
