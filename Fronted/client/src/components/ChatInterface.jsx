import { useState, useEffect, useRef } from "react"
import { sendMessage, startSpeechRecognition, stopSpeechRecognition } from "../services/api"
import "../styles/ChatInterface.css"

const ChatInterface = ({ uploadedImage }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef]) // Updated dependency

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return

    const newMessage = { text: input, sender: "user" }
    setMessages([...messages, newMessage])
    setInput("")

    try {
      const response = await sendMessage(input, uploadedImage)
      setMessages((prevMessages) => [...prevMessages, { text: response, sender: "bot" }])
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleVoiceInput = async () => {
    if (isListening) {
      const text = await stopSpeechRecognition()
      setInput(text)
      setIsListening(false)
    } else {
      setIsListening(true)
      startSpeechRecognition((text) => setInput(text))
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
        <button type="button" onClick={handleVoiceInput}>
          {isListening ? "Stop" : "Start"} Voice
        </button>
      </form>
    </div>
  )
}

export default ChatInterface

