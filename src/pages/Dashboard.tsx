// src/pages/Dashboard.tsx
// =============================================================================
// Sentinel Swarm – Enterprise Dashboard
// =============================================================================
// This component implements an interactive, multi‑section dashboard for 
// Geo‑Swarm Defensive Orchestration (GSDO) + Metamorphic Proxy at the Edge (MPE). 
// =============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Area,
  AreaChart,
  Legend,
  Scatter,
  ScatterChart,
} from 'recharts';
import {
  Shield,
  Activity,
  Bell,
  Globe,
  Server,
  AlertTriangle,
  Search,
  Eye,
  Menu,
  ExternalLink,
  Filter,
  Download,
  RefreshCw,
  Database,
  Zap,
  Target,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Terminal,
  Maximize,
  Map,
  Calendar,
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart as PieChartIcon,
  Hash,
  Lock,
  Cpu,
  Settings,
} from 'lucide-react';

// -------------------------------------------------------------------------
// TYPE DEFINITIONS
// -------------------------------------------------------------------------
interface EventRecord {
  id: number;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  affected: string;
  detected: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'False Positive';
  assignee?: string;
  resolution?: string;
}

interface Agent {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  status: 'online' | 'offline' | 'degraded';
  lastSeen: string;
  version: string;
  uptime: string;
  cpu: number;
  memory: number;
  diskSpace: number;
  responseTime: number;
  eventsToday: number;
  region: string;
  ip: string;
}

interface ThreatIntel {
  id: number;
  indicator: string;
  type: string;
  confidence: number;
  severity: string;
  firstSeen: string;
  lastSeen: string;
  source: string;
}

interface SummaryMetric {
  label: string;
  value: string;
  description: string;
  change?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: React.ReactNode;
}

interface ModelPerformance {
  name: string;
  precision: string;
  recall: string;
  f1: string;
  auc: string;
  latency: string;
  lastUpdated: string;
}

interface ProxyRotation {
  timestamp: string;
  proxyId: string;
  reason: string;
  ipRange: string;
  duration: string;
}

// -------------------------------------------------------------------------
// UTILITY FUNCTIONS
// -------------------------------------------------------------------------
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'online':
      return '#00E396';
    case 'offline':
      return '#FF3A00';
    case 'degraded':
      return '#FFAB00';
    case 'critical':
      return '#FF3A00';
    case 'high':
      return '#FF5C00';
    case 'medium':
      return '#FFAB00';
    case 'low':
      return '#00B2FF';
    case 'open':
      return '#FF3A00';
    case 'investigating':
      return '#FFAB00';
    case 'resolved':
      return '#00E396';
    case 'false positive':
      return '#A3A3A3';
    default:
      return '#AAAAAA';
  }
};

// -------------------------------------------------------------------------
// MODAL COMPONENT (In-window popup)
// -------------------------------------------------------------------------
interface ModalProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ title, content, onClose, size = 'medium' }) => {
  const getWidth = () => {
    switch (size) {
      case 'small':
        return '500px';
      case 'large':
        return '900px';
      default:
        return '700px';
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={{ ...modalStyles.modal, width: getWidth(), maxWidth: '95vw' }}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>{title}</h2>
          <button style={modalStyles.closeBtn} onClick={onClose} aria-label="Close Modal">
            &times;
          </button>
        </div>
        <div style={modalStyles.body}>{content}</div>
        <div style={modalStyles.footer}>
          <button style={modalStyles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
          <button style={modalStyles.btnPrimary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)',
  },
  modal: {
    backgroundColor: '#0a0a0a',
    padding: '24px',
    borderRadius: '12px',
    maxHeight: '85vh',
    overflowY: 'auto' as const,
    boxShadow: '0 4px 24px rgba(0,0,0,0.8), 0 0 2px rgba(255,58,0,0.5)',
    border: '1px solid rgba(255,58,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    color: '#FF3A00',
    fontSize: '1.5rem',
    margin: 0,
  },
  closeBtn: {
    background: 'rgba(255,58,0,0.15)',
    border: '1px solid rgba(255,58,0,0.3)',
    color: '#FF3A00',
    fontSize: '1.2rem',
    cursor: 'pointer',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  body: {
    color: '#ffffff',
    fontSize: '1rem',
    marginBottom: '20px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  btnPrimary: {
    backgroundColor: '#FF3A00',
    color: '#ffffff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
};

// -------------------------------------------------------------------------
// CARD COMPONENT
// -------------------------------------------------------------------------
interface CardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isLoading?: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, actions, className, style, isLoading = false }) => {
  return (
    <div
      style={{
        backgroundColor: '#1E1E1E',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,58,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {title}
        </h3>
        {actions && <div>{actions}</div>}
      </div>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '40px 0',
          }}
        >
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div style={{ flex: 1 }}>{children}</div>
      )}
    </div>
  );
};

// -------------------------------------------------------------------------
// BADGE COMPONENT
// -------------------------------------------------------------------------
interface BadgeProps {
  label: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
}

const Badge: React.FC<BadgeProps> = ({ label, type = 'default', size = 'medium' }) => {
  const getColor = () => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(0, 227, 150, 0.15)', border: 'rgba(0, 227, 150, 0.3)', text: '#00E396' };
      case 'warning':
        return { bg: 'rgba(255, 171, 0, 0.15)', border: 'rgba(255, 171, 0, 0.3)', text: '#FFAB00' };
      case 'error':
        return { bg: 'rgba(255, 58, 0, 0.15)', border: 'rgba(255, 58, 0, 0.3)', text: '#FF3A00' };
      case 'info':
        return { bg: 'rgba(0, 178, 255, 0.15)', border: 'rgba(0, 178, 255, 0.3)', text: '#00B2FF' };
      default:
        return { bg: 'rgba(170, 170, 170, 0.15)', border: 'rgba(170, 170, 170, 0.3)', text: '#AAAAAA' };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '0.7rem';
      case 'large':
        return '0.95rem';
      default:
        return '0.8rem';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return '2px 6px';
      case 'large':
        return '6px 12px';
      default:
        return '4px 8px';
    }
  };

  const colors = getColor();

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        borderRadius: '12px',
        padding: getPadding(),
        fontSize: getFontSize(),
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};

