'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface RadarChartProps {
  indicators: { name: string; max: number }[];
  series: { name: string; data: number[] }[];
  colors?: string[];
  height?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({
  indicators,
  series,
  colors = ['#5470c6', '#91cc75'],
  height = 300,
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

    const actualColors = colors.map(getActualColor);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: series.map((s) => s.name),
        bottom: '0%',
        left: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: '#6b7280',
        },
      },
      radar: {
        indicator: indicators,
        radius: '68%',
        axisName: {
          color: '#6b7280',
          fontSize: 13,
          fontWeight: 500,
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(79, 155, 250, 0.08)', 'rgba(79, 155, 250, 0.04)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(79, 155, 250, 0.25)',
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(79, 155, 250, 0.25)',
          },
        },
      },
      series: [
        {
          name: '数据',
          type: 'radar',
          data: series.map((s) => ({
            name: s.name,
            value: s.data,
          })),
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
            shadowBlur: 4,
          },
          areaStyle: {
            opacity: 0.35,
          },
          lineStyle: {
            width: 3,
          },
          color: actualColors,
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
  }, [indicators, series, colors]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default RadarChart;
