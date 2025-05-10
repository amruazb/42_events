
import React from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AdminExport = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const handleExportCSV = () => {
    // Here you would normally generate and download a CSV file
    toast({
      title: "Export started",
      description: "Your events are being exported to CSV.",
      variant: "default",
    });
  };
  
  const handleExportCalendar = () => {
    // Here you would normally generate and download an iCal file
    toast({
      title: "Calendar export started",
      description: "Your events are being exported to calendar format.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">{t('admin.exportEvents')}</h2>
      <div className="bg-background/50 backdrop-blur-sm p-6 border rounded-md">
        <p className="text-muted-foreground mb-4">{t('admin.exportDescription')}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleExportCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            {t('admin.exportCSV')}
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleExportCalendar}
          >
            <Download className="mr-2 h-4 w-4" />
            {t('admin.exportCalendar')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminExport;
