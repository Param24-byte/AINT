import { Radio } from 'lucide-react'
import './Header.css'

export default function Header() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <header className="header fade-up">
      <div className="header-left">
        <h1 className="header-title">
          <span className="glow-text">ATIN</span>
          <span className="header-sep">•</span>
          <span className="header-subtitle">AI Traffic Intelligence Network</span>
        </h1>
        <p className="header-tagline">City-scale enforcement intelligence · Bengaluru</p>
      </div>
      <div className="header-right">
        <div className="header-live">
          <Radio size={14} className="header-live-icon" />
          <span>LIVE</span>
        </div>
        <div className="header-time">
          <span className="header-clock">{timeStr}</span>
          <span className="header-date">{dateStr}</span>
        </div>
      </div>
    </header>
  )
}
