import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { sendMessage } from '../slices/messagesSlice'

const MessageForm = ({ currentChannelId }) => {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    dispatch(sendMessage({ text, channelId: currentChannelId }))
    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <button type="submit">Send</button>
    </form>
  )
}

export default MessageForm
