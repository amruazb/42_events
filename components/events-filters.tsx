"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function EventsFilters() {
  const router = useRouter()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [categories, setCategories] = useState<Record<string, boolean>>({
    conference: false,
    workshop: false,
    meetup: false,
    webinar: false,
  })

  const handleCategoryChange = (category: string, checked: boolean) => {
    setCategories((prev) => ({
      ...prev,
      [category]: checked,
    }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (startDate) {
      params.append("startDate", startDate)
    }

    if (endDate) {
      params.append("endDate", endDate)
    }

    const selectedCategories = Object.entries(categories)
      .filter(([_, selected]) => selected)
      .map(([category]) => category)

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","))
    }

    router.push(`/?${params.toString()}`)
  }

  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    setCategories({
      conference: false,
      workshop: false,
      meetup: false,
      webinar: false,
    })
    router.push("/")
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Filter Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="space-y-2">
            {Object.entries(categories).map(([category, checked]) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={checked}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                />
                <Label htmlFor={`category-${category}`} className="capitalize">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
