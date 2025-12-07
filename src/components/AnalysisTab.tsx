import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisResult {
  totalRevenue: number;
  avgRevenue: number;
  growth: number;
  forecast: number;
  insights: string[];
  recommendations: string[];
}

interface AnalysisTabProps {
  isAnalyzing: boolean;
  analysis: AnalysisResult | null;
}

const exportToPDF = async () => {
  const element = document.getElementById('analysis-content');
  if (!element) return;
  
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#1a1f2c'
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save('financial-analysis.pdf');
};

export default function AnalysisTab({ isAnalyzing, analysis }: AnalysisTabProps) {
  if (isAnalyzing) {
    return (
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
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Icon name="Bot" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Нажмите "ИИ Анализ" для начала обработки данных
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={exportToPDF} variant="outline">
          <Icon name="Download" size={16} className="mr-2" />
          Экспорт в PDF
        </Button>
      </div>
      <div id="analysis-content" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}