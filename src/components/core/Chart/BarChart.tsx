'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface BarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  color = '#5470c6',
  height = 300,
  showGrid = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 解析 CSS 变量颜色
    const getActualColor = (colorValue: string): string => {
      if (colorValue.startsWith('var(')) {
        const varName = colorValue.match(/var\(([^)]+)\)/)?.[1];
        if (varName) {
          const computedStyle = getComputedStyle(document.documentElement);
          const value = computedStyle.getPropertyValue(varName).trim();
          return value || colorValue;
        }
      }
      return colorValue;
    };

    const actualColor = getActualColor(color);

    const option: echarts.EChartsOption = {
      grid: {
        left: '8%',
        right: '4%',
        bottom: '12%',
        top: '10%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLine: {
          lineStyle: {
            color: '#e5e7eb',
          },
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '数值',
          type: 'bar',
          data: data.map((d) => d.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: actualColor },
              { offset: 1, color: actualColor + '60' },
            ]),
            borderRadius: [6, 6, 0, 0],
            shadowBlur: 4,
            shadowColor: actualColor + '40',
          },
          barWidth: '50%',
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 响应式调整
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, color, showGrid]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default BarChart;
