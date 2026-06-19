import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsRow from './components/StatsRow'
import MapPanel from './components/MapPanel'
import EvidencePanel from './components/EvidencePanel'
import PriorityZones from './components/PriorityZones'
import PredictionChart from './components/PredictionChart'
import './App.css'

const API = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000' : '')

// Bengaluru hotspot data (mirrors backend)
const ZONES = [
  {id:1,name:"Silk Board Junction",lat:12.9170,lng:77.6225,severity:"CRITICAL",score:94,reports:23,violations:{"Illegal Parking":61,"Wrong-side":22,"Red-light":17},congestion_prob:78,time_window:"08:30 – 10:00",narrative:"High-density violation cluster centred on the Hosur Road merge. Illegal parking on the left shoulder is compressing two lanes into one, with cascading signal violations emerging at the 200 m mark. Recommend 2 officers + 1 tow vehicle deployed by 09:00."},
  {id:2,name:"Koramangala 5th Block",lat:12.9352,lng:77.6245,severity:"HIGH",score:71,reports:14,violations:{"Triple Riding":57,"Helmet Non-compliance":43},congestion_prob:52,time_window:"08:30 – 10:00",narrative:"Consistent morning-peak triple-riding cluster near school zone. Evidence density peaks 08:30–09:30. Pattern consistent across 6 consecutive weekday mornings. Recommend 1 officer on traffic duty at the junction entry."},
  {id:3,name:"HSR Layout Sector 2",lat:12.9116,lng:77.6474,severity:"MODERATE",score:52,reports:9,violations:{"Stop-line Violation":78,"Illegal Parking":22},congestion_prob:34,time_window:"09:00 – 11:00",narrative:"Stop-line violation cluster forming near the new signal at 27th Cross. Likely caused by unclear road marking post-resurfacing. Recommend advisory + line repaint request rather than enforcement deployment."},
  {id:4,name:"Marathahalli Bridge",lat:12.9591,lng:77.7009,severity:"HIGH",score:68,reports:17,violations:{"Lane Violation":48,"Illegal Parking":32,"Signal Jump":20},congestion_prob:61,time_window:"07:45 – 09:30",narrative:"Persistent lane-change violations at the ORR merge ramp. Commercial vehicles queuing on service road spill into the main carriageway during peak hours."},
  {id:5,name:"Hebbal Flyover",lat:13.0358,lng:77.5970,severity:"MODERATE",score:47,reports:8,violations:{"Speed Violation":55,"Wrong-side":45},congestion_prob:29,time_window:"06:00 – 08:00",narrative:"Early-morning speed violations on the flyover descent. Wrong-side driving reports concentrated on the service road below the flyover entry ramp."},
  {id:6,name:"Electronic City Phase 1",lat:12.8440,lng:77.6604,severity:"HIGH",score:65,reports:12,violations:{"Illegal Parking":50,"Signal Jump":30,"No Helmet":20},congestion_prob:55,time_window:"08:00 – 10:30",narrative:"Tech-park entry congestion. Illegal parking along the approach road is reducing effective lanes."},
  {id:7,name:"Indiranagar 100ft Road",lat:12.9719,lng:77.6412,severity:"MODERATE",score:44,reports:7,violations:{"Illegal Parking":65,"No Entry":35},congestion_prob:25,time_window:"18:00 – 22:00",narrative:"Evening entertainment-district parking congestion. Double-parking compresses the road to single-lane during nightlife hours."},
  {id:8,name:"Whitefield Main Road",lat:12.9698,lng:77.7500,severity:"HIGH",score:72,reports:19,violations:{"Lane Violation":40,"Illegal Parking":35,"Red-light":25},congestion_prob:64,time_window:"08:00 – 10:00",narrative:"IT corridor peak-hour gridlock. Lane violations at the railway underpass create bottleneck propagating 2 km upstream."},
]

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedZone, setSelectedZone] = useState(null)

  const stats = {
    total_reports: ZONES.reduce((s, z) => s + z.reports, 0),
    active_zones: ZONES.length,
    critical_zones: ZONES.filter(z => z.severity === 'CRITICAL').length,
    high_zones: ZONES.filter(z => z.severity === 'HIGH').length,
    avg_eas_score: Math.round(ZONES.reduce((s, z) => s + z.score, 0) / ZONES.length),
    predictions_served: 41778,
    officers_deployed: 12,
    avg_congestion_prob: Math.round(ZONES.reduce((s, z) => s + z.congestion_prob, 0) / ZONES.length),
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Header />
        <StatsRow stats={stats} />

        {activeTab === 'dashboard' && (
          <>
            <div className="grid-2col fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <MapPanel zones={ZONES} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
              <EvidencePanel apiUrl={API} />
            </div>
            <div className="grid-2col fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <PriorityZones zones={ZONES} onSelect={setSelectedZone} />
              <PredictionChart />
            </div>
          </>
        )}

        {activeTab === 'evidence' && (
          <div className="fade-up" style={{ maxWidth: 700 }}>
            <EvidencePanel apiUrl={API} expanded />
          </div>
        )}

        {activeTab === 'zones' && (
          <div className="fade-up">
            <PriorityZones zones={ZONES} onSelect={setSelectedZone} expanded />
          </div>
        )}

        {activeTab === 'prediction' && (
          <div className="fade-up">
            <PredictionChart expanded />
          </div>
        )}
      </div>
    </div>
  )
}
