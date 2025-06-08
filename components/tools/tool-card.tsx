"use client"

import { memo, useMemo, useState} from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink, Plus, Check, TrendingUp, Globe, Smartphone, Monitor, Apple } from "lucide-react"
import type { Tool } from "@/types"
import { cn } from "@/lib/utils"

// Constants moved outside component for better performance
const CATEGORY_CONFIG = {
  VIDEO_LEARNING: { label: "Video Learning", color: "blue" },
  PRACTICE_TESTS: { label: "Practice Tests", color: "purple" },
  NOTE_TAKING: { label: "Note Taking", color: "green" },
  PROBLEM_SOLVING: { label: "Problem Solving", color: "orange" },
  LIVE_CLASSES: { label: "Live Classes", color: "red" },
  DOUBT_SOLVING: { label: "Doubt Solving", color: "indigo" },
  MOCK_TESTS: { label: "Mock Tests", color: "pink" },
  STUDY_PLANNER: { label: "Study Planner", color: "cyan" },
  FLASHCARDS: { label: "Flashcards", color: "amber" },
  REFERENCE_BOOKS: { label: "Reference Books", color: "teal" },
} as const

const getCategoryStyles = (color: string) => ({
  blue: "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400",
  purple: "bg-purple-500/10 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400",
  green: "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400",
  orange: "bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400",
  red: "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400",
  indigo: "bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400",
  pink: "bg-pink-500/10 text-pink-700 border-pink-200 dark:bg-pink-500/20 dark:text-pink-400",
  cyan: "bg-cyan-500/10 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400",
  amber: "bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400",
  teal: "bg-teal-500/10 text-teal-700 border-teal-200 dark:bg-teal-500/20 dark:text-teal-400",
}[color] || "")

// Platform icon mapping
const PLATFORM_ICONS = {
  'Web': Globe,
  'Android': Smartphone,
  'iOS': Apple,
  'Desktop': Monitor,
} as const

// Separate small components
const PopularBadge = memo(() => (
  <Badge className="absolute top-2 left-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-[10px] px-2 py-0.5 shadow-sm">
    <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
    Popular
  </Badge>
))

const PlatformIcons = memo(({ platforms }: { platforms: string[] }) => (
  <div className="absolute top-2 right-2 z-20 flex gap-1">
    {platforms.map((platform) => {
      const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || Globe
      return (
        <div
          key={platform}
          className="w-7 h-7 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm flex items-center justify-center backdrop-blur-sm"
          title={platform}
        >
          <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </div>
      )
    })}
  </div>
))

const RatingBadge = memo(({ rating, reviewCount }: { rating: number; reviewCount: number }) => (
  <div className="flex items-center space-x-1 bg-yellow-50/90 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
    <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">{rating?.toFixed(1)}</span>
    <span className="text-[10px] text-yellow-600 dark:text-yellow-500">({reviewCount})</span>
  </div>
))

interface ToolCardProps {
  tool: Tool
  onAddToCompare: (tool: Tool) => void
  isInCompare: boolean
}

