import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
//import noteService from './services/notes'
import loginService from './services/login'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      blogs: [],
      error: '',
      user: null,
      currentuser: null,
      title: '',
      author:'',
      url:'',
      info: '',
    }
  }

  addBlog = async (event) => {
    event.preventDefault()

    console.log('Wanna add?', this.state)

    try {

      const miBlog = {
        title: this.state.title,
        author: this.state.author,
        url: this.state.url        
      }
  
      //let temp = this.state.blogs   //???
      let bname = this.state.title
  

      const createdBlog = await blogService.create(miBlog)

      console.log('Luotiin?', createdBlog)

      this.setState({ title: '', author: '', url:''
      , blogs : this.state.blogs.concat(createdBlog)
      , info: `Blog '${bname}' added.`
      , msgtype: 'info'
      })
      setTimeout(() => {
        this.setState({info: null , msgtype:'info'})
      }, 5000)
    }
    catch (exception) {
      this.setState({
        error: 'New blog could not be added',
      })
      setTimeout(() => {
        this.setState({ error: null , msgtype:'error' })
      }, 5000)
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

      console.log('Useri:', user)

      this.setState({ currentuser : user.name})
      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.setState({
        msgtype: 'error',
        error: 'Username or password erroneous',
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


  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
    const loggedUserJSON = window.localStorage.getItem('loggedappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
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
          <Blog key={blog._id} id={blog._id} blog={blog}/>
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
