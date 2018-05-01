import React from 'react'
import '../index.css'

//  {  console.log('Blogi:',blog.title, '-url-:', blog.url) }
//let hideWhenVisible = { display: visible === blog.id ? 'none' : '' }
//let showWhenVisible = { display: visible === blog.id ? '' : 'none' }

const tyyli = ({blog,visible,lastopened,clicksdone}) => {

  //console.log('Toggling ', blog.id)
  let res
  /*let res = visible === blog.id ? 
  { 'display': visible === blog.id ? 'none' : '' } 
: { 'display': visible === blog.id ? '' : 'none' } 
*/

  //var isVisible = _.('#blog.id').is(':visible')

  if ( visible === blog.id) {
    //console.log('Toggling', blog.id, ' vs ', visible)
      res = 'visible'
    } else {
      res =  'hidden'  
    }

    if (visible === blog.id === lastopened) {
      res = 'hidden'
    }

  return res
}


const Blog = ({blog, adder, fu1, fu2, classStyle, visible, lastopened,clicksdone}) => (

  <div>
    <div className="blogheader" onClick={fu1}>{blog.title} {blog.author}</div>
    <div key={blog._id} id="{blog._id}" classnxame="{classStyle}"
    className={tyyli({blog,visible, lastopened,clicksdone})} >
<a target="_new" href="`blog.url`">{blog.url}</a>
<form onSubmit={fu2}>
{blog.likes} likes <button>like</button><br/>
</form>
added by {blog.user !== null ? blog.user.name : '-'   }
</div>
  </div>  
)

export default Blog

