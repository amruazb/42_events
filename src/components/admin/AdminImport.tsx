
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import MediaUpload from "@/components/MediaUpload";
import CSVFormatGuide from "@/components/CSVFormatGuide";

const AdminImport = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  const handleImportCSV = () => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally process the CSV file
    toast({
      title: "Import started",
      description: "Your events are being imported. This may take a few moments.",
      variant: "default",
    });
    
    // Reset the file input
    setCsvFile(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">{t('admin.importEvents')}</h2>
      <div className="bg-background/50 backdrop-blur-sm p-6 border rounded-md">
        <p className="text-muted-foreground mb-4">{t('admin.importDescription')}</p>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">{t('admin.csvImport')}</h3>
            <div className="flex flex-col gap-4">
              <Input 
                type="file" 
                accept=".csv" 
                className="bg-background" 
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleImportCSV}
              >
                <FileUp className="mr-2 h-4 w-4" />
                {t('admin.upload')}
              </Button>
            </div>
          </div>
          
          <CSVFormatGuide />

          <div>
            <h3 className="text-lg font-medium mb-3">{t('admin.mediaImport')}</h3>
            <MediaUpload
              type="all"
              onFileSelect={(file) => {
                console.log('Media file selected:', file);
                toast({
                  title: "Media uploaded",
                  description: `File "${file.name}" has been uploaded successfully.`,
                  variant: "default",
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminImport;
