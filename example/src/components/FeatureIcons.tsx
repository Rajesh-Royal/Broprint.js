import { motion } from 'framer-motion'
import { Shield, Cpu, Globe, Lock } from 'lucide-react'
import React from 'react'

const features = [
  { icon: Shield, label: 'Secure', color: '#4ade80' },
  { icon: Cpu, label: 'Fast', color: '#60a5fa' },
  { icon: Globe, label: 'Universal', color: '#34d399' },
  { icon: Lock, label: 'Private', color: '#ec4899' }
]

export const FeatureIcons: React.FC = () => (
  <motion.div className="flex justify-center flex-wrap gap-8 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
    {features.map((f, i) => (
      <motion.div key={f.label} className="flex flex-col items-center gap-2" whileHover={{ scale: 1.1 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}>
        <motion.div style={{ padding: 12, borderRadius: '9999px', border: `1px solid ${f.color}`, background: f.color + '20' }} animate={{ boxShadow: ['0 0 20px ' + f.color + '40', '0 0 30px ' + f.color + '60', '0 0 20px ' + f.color + '40'] }} transition={{ duration: 2, repeat: Infinity }}>
          <f.icon className="w-6 h-6" color={f.color} />
        </motion.div>
        <span style={{ fontSize: 12, color: f.color, fontWeight: 600 }}>{f.label}</span>
      </motion.div>
    ))}
  </motion.div>
)
