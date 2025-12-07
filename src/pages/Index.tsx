import { useState } from 'react';
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

    const mockData: ExcelData = {
      headers: ['Период', 'Доход', 'Расход', 'Прибыль', 'Рост %'],
      rows: [
        ['Янв 2024', 450000, 280000, 170000, 12.5],
        ['Фев 2024', 520000, 310000, 210000, 23.5],
        ['Мар 2024', 480000, 290000, 190000, -7.7],
        ['Апр 2024', 610000, 340000, 270000, 27.1],
        ['Май 2024', 580000, 320000, 260000, -4.9],
        ['Июн 2024', 670000, 380000, 290000, 15.5],
        ['Июл 2024', 720000, 410000, 310000, 7.5],
        ['Авг 2024', 690000, 395000, 295000, -4.2],
        ['Сен 2024', 780000, 440000, 340000, 13.0],
        ['Окт 2024', 820000, 460000, 360000, 5.1],
        ['Ноя 2024', 850000, 480000, 370000, 3.7],
        ['Дек 2024', 920000, 510000, 410000, 8.2],
      ]
    };

    setExcelData(mockData);
    
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        totalRevenue: 7690000,
        avgRevenue: 640833,
        growth: 104.4,
        forecast: 980000,
        insights: [
          'Стабильный рост доходов на протяжении года (+104.4%)',
          'Пиковый период: Q4 2024 (Окт-Дек)',
          'Средняя маржинальность: 42.8%',
          'Минимальный месяц: Январь (450К)'
        ],
        recommendations: [
          'Увеличить инвестиции в маркетинг в Q1 для стабилизации доходов',
          'Оптимизировать расходы в периоды спада (Март, Май, Август)',
          'Масштабировать успешные стратегии Q4 на весь год',
          'Рассмотреть диверсификацию источников дохода'
        ]
      };
      setAnalysis(mockAnalysis);
    }, 1000);
  };

  const analyzeWithAI = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
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
