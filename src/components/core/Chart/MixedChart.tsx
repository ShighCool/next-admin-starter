'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface MixedChartProps {
  xData: string[];
  barData: { name: string; data: number[]; color: string }[];
  lineData?: { name: string; data: number[]; color: string }[];
  height?: number;
  yName?: string;
}

const MixedChart: React.FC<MixedChartProps> = ({
  xData,
  barData,
  lineData = [],
  height = 300,
  yName = '数值',
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

    const series: any[] = [];

    // 添加柱状图数据
    barData.forEach((bar) => {
      const actualColor = getActualColor(bar.color);
      series.push({
        name: bar.name,
        type: 'bar',
        data: bar.data,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: actualColor },
            { offset: 1, color: actualColor + '60' },
          ]),
          shadowBlur: 4,
          shadowColor: actualColor + '40',
        },
        barMaxWidth: 32,
      });
    });

    // 添加折线图数据
    lineData.forEach((line) => {
      const actualColor = getActualColor(line.color);
      series.push({
        name: line.name,
        type: 'line',
        yAxisIndex: 1,
        data: line.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: actualColor,
          borderColor: '#fff',
          borderWidth: 3,
          shadowBlur: 4,
          shadowColor: actualColor,
        },
        lineStyle: {
          color: actualColor,
          width: 3,
        },
      });
    });

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
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
      grid: {
        left: '8%',
        right: '4%',
        bottom: '12%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
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
      yAxis: [
        {
          type: 'value',
          name: yName,
          nameTextStyle: {
            color: '#6b7280',
            fontSize: 12,
          },
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
        {
          type: 'value',
          name: '百分比',
          nameTextStyle: {
            color: '#6b7280',
            fontSize: 12,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
            color: '#6b7280',
            fontSize: 12,
          },
        },
      ],
      series,
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
  }, [xData, barData, lineData, height, yName]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default MixedChart;
