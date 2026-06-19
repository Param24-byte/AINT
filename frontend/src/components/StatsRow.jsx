import React from 'react'
import { FileSpreadsheet, Map, AlertOctagon, ShieldAlert, Cpu } from 'lucide-react'
import './StatsRow.css'

export default function StatsRow({ stats }) {
  const cards = [
    {
      label: 'Total Reports',
      value: stats.total_reports,
      sub: 'Citizen submissions',
      icon: FileSpreadsheet,
      color: 'var(--cyan)'
    },
    {
      label: 'Active Hotspots',
      value: stats.active_zones,
      sub: `${stats.critical_zones} Critical · ${stats.high_zones} High`,
      icon: Map,
      color: 'var(--amber)'
    },
    {
      label: 'Avg EAS Score',
      value: `${stats.avg_eas_score}/100`,
      sub: 'Evidence authenticity',
      icon: ShieldAlert,
      color: 'var(--emerald)'
    },
    {
      label: 'Congestion Risk',
      value: `${stats.avg_congestion_prob}%`,
      sub: '30-60m probability',
      icon: AlertOctagon,
      color: 'var(--rose)'
    }
  ]

  return (
    <div className="stats-row fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div key={idx} className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value" style={{ color: card.color }}>{card.value}</span>
              <span className="stat-sub">{card.sub}</span>
            </div>
            <div className="stat-icon-wrapper" style={{ background: `rgba(255,255,255,0.02)`, color: card.color }}>
              <Icon size={24} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
