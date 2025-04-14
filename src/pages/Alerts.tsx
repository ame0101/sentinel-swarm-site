// src/pages/Alerts.tsx
import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, RefreshCw, Download, Eye, Clock } from 'lucide-react';

const Alerts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Colors for consistency with dashboard
  const colors = {
    background: '#121212',
    backgroundDark: '#0a0a0a',
    accent: '#FF3A00',
    accentLight: '#FF5C00',
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
  };

  // Simulated refresh function
  const refreshAlerts = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Enhanced alerts data with more details and variety
  const alertsData = [
    { 
      id: 30215, 
      type: 'Malware Signature #A45-7', 
      severity: 'High', 
      source: '192.168.5.22', 
      affected: 'workstation_008, server_prod02', 
      detected: '2025-04-13 15:24:11',
      status: 'Open'
    },
    { 
      id: 30216, 
      type: 'Phishing Email Campaign', 
      severity: 'Medium', 
      source: 'email@suspicious-domain.com', 
      affected: 'CEO_Office, user_kate', 
      detected: '2025-04-13 16:10:03',
      status: 'Investigating'
    },
    { 
      id: 30217, 
      type: 'Port Scan (TCP/22)', 
      severity: 'Low', 
      source: '45.67.89.100', 
      affected: 'dmz_fw01', 
      detected: '2025-04-13 16:55:42',
      status: 'Resolved'
    },
    { 
      id: 30218, 
      type: 'Brute Force (SSH)', 
      severity: 'Critical', 
      source: '172.16.32.11', 
      affected: 'server_auth01', 
      detected: '2025-04-13 17:21:07',
      status: 'Open'
    },
    { 
      id: 30219, 
      type: 'Data Exfiltration Attempt', 
      severity: 'Critical', 
      source: '128.197.71.247', 
      affected: 'db_finance, user_mark', 
      detected: '2025-04-13 18:02:55',
      status: 'Investigating'
    },
    { 
      id: 30220, 
      type: 'SQL Injection Attempt', 
      severity: 'Medium', 
      source: '203.45.67.150', 
      affected: 'webapp_prod03', 
      detected: '2025-04-13 18:47:33',
      status: 'Open'
    },
    { 
      id: 30221, 
      type: 'Suspicious Process Execution', 
      severity: 'High', 
      source: '10.1.24.56', 
      affected: 'workstation_045', 
      detected: '2025-04-13 19:18:22',
      status: 'Open'
    },
    { 
      id: 30222, 
      type: 'Unusual Admin Login', 
      severity: 'Medium', 
      source: '10.5.2.180', 
      affected: 'server_auth02', 
      detected: '2025-04-13 19:43:01',
      status: 'Resolved'
    },
  ];

  // Filter alerts based on search and severity filters
  const filteredAlerts = alertsData.filter(alert => {
    const matchesSearch = searchQuery === '' || 
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.affected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toString().includes(searchQuery);
    
    const matchesSeverity = filterSeverity.length === 0 || 
      filterSeverity.includes(alert.severity);
    
    return matchesSearch && matchesSeverity;
  });

  // Function to get appropriate color for severity badges
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical':
        return colors.error;
      case 'High':
        return colors.accentLight;
      case 'Medium':
        return colors.warning;
      case 'Low':
        return colors.info;
      default:
        return colors.textMuted;
    }
  };

  // Function to get appropriate color for status badges
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open':
        return colors.error;
      case 'Investigating':
        return colors.warning;
      case 'Resolved':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  // Badge component for consistent styling
  const Badge = ({ label, color }: { label: string, color: string }) => (
    <span style={{
      display: 'inline-block',
      backgroundColor: `${color}20`,
      color: color,
      border: `1px solid ${color}40`,
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '0.8rem',
      fontWeight: 600,
    }}>
      {label}
    </span>
  );

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text, minHeight: 'calc(100vh - 60px)', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with controls */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: colors.accentTransparent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={24} color={colors.accent} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Security Alerts</h2>
              <p style={{ fontSize: '0.95rem', color: colors.textMuted, margin: '4px 0 0 0' }}>
                Real-time threat monitoring and incident tracking
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', width: '260px' }}>
              <input 
                type="text"
                placeholder="Search alerts..."
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
                  }}
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Severity Filter */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  document.getElementById('severity-dropdown')?.classList.toggle('show');
                }}
                style={{
                  backgroundColor: filterSeverity.length > 0 ? colors.accentTransparent : 'rgba(255, 255, 255, 0.05)',
                  color: filterSeverity.length > 0 ? colors.accent : colors.textMuted,
                  border: filterSeverity.length > 0 ? `1px solid ${colors.accent}40` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                <Filter size={16} />
                Severity
                {filterSeverity.length > 0 && (
                  <span style={{
                    backgroundColor: colors.accent,
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.7rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {filterSeverity.length}
                  </span>
                )}
              </button>
              
              <div id="severity-dropdown" style={{
                display: 'none',
                position: 'absolute',
                top: '100%',
                right: '0',
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
            </div>
            
            {/* Refresh Button */}
            <button 
              onClick={refreshAlerts}
              style={{
                backgroundColor: colors.accent,
                color: colors.text,
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
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
            
            {/* Export Button */}
            <button 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
        </header>

        {/* Status Banner */}
        <div style={{
          backgroundColor: colors.cardBgDark,
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${colors.borderColor}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={20} color={colors.accent} />
            <span style={{ fontSize: '0.95rem' }}>
              Showing {filteredAlerts.length} alerts{searchQuery && ` matching "${searchQuery}"`}
              {filterSeverity.length > 0 && ` with severity: ${filterSeverity.join(', ')}`}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>Critical</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.error }}>
                {alertsData.filter(a => a.severity === 'Critical').length}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>High</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.accentLight }}>
                {alertsData.filter(a => a.severity === 'High').length}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>Medium</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.warning }}>
                {alertsData.filter(a => a.severity === 'Medium').length}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>Low</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.info }}>
                {alertsData.filter(a => a.severity === 'Low').length}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div style={{ 
          backgroundColor: colors.cardBg, 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          border: `1px solid ${colors.borderColor}`,
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: colors.cardBgDark }}>
                <tr>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>ID</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Type</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Severity</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Source</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Affected</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Detected</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: colors.text, fontSize: '0.9rem' }}>
                {filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id} 
                    style={{ 
                      borderBottom: `1px solid ${colors.borderColor}`,
                      cursor: 'pointer',
                      backgroundColor: alert.severity === 'Critical' ? 'rgba(255, 58, 0, 0.05)' : 'transparent',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = alert.severity === 'Critical' ? 'rgba(255, 58, 0, 0.05)' : 'transparent';
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>{alert.id}</td>
                    <td style={{ padding: '14px 16px' }}>{alert.type}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge label={alert.severity} color={getSeverityColor(alert.severity)} />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge label={alert.status} color={getStatusColor(alert.status)} />
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{alert.source}</td>
                    <td style={{ padding: '14px 16px' }}>{alert.affected}</td>
                    <td style={{ padding: '14px 16px' }}>{alert.detected}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button 
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: colors.textMuted,
                          cursor: 'pointer',
                          padding: '4px',
                          transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = colors.accent;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = colors.textMuted;
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px 0', textAlign: 'center', color: colors.textMuted }}>
                      No alerts found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
  textAlign: 'center', 
  padding: '20px 0', 
  marginTop: '24px', 
  fontSize: '0.9rem', 
  color: colors.textMuted,
  borderTop: `1px solid ${colors.borderColor}`,
}}>
  <small>
    © 2025 Sentinel Swarm — Enterprise Security Platform DEMO. 
    <span style={{ display: 'block', marginTop: '4px' }}>
      This is a demonstration prototype only. Not a production-ready product.
      Last refreshed: {new Date().toLocaleTimeString()}
    </span>
  </small>
</footer>
      </div>

      {/* CSS for animations */}
      <style
        dangerouslySetInnerHTML={{
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
          `,
        }}
      />
    </div>
  );
};

export default Alerts;