import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface FileUploadZoneProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadZone({ onFileUpload }: FileUploadZoneProps) {
  return (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <Icon name="Upload" size={48} className="text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Загрузите Excel файл</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Поддержка форматов .xlsx, .xls, .csv для автоматического анализа финансовых отчётов
        </p>
        <label htmlFor="file-upload">
          <Button size="lg" className="cursor-pointer">
            <Icon name="FileSpreadsheet" size={20} className="mr-2" />
            Выбрать файл
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={onFileUpload}
          />
        </label>
      </CardContent>
    </Card>
  );
}
