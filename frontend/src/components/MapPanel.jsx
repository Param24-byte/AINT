import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import './MapPanel.css'

// Leaflet marker default configuration fix
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom Map controllers
function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom])
  return null
}

export default function MapPanel({ zones, selectedZone, onSelectZone }) {
  const center = selectedZone ? [selectedZone.lat, selectedZone.lng] : [12.93, 77.62]
  const zoom = selectedZone ? 15 : 12

  // We construct dynamic urgency levels with custom icons or color markers
  const getMarkerIcon = (severity) => {
    let color = '#ef4444' // red
    if (severity === 'CRITICAL') color = '#f43f5e'
    if (severity === 'HIGH') color = '#f59e0b'
    if (severity === 'MODERATE') color = '#10b981'

    const html = `<div class="custom-map-pin" style="background-color: ${color}; border-color: ${color}55;"></div>`
    return L.divIcon({
      className: 'custom-pin-container',
      html: html,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }

  return (
    <div className="glass-card map-panel">
      <div className="map-header">
        <h3 className="section-title">Hotspot Live Operations Map</h3>
        <div className="map-key">
          <span className="key-item"><span className="key-dot" style={{background: 'var(--rose)'}}></span> Critical</span>
          <span className="key-item"><span className="key-dot" style={{background: 'var(--amber)'}}></span> High</span>
          <span className="key-item"><span className="key-dot" style={{background: 'var(--emerald)'}}></span> Moderate</span>
        </div>
      </div>
      <div className="map-container-wrapper">
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={center} zoom={zoom} />
          {/* Default Dark Matter tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {zones.map(zone => (
            <Marker
              key={zone.id}
              position={[zone.lat, zone.lng]}
              icon={getMarkerIcon(zone.severity)}
              eventHandlers={{
                click: () => onSelectZone(zone)
              }}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <h4>{zone.name}</h4>
                  <p className="popup-urgency">Urgency Score: <strong>{zone.score}/100</strong></p>
                  <p className="popup-prob">Congestion Probability: <strong>{zone.congestion_prob}%</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {selectedZone && (
        <div className="selected-zone-bar">
          <div>
            <strong>Selected Zone:</strong> {selectedZone.name} ({selectedZone.severity})
          </div>
          <button className="clear-selection-btn" onClick={() => onSelectZone(null)}>Reset View</button>
        </div>
      )}
    </div>
  )
}
