'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ColorPicker,
  Button,
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Card,
  Select,
  App,
  Tooltip,
} from 'antd';
import {
  BgColorsOutlined,
  SaveOutlined,
  DownloadOutlined,
  UploadOutlined,
  UndoOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface ThemeEditorProps {
  tooltipTitle?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  cardBg: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#2f54eb',
  backgroundColor: '#f5f5f5',
  textColor: '#1a1f2e',
  borderColor: '#eaecf5',
  cardBg: '#ffffff',
  successColor: '#52c41a',
  warningColor: '#faad14',
  errorColor: '#f5222d',
};

const ThemeEditor: React.FC<ThemeEditorProps> = ({ tooltipTitle = '主题编辑' }) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [savedThemes, setSavedThemes] = useState<{ name: string; config: ThemeConfig }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved-themes');
    if (saved) {
      setSavedThemes(JSON.parse(saved));
    }

    const currentTheme = localStorage.getItem('current-theme');
    if (currentTheme) {
      setTheme(JSON.parse(currentTheme));
    }
  }, []);

  const handleColorChange = (key: keyof ThemeConfig, color: string) => {
    const newTheme = { ...theme, [key]: color };
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', themeConfig.primaryColor);
    root.style.setProperty('--theme-bg-color', themeConfig.backgroundColor);
    root.style.setProperty('--theme-text-color', themeConfig.textColor);
    root.style.setProperty('--theme-border-color', themeConfig.borderColor);
    root.style.setProperty('--theme-card-bg', themeConfig.cardBg);
  };

  const handleSave = () => {
    const name = prompt('请输入主题名称：');
    if (name) {
      const newSavedThemes = [...savedThemes, { name, config: { ...theme } }];
      setSavedThemes(newSavedThemes);
      localStorage.setItem('saved-themes', JSON.stringify(newSavedThemes));
      localStorage.setItem('current-theme', JSON.stringify(theme));
      message.success('主题已保存');
    }
  };

  const handleExport = () => {
    const themeStr = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    a.click();
    URL.revokeObjectURL(url);
    message.success('主题已导出');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedTheme = JSON.parse(event.target?.result as string);
            setTheme(importedTheme);
            applyTheme(importedTheme);
            localStorage.setItem('current-theme', JSON.stringify(importedTheme));
            message.success('主题已导入');
          } catch (error) {
            message.error('主题文件格式错误');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleLoadTheme = (config: ThemeConfig) => {
    setTheme(config);
    applyTheme(config);
    localStorage.setItem('current-theme', JSON.stringify(config));
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    applyTheme(defaultTheme);
    localStorage.setItem('current-theme', JSON.stringify(defaultTheme));
    message.success('主题已重置');
  };

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <Button
          type="text"
          icon={<BgColorsOutlined />}
          onClick={() => setOpen(true)}
          style={{
            color: '#6b7280',
            fontSize: 16,
          }}
        />
      </Tooltip>

      <Modal
        title={
          <Space>
            <BgColorsOutlined />
            <span>主题编辑器</span>
          </Space>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* 预设主题 */}
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ fontSize: 14, marginBottom: 12, display: 'block' }}>
              预设主题
            </Text>
            <Space wrap>
              <Select
                style={{ width: 200 }}
                placeholder="选择预设主题"
                onChange={(value) => {
                  const preset = savedThemes.find((t) => t.name === value);
                  if (preset) {
                    handleLoadTheme(preset.config);
                  }
                }}
              >
                {savedThemes.map((t) => (
                  <Option key={t.name} value={t.name}>
                    {t.name}
                  </Option>
                ))}
              </Select>
              <Button icon={<UndoOutlined />} onClick={handleReset}>
                重置默认
              </Button>
            </Space>
          </div>

          <Divider />

          {/* 颜色配置 */}
          <Row gutter={16}>
            <Col span={12}>
              <ColorPickerCard
                label="主色调"
                color={theme.primaryColor}
                onChange={(color) => handleColorChange('primaryColor', color)}
              />
              <ColorPickerCard
                label="背景色"
                color={theme.backgroundColor}
                onChange={(color) => handleColorChange('backgroundColor', color)}
              />
              <ColorPickerCard
                label="文字色"
                color={theme.textColor}
                onChange={(color) => handleColorChange('textColor', color)}
              />
            </Col>
            <Col span={12}>
              <ColorPickerCard
                label="边框色"
                color={theme.borderColor}
                onChange={(color) => handleColorChange('borderColor', color)}
              />
              <ColorPickerCard
                label="卡片背景"
                color={theme.cardBg}
                onChange={(color) => handleColorChange('cardBg', color)}
              />
              <ColorPickerCard
                label="成功色"
                color={theme.successColor}
                onChange={(color) => handleColorChange('successColor', color)}
              />
            </Col>
          </Row>

          {/* 操作按钮 */}
          <Divider />
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button icon={<SaveOutlined />} onClick={handleSave}>
              保存主题
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>
              导入
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  );
};

const ColorPickerCard: React.FC<{
  label: string;
  color: string;
  onChange: (color: string) => void;
}> = ({ label, color, onChange }) => {
  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderRadius: 8,
        border: '1px solid #f0f0f0',
      }}
      styles={{
        body: { padding: '12px' },
      }}
    >
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 13 }}>{label}</Text>
        <ColorPicker
          value={color}
          onChange={(value) => onChange(value.toHexString())}
          showText
          size="small"
        />
      </Space>
    </Card>
  );
};

export default ThemeEditor;
