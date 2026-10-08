import React from 'react';
/**
 * @module Navbar
 * @description Navigation bar with live engine status indicator
 * and tab navigation for the main application sections.
 */

import { useCallback } from 'react';
import type { ActiveTab } from '../../core/state/projectReducer';
import { EngineStatus } from '../../core/state/projectReducer';

/**
 * Navigation tab configuration.
 */
const NAV_TABS: ReadonlyArray<{ id: ActiveTab; label: string }> = [
  { id: 'intake', label: 'Scope' },
  { id: 'blueprint', label: 'Topology' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'defense', label: 'Viva Voce' },
  { id: 'assessment', label: 'Review' },
];

/**
 * Props for the Navbar component.
 *
 * @property activeTab - Currently active navigation tab
 * @property onTabChange - Callback when a tab is selected
 * @property engineStatus - Current AI engine connection status
 */
interface NavbarProps {
  readonly activeTab: ActiveTab;
  readonly onTabChange: (tab: ActiveTab) => void;
  readonly engineStatus: EngineStatus;
  readonly isAudioEnabled: boolean;
  readonly onToggleAudio: () => void;
  readonly onLoadDemo: () => void;
  readonly onExportProject: () => void;
  readonly onImportProject: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly readinessScore: number;
}

/**
 * Maps engine status to badge status for MetricsBadge.
 *
 * @param status - Engine status
 * @returns Badge status string
 */
function mapEngineStatusToBadge(status: EngineStatus): 'online' | 'offline' | 'warning' | 'processing' {
  switch (status) {
    case EngineStatus.Online: return 'online';
    case EngineStatus.Connecting: return 'processing';
    case EngineStatus.Fallback: return 'warning';
    case EngineStatus.Error: return 'offline';
    default: return 'offline';
  }
}

/**
 * Navigation bar with live engine status and tab navigation.
 * Shows the Archon OS branding, navigation tabs,
 * and real-time AI engine connection indicator.
 *
 * @param props - Component configuration
 * @returns The rendered navigation bar
 */
export function Navbar({ activeTab, onTabChange, engineStatus: _engineStatus, isAudioEnabled: _isAudioEnabled, onToggleAudio: _onToggleAudio, onLoadDemo, onExportProject, onImportProject, readinessScore }: NavbarProps): React.JSX.Element {
  const handleTabClick = useCallback(
    (tab: ActiveTab) => {
      onTabChange(tab);
    },
    [onTabChange]
  );

  return (
    <nav
      aria-label="Main navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '3.5rem',
        padding: '0 1.5rem',
        background: '#000000',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.6))' }}>
          <path d="M12 2c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.1V22h6v-8.9c1.8-1 3-2.9 3-5.1 0-3.3-2.7-6-6-6z"/>
          <path d="M12 10v4"/>
        </svg>
        <h1 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          margin: 0,
          color: '#ffffff',
          letterSpacing: '0.05em',
          fontFamily: 'monospace',
        }}>
          ⚡ ARCHON OS // Capstone Compiler
        </h1>

      </div>

      {/* Center: Pipeline Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }} role="tablist">
        {/* Animated Laser Underline */}
        <div style={{
          position: 'absolute',
          bottom: '-0.25rem',
          left: 0,
          height: '2px',
          width: '120px',
          background: 'linear-gradient(90deg, transparent, #06b6d4, #818cf8, transparent)',
          boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
          transform: `translateX(${NAV_TABS.findIndex(t => t.id === activeTab) * (120 + 8 + 12 + 8)}px)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          zIndex: 10
        }} />

        {NAV_TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isPassed = NAV_TABS.findIndex(t => t.id === activeTab) > index;
          const isNext = NAV_TABS.findIndex(t => t.id === activeTab) === index - 1;
          
          return (
            <React.Fragment key={tab.id}>
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.5rem',
                  width: '120px',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#ffffff' : isPassed ? '#94a3b8' : '#64748b',
                  background: isActive ? 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent)' : 'transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span className="hide-on-mobile">{isActive ? `${index + 1}. ${tab.label}` : `${index + 1}. ${tab.label}`}</span>
              </button>
              {index < NAV_TABS.length - 1 && (
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={isNext ? "#06b6d4" : "currentColor"} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{
                    opacity: isNext ? 1 : 0.3,
                    filter: isNext ? 'drop-shadow(0 0 6px #06b6d4)' : 'none',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Readiness Ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#f7f8f8', fontSize: '0.75rem', position: 'relative' }}>
          <div style={{ position: 'relative', width: '20px', height: '20px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }} className={readinessScore > 0 && readinessScore % 25 === 0 ? 'readiness-ring-glow' : ''}>
              <defs>
                <linearGradient id="cyanIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle cx="12" cy="12" r="10" fill="none" stroke="url(#cyanIndigo)" strokeWidth="3" strokeDasharray="62.8" strokeDashoffset={62.8 - (62.8 * readinessScore) / 100} style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
            </svg>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              transform: `rotate(${(readinessScore / 100) * 360}deg)`,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: 'none'
            }}>
              <div style={{
                position: 'absolute',
                top: '-1px', left: '50%',
                transform: 'translateX(-50%)',
                width: '4px', height: '4px',
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 0 8px 2px #06b6d4'
              }} />
            </div>
          </div>
          <span style={{ fontFamily: 'monospace' }}>{readinessScore}%</span>
        </div>

        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Ghost Buttons */}
        <label className="btn-action" style={{ color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', padding: '0.25rem', borderRadius: '6px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} title="Import JSON">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <input type="file" accept=".json" onChange={onImportProject} style={{ display: 'none' }} />
        </label>
        <button className="btn-action" onClick={onExportProject} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem', borderRadius: '6px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} title="Export JSON">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        <button className="btn-action" onClick={onLoadDemo} style={{ background: 'transparent', border: 'none', color: '#06b6d4', cursor: 'pointer', padding: '0.25rem', borderRadius: '6px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} title="Load Demo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </button>
        
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Hotkey Tag */}
        <kbd style={{ 
          background: 'rgba(255,255,255,0.06)', 
          border: '1px solid rgba(255,255,255,0.12)', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          fontSize: '10px', 
          fontFamily: 'monospace', 
          color: '#cbd5e1' 
        }}>
          P Preview
        </kbd>
      </div>
    </nav>
  );
}
