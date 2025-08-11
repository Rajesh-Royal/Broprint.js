import { motion } from 'framer-motion'
import { Fingerprint } from 'lucide-react'
import { Badge } from './ui/badge'
import { useEffect, useState } from 'react'
import { GithubSvgIcon, XSvgIcon } from './icons'

export const Header = () => {
  const [version] = useState('v2')
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setIsLive(p => !p), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div className="flex justify-between items-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div className="flex items-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
          <Fingerprint className="w-8 h-8" color="#22d3ee" />
        </motion.div>
        <Badge>
          <motion.div className="w-2 h-2 rounded-full mr-2" style={{ background: isLive ? '#4ade80' : 'rgba(74,222,128,0.4)' }} animate={{ scale: isLive ? 1.2 : 1 }} transition={{ duration: 0.3 }} />
          {version} LIVE
        </Badge>
      </div>
      <div className="flex gap-4">
        <motion.a href="https://github.com/Rajesh-Royal/Broprint.js" target="_blank" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ color: '#22d3ee' }}>
        <GithubSvgIcon className="w-6 h-6 fill-[#22d3ee]" />
        </motion.a>
        <motion.a href="https://x.com/Raj_896" target="_blank" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ color: '#22d3ee' }}>
        <XSvgIcon className="w-6 h-6 fill-[#22d3ee]" />
        </motion.a>
      </div>
    </motion.div>
  )
}
