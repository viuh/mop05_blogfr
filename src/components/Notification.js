import React from 'react'

const Notification = ({ message , msgtype }) => {
  if (message === null) {
    return null
  }
  if (msgtype === "error") {
    return (
    <div className="error">
      {message}
    </div>
    )
  } else {
    return (
      <div className="info">
        {message}
      </div>
      )
  }

}

export default Notification