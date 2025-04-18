"use client"

import { useEffect, useRef } from "react"
import type { YoloPrediction } from "./trashx-dashboard"

interface ImageDisplayProps {
  image: string | null
  onPerformPrediction: () => void
  prediction: YoloPrediction | null
  isLoading: boolean
}

export function ImageDisplay({ image, onPerformPrediction, prediction, isLoading }: ImageDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (image && prediction && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Load image
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width
        canvas.height = img.height

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Draw bounding boxes
        prediction.predictions.forEach((pred) => {
          const [x, y, width, height] = pred.bbox

          // Determine color based on class
          let color = "#FF0000" // Default red
          if (pred.class.includes("plastic") || pred.class.includes("bottle")) {
            color = "#3B82F6" // Blue for recyclables
          } else if (pred.class.includes("banana") || pred.class.includes("peel") || pred.class.includes("food")) {
            color = "#10B981" // Green for compostables
          }

          // Draw rectangle
          ctx.strokeStyle = color
          ctx.lineWidth = 3
          ctx.strokeRect(x, y, width, height)

          // Draw label background
          ctx.fillStyle = color
          const label = `${pred.class} (${Math.round(pred.confidence * 100)}%)`
          const textMetrics = ctx.measureText(label)
          const textHeight = 20
          ctx.fillRect(x, y - textHeight, textMetrics.width + 10, textHeight)

          // Draw label text
          ctx.fillStyle = "#FFFFFF"
          ctx.font = "14px Arial"
          ctx.fillText(label, x + 5, y - 5)
        })
      }
      img.src = image
    }
  }, [image, prediction])

  if (!image) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex flex-col items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="border-2 border-dashed border-gray-800 rounded-lg p-12 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm">Upload an image to see the prediction results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex flex-col">
      <div className="relative flex-1 mb-4">
        {prediction ? (
          <canvas ref={canvasRef} className="w-full h-auto rounded-md" />
        ) : (
          <img src={image || "/placeholder.svg"} alt="Uploaded image" className="w-full h-auto rounded-md" />
        )}
      </div>

      <button
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
          !isLoading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"
        } transition-colors`}
        onClick={onPerformPrediction}
        disabled={isLoading}
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
          <>Perform Prediction</>
        )}
      </button>
    </div>
  )
}
