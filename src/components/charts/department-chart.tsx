'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pegawai } from '@/lib/types';
import React from 'react';

export function DepartmentChart({ data }: { data: Pegawai[] }) {
  const departmentData = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    data.forEach(pegawai => {
      counts[pegawai.departemen] = (counts[pegawai.departemen] || 0) + 1;
    });
    return Object.entries(counts).map(([departemen, total]) => ({ departemen, total }));
  }, [data]);
  
  const chartConfig = {
    total: {
      label: 'Pegawai',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pegawai per Departemen</CardTitle>
        <CardDescription>
          Distribusi jumlah pegawai di setiap departemen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={departmentData}>
            <XAxis
              dataKey="departemen"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" /> Departemen dengan pegawai terbanyak adalah Badan Perencanaan.
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan jumlah pegawai untuk semua departemen.
        </div>
      </CardFooter>
    </Card>
  );
}
