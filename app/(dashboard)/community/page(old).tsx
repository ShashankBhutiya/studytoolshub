"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Heart, MessageCircle, Plus, Search } from "lucide-react"
import type { ForumPost } from "@/types"
import { useToast } from "@/hooks/use-toast"

const categories = [
  { value: "GENERAL", label: "General Discussion" },
  { value: "JEE", label: "JEE Preparation" },
  { value: "NEET", label: "NEET Preparation" },
  { value: "TOOLS", label: "Study Tools" },
  { value: "STUDY_TIPS", label: "Study Tips" },
  { value: "MOTIVATION", label: "Motivation" },
]

export default function CommunityPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("GENERAL") // Updated default value
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "GENERAL", // Updated default value
    tags: "",
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: posts, isLoading } = useQuery({
    queryKey: ["forum-posts", searchTerm, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory) params.append("category", selectedCategory)

      const response = await fetch(`/api/community/posts?${params}`)
      if (!response.ok) throw new Error("Failed to fetch posts")
      return response.json()
    },
  })

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })
      if (!response.ok) throw new Error("Failed to create post")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] })
      setIsCreateDialogOpen(false)
      setNewPost({ title: "", content: "", category: "GENERAL", tags: "" }) // Updated default value
      toast({
        title: "Success",
        description: "Post created successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    },
  })

  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to like post")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] })
    },
  })

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const tags = newPost.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    createPostMutation.mutate({
      ...newPost,
      tags,
    })
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground">Connect with fellow JEE and NEET aspirants</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title..."
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your post content..."
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="study tips, motivation, jee mains..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost} disabled={createPostMutation.isPending}>
                    {createPostMutation.isPending ? "Creating..." : "Create Post"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts?.map((post: ForumPost) => (
            <Card key={post._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>By {post.author.name}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <Badge variant="secondary">
                        {categories.find((c) => c.value === post.category)?.label || post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likePostMutation.mutate(post._id)}
                    className="flex items-center space-x-1"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        post.likes.includes(session?.user?.email || "") ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                            <span>{post.likes.length}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments.length}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
