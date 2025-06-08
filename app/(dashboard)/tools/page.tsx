"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ToolCard } from "@/components/tools/tool-card"
import { ToolComparison } from "@/components/tools/tool-comparison"
import { Search, X } from "lucide-react"
import type { Tool } from "@/types"

const categories = [
  { value: "CLASS_NOTES", label: "Class Notes" },
  { value: "TIME_MANAGEMENT", label: "Time Management" },
  { value: "PRODUCTIVITY_TOOLS", label: "Productivity Tools" },
  { value: "FLASHCARDS", label: "Flashcards" },
  { value: "REFERENCE_BOOKS", label: "Reference Books" },
  { value: "STUDY_PLANNER", label: "Study Planner" },
  { value: "RESOURCE_AGGREGATORS", label: "Resource Aggregators" }, 
  { value: "POMODORO", label: "Pomodoro" },
  { value: "REVISION_TOOLS", label: "Revision Tools" },
  { value: "QUIZ_APPS", label: "Quiz Apps" },
  { value: "COLLABORATION_TOOLS", label: "Collaboration Tools" },
  { value: "VOICE_TO_NOTES", label: "Voice to Notes" },
  { value: "MINI_NOTESCLIP_TODO", label: "Mini Notesclip and Todo" },
  { value: "SCHEDULE_PLANNER", label: "Schedule Planner" },
  { value: "HOMEWORK_HELP", label: "Homework Help" },
  { value: "COMMON_DISCUSSION_FORUM", label: "Common Discussion Forum"},
  { value: "VIDEO_LEARNING", label: "Video Learning" },
  { value: "PRACTICE_TESTS", label: "Practice Tests" },
  { value: "NOTE_TAKING", label: "Note Taking" },
  { value: "PROBLEM_SOLVING", label: "Problem Solving" },
  { value: "LIVE_CLASSES", label: "Live Classes" },
  { value: "DOUBT_SOLVING", label: "Doubt Solving" },
  { value: "MOCK_TESTS", label: "Mock Tests" },
  { value: "Chrome Extentions", label: "Chrome Extention" }
  
]

export default function ToolsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("category") || "ALL_CATEGORIES")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [compareTools, setCompareTools] = useState<Tool[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const { data: tools, isLoading } = useQuery({
    queryKey: ["tools", searchTerm, selectedCategory, selectedPlatform],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory && selectedCategory !== "ALL_CATEGORIES") params.append("category", selectedCategory)
      if (selectedPlatform) params.append("platform", selectedPlatform)

      const response = await fetch(`/api/tools?${params}`)
      if (!response.ok) throw new Error("Failed to fetch tools")
      return response.json()
    },
  })

  const addToCompare = (tool: Tool) => {
    if (compareTools.length >= 4) {
      alert("You can compare maximum 4 tools at a time")
      return
    }
    if (compareTools.find((t) => t._id === tool._id)) {
      return
    }
    setCompareTools([...compareTools, tool])
  }

  const removeFromCompare = (toolId: string) => {
    setCompareTools(compareTools.filter((t) => t._id !== toolId))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("ALL_CATEGORIES")
    setSelectedPlatform("")
  }

  // Apply search filtering (applied on top of fetched data)
  const filteredTools = (tools || []).filter((tool: Tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Updated filtering: Check the tool's bestFor array instead of a 'category' property.
  const getCategoryTools = (categoryValue: string) =>
    filteredTools.filter((tool: Tool) => tool.bestFor && tool.bestFor.includes(categoryValue))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Study Tools Directory</h1>
        <p className="text-muted-foreground">
          Discover and compare the best study tools for JEE and NEET preparation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_CATEGORIES">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_PLATFORMS">All Platforms</SelectItem>
              <SelectItem value="WEB">Web</SelectItem>
              <SelectItem value="ANDROID">Android</SelectItem>
              <SelectItem value="IOS">iOS</SelectItem>
              <SelectItem value="DESKTOP">Desktop</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary">
              Search: {searchTerm}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchTerm("")} />
            </Badge>
          )}
          {selectedCategory !== "ALL_CATEGORIES" && (
            <Badge variant="secondary">
              Category: {categories.find((c) => c.value === selectedCategory)?.label}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory("ALL_CATEGORIES")} />
            </Badge>
          )}
          {selectedPlatform !== "ALL_PLATFORMS" && (
            <Badge variant="secondary">
              Platform: {selectedPlatform}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedPlatform("")} />
            </Badge>
          )}
        </div>
      </div>

      {/* Compare Tools Bar */}
      {compareTools.length > 0 && (
        <div className="mb-8 p-4 bg-secondary rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Compare Tools ({compareTools.length}/4):</span>
              <div className="flex flex-wrap gap-2">
                {compareTools.map((tool) => (
                  <Badge key={tool._id} variant="default">
                    {tool.name}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFromCompare(tool._id)} />
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowComparison(true)} disabled={compareTools.length < 2}>
                Compare
              </Button>
              <Button variant="outline" onClick={() => setCompareTools([])}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tools Display as Horizontal Sliders by Category */}
      {isLoading ? (
        <p className="text-center">Loading tools...</p>
      ) : (
        selectedCategory !== "ALL_CATEGORIES" ? (
          // When a specific category is selected, show one horizontal slider.
          <>
            {getCategoryTools(selectedCategory).length > 0 ? (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">
                  {categories.find((cat) => cat.value === selectedCategory)?.label}
                </h2>
                <div className="flex space-x-4 overflow-x-auto">
                  {getCategoryTools(selectedCategory).map((tool: Tool) => (
                    <ToolCard
                      key={tool._id}
                      tool={tool}
                      onAddToCompare={addToCompare}
                      isInCompare={compareTools.some((t) => t._id === tool._id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center">No tools found for this category.</p>
            )}
          </>
        ) : (
          // Otherwise, show a slider for each category.
          categories.map((cat) => {
            const categoryTools = getCategoryTools(cat.value)
            return (
              categoryTools.length > 0 && (
                <div key={cat.value} className="mb-8">
                  <h2 className="text-lg font-semibold mb-2">{cat.label}</h2>
                  <div className="flex space-x-4 overflow-x-auto">
                    {categoryTools.map((tool: Tool) => (
                      <ToolCard
                        key={tool._id}
                        tool={tool}
                        onAddToCompare={addToCompare}
                        isInCompare={compareTools.some((t) => t._id === tool._id)}
                      />
                    ))}
                  </div>
                </div>
              )
            )
          })
        )
      )}

      {/* Tool Comparison Modal */}
      {showComparison && <ToolComparison tools={compareTools} onClose={() => setShowComparison(false)} />}
    </div>
  )
}
