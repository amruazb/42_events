
import React from "react";
import { useTranslation } from "react-i18next";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const CSVFormatGuide = () => {
  const { t } = useTranslation();

  const csvColumns = [
    { name: 'titleEn', description: t('admin.csvFormat.titleEn'), example: 'Introduction to AI' },
    { name: 'titleAr', description: t('admin.csvFormat.titleAr'), example: 'مقدمة في الذكاء الاصطناعي' },
    { name: 'titleFr', description: t('admin.csvFormat.titleFr'), example: 'Introduction à l\'IA' },
    { name: 'descriptionEn', description: t('admin.csvFormat.descriptionEn'), example: 'Learn the basics of artificial intelligence' },
    { name: 'descriptionAr', description: t('admin.csvFormat.descriptionAr'), example: 'تعلم أساسيات الذكاء الاصطناعي' },
    { name: 'descriptionFr', description: t('admin.csvFormat.descriptionFr'), example: 'Apprenez les bases de l\'intelligence artificielle' },
    { name: 'date', description: t('admin.csvFormat.date'), example: '2025-06-15' },
    { name: 'time', description: t('admin.csvFormat.time'), example: '14:00-17:00' },
    { name: 'location', description: t('admin.csvFormat.location'), example: 'Main Auditorium' },
    { name: 'organizer', description: t('admin.csvFormat.organizer'), example: 'Dr. Sarah Johnson' }
  ];

  const generateSampleCSV = () => {
    // Create CSV header
    const header = csvColumns.map(col => col.name).join(',');
    
    // Create a sample row
    const sampleRow = csvColumns.map(col => col.example).join(',');
    
    // Combine header and row
    const csvContent = `${header}\n${sampleRow}`;
    
    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'event_template.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('admin.csvFormat.title')}</h3>
        <Button 
          onClick={generateSampleCSV} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          {t('admin.csvFormat.downloadTemplate')}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {t('admin.csvFormat.description')}
      </p>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.csvFormat.columnName')}</TableHead>
              <TableHead>{t('admin.csvFormat.description')}</TableHead>
              <TableHead>{t('admin.csvFormat.example')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvColumns.map((column) => (
              <TableRow key={column.name}>
                <TableCell className="font-mono">{column.name}</TableCell>
                <TableCell>{column.description}</TableCell>
                <TableCell className="font-mono text-xs">{column.example}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300">
        <p>{t('admin.csvFormat.note')}</p>
      </div>
    </div>
  );
};

export default CSVFormatGuide;
