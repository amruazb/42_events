"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"
import { useBroadcastChannel } from "@/hooks/use-broadcast-channel"

export default function CsvImport() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { postMessage } = useBroadcastChannel("events-channel")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      const text = await file.text()
      const rows = text.split("\n")

      // Parse CSV header
      const headers = rows[0].split(",").map((header) => header.trim())

      // Check required columns
      const titleIndex = headers.findIndex((h) => h.toLowerCase() === "title")
      const descriptionIndex = headers.findIndex((h) => h.toLowerCase() === "description")
      const dateIndex = headers.findIndex((h) => h.toLowerCase() === "date")

      if (titleIndex === -1 || descriptionIndex === -1 || dateIndex === -1) {
        throw new Error("CSV must contain title, description, and date columns")
      }

      // Parse data rows
      const events = []

      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue

        const values = parseCSVRow(rows[i])

        if (values.length !== headers.length) {
          toast({
            title: "CSV format error",
            description: `Row ${i} has incorrect number of columns`,
            variant: "destructive",
          })
          continue
        }

        const event: Record<string, any> = {}

        headers.forEach((header, index) => {
          const key = header.toLowerCase()
          const value = values[index]

          if (key === "tags") {
            event[key] = value
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean)
          } else if (key === "date") {
            // Validate date
            const dateObj = new Date(value)
            if (isNaN(dateObj.getTime())) {
              throw new Error(`Invalid date format in row ${i}`)
            }
            event[key] = value
          } else {
            event[key] = value
          }
        })

        events.push(event)
      }

      if (events.length === 0) {
        throw new Error("No valid events found in CSV")
      }

      // Send to API
      const response = await fetch("/api/events/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(events),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to import events")
      }

      const result = await response.json()

      // Refresh the events list
      const eventsResponse = await fetch("/api/events")
      const eventsData = await eventsResponse.json()

      // Broadcast the update to other tabs
      postMessage({
        type: "events-imported",
        count: result.insertedCount,
      })

      toast({
        title: "Import successful",
        description: `Imported ${result.insertedCount} events`,
      })

      // Reset file input
      setFile(null)
      const fileInput = document.getElementById("csv-file") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error) {
      console.error("Error importing CSV:", error)
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import events",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Helper function to parse CSV row handling quoted values
  const parseCSVRow = (row: string): string[] => {
    const result = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Events from CSV</CardTitle>
        <CardDescription>Upload a CSV file to bulk import events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>CSV file must include the following columns:</p>
            <ul className="ml-4 list-disc">
              <li>title (required)</li>
              <li>description (required)</li>
              <li>date (required, in ISO format)</li>
              <li>location (optional)</li>
              <li>tags (optional, comma separated)</li>
            </ul>
          </div>

          <div className="text-sm">
            <p>Example CSV format:</p>
            <pre className="mt-1 rounded bg-muted p-2 text-xs">
              title,description,date,location,tags
              <br />
              "Conference 2023","Annual tech conference","2023-12-15T09:00:00","Convention Center","tech,conference"
            </pre>
          </div>

          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload and Import"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
