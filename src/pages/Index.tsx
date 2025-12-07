import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

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
                  onChange={handleFileUpload}
                />
              </label>
            </CardContent>
          </Card>
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
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Данные таблицы</CardTitle>
                      <CardDescription>
                        {excelData.rows.length} записей загружено
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                      />
                      <Button variant="outline" size="icon">
                        <Icon name="Download" size={18} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {excelData.headers.map((header, idx) => (
                            <TableHead key={idx} className="font-semibold">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRows.map((row, rowIdx) => (
                          <TableRow key={rowIdx} className="hover:bg-muted/50">
                            {row.map((cell, cellIdx) => (
                              <TableCell key={cellIdx}>
                                {cellIdx === 4 && typeof cell === 'number' ? (
                                  <Badge variant={cell >= 0 ? "default" : "destructive"}>
                                    {cell >= 0 ? '+' : ''}{cell}%
                                  </Badge>
                                ) : cellIdx >= 1 && cellIdx <= 3 ? (
                                  <span className="font-mono">
                                    {typeof cell === 'number' ? cell.toLocaleString('ru-RU') + ' ₽' : cell}
                                  </span>
                                ) : cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {isAnalyzing ? (
                <Card>
                  <CardContent className="py-16">
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div className="relative">
                        <Icon name="Bot" size={64} className="text-primary animate-pulse" />
                        <div className="absolute -top-2 -right-2">
                          <Icon name="Sparkles" size={24} className="text-secondary animate-spin" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold">ИИ анализирует данные...</h3>
                        <p className="text-muted-foreground">Gemini обрабатывает финансовые метрики</p>
                      </div>
                      <Progress value={66} className="w-64" />
                    </div>
                  </CardContent>
                </Card>
              ) : analysis ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
                      <Icon name="TrendingUp" size={16} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {analysis.totalRevenue.toLocaleString('ru-RU')} ₽
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        За весь период
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Средний доход</CardTitle>
                      <Icon name="Activity" size={16} className="text-secondary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {analysis.avgRevenue.toLocaleString('ru-RU')} ₽
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        В месяц
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Рост YoY</CardTitle>
                      <Icon name="ArrowUp" size={16} className="text-accent" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent">
                        +{analysis.growth}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        С начала года
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Прогноз на Янв</CardTitle>
                      <Icon name="Zap" size={16} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {analysis.forecast.toLocaleString('ru-RU')} ₽
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ИИ прогноз
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Lightbulb" size={20} className="text-accent" />
                        ИИ Инсайты
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                              <Icon name="Check" size={14} className="text-primary" />
                            </div>
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Target" size={20} className="text-secondary" />
                        Рекомендации
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="rounded-full bg-secondary/10 p-1.5 mt-0.5">
                              <Icon name="ArrowRight" size={14} className="text-secondary" />
                            </div>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Icon name="Bot" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Нажмите "ИИ Анализ" для начала обработки данных
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Динамика доходов</CardTitle>
                    <CardDescription>Помесячный тренд за 2024 год</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-end justify-between gap-2 p-4">
                      {excelData.rows.map((row, idx) => {
                        const revenue = row[1] as number;
                        const maxRevenue = Math.max(...excelData.rows.map(r => r[1] as number));
                        const height = (revenue / maxRevenue) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"
                              style={{ height: `${height}%` }}
                              title={`${row[0]}: ${revenue.toLocaleString('ru-RU')} ₽`}
                            />
                            <span className="text-[10px] text-muted-foreground rotate-45 origin-left">
                              {(row[0] as string).slice(0, 3)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Структура расходов</CardTitle>
                    <CardDescription>Распределение по категориям</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="20"
                            strokeDasharray="75.4 251.2"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="hsl(var(--secondary))"
                            strokeWidth="20"
                            strokeDasharray="62.8 251.2"
                            strokeDashoffset="-75.4"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="hsl(var(--accent))"
                            strokeWidth="20"
                            strokeDasharray="113 251.2"
                            strokeDashoffset="-138.2"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">100%</div>
                            <div className="text-xs text-muted-foreground">Расходы</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <div>
                          <div className="text-sm font-medium">Операционные</div>
                          <div className="text-xs text-muted-foreground">30%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <div>
                          <div className="text-sm font-medium">Маркетинг</div>
                          <div className="text-xs text-muted-foreground">25%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <div>
                          <div className="text-sm font-medium">Зарплата</div>
                          <div className="text-xs text-muted-foreground">45%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Прогноз роста</CardTitle>
                    <CardDescription>ИИ прогноз на следующие 6 месяцев</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end justify-between gap-1 p-4">
                      {[...excelData.rows.slice(-3), 
                        ['Янв 2025', 980000], 
                        ['Фев 2025', 1050000], 
                        ['Мар 2025', 1120000]
                      ].map((row, idx) => {
                        const revenue = row[1] as number;
                        const maxRevenue = 1120000;
                        const height = (revenue / maxRevenue) * 100;
                        const isForecast = idx >= 3;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className={`w-full rounded-t-sm transition-opacity cursor-pointer ${
                                isForecast 
                                  ? 'bg-gradient-to-t from-secondary/50 to-accent/50 border-2 border-dashed border-secondary' 
                                  : 'bg-gradient-to-t from-primary to-primary/70 hover:opacity-80'
                              }`}
                              style={{ height: `${height}%` }}
                              title={`${row[0]}: ${revenue.toLocaleString('ru-RU')} ₽`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {(row[0] as string).slice(0, 3)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-primary" />
                        <span className="text-sm">Факт</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-secondary/50 border-2 border-dashed border-secondary" />
                        <span className="text-sm">Прогноз ИИ</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
