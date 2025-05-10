"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, RefreshCw, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AdminImportExport() {
  const { t } = useLanguage()
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [mediaFiles, setMediaFiles] = useState<{ [key: string]: File }>({})
  const [error, setError] = useState<string | null>(null)

  // Handle CSV file selection
  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0])
      setError(null)
    }
  }

  // Handle media file selection
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newMediaFiles = { ...mediaFiles }
      Array.from(e.target.files).forEach((file) => {
        newMediaFiles[file.name] = file
      })
      setMediaFiles(newMediaFiles)
      setError(null)
    }
  }

  // Handle import from 42 API
  const handleImport = async () => {
    setIsImporting(true)
    setError(null)
    try {
      const response = await fetch("/api/42/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to import events")
      }

      // Refresh the page to show updated events
      window.location.reload()
    } catch (error) {
      console.error("Error importing events:", error)
      setError(t("error_importing_events"))
    } finally {
      setIsImporting(false)
    }
  }

  // Handle CSV import
  const handleCsvImport = async () => {
    if (!csvFile) {
      setError(t("please_select_csv_file"))
      return
    }

    setIsImporting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("csv", csvFile)
      
      // Append media files
      Object.entries(mediaFiles).forEach(([filename, file]) => {
        formData.append("media", file)
      })

      const response = await fetch("/api/events/import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to import events from CSV")
      }

      // Clear files
      setCsvFile(null)
      setMediaFiles({})
      
      // Refresh the page to show updated events
      window.location.reload()
    } catch (error) {
      console.error("Error importing events:", error)
      setError(t("error_importing_events"))
    } finally {
      setIsImporting(false)
    }
  }

  // Handle export to JSON
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const events = await response.json()
      const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "42-events.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting events:", error)
      setError(t("error_exporting_events"))
    } finally {
      setIsExporting(false)
    }
  }

  // Handle refresh from 42 API
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      const response = await fetch("/api/42/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to refresh events")
      }

      // Refresh the page to show updated events
      window.location.reload()
    } catch (error) {
      console.error("Error refreshing events:", error)
      setError(t("error_refreshing_events"))
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-[#242424] p-1">
          <TabsTrigger value="import" className="data-[state=active]:bg-[#1A1A1A]">
            {t("import")}
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-[#1A1A1A]">
            {t("export")}
          </TabsTrigger>
          <TabsTrigger value="refresh" className="data-[state=active]:bg-[#1A1A1A]">
            {t("refresh")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          <Card className="bg-[#242424] border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">{t("import_from_csv")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file" className="text-white">{t("select_csv_file")}</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvChange}
                  className="bg-[#1A1A1A] border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-files" className="text-white">{t("select_media_files")}</Label>
                <Input
                  id="media-files"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaChange}
                  className="bg-[#1A1A1A] border-gray-700 text-white"
                />
                {Object.keys(mediaFiles).length > 0 && (
                  <p className="text-sm text-gray-400">
                    {t("selected_files")}: {Object.keys(mediaFiles).join(", ")}
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-400">
                <p className="mb-2">{t("csv_format")}:</p>
                <pre className="bg-[#1A1A1A] p-3 rounded-md overflow-x-auto border border-gray-700">
                  title_en,title_ar,title_fr,description_en,description_ar,description_fr,location_en,location_ar,location_fr,startDate,endDate,category,image,capacity
                </pre>
              </div>

              <Button
                onClick={handleCsvImport}
                disabled={!csvFile || isImporting}
                className="w-full bg-[#1A1A1A] text-white hover:bg-gray-800 border border-gray-700"
              >
                <FileText className={`h-4 w-4 mr-2 ${isImporting ? "animate-spin" : ""}`} />
                {isImporting ? t("importing") : t("import_csv")}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#242424] border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">{t("import_from_42")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">{t("import_description")}</p>
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="w-full bg-[#1A1A1A] text-white hover:bg-gray-800 border border-gray-700"
              >
                <Upload className={`h-4 w-4 mr-2 ${isImporting ? "animate-spin" : ""}`} />
                {isImporting ? t("importing") : t("import_from_42")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card className="bg-[#242424] border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">{t("export_events")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">{t("export_description")}</p>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-[#1A1A1A] text-white hover:bg-gray-800 border border-gray-700"
              >
                <Download className={`h-4 w-4 mr-2 ${isExporting ? "animate-spin" : ""}`} />
                {isExporting ? t("exporting") : t("export_to_json")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refresh">
          <Card className="bg-[#242424] border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">{t("refresh_events")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">{t("refresh_description")}</p>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full bg-[#1A1A1A] text-white hover:bg-gray-800 border border-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? t("refreshing") : t("refresh_from_42")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
