"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink, Plus, Check, Loader2 } from "lucide-react"
import type { Tool } from "@/types"
import { useState, useEffect } from "react"

interface ToolCardProps {
  tool: Tool
  onAddToCompare: (tool: Tool) => void
  isInCompare: boolean
}

export function ToolCard({ tool, onAddToCompare, isInCompare }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // Show all info on mobile, use hover effect on desktop
  const showDetails = isMobile || isHovered

  return (
    <div className="tool-card-wrapper relative w-[300px]">
      <Card
        className={`tool-card w-full relative transition-all duration-300 ${
          !isMobile && isHovered ? 'tool-card-expanded shadow-lg z-10' : 'h-[140px] overflow-hidden'
        } ${isMobile ? 'h-auto' : ''}`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onFocus={() => !isMobile && setIsHovered(true)}
        onBlur={(e) => {
          // Only blur if focus is leaving the card entirely
          if (!e.currentTarget.contains(e.relatedTarget)) {
            !isMobile && setIsHovered(false)
          }
        }}
        tabIndex={0}
        role="article"
        aria-label={`${tool.name} tool card`}
      >
        {/* Always-visible header with logo and name */}
        <CardHeader className="text-center p-4">
          <div className="relative w-20 h-20 mx-auto">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}
            {imageError ? (
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">No image</span>
              </div>
            ) : (
              <img
                src={tool.logo || "/placeholder.svg"}
                alt={`${tool.name} logo`}
                className={`w-20 h-20 rounded-lg object-cover ${imageLoading ? 'invisible' : 'visible'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>
          <CardTitle className="text-base mt-2">{tool.name}</CardTitle>
        </CardHeader>

        {/* Details section that appears on hover */}
        <CardContent
          className={`tool-card-details px-4 pb-4 transition-all duration-300 ${
            showDetails ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="space-y-2">
            <div className="text-xs">
              <span className="font-medium">Description: </span>
              <span className="text-gray-600">{tool.description}</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{tool.rating}</span>
                <span className="text-xs text-muted-foreground">({tool.reviewCount})</span>
              </div>
            </div>
            
            <div className="text-xs">
              <span className="font-medium">Category: </span>
              <Badge className="text-[10px]">
                {categoryLabels[tool.category] || tool.category}
              </Badge>
            </div>
            
            <div className="text-xs">
              <span className="font-medium">Pricing: </span>
              <span className="text-muted-foreground">{tool.pricing}</span>
            </div>
            
            <div className="text-xs">
              <span className="font-medium">Best For: </span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {tool.bestFor.map((exam: string) => (
                  <Badge key={exam} variant="outline" className="text-[10px]">
                    {exam}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-xs">
              <span className="font-medium">Platforms: </span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {tool.platforms.map((platform: string) => (
                  <Badge key={platform} variant="outline" className="text-[10px]">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(tool.website, "_blank", "noopener,noreferrer");
                }}
                aria-label={`Visit ${tool.name} website`}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit
              </Button>
              <Button
                variant={isInCompare ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCompare(tool);
                }}
                disabled={isInCompare}
                aria-label={isInCompare ? `${tool.name} added to comparison` : `Add ${tool.name} to comparison`}
              >
                {isInCompare ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 mr-1" />
                    Compare
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add custom styles */}
      <style jsx global>{`
        .tool-card-wrapper {
          /* Reserve space for expansion */
          min-height: 140px;
        }
        
        .tool-card {
          transform-origin: top center;
          transition: all 0.3s ease-in-out;
        }
        
        .tool-card-expanded {
          height: auto !important;
          transform: translateY(-10px) scale(1.05);
          position: relative;
        }
        
        .tool-card-details {
          transition: opacity 0.3s ease-in-out, max-height 0.3s ease-in-out;
        }
        
        /* Ensure expanded cards appear above others */
        .tool-card-expanded {
          position: relative;
          z-index: 10;
        }
        
        /* Focus styles for accessibility */
        .tool-card:focus {
          outline: 2px solid rgb(59, 130, 246);
          outline-offset: 2px;
        }
        
        .tool-card:focus:not(:focus-visible) {
          outline: none;
        }
        
        /* Grid container adjustment (add this to your parent grid) */
        .tool-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          align-items: start;
        }
        
        @media (max-width: 767px) {
          .tool-card-wrapper {
            min-height: auto;
          }
          
          .tool-card {
            height: auto !important;
          }
          
          .tool-card-details {
            opacity: 1 !important;
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  )
}