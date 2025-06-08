"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, X } from "lucide-react"
import type { Tool } from "@/types"

interface ToolComparisonProps {
  tools: Tool[]
  onClose: () => void
}

export function ToolComparison({ tools, onClose }: ToolComparisonProps) {
  const categoryLabels: Record<string, string> = {
    VIDEO_LEARNING: "Video Learning",
    PRACTICE_TESTS: "Practice Tests",
    NOTE_TAKING: "Note Taking",
    PROBLEM_SOLVING: "Problem Solving",
    LIVE_CLASSES: "Live Classes",
    DOUBT_SOLVING: "Doubt Solving",
    MOCK_TESTS: "Mock Tests",
    STUDY_PLANNER: "Study Planner",
    FLASHCARDS: "Flashcards",
    REFERENCE_BOOKS: "Reference Books",
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Tool Comparison
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Card key={tool._id} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  {tool.logo && (
                    <img
                      src={tool.logo || "/placeholder.svg"}
                      alt={tool.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                </div>
                <Badge variant="secondary" className="w-fit">
                  {categoryLabels[tool.category] || tool.category}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Pricing</h4>
                  <p className="text-sm">{tool.pricing}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Best For</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.bestFor.map((exam) => (
                      <Badge key={exam} variant="outline" className="text-xs">
                        {exam}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Platforms</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                {tool.features?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Features</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {tool.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tool.pros?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-green-600">Pros</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {tool.pros.slice(0, 3).map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1 text-green-500">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tool.cons?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-red-600">Cons</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {tool.cons.slice(0, 3).map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1 text-red-500">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(tool.website, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
