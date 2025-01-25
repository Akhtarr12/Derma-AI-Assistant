import React, { useState } from "react"
import ChatInterface from "./components/ChatInterface"
import ImageUpload from "./components/ImageUpload"
import "./styles/App.css"

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)

  return (
    <div className="App">
      <h1>Derma AI Assistant</h1>
      <ImageUpload setUploadedImage={setUploadedImage} />
      <ChatInterface uploadedImage={uploadedImage} />
    </div>
  )
}

export default App
