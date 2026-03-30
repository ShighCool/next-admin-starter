'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Slider, Space, Typography, Tag } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { ClickEvent, HeatmapConfig } from '@/types/heatmap';

const { Text } = Typography;

interface HeatmapOverlayProps {
  events: ClickEvent[];
  config: HeatmapConfig;
  onConfigChange: (config: Partial<HeatmapConfig>) => void;
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ events, config, onConfigChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ totalClicks: 0, uniqueElements: 0 });

  useEffect(() => {
    if (!config.showHeatmap || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const uniqueSelectors = new Set(events.map((e) => e.element.selector));
    setStats({
      totalClicks: events.length,
      uniqueElements: uniqueSelectors.size,
    });

    if (events.length === 0) return;

    const positionMap = new Map<string, number>();

    events.forEach((event) => {
      const key = Math.floor(event.position.x / 10) + ',' + Math.floor(event.position.y / 10);
      const count = (positionMap.get(key) || 0) + 1;
      positionMap.set(key, count);
    });

    const maxCount = Math.max(...Array.from(positionMap.values()));
    const radius = config.radius;

    events.forEach((event) => {
      const key = Math.floor(event.position.x / 10) + ',' + Math.floor(event.position.y / 10);
      const normalizedValue = (positionMap.get(key) || 0) / maxCount;
      const alpha = normalizedValue * config.intensity;

      const gradient = ctx.createRadialGradient(
        event.position.x,
        event.position.y,
        0,
        event.position.x,
        event.position.y,
        radius
      );

      if (normalizedValue < 0.3) {
        gradient.addColorStop(0, 'rgba(66, 133, 244,' + alpha + ')');
      } else if (normalizedValue < 0.6) {
        gradient.addColorStop(0, 'rgba(255, 193, 7,' + alpha + ')');
      } else {
        gradient.addColorStop(0, 'rgba(244, 67, 54,' + alpha + ')');
      }

      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(event.position.x, event.position.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    if (config.showClicks) {
      events.forEach((event) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(event.position.x, event.position.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [events, config.showHeatmap, config.showClicks, config.intensity, config.radius]);

  if (!config.showHeatmap) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />

      <Card
        size="small"
        style={{
          position: 'fixed',
          top: 80,
          right: 24,
          width: 280,
          zIndex: 9999,
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        styles={{ body: { padding: '16px' } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <EyeOutlined />
            <Text strong>热力图控制</Text>
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
            点击强度: {config.intensity.toFixed(2)}
          </Text>
          <Slider
            min={0.1}
            max={1}
            step={0.1}
            value={config.intensity}
            onChange={(value) => onConfigChange({ intensity: value })}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
            半径: {config.radius}px
          </Text>
          <Slider
            min={10}
            max={100}
            step={10}
            value={config.radius}
            onChange={(value) => onConfigChange({ radius: value })}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Tag color="blue">总点击: {stats.totalClicks}</Tag>
            <Tag color="green">元素数: {stats.uniqueElements}</Tag>
          </Space>
        </div>

        <div>
          <Space orientation="vertical" size={8} style={{ width: '100%' }}>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onConfigChange({ showClicks: !config.showClicks })}
              type={config.showClicks ? 'primary' : 'default'}
            >
              {config.showClicks ? '隐藏' : '显示'}点击点
            </Button>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => {
                const data = JSON.stringify(events, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'heatmap-data.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              导出数据
            </Button>
          </Space>
        </div>
      </Card>
    </>
  );
};

export default HeatmapOverlay;
