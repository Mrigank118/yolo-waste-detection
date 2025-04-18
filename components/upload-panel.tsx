"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Camera, ImageIcon, Download } from "lucide-react"

interface UploadPanelProps {
  onImageUpload: (imageData: string) => void
  onPerformPrediction: () => void
  onDownloadResult: () => void
  image: string | null
  hasResults: boolean
  isLoading: boolean
}

export function UploadPanel({
  onImageUpload,
  onPerformPrediction,
  onDownloadResult,
  image,
  hasResults,
  isLoading,
}: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
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
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(video, 0, 0)

        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())

        const imageData = canvas.toDataURL("image/jpeg")
        onImageUpload(imageData)
      }, 500)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const handleUseTestImage = () => {
    // Use a placeholder image for testing
    const testImageUrl = "/placeholder.svg?height=640&width=640"
    fetch(testImageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            onImageUpload(e.target.result as string)
          }
        }
        reader.readAsDataURL(blob)
      })
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">Test Image</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="h-6 w-6 mb-2 text-blue-400" />
          <span className="text-sm">Upload</span>
          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileInputChange} />
        </button>

        <button
          className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
          onClick={handleCameraCapture}
        >
          <Camera className="h-6 w-6 mb-2 text-blue-400" />
          <span className="text-sm">Camera</span>
        </button>

        <button
          className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
          onClick={handleUseTestImage}
        >
          <ImageIcon className="h-6 w-6 mb-2 text-blue-400" />
          <span className="text-sm">Test Image</span>
        </button>

        <div
          className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-md"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={`flex items-center justify-center h-full w-full rounded-md transition-colors ${isDragging ? "bg-gray-700 border-2 border-dashed border-blue-400" : ""}`}
          >
            <div className="text-center">
              <Upload className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <span className="text-sm">Drop Here</span>
            </div>
          </div>
        </div>
      </div>

      <button
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center mb-3 ${
          image && !isLoading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"
        } transition-colors`}
        onClick={onPerformPrediction}
        disabled={!image || isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <span className="mr-2">Perform Prediction</span>
          </>
        )}
      </button>

      <button
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
          hasResults ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-800 opacity-50 cursor-not-allowed"
        } transition-colors`}
        onClick={onDownloadResult}
        disabled={!hasResults}
      >
        <Download className="h-5 w-5 mr-2" />
        Download Result
      </button>

      {image && (
        <div className="mt-4 rounded-md overflow-hidden border border-gray-700">
          <img src={image || "/placeholder.svg"} alt="Uploaded preview" className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  )
}
