import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import noteService from './services/notes'
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
      currentuser: null
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
      noteService.setToken(user.token)

      console.log('Useri:', user)

      this.setState({ currentuser : user.name})
      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.setState({
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


  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
    const loggedUserJSON = window.localStorage.getItem('loggedappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      noteService.setToken(user.token)
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
          <Blog key={blog._id} blog={blog}/>
        )}
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
              name="username" autocomplete="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              name="password" autocomplete="password"
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
      <Notification message={this.state.error} />

      {this.state.user === null ?
        loginForm() :
        <div>
          <p>{this.state.currentuser} logged in &nbsp;
          <form onSubmit={this.logout}><button>logout</button></form>
          </p>
          {showBlogs()}
        </div>
      }

      </div>
    );
  }
}

export default App;
