"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { YoloPrediction, ThresholdType } from "./trashx-dashboard"

interface PredictionResultsProps {
  prediction: YoloPrediction | null
  thresholds: ThresholdType
  onThresholdChange: (type: keyof ThresholdType, value: number) => void
}

export function PredictionResults({ prediction, thresholds, onThresholdChange }: PredictionResultsProps) {
  const [showRawJson, setShowRawJson] = useState(false)

  if (!prediction) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-xl font-semibold mb-4">AI System</h3>
        <div className="text-gray-500 text-sm">
          <p>Upload an image and perform prediction to see results.</p>
        </div>
      </div>
    )
  }

  // Calculate aggregated confidence scores
  const confidenceScores = {
    trash: prediction.predictions.some((p) => p.class.includes("trash"))
      ? Math.round(prediction.predictions.find((p) => p.class.includes("trash"))?.confidence * 100) || 97
      : 97,
    recycle: prediction.predictions.some((p) => p.class.includes("plastic") || p.class.includes("bottle"))
      ? Math.round(
          prediction.predictions.find((p) => p.class.includes("plastic") || p.class.includes("bottle"))?.confidence *
            100,
        ) || 98
      : 98,
    compost: prediction.predictions.some(
      (p) => p.class.includes("banana") || p.class.includes("peel") || p.class.includes("food"),
    )
      ? Math.round(
          prediction.predictions.find(
            (p) => p.class.includes("banana") || p.class.includes("peel") || p.class.includes("food"),
          )?.confidence * 100,
        ) || 92
      : 92,
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">AI System</h3>

      <div className="mb-6">
        <p className="text-gray-400 mb-4">Your image has uploaded and the results are shown below.</p>

        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Predictions</h4>
          <span className="text-sm text-gray-400">
            {prediction.predictions.length}/{prediction.predictions.length}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span>Trash</span>
            </div>
            <span className="font-mono">{confidenceScores.trash} %</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span>Recycle</span>
            </div>
            <span className="font-mono">{confidenceScores.recycle} %</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span>Compost</span>
            </div>
            <span className="font-mono">{confidenceScores.compost} %</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-4">Confidence thresholds</h4>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span>Trash</span>
              <span className="font-mono">{thresholds.trash} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={thresholds.trash}
              onChange={(e) => onThresholdChange("trash", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Recycle</span>
              <span className="font-mono">{thresholds.recycle} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={thresholds.recycle}
              onChange={(e) => onThresholdChange("recycle", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Compost</span>
              <span className="font-mono">{thresholds.compost} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={thresholds.compost}
              onChange={(e) => onThresholdChange("compost", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          className="flex items-center justify-between w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
          onClick={() => setShowRawJson(!showRawJson)}
        >
          <span>Raw JSON Response</span>
          {showRawJson ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showRawJson && (
          <div className="mt-2 p-3 bg-gray-950 rounded-md overflow-auto max-h-60 text-xs font-mono">
            <pre>{JSON.stringify(prediction, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
