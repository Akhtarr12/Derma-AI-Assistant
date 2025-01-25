import React, { useState } from "react"
import { uploadImage } from "../services/api"
import "../styles/ImageUpload.css"

const ImageUpload = ({ setUploadedImage }) => {
  const [preview, setPreview] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)

      try {
        const uploadedImageUrl = await uploadImage(file)
        setUploadedImage(uploadedImageUrl)
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      setTimeout(() => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext("2d").drawImage(video, 0, 0)
        stream.getTracks().forEach((track) => track.stop())

        canvas.toBlob(async (blob) => {
          const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" })
          setPreview(URL.createObjectURL(blob))

          try {
            const uploadedImageUrl = await uploadImage(file)
            setUploadedImage(uploadedImageUrl)
          } catch (error) {
            console.error("Error uploading image:", error)
          }
        }, "image/jpeg")
      }, 1000)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleCameraCapture}>Capture from Camera</button>
      {preview && <img src={preview || "/placeholder.svg"} alt="Preview" className="image-preview" />}
    </div>
  )
}

export default ImageUpload

