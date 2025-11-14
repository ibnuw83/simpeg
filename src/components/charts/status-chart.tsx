'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';


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
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { Pegawai } from '@/lib/types';
import React from 'react';

const statusColors: { [key: string]: string } = {
  'Aktif': 'hsl(var(--chart-1))',
  'Cuti': 'hsl(var(--chart-2))',
  'Pensiun': 'hsl(var(--chart-3))',
};

const departmentColors: { [key: string]: string } = {
    'Badan Perencanaan': 'hsl(var(--chart-1))',
    'Badan Keuangan': 'hsl(var(--chart-2))',
    'Dinas Komunikasi': 'hsl(var(--chart-3))',
    'Badan Kepegawaian': 'hsl(var(--chart-4))',
    'Dinas Pekerjaan Umum': 'hsl(var(--chart-5))',
    'Inspektorat Daerah': 'hsl(var(--chart-1))',
};


export function StatusChart({ data }: { data: Pegawai[] }) {
  const statusData = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    data.forEach(pegawai => {
      counts[pegawai.status] = (counts[pegawai.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, total]) => ({ name: status, value: total, fill: statusColors[status] }));
  }, [data]);
  
  const chartConfig = {
    value: { label: 'Pegawai' },
    Aktif: { label: 'Aktif', color: 'hsl(var(--chart-1))' },
    Cuti: { label: 'Cuti', color: 'hsl(var(--chart-2))' },
    Pensiun: { label: 'Pensiun', color: 'hsl(var(--chart-3))' },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Distribusi Status Pegawai</CardTitle>
        <CardDescription>
            Menampilkan proporsi pegawai berdasarkan status kepegawaian.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
                {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
             <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col gap-2 text-sm mt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          Mayoritas pegawai berstatus aktif.
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Data per Juli 2024
        </div>
      </CardFooter>
    </Card>
  );
}

export function DepartmentChart({ data }: { data: Pegawai[] }) {
  const departmentData = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    data.forEach(pegawai => {
      counts[pegawai.departemen] = (counts[pegawai.departemen] || 0) + 1;
    });
    return Object.entries(counts).map(([departemen, total]) => ({
      name: departemen,
      value: total,
      fill: departmentColors[departemen] || 'hsl(var(--chart-1))',
    }));
  }, [data]);

  const chartConfig = departmentData.reduce((acc, { name, fill }) => {
    acc[name] = { label: name, color: fill };
    return acc;
  }, {} as any);
  
  chartConfig.value = { label: 'Pegawai' };
  

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Distribusi Pegawai per Departemen</CardTitle>
        <CardDescription>
            Menampilkan jumlah pegawai di setiap departemen.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
         <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={departmentData} layout="vertical">
            <YAxis
              dataKey="name"
              type="category"
              tickCount={departmentData.length}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={120}
            />
            <XAxis dataKey="value" type="number" hide />
            <CartesianGrid horizontal={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" layout="vertical" radius={5}>
                 {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col gap-2 text-sm mt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" /> Badan Perencanaan memiliki pegawai terbanyak.
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Data per Juli 2024
        </div>
      </CardFooter>
    </Card>
  );
}