export const ToolCard = memo(function ToolCard({ tool, onAddToCompare, isInCompare }: ToolCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  
  const isPopular = tool.rating >= 4.5
  const categoryConfig = CATEGORY_CONFIG[tool.category as keyof typeof CATEGORY_CONFIG]
  const categoryStyles = useMemo(() => 
    getCategoryStyles(categoryConfig?.color || ""), 
    [categoryConfig]
  )

  const handleVisitClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(tool.website, "_blank", "noopener,noreferrer")
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isInCompare) {
      onAddToCompare(tool)
    }
  }

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  return (
    <Card 
      className={cn(
        "w-[280px] flex flex-col",
        "relative overflow-hidden flex-shrink-0",
        "transition-all duration-300 ease-out cursor-pointer",
        "hover:shadow-2xl hover:-translate-y-1",
        "group focus-within:ring-2 focus-within:ring-primary/20",
        // Dynamic height based on description expansion
        isDescriptionExpanded ? "h-auto min-h-[340px]" : "h-[340px]"
      )}
      role="article"
      aria-label={`${tool.name} tool card`}
    >
      {/* Large Image Header with Overlay Info */}
      <div className="relative h-[140px] flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Background Image */}
        <img
          src={tool.logo || "/placeholder.svg"}
          alt={`${tool.name} logo`}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        
        {isPopular && <PopularBadge />}
        <PlatformIcons platforms={tool.platforms} />
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
            {tool.name}
          </h3>
        </div>
      </div>

      {/* Compact Content Section */}
      <CardContent className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <RatingBadge rating={tool.rating} reviewCount={tool.reviewCount} />
            <Badge className={cn("text-[10px]", categoryStyles)}>
              {categoryConfig?.label || tool.category}
            </Badge>
          </div>
          
          {/* Expandable Description */}
          <div 
            className="cursor-pointer"
            onClick={handleDescriptionClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleDescriptionClick(e as any)
              }
            }}
          >
            <p className={cn(
              "text-xs text-muted-foreground transition-all duration-200",
              !isDescriptionExpanded && "line-clamp-2",
              "hover:text-foreground"
            )}>
              {tool.description}
            </p>
            {tool.description.length > 100 && (
              <button 
                className="text-xs text-primary hover:text-primary/80 mt-1 font-medium"
                aria-label={isDescriptionExpanded ? "Show less" : "Show more"}
              >
                {isDescriptionExpanded ? "Show less" : "Read more..."}
              </button>
            )}
          </div>

          {/* Best For - Compact */}
          <div className="flex flex-wrap gap-1">
            {tool.bestFor.slice(0, 3).map((exam) => (
              <Badge key={exam} variant="outline" className="text-[10px] h-5 px-1.5">
                {exam}
              </Badge>
            ))}
            {tool.bestFor.length > 3 && (
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-muted">
                +{tool.bestFor.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs hover:bg-primary hover:text-primary-foreground transition-colors group/btn"
            onClick={handleVisitClick}
            aria-label={`Visit ${tool.name} website`}
          >
            <ExternalLink className="h-3 w-3 mr-1 group-hover/btn:rotate-12 transition-transform" aria-hidden="true" />
            Visit
          </Button>
          <Button
            variant={isInCompare ? "default" : "outline"}
            size="sm"
            className={cn(
              "flex-1 h-8 text-xs transition-all",
              isInCompare 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'hover:bg-primary hover:text-primary-foreground'
            )}
            onClick={handleCompareClick}
            disabled={isInCompare}
            aria-label={isInCompare ? `${tool.name} added to comparison` : `Add ${tool.name} to comparison`}
          >
            {isInCompare ? (
              <>
                 <Check className="h-3 w-3 mr-1" aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                Compare
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

// Skeleton loader with new design
export const ToolCardSkeleton = () => (
  <Card className="w-[280px] h-[340px] animate-pulse">
    <div className="h-[140px] bg-muted" />
    <CardContent className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 bg-muted rounded-full" />
        <div className="h-5 w-24 bg-muted rounded" />
      </div>
      <div className="h-3 w-full bg-muted rounded" />
      <div className="h-3 w-3/4 bg-muted rounded" />
      <div className="flex gap-1">
        <div className="h-5 w-16 bg-muted rounded" />
        <div className="h-5 w-16 bg-muted rounded" />
        <div className="h-5 w-16 bg-muted rounded" />
      </div>
      <div className="flex gap-2 mt-auto">
        <div className="h-8 flex-1 bg-muted rounded" />
        <div className="h-8 flex-1 bg-muted rounded" />
      </div>
    </CardContent>
  </Card>
)

// Optional: Export category config for use in other components
export { CATEGORY_CONFIG, getCategoryStyles }