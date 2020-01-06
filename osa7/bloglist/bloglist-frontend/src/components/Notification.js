import React from 'react'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'

const Notification = (props) => {
  if (props.notification.message.length === 0) {
    return null
  }

  return (
    <Message
      success={props.notification.type === 'success'}
      error={props.notification.type === 'error'}
      header={props.notification.message}
      data-cy='notification'
    />
  )
}

const mapStateToProps = (state) => ({
  notification: state.notification
})

export default connect(mapStateToProps)(Notification)