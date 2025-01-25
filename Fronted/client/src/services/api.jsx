const API_URL = "http://localhost:3001/api"

export const sendMessage = async (message, imageUrl) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, imageUrl }),
  })
  return response.text()
}

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  })
  return response.text()
}

export const startSpeechRecognition = (onResult) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("")
    onResult(transcript)
  }

  recognition.start()
  return recognition
}

export const stopSpeechRecognition = () => {
  return new Promise((resolve) => {
    const recognition = startSpeechRecognition((transcript) => {
      recognition.stop()
      resolve(transcript)
    })
  })
}

