import { LayoutDashboard, ShieldCheck, MapPin, BrainCircuit, Activity } from 'lucide-react'
import './Sidebar.css'

const NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
  { id: 'evidence',  icon: ShieldCheck,     label: 'Evidence' },
  { id: 'zones',     icon: MapPin,          label: 'Zones' },
  { id: 'prediction',icon: BrainCircuit,    label: 'Predict' },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <Activity size={28} strokeWidth={2.5} />
      </div>
      <div className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
          >
            <item.icon size={20} />
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="pulse-dot" />
      </div>
    </nav>
  )
}
