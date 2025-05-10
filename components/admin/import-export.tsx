"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Download, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { Import42Events } from "@/components/admin/import-42-events"

export function AdminImportExport() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Handle CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0])
    }
  }

  // Import events from CSV
  const handleImport = async () => {
    if (!csvFile) {
      toast({
        title: t("error"),
        description: t("please_select_file"),
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    try {
      const formData = new FormData()
      formData.append("file", csvFile)

      const response = await fetch("/api/events/import", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: t("events_imported"),
          description: `${result.imported} ${t("events_imported_count")}`,
        })

        // Reset file input
        setCsvFile(null)

        // Refresh the page
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Import failed")
      }
    } catch (error) {
      console.error("Error importing events:", error)
      toast({
        title: t("error"),
        description: t("error_importing_events"),
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Export events to CSV
  const handleExportCSV = async () => {
    setIsExporting(true)

    try {
      const response = await fetch("/api/events/export?format=csv", {
        method: "GET",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `42-events-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()

        toast({
          title: t("events_exported"),
          description: t("events_exported_csv"),
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("Error exporting events:", error)
      toast({
        title: t("error"),
        description: t("error_exporting_events"),
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Export events to ICS
  const handleExportICS = async () => {
    setIsExporting(true)

    try {
      const response = await fetch("/api/events/export?format=ics", {
        method: "GET",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `42-events-${new Date().toISOString().split("T")[0]}.ics`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()

        toast({
          title: t("events_exported"),
          description: t("events_exported_ics"),
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("Error exporting events:", error)
      toast({
        title: t("error"),
        description: t("error_exporting_events"),
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">{t("import_csv")}</TabsTrigger>
          <TabsTrigger value="import42">{t("import_42")}</TabsTrigger>
          <TabsTrigger value="export">{t("export_events")}</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">{t("select_csv_file")}</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">{t("csv_format")}:</p>
              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                title_en,title_ar,title_fr,description_en,description_ar,description_fr,location_en,location_ar,location_fr,startDate,endDate,category,image,capacity
              </pre>
            </div>

            <Button onClick={handleImport} disabled={!csvFile || isImporting} className="w-full">
              {isImporting ? t("importing") : t("import")}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="import42" className="space-y-6 pt-6">
          <Import42Events />
        </TabsContent>

        <TabsContent value="export" className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{t("export_csv")}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t("export_csv_description")}</p>
              <Button onClick={handleExportCSV} disabled={isExporting} className="w-full">
                {isExporting ? t("exporting") : t("export_csv")}
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{t("export_ics")}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t("export_ics_description")}</p>
              <Button onClick={handleExportICS} disabled={isExporting} className="w-full">
                {isExporting ? t("exporting") : t("export_ics")}
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
