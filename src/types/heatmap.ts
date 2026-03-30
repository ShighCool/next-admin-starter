export interface ClickEvent {
  id: string;
  timestamp: number;
  path: string;
  element: {
    tag: string;
    id?: string;
    className?: string;
    text?: string;
    selector?: string;
  };
  position: {
    x: number;
    y: number;
    viewportX: number;
    viewportY: number;
  };
  metadata?: {
    type?: 'button' | 'link' | 'menu' | 'form' | 'other';
    label?: string;
    icon?: string;
  };
}

export interface HeatmapData {
  path: string;
  events: ClickEvent[];
  stats: {
    totalClicks: number;
    uniqueElements: number;
    dateRange: {
      start: number;
      end: number;
    };
  };
}

export interface HeatmapConfig {
  enabled: boolean;
  showClicks: boolean;
  showHeatmap: boolean;
  intensity: number;
  radius: number;
  dateFilter?: {
    start: Date;
    end: Date;
  };
}

export interface ElementClickStats {
  selector: string;
  label: string;
  count: number;
  percentage: number;
  firstClicked: number;
  lastClicked: number;
  type: string;
}
