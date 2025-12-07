import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import FileUploadZone from '@/components/FileUploadZone';
import DataTableTab from '@/components/DataTableTab';
import AnalysisTab from '@/components/AnalysisTab';
import ChartsTab from '@/components/ChartsTab';

interface ExcelData {
  headers: string[];
  rows: (string | number)[][];
}

interface AnalysisResult {
  totalRevenue: number;
  avgRevenue: number;
  growth: number;
  forecast: number;
  insights: string[];
  recommendations: string[];
}

export default function Index() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
      
      if (jsonData.length > 0) {
        const headers = jsonData[0].map(h => String(h));
        const rows = jsonData.slice(1);
        
        setExcelData({ headers, rows });
      }
    };
    reader.readAsBinaryString(file);
  };

  const analyzeWithAI = async () => {
    if (!excelData) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6a0bf242-3aa7-4c36-afdb-b25d9712b461', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ excelData }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredRows = excelData?.rows.filter(row =>
    row.some(cell => 
      cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <Icon name="BarChart3" size={36} className="text-primary" />
              Excel Аналитика
            </h1>
            <p className="text-muted-foreground mt-2">
              ИИ-платформа для глубокого анализа финансовых данных
            </p>
          </div>
          {excelData && (
            <Button onClick={analyzeWithAI} disabled={isAnalyzing} size="lg">
              <Icon name="Sparkles" size={20} className="mr-2" />
              {isAnalyzing ? 'Анализирую...' : 'ИИ Анализ'}
            </Button>
          )}
        </div>

        {!excelData ? (
          <FileUploadZone onFileUpload={handleFileUpload} />
        ) : (
          <Tabs defaultValue="table" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="table">
                <Icon name="Table" size={16} className="mr-2" />
                Таблица
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Icon name="TrendingUp" size={16} className="mr-2" />
                Анализ
              </TabsTrigger>
              <TabsTrigger value="charts">
                <Icon name="PieChart" size={16} className="mr-2" />
                Графики
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <DataTableTab 
                excelData={excelData}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filteredRows={filteredRows}
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <AnalysisTab 
                isAnalyzing={isAnalyzing}
                analysis={analysis}
              />
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              <ChartsTab excelData={excelData} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}