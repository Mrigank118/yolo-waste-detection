"use client"

import { useState } from "react"
import { UploadPanel } from "./upload-panel"
import { ImageDisplay } from "./image-display"
import { PredictionResults } from "./prediction-results"
import { SustainabilityInsights } from "./sustainability-insights"
import { Logo } from "./logo"

export type PredictionType = {
  trash: number
  recycle: number
  compost: number
}

export type ThresholdType = {
  trash: number
  recycle: number
  compost: number
}

export type DetectedObject = {
  class: string
  confidence: number
  bbox: [number, number, number, number] // [x, y, width, height]
}

export type YoloPrediction = {
  predictions: DetectedObject[]
  rawResponse?: any
}

export type GeminiInsight = {
  itemName: string
  description: string
  carbonFootprint: string
  disposalAdvice: string
  sustainableAlternatives: string[]
}

export function TrashXDashboard() {
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<YoloPrediction | null>(null)
  const [insights, setInsights] = useState<GeminiInsight | null>(null)
  const [thresholds, setThresholds] = useState<ThresholdType>({
    trash: 50,
    recycle: 95,
    compost: 92,
  })

  const handleImageUpload = (imageData: string) => {
    setImage(imageData)
    setPrediction(null)
    setInsights(null)
  }

  const handleThresholdChange = (type: keyof ThresholdType, value: number) => {
    setThresholds((prev) => ({ ...prev, [type]: value }))
  }

  const performPrediction = async () => {
    if (!image) return

    setIsLoading(true)
    try {
      // Simulate API call to YOLO model
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock prediction data
      const mockPrediction: YoloPrediction = {
        predictions: [
          {
            class: "plastic_bottle",
            confidence: 0.97,
            bbox: [120, 80, 200, 300],
          },
          {
            class: "banana_peel",
            confidence: 0.92,
            bbox: [350, 150, 150, 200],
          },
          {
            class: "paper",
            confidence: 0.98,
            bbox: [550, 200, 100, 150],
          },
        ],
        rawResponse: {
          model: "yolov8",
          version: "1.0",
          timestamp: new Date().toISOString(),
          inference_time: "0.23s",
        },
      }

      setPrediction(mockPrediction)

      // Simulate Gemini API call for insights
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock Gemini insights
      const mockInsights: GeminiInsight = {
        itemName: "Mixed Waste (Plastic Bottle, Banana Peel, Paper)",
        description: "Your image contains multiple items that require different disposal methods.",
        carbonFootprint:
          "The plastic bottle has a high carbon footprint of approximately 82g CO2e per bottle. The banana peel and paper have lower footprints but still contribute to waste.",
        disposalAdvice:
          "Plastic bottle: Recycle (rinse first)\nBanana peel: Compost\nPaper: Recycle or compost depending on cleanliness",
        sustainableAlternatives: [
          "Use a reusable water bottle instead of single-use plastic",
          "Consider a home composting system for food waste",
          "Opt for digital documents when possible to reduce paper usage",
        ],
      }

      setInsights(mockInsights)
    } catch (error) {
      console.error("Error performing prediction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadResult = () => {
    if (!prediction) return

    const resultData = {
      timestamp: new Date().toISOString(),
      image: image ? "Image data included" : "No image",
      prediction,
      insights,
    }

    const blob = new Blob([JSON.stringify(resultData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trashx-result-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex items-center">
          <Logo />
          <h1 className="text-2xl font-bold ml-3">TRASHX AI</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 flex-1">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">How to Use the YOLO Waste Detection API</h2>
          <p className="text-gray-400 mb-4">Upload an image of waste to see the model's predictions.</p>
          <p className="text-gray-500 text-sm">The uploaded image will be resized to 640x640 pixels for processing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UploadPanel
            onImageUpload={handleImageUpload}
            onPerformPrediction={performPrediction}
            onDownloadResult={downloadResult}
            image={image}
            hasResults={!!prediction}
            isLoading={isLoading}
          />

          <ImageDisplay
            image={image}
            onPerformPrediction={performPrediction}
            prediction={prediction}
            isLoading={isLoading}
          />

          <PredictionResults
            prediction={prediction}
            thresholds={thresholds}
            onThresholdChange={handleThresholdChange}
          />
        </div>

        {insights && (
          <div className="mt-8 animate-fadeIn">
            <SustainabilityInsights insights={insights} />
          </div>
        )}
      </div>
    </div>
  )
}