// -------------------------------------------------------------------------
// DASHBOARD COMPONENT
// -------------------------------------------------------------------------
const Dashboard: React.FC = () => {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const [activeSection, setActiveSection] = useState<'summary' | 'agents' | 'events' | 'analytics' | 'models' | 'proxy'>('summary');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
  const [modalSize, setModalSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [threatLevel, setThreatLevel] = useState<'normal' | 'elevated' | 'high' | 'critical'>('normal');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeDashboardFilters, setActiveDashboardFilters] = useState<Record<string, boolean>>({
    networkTraffic: true,
    threatIndicators: true,
    activeAlerts: true,
    systemHealth: true,
  });

  // =========================================================================
  // COLORS & LAYOUT
  // =========================================================================
  const colors = {
    background: '#121212',
    backgroundDark: '#0a0a0a',
    accent: '#FF3A00',
    accentLight: '#FF5C00',
    accentDark: '#CC2500',
    accentTransparent: 'rgba(255, 58, 0, 0.15)',
    success: '#00E396',
    successTransparent: 'rgba(0, 227, 150, 0.15)',
    warning: '#FFAB00',
    warningTransparent: 'rgba(255, 171, 0, 0.15)',
    info: '#00B2FF',
    infoTransparent: 'rgba(0, 178, 255, 0.15)',
    error: '#FF3A00',
    errorTransparent: 'rgba(255, 58, 0, 0.15)',
    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#AAAAAA',
    cardBg: '#1E1E1E',
    cardBgDark: '#171717',
    cardBgLight: '#252525',
    darkGrey: '#333333',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    chartColors: ['#FF3A00', '#00E396', '#FFAB00', '#00B2FF', '#A66AFC', '#58D0FF', '#FF5C41', '#2CCCB0'],
  };

  const COLORS = ['#FF3A00', '#00E396', '#FFAB00', '#00B2FF', '#A66AFC'];

  // =========================================================================
  // DUMMY DATA GENERATION (Much more detailed and realistic)
  // =========================================================================

  // Generate more realistic date for "last seen"
  const generateRecentTimestamp = () => {
    const now = new Date();
    const minutesAgo = Math.floor(Math.random() * 120); // Random time in the last 2 hours
    now.setMinutes(now.getMinutes() - minutesAgo);
    
    // Format: "2025-04-13 15:30:42"
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };
  
  // Generate a more diverse range of timestamps for event history
  const generateTimestampInRange = (daysBack = 7) => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * daysBack);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    now.setDate(now.getDate() - daysAgo);
    now.setHours(now.getHours() - hoursAgo);
    now.setMinutes(now.getMinutes() - minutesAgo);
    
    // Format: "2025-04-13 15:30:42"
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  const generateIP = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  const generateUptime = () => {
    const days = Math.floor(Math.random() * 60);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Summary metrics with more detailed information
  const summaryMetrics: SummaryMetric[] = [
    { 
      label: 'Active Swarm Agents', 
      value: '42/48', 
      description: 'Nodes online & reporting in realtime',
      change: '+3',
      trend: 'up',
      icon: <Server size={22} />
    },
    { 
      label: 'Critical Threats', 
      value: '7', 
      description: 'High-severity events in the last 24h',
      change: '+2',
      trend: 'up',
      icon: <AlertTriangle size={22} />
    },
    { 
      label: 'Total Alerts', 
      value: '384', 
      description: 'Alerts triggered over the past 7 days',
      change: '-12',
      trend: 'down',
      icon: <Bell size={22} />
    },
    { 
      label: 'Blocked Attacks', 
      value: '89.2%', 
      description: 'Attacks contained by dynamic MPE proxies',
      change: '+2.3%',
      trend: 'up',
      icon: <Shield size={22} />
    },
    { 
      label: 'Average Response Time', 
      value: '168ms', 
      description: 'Avg time to block detected threats',
      change: '-32ms',
      trend: 'down',
      icon: <Clock size={22} />
    },
    { 
      label: 'Data Processed', 
      value: '5.8TB', 
      description: 'Data analyzed in the last 24h',
      change: '+0.7TB',
      trend: 'up',
      icon: <Database size={22} />
    },
    { 
      label: 'Active Users', 
      value: '173', 
      description: 'Users currently protected by the system',
      change: '+8',
      trend: 'up',
      icon: <User size={22} />
    },
    { 
      label: 'Key Rotation Rate', 
      value: '4.2/hr', 
      description: 'Metamorphic encryption changes per hour',
      change: '+0.5',
      trend: 'up',
      icon: <RefreshCw size={22} />
    },
  ];

  // Timeline data with more granularity
  const generateTimelineData = () => {
    const data = [];
    const baseline = 15;
    // Create 48 data points for a 48-hour view
    for (let hour = 0; hour < 48; hour++) {
      const time = `${hour % 24}:00`;
      // Create a more realistic pattern with peaks during business hours
      let threatLevel = baseline;
      
      // Business hours have more activity
      if (hour % 24 >= 8 && hour % 24 <= 18) {
        threatLevel += 10 + Math.floor(Math.random() * 15);
      } else {
        threatLevel += Math.floor(Math.random() * 10);
      }
      
      // Create occasional spikes
      if (Math.random() > 0.85) {
        threatLevel += Math.floor(Math.random() * 25);
      }
      
      data.push({
        time,
        threats: threatLevel,
        blocked: Math.floor(threatLevel * (0.7 + Math.random() * 0.2)), // Between 70-90% blocked
        critical: Math.floor(threatLevel * 0.2 * Math.random()),
      });
    }
    return data;
  };

  const timelineData = generateTimelineData();

  // Attack vectors with more categories and detailed counts
  const attackVectors = [
    { category: 'Malware', count: 142, blocked: 128, percentage: 90 },
    { category: 'Phishing', count: 86, blocked: 72, percentage: 84 },
    { category: 'Ransomware', count: 37, blocked: 35, percentage: 95 },
    { category: 'Intrusion', count: 64, blocked: 51, percentage: 80 },
    { category: 'DDoS', count: 29, blocked: 27, percentage: 93 },
    { category: 'Supply Chain', count: 18, blocked: 14, percentage: 78 },
    { category: 'Credential Theft', count: 52, blocked: 46, percentage: 88 },
    { category: 'Zero-Day', count: 8, blocked: 6, percentage: 75 },
  ];

  // Threat origin data for geographic display
  const threatOriginData = [
    { country: 'United States', count: 87, percentage: 18.5 },
    { country: 'China', count: 63, percentage: 13.4 },
    { country: 'Russia', count: 58, percentage: 12.3 },
    { country: 'Brazil', count: 42, percentage: 8.9 },
    { country: 'India', count: 38, percentage: 8.1 },
    { country: 'Ukraine', count: 32, percentage: 6.8 },
    { country: 'Nigeria', count: 29, percentage: 6.2 },
    { country: 'Other', count: 121, percentage: 25.8 },
  ];

  // Network traffic patterns
  const networkTrafficData = Array(24).fill(0).map((_, idx) => {
    const hour = idx;
    // Create more realistic traffic pattern with business hour peaks
    let baseline = 400 + Math.random() * 200;
    
    // Increase during business hours
    if (hour >= 8 && hour <= 18) {
      baseline += 200 + Math.random() * 300;
    }
    
    // Add randomness
    const inbound = Math.floor(baseline + Math.random() * 100);
    const outbound = Math.floor(baseline * 0.7 + Math.random() * 80);
    
    return {
      hour: `${hour}:00`,
      inbound,
      outbound,
      total: inbound + outbound
    };
  });

  // System health metrics over time
  const systemHealthData = Array(30).fill(0).map((_, idx) => {
    const day = idx + 1;
    return {
      day,
      cpu: 35 + Math.random() * 30,
      memory: 45 + Math.random() * 25,
      diskIO: 30 + Math.random() * 40,
      network: 50 + Math.random() * 30,
    };
  });

  // More detailed and realistic event records
  const generateEventRecords = (): EventRecord[] => {
    const eventTypes = [
      'Malware Signature #A45-7', 
      'Ransomware Attempt', 
      'Phishing Email Campaign', 
      'Data Exfiltration Attempt',
      'Port Scan (TCP/22)', 
      'Brute Force (SSH)', 
      'SQL Injection Attempt',
      'XSS Attempt',
      'Suspicious Process Execution',
      'Command & Control Traffic',
      'Lateral Movement',
      'Privilege Escalation',
      'DDOS Attack',
      'DNS Tunneling',
      'Zero-Day Exploit Attempt',
      'API Token Compromise',
      'Unauthorized Admin Access'
    ];
    
    const severities: ('Critical' | 'High' | 'Medium' | 'Low')[] = ['Critical', 'High', 'Medium', 'Low'];
    const statuses: ('Open' | 'Investigating' | 'Resolved' | 'False Positive')[] = ['Open', 'Investigating', 'Resolved', 'False Positive'];
    const assignees = ['John Smith', 'Alex Wong', 'Sarah Johnson', 'Michael Brown', 'Priya Patel', 'Unassigned'];
    
    const events: EventRecord[] = [];
    
    for (let i = 30215; i < 30250; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const assignee = assignees[Math.floor(Math.random() * assignees.length)];
      
      // Generate affected systems with more realistic names
      const numAffected = 1 + Math.floor(Math.random() * 3);
      const affectedSystems = [];
      
      for (let j = 0; j < numAffected; j++) {
        const systemTypes = ['workstation_', 'server_', 'db_', 'web_', 'api_', 'fw_', 'storage_', 'user_'];
        const type = systemTypes[Math.floor(Math.random() * systemTypes.length)];
        const num = Math.floor(Math.random() * 100).toString().padStart(3, '0');
        affectedSystems.push(`${type}${num}`);
      }
      
      const detected = generateTimestampInRange(7);
      
      events.push({
        id: i,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        severity,
        source: generateIP(),
        affected: affectedSystems.join(', '),
        detected,
        status,
        assignee: assignee !== 'Unassigned' ? assignee : undefined,
        resolution: status === 'Resolved' ? 'Automatically blocked by MPE' : undefined
      });
    }
    
    // Sort by detected time, most recent first
    return events.sort((a, b) => new Date(b.detected).getTime() - new Date(a.detected).getTime());
  };

  const eventRecords = generateEventRecords();

  // More detailed agent information
  const generateAgents = (): Agent[] => {
    const regions = ['US-West', 'US-East', 'EU-Central', 'EU-West', 'AP-East', 'AP-South', 'SA-East'];
    const agentTypes = ['Perimeter', 'Core', 'Database', 'Web', 'API', 'Internal', 'DMZ'];
    
    const agents: Agent[] = [];
    
    // Generate 42 agents with detailed information
    for (let i = 101; i <= 148; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const type = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      
      // Generate coordinates based on region
      let lat = 37.7749; // Default to US
      let lng = -122.4194;
      
      if (region === 'US-East') {
        lat = 40.7128;
        lng = -74.0060;
      } else if (region === 'EU-Central') {
        lat = 50.1109;
        lng = 8.6821;
      } else if (region === 'EU-West') {
        lat = 51.5074;
        lng = -0.1278;
      } else if (region === 'AP-East') {
        lat = 35.6895;
        lng = 139.6917;
      } else if (region === 'AP-South') {
        lat = 28.6139;
        lng = 77.2090;
    } else if (region === 'SA-East') {
        lat = -23.5505;
        lng = -46.6333;
      }
      
      // Add some randomness to coordinates
      lat += (Math.random() - 0.5) * 2;
      lng += (Math.random() - 0.5) * 2;
      
      // Determine status - mostly online with some degraded and offline
      let status: 'online' | 'offline' | 'degraded';
      const statusRoll = Math.random();
      if (statusRoll > 0.9) {
        status = 'offline';
      } else if (statusRoll > 0.8) {
        status = 'degraded';
      } else {
        status = 'online';
      }
      
      agents.push({
        id: i,
        name: `Agent-${type}-${i}`,
        type,
        lat,
        lng,
        status,
        lastSeen: status === 'offline' ? generateTimestampInRange(1) : generateRecentTimestamp(),
        version: `v${Math.floor(Math.random() * 2) + 3}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
        uptime: status === 'offline' ? '0m' : generateUptime(),
        cpu: status === 'offline' ? 0 : Math.floor(20 + Math.random() * 60),
        memory: status === 'offline' ? 0 : Math.floor(30 + Math.random() * 50),
        diskSpace: status === 'offline' ? 0 : Math.floor(10 + Math.random() * 60),
        responseTime: status === 'offline' ? 0 : Math.floor(20 + Math.random() * 200),
        eventsToday: status === 'offline' ? 0 : Math.floor(Math.random() * 30),
        region,
        ip: generateIP(),
      });
    }
    
    return agents;
  };

  const agents = generateAgents();

  // Model performance data for ML analytics
  const generateModelPerformance = (): ModelPerformance[] => {
    const models = [
      { name: 'Anomaly Detection Engine', base: 0.92 },
      { name: 'ThreatPatternClassifier', base: 0.87 },
      { name: 'NetworkFlowAnalyzer', base: 0.89 },
      { name: 'API-AbusePrevention', base: 0.85 },
      { name: 'UserBehaviorModel', base: 0.83 },
      { name: 'MalwareDetector-v2', base: 0.94 },
    ];
    
    return models.map(model => {
      const precisionBase = model.base;
      const recallBase = model.base - 0.05;
      
      // Add some variance
      const precision = (precisionBase + (Math.random() * 0.04 - 0.02)).toFixed(2);
      const recall = (recallBase + (Math.random() * 0.04 - 0.02)).toFixed(2);
      const f1 = ((parseFloat(precision) * parseFloat(recall) * 2) / (parseFloat(precision) + parseFloat(recall))).toFixed(2);
      const auc = (model.base + (Math.random() * 0.03)).toFixed(2);
      
      return {
        name: model.name,
        precision: `${precision}`,
        recall: `${recall}`,
        f1: `${f1}`,
        auc: `${auc}`,
        latency: `${Math.floor(50 + Math.random() * 150)}ms`,
        lastUpdated: generateTimestampInRange(30),
      };
    });
  };
  
  const modelPerformanceData = generateModelPerformance();

  // Proxy rotation logs
  const generateProxyRotations = (): ProxyRotation[] => {
    const reasons = [
      'Scheduled Rotation',
      'Threat Detection',
      'Performance Optimization',
      'Manual Trigger',
      'High Traffic Pattern',
      'Security Policy Update',
      'Suspicious Activity',
    ];
    
    const rotations: ProxyRotation[] = [];
    
    for (let i = 0; i < 25; i++) {
      const timestamp = generateTimestampInRange(2);
      const proxyId = `MPE-${['EDGE', 'CORE', 'DMZ', 'API'][Math.floor(Math.random() * 4)]}-${Math.floor(Math.random() * 100)}`;
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      
      // Generate realistic IP ranges
      const baseOctet1 = Math.floor(Math.random() * 223) + 1;
      const baseOctet2 = Math.floor(Math.random() * 256);
      const ipRange = `${baseOctet1}.${baseOctet2}.0.0/16`;
      
      const duration = `${Math.floor(Math.random() * 120) + 20}s`;
      
      rotations.push({
        timestamp,
        proxyId,
        reason,
        ipRange,
        duration,
      });
    }
    
    return rotations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  
  const proxyRotations = generateProxyRotations();

  // Threat Intelligence indicators
  const generateThreatIntel = (): ThreatIntel[] => {
    const types = [
      'IP Address',
      'Domain',
      'URL',
      'File Hash',
      'Email',
      'User Agent',
      'TLS Fingerprint',
    ];
    
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    const sources = ['OSINT', 'AlienVault', 'Internal Analysis', 'Partner Feed', 'MISP', 'VirusTotal'];
    
    const threatIntel: ThreatIntel[] = [];
    
    for (let i = 1; i <= 30; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      let indicator = '';
      
      // Generate realistic indicators based on type
      if (type === 'IP Address') {
        indicator = generateIP();
      } else if (type === 'Domain') {
        const domains = ['malicious-domain.com', 'evil-site.org', 'phishing-attempt.net', 'data-stealer.ru', 'fake-login.cn'];
        indicator = domains[Math.floor(Math.random() * domains.length)];
      } else if (type === 'File Hash') {
        indicator = Array(64).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
      } else if (type === 'URL') {
        const domains = ['malicious-domain.com', 'evil-site.org', 'phishing-attempt.net', 'data-stealer.ru', 'fake-login.cn'];
        const paths = ['/login', '/download', '/update', '/admin', '/secure'];
        indicator = `https://${domains[Math.floor(Math.random() * domains.length)]}${paths[Math.floor(Math.random() * paths.length)]}`;
      } else {
        indicator = `${type}-${i}`;
      }
      
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      const firstSeen = generateTimestampInRange(90);
      const lastSeen = new Date(firstSeen);
      lastSeen.setDate(lastSeen.getDate() + Math.floor(Math.random() * 10));
      
      threatIntel.push({
        id: i,
        indicator,
        type,
        confidence,
        severity,
        firstSeen,
        lastSeen: lastSeen.toISOString().replace('T', ' ').substring(0, 19),
        source: sources[Math.floor(Math.random() * sources.length)],
      });
    }
    
    return threatIntel;
  };
  
  const threatIntelData = generateThreatIntel();

  // Radar plot data for attack surface 
  const attackSurfaceData = [
    { subject: 'Web Apps', value: 75 },
    { subject: 'Cloud Services', value: 82 },
    { subject: 'User Endpoints', value: 68 },
    { subject: 'Network Edges', value: 90 },
    { subject: 'API Gateways', value: 85 },
    { subject: 'Data Storage', value: 78 },
    { subject: 'IoT Devices', value: 62 },
    { subject: 'Supply Chain', value: 70 },
  ];

  // Data for donut chart
  const securityPostureData = [
    { name: 'Secure', value: 68 },
    { name: 'Needs Attention', value: 22 },
    { name: 'Critical', value: 10 },
  ];

  // Detection method effectiveness data
  const detectionMethodData = [
    { name: 'AI/ML Detection', success: 87, failure: 13 },
    { name: 'Signature Based', success: 72, failure: 28 },
    { name: 'Behavioral Analysis', success: 81, failure: 19 },
    { name: 'Threat Intel Feeds', success: 65, failure: 35 },
    { name: 'User Reports', success: 42, failure: 58 },
  ];

  // =========================================================================
  // INTERACTIVE FUNCTIONS
  // =========================================================================
  const refreshDashboard = () => {
    setIsRefreshing(true);
    console.info("Refreshing dashboard data...");
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // In a real system, re-fetch data here
      setIsRefreshing(false);
      
      // Random chance to change threat level for demo purposes
      const rand = Math.random();
      if (rand < 0.25) {
        setThreatLevel('normal');
      } else if (rand < 0.5) {
        setThreatLevel('elevated');
      } else if (rand < 0.75) {
        setThreatLevel('high');
      } else {
        setThreatLevel('critical');
      }
    }, 1500);
  };

  const handleSectionChange = (section: 'summary' | 'agents' | 'events' | 'analytics' | 'models' | 'proxy') => {
    setActiveSection(section);
  };

  const openAgentModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setModalContent({
      title: `${agent.name} Details`,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            backgroundColor: colors.cardBgDark,
            padding: '15px',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(agent.status),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000000',
            }}>
              {agent.name.substring(6, 8)}
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{agent.name}</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge 
                  label={agent.status.toUpperCase()} 
                  type={agent.status === 'online' ? 'success' : agent.status === 'degraded' ? 'warning' : 'error'} 
                />
                <Badge label={agent.type} type="info" />
                <Badge label={agent.region} />
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{
              backgroundColor: colors.cardBgDark,
              padding: '15px',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: colors.textMuted }}>System Information</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                    <td style={{ padding: '8px 0', color: colors.textMuted }}>IP Address</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{agent.ip}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                    <td style={{ padding: '8px 0', color: colors.textMuted }}>Version</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{agent.version}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                    <td style={{ padding: '8px 0', color: colors.textMuted }}>Uptime</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{agent.uptime}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                    <td style={{ padding: '8px 0', color: colors.textMuted }}>Location</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{agent.lat.toFixed(4)}, {agent.lng.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: colors.textMuted }}>Last Seen</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{agent.lastSeen}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style={{
              backgroundColor: colors.cardBgDark,
              padding: '15px',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: colors.textMuted }}>Performance Metrics</h4>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>CPU Usage</span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: agent.cpu > 80 ? colors.error : agent.cpu > 60 ? colors.warning : colors.success 
                  }}>{agent.cpu}%</span>
                </div>
                <div style={{ 
                  height: '6px', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '3px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${agent.cpu}%`, 
                    backgroundColor: agent.cpu > 80 ? colors.error : agent.cpu > 60 ? colors.warning : colors.success,
                    borderRadius: '3px',
                  }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>Memory Usage</span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: agent.memory > 80 ? colors.error : agent.memory > 60 ? colors.warning : colors.success 
                  }}>{agent.memory}%</span>
                </div>
                <div style={{ 
                  height: '6px', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '3px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${agent.memory}%`, 
                    backgroundColor: agent.memory > 80 ? colors.error : agent.memory > 60 ? colors.warning : colors.success,
                    borderRadius: '3px',
                  }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>Disk Usage</span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: agent.diskSpace > 80 ? colors.error : agent.diskSpace > 60 ? colors.warning : colors.success 
                  }}>{agent.diskSpace}%</span>
                </div>
                <div style={{ 
                  height: '6px', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '3px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${agent.diskSpace}%`, 
                    backgroundColor: agent.diskSpace > 80 ? colors.error : agent.diskSpace > 60 ? colors.warning : colors.success,
                    borderRadius: '3px',
                  }}></div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>Response Time</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{agent.responseTime}ms</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>Events Today</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{agent.eventsToday}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: colors.cardBgDark,
            padding: '15px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: colors.textMuted }}>Recent Activity</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {[...Array(5)].map((_, idx) => (
                <li key={idx} style={{ 
                  padding: '8px 0', 
                  borderBottom: idx < 4 ? `1px solid ${colors.borderColor}` : 'none',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{['Configuration Updated', 'System Scan Completed', 'Heartbeat', 'Threat Detected', 'Policy Applied'][idx]}</span>
                  <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>{new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
            <button style={{
              backgroundColor: colors.errorTransparent,
              border: `1px solid ${colors.error}`,
              color: colors.error,
              padding: '8px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}>
              <RefreshCw size={16} />
              Restart Agent
            </button>
            
            <button style={{
              backgroundColor: colors.warningTransparent,
              border: `1px solid ${colors.warning}`,
              color: colors.warning,
              padding: '8px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}>
              <Shield size={16} />
              Isolate Agent
            </button>
            
            <button style={{
              backgroundColor: colors.infoTransparent,
              border: `1px solid ${colors.info}`,
              color: colors.info,
              padding: '8px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}>
              <Terminal size={16} />
              Remote Shell
            </button>
          </div>
        </div>
      ),
    });
    setModalSize('large');
    setShowModal(true);
  };

  const openEventModal = (event: EventRecord) => {
    setSelectedEvent(event);
    setModalContent({
      title: `Event #${event.id} Details`,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            backgroundColor: colors.cardBgDark,
            padding: '15px',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '8px',
              backgroundColor: getStatusColor(event.severity),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000000',
            }}>
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{event.type}</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge 
                  label={event.severity} 
                  type={event.severity === 'Critical' || event.severity === 'High' ? 'error' : 
                         event.severity === 'Medium' ? 'warning' : 'info'} 
                />
                <Badge 
                  label={event.status} 
                  type={event.status === 'Open' ? 'error' : 
                         event.status === 'Investigating' ? 'warning' : 
                         event.status === 'Resolved' ? 'success' : 'default'} 
                />
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: colors.cardBgDark,
            padding: '15px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: colors.textMuted }}>Event Information</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                  <td style={{ padding: '8px 0', color: colors.textMuted }}>Event ID</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{event.id}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                  <td style={{ padding: '8px 0', color: colors.textMuted }}>Source</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{event.source}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                  <td style={{ padding: '8px 0', color: colors.textMuted }}>Affected Systems</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{event.affected}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                  <td style={{ padding: '8px 0', color: colors.textMuted }}>Detected</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{event.detected}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                  <td style={{ padding: '8px 0', color: colors.textMuted }}>Status</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{event.status}</td>
                </tr>
                {event.assignee && (
                  <tr style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                    <td style={{ padding: '8px 0', color: colors.textMuted }}>Assignee</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{event.assignee}</td>
                  </tr>
                )}
                {event.resolution && (
                  <tr>
                    <td style={{ padding: '8px 0', color: colors.textMuted }}>Resolution</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace' }}>{event.resolution}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div style={{
            backgroundColor: colors.cardBgDark,
            padding: '15px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: colors.textMuted }}>Threat Description</h4>
            <p style={{ margin: '0 0 15px 0', lineHeight: '1.6' }}>
              This {event.severity.toLowerCase()} severity event was detected at {event.detected} and is currently {event.status.toLowerCase()}. 
              The threat originated from {event.source} and targeted {event.affected.split(',').length} system(s).
            </p>
            
            <h5 style={{ margin: '15px 0 5px 0', fontSize: '0.9rem', color: colors.textMuted }}>Indicators of Compromise</h5>
            <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
              <li style={{ margin: '5px 0' }}>Source IP: {event.source}</li>
              <li style={{ margin: '5px 0' }}>Process: svchost.exe</li>
              <li style={{ margin: '5px 0' }}>Registry Key: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run</li>
              <li style={{ margin: '5px 0' }}>File Hash: 7b52a548b2ce8f8f4f5c887931e2ca5a</li>
            </ul>
          </div>
          
          <div style={{
            backgroundColor: colors.cardBgDark,
            padding: '15px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: colors.textMuted }}>MITRE ATT&CK Mapping</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Badge label="T1190: Exploit Public-Facing Application" type="info" size="small" />
              <Badge label="T1133: External Remote Services" type="info" size="small" />
              <Badge label="T1078: Valid Accounts" type="info" size="small" />
              <Badge label="T1021: Remote Services" type="info" size="small" />
              <Badge label="T1059: Command and Scripting Interpreter" type="info" size="small" />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
            {event.status !== 'Resolved' && (
              <>
                <button style={{
                  backgroundColor: colors.successTransparent,
                  border: `1px solid ${colors.success}`,
                  color: colors.success,
                  padding: '8px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}>
                  <CheckCircle size={16} />
                  Resolve Event
                </button>
                
                <button style={{
                  backgroundColor: colors.warningTransparent,
                  border: `1px solid ${colors.warning}`,
                  color: colors.warning,
                  padding: '8px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}>
                  <User size={16} />
                  Assign to Me
                  </button>
              </>
            )}
            
            <button style={{
              backgroundColor: colors.infoTransparent,
              border: `1px solid ${colors.info}`,
              color: colors.info,
              padding: '8px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              marginLeft: 'auto'
            }}>
              <ExternalLink size={16} />
              View Full Report
            </button>
          </div>
        </div>
      ),
    });
    setModalSize('large');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
    setSelectedAgent(null);
    setSelectedEvent(null);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Filter events by search query, status, and severity
  const filteredEvents = useMemo(() => {
    return eventRecords.filter(event => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.affected.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.id.toString().includes(searchQuery);
      
      // Filter by status
      const matchesStatus = filterStatus.length === 0 ||
        filterStatus.includes(event.status);
      
      // Filter by severity
      const matchesSeverity = filterSeverity.length === 0 ||
        filterSeverity.includes(event.severity);
      
      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [eventRecords, searchQuery, filterStatus, filterSeverity]);

  // =========================================================================
  // LIFECYCLE
  // =========================================================================
  useEffect(() => {
    const timer = setTimeout(() => setThreatLevel('critical'), 3000);
    return () => clearTimeout(timer);
  }, []);

  // =========================================================================
  // INLINE STYLES
  // =========================================================================
  const headerStyle: React.CSSProperties = {
    backgroundColor: colors.backgroundDark,
    padding: '20px',
    borderBottom: `2px solid ${colors.accent}`,
    width: '100%',
  };

  const innerContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    maxWidth: '1600px',
    margin: '0 auto',
  };

  // =========================================================================
  // HELPER FUNCTIONS FOR DASHBOARD STYLING
  // =========================================================================
  const getDashboardCardStyle = (cardType: string) => {
    let baseStyle: React.CSSProperties = {
      backgroundColor: colors.cardBg,
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255,58,0,0.2)',
      position: 'relative',
      overflow: 'hidden',
    };
    
    if (cardType === 'metric') {
      baseStyle = {
        ...baseStyle,
        padding: '24px',
        backgroundColor: colors.cardBg,
        borderLeft: `4px solid ${colors.accent}`,
      };
    } else if (cardType === 'chart') {
      baseStyle = {
        ...baseStyle,
        height: '350px',
      };
    } else if (cardType === 'table') {
      baseStyle = {
        ...baseStyle,
        padding: '16px',
      };
    }
    
    return baseStyle;
  };

  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case 'normal':
        return colors.success;
      case 'elevated':
        return colors.warning;
      case 'high':
        return '#FF5C00';
      case 'critical':
        return colors.error;
      default:
        return colors.success;
    }
  };

  const getThreatLevelBackground = () => {
    switch (threatLevel) {
      case 'normal':
        return colors.successTransparent;
      case 'elevated':
        return colors.warningTransparent;
      case 'high':
        return 'rgba(255, 92, 0, 0.15)';
      case 'critical':
        return colors.errorTransparent;
      default:
        return colors.successTransparent;
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '24h':
        return 'Last 24 Hours';
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '90d':
        return 'Last 90 Days';
      default:
        return 'Last 24 Hours';
    }
  };

  // =========================================================================
  // RENDER SUBSECTIONS
  // =========================================================================

  const renderSummary = () => (
    <div>
      {/* Dashboard Header & Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Security Dashboard</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <button 
              onClick={() => setTimeRange('24h')}
              style={{
                backgroundColor: timeRange === '24h' ? colors.accent : 'transparent',
                color: timeRange === '24h' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              24h
            </button>
            <button 
              onClick={() => setTimeRange('7d')}
              style={{
                backgroundColor: timeRange === '7d' ? colors.accent : 'transparent',
                color: timeRange === '7d' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              7d
            </button>
            <button 
              onClick={() => setTimeRange('30d')}
              style={{
                backgroundColor: timeRange === '30d' ? colors.accent : 'transparent',
                color: timeRange === '30d' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              30d
            </button>
            <button 
              onClick={() => setTimeRange('90d')}
              style={{
                backgroundColor: timeRange === '90d' ? colors.accent : 'transparent',
                color: timeRange === '90d' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              90d
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: getThreatLevelBackground(),
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid ${getThreatLevelColor()}`,
            color: getThreatLevelColor(),
          }}>
            <AlertTriangle size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
              {threatLevel} THREAT LEVEL
            </span>
          </div>
          
          <button 
            onClick={refreshDashboard}
            style={{
              backgroundColor: colors.accent,
              color: colors.text,
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: colors.textMuted,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      
      {/* Current Status Banner */}
      <div style={{
        backgroundColor: colors.cardBgDark,
        borderRadius: '12px',
        padding: '16px 24px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${getThreatLevelColor()}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: getThreatLevelBackground(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Shield size={24} color={getThreatLevelColor()} />
          </div>
          
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Security Status: <span style={{ color: getThreatLevelColor() }}>{threatLevel.toUpperCase()}</span></h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: colors.textMuted }}>
              {threatLevel === 'normal' && 'All systems operating normally. No significant threats detected.'}
              {threatLevel === 'elevated' && 'Increased suspicious activity detected. Monitoring closely.'}
              {threatLevel === 'high' && 'Multiple security incidents detected. Active investigation in progress.'}
              {threatLevel === 'critical' && 'Critical security breach detected. Immediate action required.'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '4px' }}>Active Threats</div>
            <div style={{ 
              fontSize: '1.6rem', 
              fontWeight: 'bold', 
              color: threatLevel === 'normal' ? colors.success : 
                     threatLevel === 'elevated' ? colors.warning : 
                     threatLevel === 'high' ? '#FF5C00' : colors.error 
            }}>
              {threatLevel === 'normal' ? '0' : 
               threatLevel === 'elevated' ? '3' : 
               threatLevel === 'high' ? '7' : '12'}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '4px' }}>Last Incident</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {threatLevel === 'normal' ? '3d 5h ago' : 
               threatLevel === 'elevated' ? '12h 23m ago' : 
               threatLevel === 'high' ? '4h 30m ago' : '23m ago'}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '4px' }}>Protection</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.success }}>Active</div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {summaryMetrics.map((metric, idx) => (
          <div
            key={idx}
            style={getDashboardCardStyle('metric')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: colors.textMuted }}>{metric.label}</h3>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 58, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.accent,
              }}>
                {metric.icon}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{metric.value}</p>
              {metric.change && (
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: metric.trend === 'up' ? 
                    (metric.label.includes('Response') ? colors.error : colors.success) : 
                    (metric.label.includes('Response') ? colors.success : colors.error),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}>
                  {metric.trend === 'up' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {metric.change}
                </span>
              )}
            </div>
            
            <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: 0 }}>{metric.description}</p>
          </div>
        ))}
      </section>

      {/* Two Charts Side by Side */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card 
          title="Threats Over Time" 
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px',
              }}>
                <Maximize size={16} />
              </button>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px',
              }}>
                <Filter size={16} />
              </button>
            </div>
          }
        >
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  dataKey="time" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <YAxis 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: colors.text }}
                  itemStyle={{ fontSize: '0.85rem' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '0.85rem' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line 
                  type="monotone" 
                  dataKey="threats" 
                  name="Total Threats"
                  stroke={colors.accent} 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="blocked" 
                  name="Blocked Threats"
                  stroke={colors.success} 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="critical" 
                  name="Critical Threats"
                  stroke={colors.warning} 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card 
          title="Attack Vectors" 
          actions={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px',
              }}>
                <BarChart2 size={16} />
              </button>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px',
              }}>
                <PieChartIcon size={16} />
              </button>
            </div>
          }
        >
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackVectors} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  dataKey="category" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }} 
                />
                <YAxis 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: colors.text }}
                  itemStyle={{ fontSize: '0.85rem' }}
                  formatter={(value, name) => [value, name === 'blocked' ? 'Blocked' : 'Total']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '0.85rem' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar 
                  dataKey="count" 
                  name="Total Attacks"
                  fill={colors.accent} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="blocked" 
                  name="Blocked"
                  fill={colors.success}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Three Card Row (Radar, Donut, Multi-column)  */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card title="Security Posture">
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={securityPostureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {securityPostureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? colors.success : index === 1 ? colors.warning : colors.error} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: colors.text }}
                  itemStyle={{ fontSize: '0.85rem' }}
                  formatter={(value) => [`${value}%`, 'Coverage']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '10px' }}>
              {securityPostureData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: index === 0 ? colors.success : index === 1 ? colors.warning : colors.error,
                  }}></div>
                  <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Attack Surface Analysis">
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={attackSurfaceData}>
                <PolarGrid stroke={colors.darkGrey} />
                <PolarAngleAxis 
                  dataKey="subject"
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Radar
                  name="Security Score"
                  dataKey="value"
                  stroke={colors.accent}
                  fill={colors.accentTransparent}
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: colors.text }}
                  itemStyle={{ fontSize: '0.85rem' }}
                  formatter={(value) => [`${value}/100`, 'Security Score']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Detection Method Effectiveness">
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={detectionMethodData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: colors.text }}
                  itemStyle={{ fontSize: '0.85rem' }}
                  formatter={(value) => [`${value}%`, value === detectionMethodData[0].success ? 'Success Rate' : 'Failure Rate']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '0.85rem' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar 
                  dataKey="success" 
                  name="Success Rate" 
                  stackId="a" 
                  fill={colors.success}
                />
                <Bar 
                  dataKey="failure" 
                  name="Failure Rate" 
                  stackId="a" 
                  fill={colors.error}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Recent Events Table */}
      <Card 
        title="Recent Security Events"
        actions={
          <button 
            onClick={() => setActiveSection('events')}
            style={{
              backgroundColor: 'rgba(255, 58, 0, 0.1)',
              border: '1px solid rgba(255, 58, 0, 0.3)',
              color: colors.accent,
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Eye size={14} />
            View All
          </button>
        }
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: colors.cardBgDark }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Event ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Severity</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Source</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Detected</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: colors.text, fontSize: '0.9rem' }}>
              {eventRecords.slice(0, 5).map((evt) => (
                <tr 
                  key={evt.id} 
                  style={{ borderBottom: `1px solid ${colors.borderColor}` }}
                  onClick={() => openEventModal(evt)}
                >
                  <td style={{ padding: '12px 16px' }}>{evt.id}</td>
                  <td style={{ padding: '12px 16px' }}>{evt.type}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge 
                      label={evt.severity} 
                      type={evt.severity === 'Critical' || evt.severity === 'High' ? 'error' : 
                        evt.severity === 'Medium' ? 'warning' : 'info'} 
                     size="small"
                   />
                 </td>
                 <td style={{ padding: '12px 16px' }}>{evt.source}</td>
                 <td style={{ padding: '12px 16px' }}>
                   <Badge 
                     label={evt.status} 
                     type={evt.status === 'Open' ? 'error' : 
                        evt.status === 'Investigating' ? 'warning' : 
                        evt.status === 'Resolved' ? 'success' : 'default'} 
                     size="small"
                   />
                 </td>
                 <td style={{ padding: '12px 16px' }}>{evt.detected}</td>
                 <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                   <button style={{
                     backgroundColor: 'transparent',
                     border: 'none',
                     color: colors.textMuted,
                     cursor: 'pointer',
                     padding: '4px',
                   }}>
                     <Eye size={16} />
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </Card>

     <footer style={{
       textAlign: 'center',
       padding: '20px 0',
       marginTop: '30px',
       borderTop: `1px solid ${colors.borderColor}`,
       fontSize: '0.9rem',
       color: colors.textMuted
     }}>
       <small>© 2025 Sentinel Swarm — {getTimeRangeLabel()} data displayed. Last refreshed: {new Date().toLocaleTimeString()}</small>
     </footer>
   </div>
 );

 const renderAgents = () => (
   <div>
     <div style={{
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
       marginBottom: '24px'
     }}>
       <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Swarm Agents</h2>
       
       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
         <div style={{
           display: 'flex',
           alignItems: 'center',
           gap: '12px',
           backgroundColor: 'rgba(255, 255, 255, 0.05)',
           padding: '8px 16px',
           borderRadius: '8px',
           border: '1px solid rgba(255, 255, 255, 0.1)',
         }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <div style={{ 
               width: '10px', 
               height: '10px', 
               borderRadius: '50%', 
               backgroundColor: colors.success 
             }}></div>
             <span style={{ fontSize: '0.9rem' }}>Online: {agents.filter(a => a.status === 'online').length}</span>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <div style={{ 
               width: '10px', 
               height: '10px', 
               borderRadius: '50%', 
               backgroundColor: colors.warning 
             }}></div>
             <span style={{ fontSize: '0.9rem' }}>Degraded: {agents.filter(a => a.status === 'degraded').length}</span>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <div style={{ 
               width: '10px', 
               height: '10px', 
               borderRadius: '50%', 
               backgroundColor: colors.error 
             }}></div>
             <span style={{ fontSize: '0.9rem' }}>Offline: {agents.filter(a => a.status === 'offline').length}</span>
           </div>
         </div>
         
         <div style={{ 
           position: 'relative',
           width: '250px'
         }}>
           <input 
             type="text"
             placeholder="Search agents..."
             style={{
               backgroundColor: 'rgba(255, 255, 255, 0.05)',
               border: '1px solid rgba(255, 255, 255, 0.1)',
               outline: 'none',
               padding: '8px 16px 8px 36px',
               borderRadius: '8px',
               color: colors.text,
               width: '100%',
               fontSize: '0.9rem',
             }}
           />
           <Search 
             size={16} 
             style={{
               position: 'absolute',
               left: '12px',
               top: '50%',
               transform: 'translateY(-50%)',
               color: colors.textMuted
             }}
           />
         </div>
         
         <button 
           onClick={refreshDashboard}
           style={{
             backgroundColor: colors.accent,
             color: colors.text,
             border: 'none',
             borderRadius: '8px',
             padding: '8px 16px',
             display: 'flex',
             alignItems: 'center',
             gap: '8px',
             fontSize: '0.9rem',
             fontWeight: 600,
             cursor: 'pointer',
           }}
           disabled={isRefreshing}
         >
           <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
           {isRefreshing ? 'Refreshing...' : 'Refresh'}
         </button>
       </div>
     </div>
     
     {/* Agents Grid */}
     <div style={{
       display: 'grid',
       gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
       gap: '20px',
       marginBottom: '30px'
     }}>
       {agents.map((agent) => (
         <div
           key={agent.id}
           style={{
             backgroundColor: colors.cardBg,
             padding: '20px',
             borderRadius: '12px',
             cursor: 'pointer',
             boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
             border: `1px solid ${getStatusColor(agent.status)}20`,
             transition: 'transform 0.2s, box-shadow 0.2s',
             position: 'relative',
             overflow: 'hidden',
           }}
           onClick={() => openAgentModal(agent)}
           onMouseOver={(e) => {
             e.currentTarget.style.transform = 'translateY(-3px)';
             e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
           }}
           onMouseOut={(e) => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
           }}
         >
           <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: getStatusColor(agent.status) }}></div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
             <div>
               <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 600 }}>{agent.name}</h3>
               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                 <Badge 
                   label={agent.status.toUpperCase()} 
                   type={agent.status === 'online' ? 'success' : agent.status === 'degraded' ? 'warning' : 'error'} 
                   size="small"
                 />
                 <Badge label={agent.type} type="info" size="small" />
                 <Badge label={agent.region} size="small" />
               </div>
             </div>
             <div style={{
               width: '32px',
               height: '32px',
               borderRadius: '50%',
               backgroundColor: getStatusColor(agent.status) + '20',
               color: getStatusColor(agent.status),
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
             }}>
               <Server size={16} />
             </div>
           </div>
           
           <div style={{ marginBottom: '16px' }}>
             <div style={{ 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center',
               marginBottom: '4px',
             }}>
               <span style={{ fontSize: '0.8rem', color: colors.textMuted }}>CPU</span>
               <span style={{ fontSize: '0.8rem', color: getStatusColor(agent.status) }}>{agent.cpu}%</span>
             </div>
             <div style={{ 
               width: '100%', 
               height: '4px', 
               backgroundColor: 'rgba(255,255,255,0.1)', 
               borderRadius: '2px',
               overflow: 'hidden',
             }}>
               <div style={{ 
                 height: '100%', 
                 width: `${agent.cpu}%`, 
                 backgroundColor: getStatusColor(agent.status),
                 borderRadius: '2px',
               }}></div>
             </div>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
             <div>
               <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '2px' }}>IP Address</div>
               <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{agent.ip}</div>
             </div>
             <div>
               <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '2px' }}>Version</div>
               <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{agent.version}</div>
             </div>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
             <div>
               <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '2px' }}>Last Seen</div>
               <div style={{ fontSize: '0.9rem' }}>{agent.lastSeen}</div>
             </div>
             <div>
               <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '2px' }}>Uptime</div>
               <div style={{ fontSize: '0.9rem' }}>{agent.uptime}</div>
             </div>
           </div>
           
           <button style={{
             position: 'absolute',
             bottom: '12px',
             right: '12px',
             backgroundColor: 'transparent',
             border: 'none',
             color: colors.textMuted,
             cursor: 'pointer',
             padding: '4px',
             fontSize: '0.8rem',
             display: 'flex',
             alignItems: 'center',
             gap: '4px',
           }}>
             <Eye size={14} />
             Details
           </button>
         </div>
       ))}
     </div>
     
     <Card title="Agent Stats" style={{ marginBottom: '30px' }}>
       <div style={{ height: '300px' }}>
         <ResponsiveContainer width="100%" height="100%">
           <ComposedChart data={systemHealthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
             <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
             <XAxis 
               dataKey="day" 
               label={{ value: 'Days', position: 'insideBottomRight', offset: -10 }}
               stroke={colors.textMuted} 
               tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
             />
             <YAxis 
               yAxisId="left"
               label={{ value: 'Resource Usage (%)', angle: -90, position: 'insideLeft', dx: -5 }}
               stroke={colors.textMuted} 
               tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
             />
             <YAxis 
               yAxisId="right"
               orientation="right"
               label={{ value: 'Avg Network (MB/s)', angle: 90, position: 'insideRight', dx: 5 }}
               stroke={colors.textMuted} 
               tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
             />
             <Tooltip 
               contentStyle={{ 
                 backgroundColor: colors.cardBgDark, 
                 border: `1px solid ${colors.borderColor}`,
                 borderRadius: '6px',
               }} 
               labelStyle={{ fontWeight: 'bold', color: colors.text }}
               itemStyle={{ fontSize: '0.85rem' }}
             />
             <Legend 
               wrapperStyle={{ fontSize: '0.85rem' }}
               iconType="circle"
               iconSize={8}
             />
             <Area 
               type="monotone" 
               dataKey="cpu" 
               name="CPU Usage"
               fill={colors.accent + '40'} 
               stroke={colors.accent}
               yAxisId="left" 
             />
             <Area 
               type="monotone" 
               dataKey="memory" 
               name="Memory Usage"
               fill={colors.info + '40'} 
               stroke={colors.info}
               yAxisId="left" 
             />
             <Area 
               type="monotone" 
               dataKey="diskIO" 
               name="Disk I/O"
               fill={colors.warning + '40'} 
               stroke={colors.warning}
               yAxisId="left" 
             />
             <Line 
               type="monotone" 
               dataKey="network" 
               name="Network Traffic"
               stroke={colors.success} 
               strokeWidth={2}
               yAxisId="right" 
               dot={false}
             />
           </ComposedChart>
         </ResponsiveContainer>
       </div>
     </Card>
           
     <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>Agents Details</h3>
     <div style={{ overflowX: 'auto' }}>
       <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
         <thead style={{ backgroundColor: colors.cardBgDark }}>
           <tr>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Agent ID</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Name</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Type</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Status</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Region</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>IP Address</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Version</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>CPU</th>
             <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Last Seen</th>
             <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Actions</th>
           </tr>
         </thead>
         <tbody style={{ color: colors.text, fontSize: '0.9rem' }}>
           {agents.map((agent) => (
             <tr 
               key={agent.id} 
               style={{ 
                 borderBottom: `1px solid ${colors.borderColor}`,
                 cursor: 'pointer',
                 backgroundColor: agent.status === 'offline' ? 'rgba(255, 58, 0, 0.05)' : 'transparent',
               }}
               onClick={() => openAgentModal(agent)}
               onMouseOver={(e) => {
                 e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
               }}
               onMouseOut={(e) => {
                 e.currentTarget.style.backgroundColor = agent.status === 'offline' ? 'rgba(255, 58, 0, 0.05)' : 'transparent';
               }}
             >
               <td style={{ padding: '12px 16px' }}>{agent.id}</td>
               <td style={{ padding: '12px 16px' }}>{agent.name}</td>
               <td style={{ padding: '12px 16px' }}>{agent.type}</td>
               <td style={{ padding: '12px 16px' }}>
                 <Badge 
                   label={agent.status.toUpperCase()} 
                   type={agent.status === 'online' ? 'success' : agent.status === 'degraded' ? 'warning' : 'error'} 
                   size="small"
                 />
               </td>
               <td style={{ padding: '12px 16px' }}>{agent.region}</td>
               <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{agent.ip}</td>
               <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{agent.version}</td>
               <td style={{ padding: '12px 16px' }}>
                 <div style={{ 
                   display: 'flex', 
                   alignItems: 'center',
                   gap: '8px',
                 }}>
                   <div style={{ 
                     width: '50px', 
                     height: '6px', 
                     backgroundColor: 'rgba(255,255,255,0.1)', 
                     borderRadius: '3px',
                     overflow: 'hidden',
                   }}>
                     <div style={{ 
                       height: '100%', 
                       width: `${agent.cpu}%`, 
                       backgroundColor: agent.cpu > 80 ? colors.error : agent.cpu > 60 ? colors.warning : colors.success,
                       borderRadius: '3px',
                     }}></div>
                   </div>
                   <span>{agent.cpu}%</span>
                 </div>
               </td>
               <td style={{ padding: '12px 16px' }}>{agent.lastSeen}</td>
               <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                 <button style={{
                   backgroundColor: 'transparent',
                   border: 'none',
                   color: colors.textMuted,
                   cursor: 'pointer',
                   padding: '4px',
                 }}>
                   <Eye size={16} />
                 </button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );

 const renderEvents = () => (
   <div>
     <div style={{
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
       marginBottom: '24px'
     }}>
       <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Security Events</h2>
       
       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
         <div style={{ 
           position: 'relative',
           width: '300px'
         }}>
           <input 
             type="text"
             placeholder="Search events..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             style={{
               backgroundColor: 'rgba(255, 255, 255, 0.05)',
               border: '1px solid rgba(255, 255, 255, 0.1)',
               outline: 'none',
               padding: '8px 16px 8px 36px',
               borderRadius: '8px',
               color: colors.text,
               width: '100%',
               fontSize: '0.9rem',
             }}
           />
           <Search 
             size={16} 
             style={{
               position: 'absolute',
               left: '12px',
               top: '50%',
               transform: 'translateY(-50%)',
               color: colors.textMuted
             }}
           />
           {searchQuery && (
             <button 
               onClick={() => setSearchQuery('')}
               style={{
                 position: 'absolute',
                 right: '12px',
                 top: '50%',
                 transform: 'translateY(-50%)',
                 backgroundColor: 'transparent',
                 border: 'none',
                 color: colors.textMuted,
                 cursor: 'pointer',
                 padding: 0,
                 fontSize: '1rem',
                 lineHeight: 1,
               }}
             >
               ×
             </button>
           )}
         </div>
         
         <div style={{
           backgroundColor: 'rgba(255, 255, 255, 0.05)',
           border: '1px solid rgba(255, 255, 255, 0.1)',
           borderRadius: '8px',
           padding: '4px',
           display: 'flex',
           alignItems: 'center',
           gap: '4px',
           position: 'relative',
         }}>
           <button 
             onClick={() => {
               document.getElementById('severity-dropdown')?.classList.toggle('show');
               document.getElementById('status-dropdown')?.classList.remove('show');
             }}
             style={{
               backgroundColor: filterSeverity.length > 0 ? colors.accent : 'transparent',
               color: filterSeverity.length > 0 ? colors.text : colors.textMuted,
               border: 'none',
               borderRadius: '6px',
               padding: '6px 12px',
               fontSize: '0.85rem',
               fontWeight: 500,
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '6px',
             }}
           >
             Severity
             <span style={{
               display: filterSeverity.length > 0 ? 'flex' : 'none',
               alignItems: 'center',
               justifyContent: 'center',
               backgroundColor: 'rgba(0,0,0,0.3)',
               borderRadius: '50%',
               width: '18px',
               height: '18px',
               fontSize: '0.7rem',
             }}>
               {filterSeverity.length}
             </span>
             <ChevronDown size={14} />
           </button>
           
           <div id="severity-dropdown" style={{
             display: 'none',
             position: 'absolute',
             top: '100%',
             left: '0',
             backgroundColor: colors.cardBgDark,
             border: `1px solid ${colors.borderColor}`,
             borderRadius: '8px',
             padding: '8px',
             zIndex: 10,
             marginTop: '4px',
             boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
             width: '150px',
           }}>
             {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
               <div key={severity} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <input 
                   type="checkbox" 
                   id={`severity-${severity}`}
                   checked={filterSeverity.includes(severity)}
                   onChange={(e) => {
                     if (e.target.checked) {
                       setFilterSeverity([...filterSeverity, severity]);
                     } else {
                       setFilterSeverity(filterSeverity.filter(s => s !== severity));
                     }
                   }}
                 />
                 <label htmlFor={`severity-${severity}`} style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                   {severity}
                 </label>
               </div>
             ))}
             <hr style={{ margin: '8px 0', borderColor: colors.borderColor }} />
             <button 
               onClick={() => setFilterSeverity([])}
               style={{
                 backgroundColor: 'transparent',
                 border: 'none',
                 color: colors.textMuted,
                 padding: '4px 8px',
                 width: '100%',
                 textAlign: 'left',
                 fontSize: '0.85rem',
                 cursor: 'pointer',
               }}
             >
               Clear All
             </button>
           </div>
           
           <button 
             onClick={() => {
               document.getElementById('status-dropdown')?.classList.toggle('show');
               document.getElementById('severity-dropdown')?.classList.remove('show');
             }}
             style={{
               backgroundColor: filterStatus.length > 0 ? colors.accent : 'transparent',
               color: filterStatus.length > 0 ? colors.text : colors.textMuted,
               border: 'none',
               borderRadius: '6px',
               padding: '6px 12px',
               fontSize: '0.85rem',
               fontWeight: 500,
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '6px',
             }}
           >
             Status
             <span style={{
               display: filterStatus.length > 0 ? 'flex' : 'none',
               alignItems: 'center',
               justifyContent: 'center',
               backgroundColor: 'rgba(0,0,0,0.3)',
               borderRadius: '50%',
               width: '18px',
               height: '18px',
               fontSize: '0.7rem',
             }}>
               {filterStatus.length}
             </span>
             <ChevronDown size={14} />
           </button>
           
           <div id="status-dropdown" style={{
             display: 'none',
             position: 'absolute',
             top: '100%',
             left: '120px',
             backgroundColor: colors.cardBgDark,
             border: `1px solid ${colors.borderColor}`,
             borderRadius: '8px',
             padding: '8px',
             zIndex: 10,
             marginTop: '4px',
             boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
             width: '180px',
           }}>
             {['Open', 'Investigating', 'Resolved', 'False Positive'].map((status) => (
               <div key={status} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <input 
                   type="checkbox" 
                   id={`status-${status}`}
                   checked={filterStatus.includes(status)}
                   onChange={(e) => {
                     if (e.target.checked) {
                       setFilterStatus([...filterStatus, status]);
                     } else {
                       setFilterStatus(filterStatus.filter(s => s !== status));
                     }
                   }}
                 />
                 <label htmlFor={`status-${status}`} style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                   {status}
                 </label>
               </div>
             ))}
             <hr style={{ margin: '8px 0', borderColor: colors.borderColor }} />
             <button 
               onClick={() => setFilterStatus([])}
               style={{
                 backgroundColor: 'transparent',
                 border: 'none',
                 color: colors.textMuted,
                 padding: '4px 8px',
                 width: '100%',
                 textAlign: 'left',
                 fontSize: '0.85rem',
                 cursor: 'pointer',
               }}
             >
               Clear All
             </button>
           </div>
         </div>
         
         <button 
           onClick={refreshDashboard}
           style={{
             backgroundColor: colors.accent,
             color: colors.text,
             border: 'none',
             borderRadius: '8px',
             padding: '8px 16px',
             display: 'flex',
             alignItems: 'center',
             gap: '8px',
             fontSize: '0.9rem',
             fontWeight: 600,
             cursor: 'pointer',
           }}
           disabled={isRefreshing}
         >
           <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
           {isRefreshing ? 'Refreshing...' : 'Refresh'}
         </button>
       </div>
     </div>
     
     <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.95rem', color: colors.textMuted }}>
          Showing {filteredEvents.length} events {searchQuery && `matching "${searchQuery}"`}
          {(filterSeverity.length > 0 || filterStatus.length > 0) && 
            ` with filters: ${filterSeverity.length > 0 ? `Severity (${filterSeverity.join(', ')})` : ''} 
             ${filterSeverity.length > 0 && filterStatus.length > 0 ? ' and ' : ''}
             ${filterStatus.length > 0 ? `Status (${filterStatus.join(', ')})` : ''}`
          }
        </div>
        
        <div>
          <button style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: colors.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
          }}>
            <Download size={14} />
            Export Events
          </button>
        </div>
      </div>
      
      <Card title="Default Title">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: colors.cardBgDark }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Event ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Severity</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Source</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Affected</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Assignee</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Detected</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: colors.text, fontSize: '0.9rem' }}>
              {filteredEvents.map((evt) => (
                <tr 
                  key={evt.id} 
                  style={{ 
                    borderBottom: `1px solid ${colors.borderColor}`,
                    cursor: 'pointer',
                    backgroundColor: evt.severity === 'Critical' ? 'rgba(255, 58, 0, 0.05)' : 'transparent',
                  }}
                  onClick={() => openEventModal(evt)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = evt.severity === 'Critical' ? 'rgba(255, 58, 0, 0.05)' : 'transparent';
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>{evt.id}</td>
                  <td style={{ padding: '12px 16px' }}>{evt.type}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge 
                      label={evt.severity} 
                      type={evt.severity === 'Critical' || evt.severity === 'High' ? 'error' : 
                          evt.severity === 'Medium' ? 'warning' : 'info'} 
                      size="small"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{evt.source}</td>
                  <td style={{ padding: '12px 16px' }}>{evt.affected}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge 
                      label={evt.status} 
                      type={evt.status === 'Open' ? 'error' : 
                          evt.status === 'Investigating' ? 'warning' : 
                          evt.status === 'Resolved' ? 'success' : 'default'} 
                      size="small"
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }}>{evt.assignee || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{evt.detected}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: colors.textMuted,
                      cursor: 'pointer',
                      padding: '4px',
                    }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '40px 0', textAlign: 'center', color: colors.textMuted }}>
                    No events found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '20px',
        padding: '12px 0',
      }}>
        <div style={{ fontSize: '0.9rem', color: colors.textMuted }}>
          Showing {Math.min(filteredEvents.length, 25)} of {filteredEvents.length} events
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: colors.textMuted,
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }} disabled>
            Previous
          </button>
          
          <button style={{
            backgroundColor: colors.accent,
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}>
            1
          </button>
          
          <button style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: colors.textMuted,
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}>
            2
          </button>
          
          <button style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: colors.textMuted,
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Analytics & Insights</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <button 
              onClick={() => setTimeRange('24h')}
              style={{
                backgroundColor: timeRange === '24h' ? colors.accent : 'transparent',
                color: timeRange === '24h' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              24h
            </button>
            <button 
              onClick={() => setTimeRange('7d')}
              style={{
                backgroundColor: timeRange === '7d' ? colors.accent : 'transparent',
                color: timeRange === '7d' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              7d
            </button>
            <button 
              onClick={() => setTimeRange('30d')}
              style={{
                backgroundColor: timeRange === '30d' ? colors.accent : 'transparent',
                color: timeRange === '30d' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              30d
            </button>
            <button 
              onClick={() => setTimeRange('90d')}
              style={{
                backgroundColor: timeRange === '90d' ? colors.accent : 'transparent',
                color: timeRange === '90d' ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              90d
            </button>
          </div>
          
          <button 
            onClick={refreshDashboard}
            style={{
              backgroundColor: colors.accent,
              color: colors.text,
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: colors.textMuted,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      
      {/* Network Traffic Analysis */}
      <Card 
        title="Network Traffic Analysis" 
        style={{ marginBottom: '30px' }}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '4px',
            }}>
              <Maximize size={16} />
            </button>
            <button style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '4px',
            }}>
              <Filter size={16} />
            </button>
          </div>
        }
      >
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={networkTrafficData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
              <XAxis 
                dataKey="hour" 
                stroke={colors.textMuted} 
                tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
              />
              <YAxis 
                stroke={colors.textMuted} 
                tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                label={{ value: 'Traffic (MB/s)', angle: -90, position: 'insideLeft', dx: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.cardBgDark, 
                  border: `1px solid ${colors.borderColor}`,
                  borderRadius: '6px',
                }} 
                labelStyle={{ fontWeight: 'bold', color: colors.text }}
                itemStyle={{ fontSize: '0.85rem' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '0.85rem' }}
                iconType="circle"
                iconSize={8}
              />
              <Area 
                type="monotone" 
                dataKey="inbound" 
                name="Inbound"
                fill={colors.accent + '40'} 
                stroke={colors.accent}
              />
              <Area 
                type="monotone" 
                dataKey="outbound" 
                name="Outbound"
                fill={colors.info + '40'} 
                stroke={colors.info}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                name="Total Traffic"
                fill={colors.success + '20'} 
                stroke={colors.success}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Two Charts Side by Side */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card title="Geographic Threat Origin">
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatOriginData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  type="number" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <YAxis 
                  dataKey="country" 
                  type="category" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: colors.text }}
                  itemStyle={{ fontSize: '0.85rem' }}
                  formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, 'Threats']}
                />
                <Bar 
                  dataKey="count" 
                  fill={colors.accent}
                  radius={[0, 4, 4, 0]}
                >
                  {threatOriginData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors.chartColors[index % colors.chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px', 
            justifyContent: 'center',
            marginTop: '10px' 
          }}>
            {threatOriginData.slice(0, 5).map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                fontSize: '0.8rem',
              }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '2px', 
                  backgroundColor: colors.chartColors[index % colors.chartColors.length] 
                }}></div>
                <span>{item.country}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Threat Categories">
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackVectors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attackVectors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors.chartColors[index % colors.chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
      
      {/* Scatter plot */}
      <Card title="Event Correlation Analysis" style={{ marginBottom: '30px' }}>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Event ID" 
                domain={[30215, 30250]}
                stroke={colors.textMuted} 
                tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                label={{ value: 'Event ID', position: 'insideBottomRight', offset: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Severity Score" 
                domain={[0, 100]}
                stroke={colors.textMuted} 
                tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                label={{ value: 'Severity Score', angle: -90, position: 'insideLeft', dx: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.cardBgDark, 
                  border: `1px solid ${colors.borderColor}`,
                  borderRadius: '6px',
                }} 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => [value, name === 'x' ? 'Event ID' : 'Severity Score']}
              />
              <Scatter 
                name="Events" 
                data={eventRecords.map(evt => ({ 
                  x: evt.id, 
                  y: evt.severity === 'Critical' ? 90 + Math.random() * 10 : 
                     evt.severity === 'High' ? 70 + Math.random() * 20 : 
                     evt.severity === 'Medium' ? 40 + Math.random() * 30 : 
                     10 + Math.random() * 30
                }))} 
                fill={colors.accent}
              >
                {eventRecords.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.severity === 'Critical' ? colors.error : 
                          entry.severity === 'High' ? colors.warning : 
                          entry.severity === 'Medium' ? colors.info : 
                          colors.success} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Threat Intelligence Table */}
      <Card title="Threat Intelligence Indicators">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: colors.cardBgDark }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Indicator</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Confidence</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Severity</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>First Seen</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Last Seen</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Source</th>
              </tr>
            </thead>
            <tbody style={{ color: colors.text, fontSize: '0.9rem' }}>
              {threatIntelData.slice(0, 10).map((intel) => (
                <tr 
                  key={intel.id} 
                  style={{ 
                    borderBottom: `1px solid ${colors.borderColor}`,
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>{intel.id}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{intel.indicator}</td>
                  <td style={{ padding: '12px 16px' }}>{intel.type}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <div style={{ 
                        width: '50px', 
                        height: '6px', 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${intel.confidence}%`, 
                          backgroundColor: intel.confidence > 80 ? colors.success : intel.confidence > 60 ? colors.warning : colors.error,
                          borderRadius: '3px',
                        }}></div>
                      </div>
                      <span>{intel.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge 
                      label={intel.severity} 
                      type={intel.severity === 'Critical' || intel.severity === 'High' ? 'error' : 
                           intel.severity === 'Medium' ? 'warning' : 'info'} 
                      size="small"
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }}>{intel.firstSeen}</td>
                  <td style={{ padding: '12px 16px' }}>{intel.lastSeen}</td>
                  <td style={{ padding: '12px 16px' }}>{intel.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderModels = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>AI Models & ML Analytics</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={refreshDashboard}
            style={{
              backgroundColor: colors.accent,
              color: colors.text,
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <section style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card title="Model Performance Over Time">
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  dataKey="day" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                  type="number"
                  domain={[1, 30]}
                  label={{ value: 'Days', position: 'insideBottomRight', offset: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <YAxis 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                  domain={[0.7, 1]}
                  label={{ value: 'Accuracy', angle: -90, position: 'insideLeft', dx: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: colors.text }}
                  itemStyle={{ fontSize: '0.85rem' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '0.85rem' }}
                  iconType="circle"
                  iconSize={8}
                />
{modelPerformanceData.map((model, index) => (
  <Line 
    key={model.name}
    type="monotone" 
    data={Array(30).fill(0).map((_, i) => ({
      day: i + 1,
      value: parseFloat(model.auc) - 0.05 + Math.random() * 0.1
    }))}
    dataKey="value"
    name={model.name}
    stroke={colors.chartColors[index % colors.chartColors.length]}
    strokeWidth={2}
    dot={false}
    activeDot={{ r: 6 }}
  />
))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Model Types">
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Anomaly Detection', value: 35 },
                    { name: 'Classification', value: 25 },
                    { name: 'Clustering', value: 15 },
                    { name: 'Regression', value: 10 },
                    { name: 'Deep Learning', value: 15 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  formatter={(value) => [`${value}%`, 'Usage']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '0.85rem' }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
      
      <section style={{ marginBottom: '30px' }}>
        <Card title="Model Performance Metrics">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: colors.cardBgDark }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Model Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Precision</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Recall</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>F1 Score</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>AUC</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Latency</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Last Updated</th>
                </tr>
              </thead>
              <tbody style={{ color: colors.text, fontSize: '0.9rem' }}>
                {modelPerformanceData.map((model) => (
                  <tr key={model.name} style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
                    <td style={{ padding: '12px 16px' }}>{model.name}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '4px', 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${parseFloat(model.precision) * 100}%`, 
                            backgroundColor: parseFloat(model.precision) > 0.9 ? colors.success : parseFloat(model.precision) > 0.8 ? colors.warning : colors.error,
                            borderRadius: '2px',
                          }}></div>
                        </div>
                        <span>{model.precision}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '4px', 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${parseFloat(model.recall) * 100}%`, 
                            backgroundColor: parseFloat(model.recall) > 0.9 ? colors.success : parseFloat(model.recall) > 0.8 ? colors.warning : colors.error,
                            borderRadius: '2px',
                          }}></div>
                        </div>
                        <span>{model.recall}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '4px', 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${parseFloat(model.f1) * 100}%`, 
                            backgroundColor: parseFloat(model.f1) > 0.9 ? colors.success : parseFloat(model.f1) > 0.8 ? colors.warning : colors.error,
                            borderRadius: '2px',
                          }}></div>
                        </div>
                        <span>{model.f1}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '4px', 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${parseFloat(model.auc) * 100}%`, 
                            backgroundColor: parseFloat(model.auc) > 0.9 ? colors.success : parseFloat(model.auc) > 0.8 ? colors.warning : colors.error,
                            borderRadius: '2px',
                          }}></div>
                        </div>
                        <span>{model.auc}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{model.latency}</td>
                    <td style={{ padding: '12px 16px' }}>{model.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
      
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card title="Feature Importance">
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={[
                  { name: 'Request Frequency', value: 0.92 },
                  { name: 'Time Pattern', value: 0.85 },
                  { name: 'IP Reputation', value: 0.78 },
                  { name: 'User Agent', value: 0.72 },
                  { name: 'Session Length', value: 0.65 },
                  { name: 'Payload Size', value: 0.61 },
                ]}
                margin={{ top: 20, right: 30, left: 110, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  type="number" 
                  domain={[0, 1]}
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  formatter={(value) => [`${value}`, 'Importance']}
                />
                <Bar 
                  dataKey="value" 
                  fill={colors.accent}
                  radius={[0, 4, 4, 0]}
                >
                  {[...Array(6)].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors.chartColors[index % colors.chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Prediction Confidence">
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { confidence: '0-10%', count: 2 },
                  { confidence: '10-20%', count: 5 },
                  { confidence: '20-30%', count: 8 },
                  { confidence: '30-40%', count: 12 },
                  { confidence: '40-50%', count: 18 },
                  { confidence: '50-60%', count: 26 },
                  { confidence: '60-70%', count: 42 },
                  { confidence: '70-80%', count: 65 },
                  { confidence: '80-90%', count: 84 },
                  { confidence: '90-100%', count: 102 },
                ]}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  dataKey="confidence" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                  interval={1}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                  formatter={(value) => [`${value}`, 'Predictions']}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={colors.info}
                  fill={`url(#colorGradient)`}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={colors.error} stopOpacity={0.8}/>
                    <stop offset="50%" stopColor={colors.warning} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={colors.success} stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Training Progress">
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...Array(20)].map((_, i) => ({
                  epoch: i + 1,
                  training: 1 - Math.exp(-0.2 * (i + 1)) * (1 + Math.sin(i / 2) * 0.05),
                  validation: 1 - Math.exp(-0.18 * (i + 1)) * (1 + Math.sin(i / 2) * 0.08) - 0.05,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
                <XAxis 
                  dataKey="epoch" 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                  label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <YAxis 
                  stroke={colors.textMuted} 
                  tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                  domain={[0.5, 1]}
                  label={{ value: 'Accuracy', angle: -90, position: 'insideLeft', dx: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.cardBgDark, 
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: '6px',
                  }} 
                />
                <Legend 
                  wrapperStyle={{ fontSize: '0.85rem' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line 
                  type="monotone" 
                  dataKey="training" 
                  name="Training Accuracy"
                  stroke={colors.accent} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="validation" 
                  name="Validation Accuracy"
                  stroke={colors.success} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
      
      <Card title="Model Deployment Status">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {modelPerformanceData.map((model, index) => (
            <div key={model.name} style={{
              backgroundColor: colors.cardBgDark,
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{model.name}</h4>
                <Badge 
                  label="Production" 
                  type={index % 3 === 0 ? 'success' : index % 3 === 1 ? 'warning' : 'info'} 
                  size="small"
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '4px' }}>Deployment Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: index % 3 === 0 ? colors.success : index % 3 === 1 ? colors.warning : colors.info
                  }}></div>
                  <span style={{ fontSize: '0.9rem' }}>
                    {index % 3 === 0 ? 'Deployed (v1.2.3)' : index % 3 === 1 ? 'Pending Update' : 'Testing'}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '4px' }}>Inference Time</div>
                  <div style={{ fontSize: '0.9rem' }}>{model.latency}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginBottom: '4px' }}>Accuracy</div>
                  <div style={{ fontSize: '0.9rem' }}>{model.auc}</div>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                fontSize: '0.85rem',
              }}>
                <span>Updated {new Date(model.lastUpdated).toLocaleDateString()}</span>
                <span style={{ color: colors.textMuted }}>by System</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderProxy = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Metamorphic Proxy Configuration</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={refreshDashboard}
            style={{
              backgroundColor: colors.accent,
              color: colors.text,
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button 
            style={{
              backgroundColor: 'rgba(0, 227, 150, 0.15)',
              color: colors.success,
              border: `1px solid rgba(0, 227, 150, 0.3)`,
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
            Force Key Rotation
          </button>
        </div>
      </div>
      
      {/* Proxy Status Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,58,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: colors.textMuted }}>Active Proxies</h3>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 58, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.accent,
            }}>
              <Server size={18} />
            </div>
          </div>
          
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0' }}>24/28</p>
          <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: '0 0 16px 0' }}>Edge proxies online</p>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '6px',
            fontSize: '0.85rem',
          }}>
            <span>Last deployment: 2h ago</span>
            <span style={{ color: colors.success }}>Healthy</span>
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,58,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: colors.textMuted }}>Key Rotation</h3>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 58, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.accent,
            }}>
              <RefreshCw size={18} />
            </div>
          </div>
          
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0' }}>4.2 / hr</p>
          <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: '0 0 16px 0' }}>Average rotation frequency</p>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '6px',
            fontSize: '0.85rem',
          }}>
            <span>Next rotation: 8m 43s</span>
            <span style={{ color: colors.success }}>Automatic</span>
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,58,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: colors.textMuted }}>Traffic Protected</h3>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 58, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.accent,
            }}>
              <Shield size={18} />
            </div>
          </div>
          
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0' }}>3.8 TB</p>
          <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: '0 0 16px 0' }}>Encrypted traffic in the last 24h</p>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '6px',
            fontSize: '0.85rem',
          }}>
            <span>Active sessions: 8,432</span>
            <span style={{ color: colors.success }}>Normal load</span>
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,58,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: colors.textMuted }}>Morphing Status</h3>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 58, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.accent,
            }}>
              <Activity size={18} />
            </div>
          </div>
          
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0' }}>Active</p>
          <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: '0 0 16px 0' }}>All proxy layers operational</p>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '6px',
            fontSize: '0.85rem',
          }}>
            <span>Policy: Dynamic</span>
            <span style={{ color: colors.success }}>Fully obfuscated</span>
          </div>
        </div>
      </section>
      
      {/* Key Rotation Chart */}
      <Card title="Key Rotation History" style={{ marginBottom: '30px' }}>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={[...Array(24)].map((_, i) => {
                const hour = i;
                // More rotations during business hours
                const baseRotations = hour >= 8 && hour <= 18 ? 4 + Math.random() * 2 : 2 + Math.random() * 2;
                // Occasional spikes for threat-based rotations
                const threatRotations = Math.random() > 0.8 ? Math.floor(Math.random() * 4) + 1 : 0;
                return {
                  hour: `${hour}:00`,
                  scheduled: Math.floor(baseRotations),
                  threat: threatRotations,
                  manual: hour % 8 === 0 ? 1 : 0, // Manual rotations at specific times
                };
              })}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.darkGrey} />
              <XAxis 
                dataKey="hour" 
                stroke={colors.textMuted} 
                tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
              />
         <YAxis 
                stroke={colors.textMuted} 
                tick={{ fill: colors.textMuted, fontSize: '0.8rem' }}
                label={{ value: 'Rotations', angle: -90, position: 'insideLeft', dx: -5, fill: colors.textMuted, fontSize: '0.8rem' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.cardBgDark, 
                  border: `1px solid ${colors.borderColor}`,
                  borderRadius: '6px',
                }} 
                labelStyle={{ fontWeight: 'bold', color: colors.text }}
                itemStyle={{ fontSize: '0.85rem' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '0.85rem' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="scheduled" name="Scheduled" fill={colors.info} stackId="a" />
              <Bar dataKey="threat" name="Threat-Triggered" fill={colors.error} stackId="a" />
              <Bar dataKey="manual" name="Manual" fill={colors.warning} stackId="a" />
              <Line type="monotone" dataKey="scheduled" stroke={colors.info} strokeWidth={0} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Proxy Rotation Logs */}
      <Card title="Proxy Rotation Logs">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: colors.cardBgDark }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Timestamp</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Proxy ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Reason</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>IP Range</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Duration</th>
              </tr>
            </thead>
            <tbody style={{ color: colors.text, fontSize: '0.9rem' }}>
              {proxyRotations.map((rotation, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    borderBottom: `1px solid ${colors.borderColor}`,
                    backgroundColor: rotation.reason.includes('Threat') ? 'rgba(255,58,0,0.05)' : 'transparent',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = rotation.reason.includes('Threat') ? 'rgba(255,58,0,0.05)' : 'transparent';
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>{rotation.timestamp}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{rotation.proxyId}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge 
                      label={rotation.reason} 
                      type={
                        rotation.reason.includes('Threat') ? 'error' : 
                        rotation.reason.includes('Manual') ? 'warning' : 
                        rotation.reason.includes('Scheduled') ? 'info' : 
                        'default'
                      } 
                      size="small"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{rotation.ipRange}</td>
                  <td style={{ padding: '12px 16px' }}>{rotation.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // =========================================================================
  // MAIN RENDER: CONDITIONAL SUBSECTION RENDERING & LAYOUT
  // =========================================================================
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.background,
      color: colors.text,
    }}>
      {/* HEADER */}
      <header style={headerStyle}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Title & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={toggleSidebar}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textMuted,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Menu size={22} />
            </button>
            
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF3A00 0%, #FF6E40 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={22} color={colors.text} />
            </div>
            
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
                Sentinel Swarm
              </h1>
              <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>
                GSDO + MPE Enterprise Dashboard
              </span>
            </div>
          </div>

          {/* Right Side Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Threat Level */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: getThreatLevelBackground(),
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid ${getThreatLevelColor()}`,
              color: getThreatLevelColor(),
            }}>
              <AlertTriangle size={18} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                {threatLevel} THREAT LEVEL
              </span>
            </div>
            
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: colors.textMuted,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Bell size={20} />
              </button>
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: colors.error,
                border: '2px solid ' + colors.backgroundDark,
              }}></span>
            </div>
            
            {/* User Profile */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
                OS
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>admin@gsdo.com</div>
                <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>System Admin</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* SIDEBAR */}
        <aside style={{
          width: showSidebar ? '240px' : '0',
          backgroundColor: colors.backgroundDark,
          padding: showSidebar ? '20px' : '0',
          borderRight: `1px solid ${colors.darkGrey}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          transition: 'width 0.3s, padding 0.3s',
          overflow: 'hidden',
          position: 'sticky',
          top: '0',
          height: 'calc(100vh - 80px)',
          overflowY: 'auto',
        }}>
          <nav>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{ 
                marginBottom: '5px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <button 
                  onClick={() => setActiveSection('summary')} 
                  style={{ 
                    marginBottom: '5px',
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: activeSection === 'summary' ? colors.accent : colors.textMuted,
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: activeSection === 'summary' ? 'rgba(255, 58, 0, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '8px',
                  }}
                >
                  <Shield size={20} />
                  <span>Dashboard</span>
                </button>
              </li>
              
              <li style={{ 
                marginBottom: '5px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <button 
                  onClick={() => setActiveSection('agents')} 
                  style={{ 
                    marginBottom: '5px',
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: activeSection === 'agents' ? colors.accent : colors.textMuted,
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: activeSection === 'agents' ? 'rgba(255, 58, 0, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '8px',
                  }}
                >
                  <Server size={20} />
                  <span>Swarm Agents</span>
                </button>
              </li>
              
              <li style={{ 
                marginBottom: '5px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <button 
                  onClick={() => setActiveSection('events')} 
                  style={{ 
                    marginBottom: '5px',
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: activeSection === 'events' ? colors.accent : colors.textMuted,
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: activeSection === 'events' ? 'rgba(255, 58, 0, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '8px',
                  }}
                >
                  <AlertTriangle size={20} />
                  <span>Security Events</span>
                </button>
              </li>
              
              <li style={{ 
                marginBottom: '5px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <button 
                  onClick={() => setActiveSection('analytics')} 
                  style={{ 
                    marginBottom: '5px',
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: activeSection === 'analytics' ? colors.accent : colors.textMuted,
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: activeSection === 'analytics' ? 'rgba(255, 58, 0, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '8px',
                  }}
                >
                  <BarChart2 size={20} />
                  <span>Analytics</span>
                </button>
              </li>
              
              <li style={{ 
                marginBottom: '5px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <button 
                  onClick={() => setActiveSection('models')} 
                  style={{ 
                    marginBottom: '5px',
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: activeSection === 'models' ? colors.accent : colors.textMuted,
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: activeSection === 'models' ? 'rgba(255, 58, 0, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '8px',
                  }}
                >
                  <Cpu size={20} />
                  <span>AI Models</span>
                </button>
              </li>
              
              <li style={{ 
                marginBottom: '5px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <button 
                  onClick={() => setActiveSection('proxy')} 
                  style={{ 
                    marginBottom: '5px',
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    color: activeSection === 'proxy' ? colors.accent : colors.textMuted,
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: activeSection === 'proxy' ? 'rgba(255, 58, 0, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '8px',
                  }}
                >
                  <Layers size={20} />
                  <span>Proxy Management</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div style={{ marginTop: 'auto', padding: '10px 0', borderTop: `1px solid ${colors.borderColor}` }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.textMuted,
              width: '100%',
              padding: '10px 12px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '8px',
            }}>
              <Settings size={20} />
              <span>Settings</span>
            </button>
            
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.textMuted,
              width: '100%',
              padding: '10px 12px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '8px',
            }}>
              <Lock size={20} />
              <span>Access Control</span>
            </button>
          </div>
        </aside>

        {/* MAIN SECTION */}
        <section style={{
          ...innerContainerStyle,
          transition: 'padding 0.3s',
          width: '100%',
        }}>
          {activeSection === 'summary' && renderSummary()}
          {activeSection === 'agents' && renderAgents()}
          {activeSection === 'events' && renderEvents()}
          {activeSection === 'analytics' && renderAnalytics()}
          {activeSection === 'models' && renderModels()}
          {activeSection === 'proxy' && renderProxy()}
        </section>
      </div>

      {/* MODAL FOR DETAILS */}
      {showModal && modalContent && (
        <Modal 
          title={modalContent.title} 
          content={modalContent.content} 
          onClose={closeModal} 
          size={modalSize}
        />
      )}

      {/* FOOTER */}
      <footer style={{
  textAlign: 'center',
  padding: '20px 0',
  borderTop: `1px solid ${colors.accent}`,
  backgroundColor: colors.backgroundDark,
  fontSize: '0.9rem',
  color: colors.textMuted,
}}>
  <small>
    © 2025 Sentinel Swarm — TECHNOLOGY DEMONSTRATION
    <span style={{ display: 'block', marginTop: '4px', fontSize: '0.8rem' }}>
      This dashboard is a conceptual prototype integrating GSDO and MPE techniques.
      <br />Not a production-ready product. All data shown is simulated.
      <br />Version 2.4.8 | Demo Environment | Last updated: April 13, 2025
    </span>
  </small>
</footer>
      
      {/* CSS Styles for Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .spin {
            animation: spin 1s linear infinite;
          }
          
          .show {
            display: block !important;
          }
          
          .loading-spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(255, 58, 0, 0.1);
            border-top: 3px solid rgba(255, 58, 0, 1);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        `
      }} />
    </div>
  );
};

export default Dashboard;