'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
  height = 300,
  title,
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
      title: title
        ? {
            text: title,
            left: 'center',
            top: 0,
            textStyle: {
              fontSize: 14,
              fontWeight: 600,
              color: '#1a1f2e',
            },
          }
        : undefined,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        bottom: '0%',
        left: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: '#6b7280',
        },
      },
      series: [
        {
          name: '数据',
          type: 'pie',
          radius: ['45%', '75%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 12,
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
              color: '#1a1f2e',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
      color: actualColors,
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
  }, [data, colors, title]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default PieChart;
