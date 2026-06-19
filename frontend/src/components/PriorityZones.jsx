import React, { useState } from 'react'
import { MapPin, ShieldAlert, Users, Compass } from 'lucide-react'
import './PriorityZones.css'

export default function PriorityZones({ zones, onSelect, expanded }) {
  const [filter, setFilter] = useState('ALL')

  const filteredZones = filter === 'ALL' 
    ? zones 
    : zones.filter(z => z.severity === filter)

  // Sort by score descending
  const sortedZones = [...filteredZones].sort((a,b) => b.score - a.score)

  const getSeverityBadgeClass = (severity) => {
    if (severity === 'CRITICAL') return 'badge-critical'
    if (severity === 'HIGH') return 'badge-high'
    return 'badge-moderate'
  }

  return (
    <div className={`glass-card priority-zones ${expanded ? 'expanded' : ''}`}>
      <div className="zones-header">
        <h3 className="section-title">Enforcement Priority Engine</h3>
        <div className="filter-buttons">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map(level => (
            <button
              key={level}
              className={`filter-btn ${filter === level ? 'active' : ''}`}
              onClick={() => setFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="zones-list">
        {sortedZones.map((zone, idx) => (
          <div key={zone.id} className="zone-item-wrapper">
            <div className="zone-item" onClick={() => onSelect(zone)}>
              <div className="zone-rank">#{idx + 1}</div>
              <div className="zone-details">
                <span className="zone-name">{zone.name}</span>
                <span className="zone-reports">{zone.reports} validated reports</span>
              </div>
              <div className="zone-stats">
                <span className={`badge ${getSeverityBadgeClass(zone.severity)}`}>{zone.severity}</span>
                <span className="zone-score">{zone.score}/100</span>
              </div>
            </div>
            {/* Show AI narrative / details if expanded */}
            {expanded && (
              <div className="zone-expanded-details fade-up">
                <div className="composition-row">
                  <strong>Violation Composition:</strong>
                  <div className="violation-progress">
                    {Object.entries(zone.violations).map(([type, pct], i) => (
                      <div 
                        key={type} 
                        className={`v-bar v-bar-${i}`} 
                        style={{ width: `${pct}%` }} 
                        title={`${type}: ${pct}%`}
                      ></div>
                    ))}
                  </div>
                  <div className="violation-legend">
                    {Object.entries(zone.violations).map(([type, pct], i) => (
                      <span key={type} className="legend-item">
                        <span className={`legend-dot v-bg-${i}`}></span>
                        {type} ({pct}%)
                      </span>
                    ))}
                  </div>
                </div>
                <div className="narrative-box">
                  <div className="narrative-header">
                    <Compass size={14} />
                    <span>AI Deployment Narrative</span>
                  </div>
                  <p>{zone.narrative}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
