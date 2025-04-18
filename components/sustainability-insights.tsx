"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Leaf, Recycle, AlertTriangle, Lightbulb } from "lucide-react"
import type { GeminiInsight } from "./trashx-dashboard"

interface SustainabilityInsightsProps {
  insights: GeminiInsight
}

export function SustainabilityInsights({ insights }: SustainabilityInsightsProps) {
  const [openSection, setOpenSection] = useState<string>("description")

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection("")
    } else {
      setOpenSection(section)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-fadeIn">
      <div className="flex items-center mb-6">
        <Leaf className="h-6 w-6 text-green-500 mr-2" />
        <h3 className="text-xl font-semibold">Sustainability Insights</h3>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <button
            className={`flex items-center justify-between w-full p-4 text-left ${
              openSection === "description" ? "bg-gray-800" : "bg-gray-900"
            }`}
            onClick={() => toggleSection("description")}
          >
            <div className="flex items-center">
              <Recycle className="h-5 w-5 text-blue-400 mr-2" />
              <span className="font-medium">Item Description</span>
            </div>
            {openSection === "description" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {openSection === "description" && (
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <h4 className="font-medium text-lg mb-2">{insights.itemName}</h4>
              <p className="text-gray-400">{insights.description}</p>
            </div>
          )}
        </div>

        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <button
            className={`flex items-center justify-between w-full p-4 text-left ${
              openSection === "carbon" ? "bg-gray-800" : "bg-gray-900"
            }`}
            onClick={() => toggleSection("carbon")}
          >
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium">Carbon Footprint</span>
            </div>
            {openSection === "carbon" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {openSection === "carbon" && (
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <p className="text-gray-400">{insights.carbonFootprint}</p>
            </div>
          )}
        </div>

        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <button
            className={`flex items-center justify-between w-full p-4 text-left ${
              openSection === "disposal" ? "bg-gray-800" : "bg-gray-900"
            }`}
            onClick={() => toggleSection("disposal")}
          >
            <div className="flex items-center">
              <Recycle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Disposal Advice</span>
            </div>
            {openSection === "disposal" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {openSection === "disposal" && (
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <pre className="text-gray-400 whitespace-pre-line font-sans">{insights.disposalAdvice}</pre>
            </div>
          )}
        </div>

        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <button
            className={`flex items-center justify-between w-full p-4 text-left ${
              openSection === "alternatives" ? "bg-gray-800" : "bg-gray-900"
            }`}
            onClick={() => toggleSection("alternatives")}
          >
            <div className="flex items-center">
              <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="font-medium">Sustainable Alternatives</span>
            </div>
            {openSection === "alternatives" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {openSection === "alternatives" && (
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                {insights.sustainableAlternatives.map((alternative, index) => (
                  <li key={index}>{alternative}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
