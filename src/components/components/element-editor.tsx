"use client"

import { useState, useEffect } from "react"
import { useEditor } from "./editor-provider"
import { useOrg } from "./org-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { X, Type, Palette } from "lucide-react"

export function ElementEditor() {
  const { state, dispatch } = useEditor()
  const { orgId } = useOrg()
  const [uploading, setUploading] = useState(false)

  if (!state.activeElement) return null

  const elementId = state.activeElement
  let element = state.elements[elementId]

  // Initialize element if it doesn't exist
  useEffect(() => {
    if (!element && elementId) {
      const elementType =
        document.querySelector(`[data-element-id="${elementId}"]`)?.getAttribute("data-element-type") || "text"
      const newElement = {
        id: elementId,
        type: elementType,
        content: "",
        visible: true,
      }
      dispatch({
        type: "UPDATE_ELEMENT",
        elementId,
        data: newElement,
      })
    }
  }, [elementId, element, dispatch])

  // Return early if element is still being initialized
  if (!element) return null

  const handleUpdate = (field: string, value: any) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      elementId,
      data: { ...element, [field]: value },
    })
  }

  const handleClose = () => {
    dispatch({ type: "SET_ACTIVE_ELEMENT", elementId: null })
  }

  const renderContentEditor = () => {
    switch (element.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Text Content</Label>
              <Textarea
                id="content"
                value={element.content || ""}
                onChange={(e) => handleUpdate("content", e.target.value)}
                placeholder="Enter text content..."
                className="mt-1"
              />
            </div>
          </div>
        )
      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Button Text</Label>
              <Input
                id="content"
                value={element.content || ""}
                onChange={(e) => handleUpdate("content", e.target.value)}
                placeholder="Button text..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                value={element.link || ""}
                onChange={(e) => handleUpdate("link", e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>
        )
      case "section":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Section Visibility</Label>
              <Switch
                id="visible"
                checked={element.visible ?? true}
                onCheckedChange={(checked) => handleUpdate("visible", checked)}
              />
            </div>
          </div>
        )
      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="imgsrc">Image URL</Label>
              <Input
                id="imgsrc"
                value={element.src || ""}
                onChange={(e) => handleUpdate("src", e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="imgfile">Upload</Label>
              <Input
                id="imgfile"
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploading(true)
                  const fd = new FormData()
                  fd.append("file", file)
                  try {
                    const res = await fetch(`/api/upload?orgId=${encodeURIComponent(orgId)}`, {
                      method: "POST",
                      body: fd,
                    })
                    const json = await res.json()
                    if (!res.ok) throw new Error(json.error || "Upload failed")
                    handleUpdate("src", json.url)
                  } catch (err) {
                    alert("Upload failed")
                  } finally {
                    setUploading(false)
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Uploads persist to Vercel Blob; URL will be saved on "Save changes".
              </p>
            </div>
            {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
          </div>
        )
      default:
        return <p>No editor available for this element type.</p>
    }
  }

  const renderStyleEditor = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="background">Background Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="background"
              type="color"
              value={element.background || "#ffffff"}
              onChange={(e) => handleUpdate("background", e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              value={element.background || "#ffffff"}
              onChange={(e) => handleUpdate("background", e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>
        {element.type === "text" && (
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="textColor"
                type="color"
                value={element.textColor || "#000000"}
                onChange={(e) => handleUpdate("textColor", e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={element.textColor || "#000000"}
                onChange={(e) => handleUpdate("textColor", e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        )}
        <div>
          <Label>Opacity: {Math.round((element.opacity ?? 1) * 100)}%</Label>
          <Slider
            value={[element.opacity ?? 1]}
            onValueChange={([value]) => handleUpdate("opacity", value)}
            max={1}
            min={0}
            step={0.1}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Blur: {element.blur ?? 0}px</Label>
          <Slider
            value={[element.blur ?? 0]}
            onValueChange={([value]) => handleUpdate("blur", value)}
            max={10}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Grayscale: {element.grayscale ?? 0}%</Label>
          <Slider
            value={[element.grayscale ?? 0]}
            onValueChange={([value]) => handleUpdate("grayscale", value)}
            max={100}
            min={0}
            step={5}
            className="mt-2"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-white border rounded-lg shadow-lg z-40 overflow-hidden">
      <Card className="h-full border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Edit {element.type}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Tabs defaultValue={state.mode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Style
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
              {renderContentEditor()}
            </TabsContent>
            <TabsContent value="style" className="mt-4">
              {renderStyleEditor()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
