"use client"

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolCard } from './tool-card'
import type { Tool } from '@/types'

interface ToolsSliderProps {
  tools: Tool[]
  onAddToCompare: (tool: Tool) => void
  compareTools: Tool[]
  title?: string
  subtitle?: string
}

export function ToolsSlider({ 
  tools, 
  onAddToCompare, 
  compareTools,
  title = "Discover Learning Tools",
  subtitle = "Find the perfect tools to accelerate your learning journey"
}: ToolsSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      
      // Calculate scroll progress
      const maxScroll = scrollWidth - clientWidth
      const progress = (scrollLeft / maxScroll) * 100
      setScrollProgress(progress)
    }
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener('resize', checkScrollability)
    return () => window.removeEventListener('resize', checkScrollability)
  }, [tools])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Card width + gap
      const currentScroll = scrollContainerRef.current.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })

      setTimeout(checkScrollability, 300)
    }
  }

  return (
    <div className="w-full py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {title}
          </h2>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Slider Container - Fixed Height */}
      <div className="relative h-[450px]">
        {/* Gradient Overlays for Visual Depth */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className={`
            absolute left-4 top-1/2 -translate-y-1/2 z-20
            bg-background/95 backdrop-blur-sm shadow-lg
            hover:shadow-xl hover:scale-110 transition-all duration-200
            ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={`
            absolute right-4 top-1/2 -translate-y-1/2 z-20
            bg-background/95 backdrop-blur-sm shadow-lg
            hover:shadow-xl hover:scale-110 transition-all duration-200
            ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Cards Container */}
        <div className="h-full flex items-center">
          <div
            ref={scrollContainerRef}
            className="
              flex gap-6 overflow-x-auto scrollbar-hide px-8
              scroll-smooth h-full items-center
            "
            onScroll={checkScrollability}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {tools.map((tool, index) => (
              <div 
                key={tool.name} 
                className="flex-shrink-0 animate-in slide-in-from-bottom-5"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <ToolCard
                  tool={tool}
                  onAddToCompare={onAddToCompare}
                  isInCompare={compareTools.some(t => t.name === tool.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 px-8">
        <div className="relative h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{tools.length} tools available</span>
          <span>{compareTools.length} selected for comparison</span>
        </div>
      </div>
    </div>
  )
}