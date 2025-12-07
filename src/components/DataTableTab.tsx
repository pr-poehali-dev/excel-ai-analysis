import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface ExcelData {
  headers: string[];
  rows: (string | number)[][];
}

interface DataTableTabProps {
  excelData: ExcelData;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredRows: (string | number)[][];
}

export default function DataTableTab({ excelData, searchQuery, onSearchChange, filteredRows }: DataTableTabProps) {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
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
  );
}
