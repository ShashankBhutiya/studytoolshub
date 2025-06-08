"use client"

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolCard } from './tool-card'
import type { Tool } from '@/types'

interface ToolsSliderProps {
  tools: Tool[]
  onAddToCompare: (tool: Tool) => void
  compareTools: Tool[]
}

export function ToolsSlider({ tools, onAddToCompare, compareTools }: ToolsSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Check if can scroll left or right
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener('resize', checkScrollability)
    return () => window.removeEventListener('resize', checkScrollability)
  }, [tools])

  // Arrow button navigation
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 300
      const gap = 24
      const scrollAmount = cardWidth + gap
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

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
    scrollContainerRef.current!.style.cursor = 'grabbing'
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    scrollContainerRef.current!.style.cursor = 'grab'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current!.offsetLeft
    const walk = (x - startX) * 1.5 // Scroll speed
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk
    checkScrollability()
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    scrollContainerRef.current!.style.cursor = 'grab'
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleScroll('left')
      } else if (e.key === 'ArrowRight') {
        handleScroll('right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft
    const walk = (x - startX) * 1.5
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk
    checkScrollability()
  }

  return (
    <div className="relative w-full py-8">
      <h2 className="text-2xl font-bold mb-6">Educational Tools</h2>
      
      {/* Container with navigation */}
      <div className="relative">
        {/* Left Arrow Button */}
        <Button
          variant="outline"
          size="icon"
          className={`
            absolute -left-4 top-1/2 -translate-y-1/2 z-10 
            bg-background shadow-lg hover:shadow-xl
            transition-all duration-200
            ${canScrollLeft ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}
          `}
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Right Arrow Button */}
        <Button
          variant="outline"
          size="icon"
          className={`
            absolute -right-4 top-1/2 -translate-y-1/2 z-10 
            bg-background shadow-lg hover:shadow-xl
            transition-all duration-200
            ${canScrollRight ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}
          `}
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Scrollable Container */}
        <div 
          className="overflow-hidden mx-8" // Margin for arrow buttons
        >
          <div
            ref={scrollContainerRef}
            className="
              flex gap-6 overflow-x-auto scrollbar-hide
              cursor-grab select-none
            "
            onScroll={checkScrollability}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {tools.map((tool) => (
              <ToolCard
                key={tool.name}
                tool={tool}
                onAddToCompare={onAddToCompare}
                isInCompare={compareTools.some(t => t.name === tool.name)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Navigation Instructions */}
      <div className="flex justify-center gap-4 mt-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
          <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
          Use arrow keys
        </span>
        <span>• Drag to scroll</span>
        <span>• Click arrows to navigate</span>
      </div>

      {/* Visual scroll indicator */}
      <div className="mt-4 flex justify-center gap-1">
        {Array.from({ length: Math.ceil(tools.length / 3) }).map((_, index) => (
          <div
            key={index}
            className={`
              h-1 w-8 rounded-full transition-colors duration-300
              ${index === Math.floor((scrollContainerRef.current?.scrollLeft || 0) / (324 * 3)) 
                ? 'bg-primary' 
                : 'bg-muted'
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}