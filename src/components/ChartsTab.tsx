import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ExcelData {
  headers: string[];
  rows: (string | number)[][];
}

interface ChartsTabProps {
  excelData: ExcelData;
}

export default function ChartsTab({ excelData }: ChartsTabProps) {
  return (
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
  );
}
