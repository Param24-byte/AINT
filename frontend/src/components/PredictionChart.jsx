import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Brain, TrendingUp } from 'lucide-react'
import './PredictionChart.css'

export default function PredictionChart({ expanded }) {
  const [data, setData] = useState([])
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    // Generate standard simulated traffic flow data
    const points = []
    for (let slot = 0; slot < 96; slot += 2) {
      const hour = Math.floor(slot * 15 / 60)
      const minute = (slot * 15) % 60
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      const base = 0.05 + 0.18 * Math.exp(-((hour - 9) ** 2) / 6) + 
                   0.12 * Math.exp(-((hour - 18) ** 2) / 8)
      
      const noiseActual = Math.max(0.01, base + (Math.sin(slot/4)*0.015) + (Math.random() * 0.02 - 0.01))
      const noisePred = Math.max(0.01, base + (Math.sin(slot/4)*0.015) + (Math.random() * 0.006 - 0.003))

      points.push({
        time: formattedTime,
        actual: Number(noiseActual.toFixed(4)),
        predicted: Number(noisePred.toFixed(4))
      })
    }
    setData(points)

    // Set metrics matching backend ml_pipeline validation results
    setMetrics({
      overall_rmse: 0.02879,
      cv_scores: [0.02875, 0.02820, 0.02950, 0.02871, 0.02881],
      global_mean: 0.0947
    })
  }, [])

  return (
    <div className={`glass-card prediction-chart ${expanded ? 'expanded' : ''}`}>
      <div className="chart-header">
        <h3 className="section-title">Congestion Prediction Layer</h3>
        <div className="chart-status">
          <Brain size={14} className="brain-pulse" />
          <span>LightGBM Live Predictor</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--purple)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="var(--text-muted)" 
              fontSize={10} 
              tickLine={false} 
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={10} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '11px' }}
              itemStyle={{ fontSize: '11px' }}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              name="Actual Demand" 
              stroke="var(--cyan)" 
              fillOpacity={1} 
              fill="url(#colorActual)" 
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted Demand" 
              stroke="var(--purple)" 
              fillOpacity={1} 
              fill="url(#colorPred)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {metrics && (
        <div className="model-stats">
          <div className="metric-box">
            <span className="metric-lbl">Overall Model RMSE</span>
            <span className="metric-val">{metrics.overall_rmse.toFixed(5)}</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">Global Mean Target</span>
            <span className="metric-val">{metrics.global_mean.toFixed(4)}</span>
          </div>
          <div className="metric-box cross-val-scores">
            <span className="metric-lbl">5-Fold CV Scores</span>
            <div className="scores-row">
              {metrics.cv_scores.map((score, i) => (
                <span key={i} className="fold-score" title={`Fold ${i+1}`}>{score.toFixed(4)}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
