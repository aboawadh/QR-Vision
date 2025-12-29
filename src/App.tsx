import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';
import Analytics from './components/Analytics';
import { 
  QrCodeIcon, 
  CameraIcon, 
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

type TabType = 'generate' | 'scan' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('generate');

  const tabs = [
    { id: 'generate' as TabType, label: 'توليد', icon: QrCodeIcon },
    { id: 'scan' as TabType, label: 'مسح', icon: CameraIcon },
    { id: 'analytics' as TabType, label: 'إحصائيات', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <SparklesIcon className="w-12 h-12 text-purple-600" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            QR Vision
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          منصة متكاملة لتوليد ومسح رموز QR بتقنية عالية
        </p>
      </motion.header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="glass-card p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'generate' && <QRGenerator />}
          {activeTab === 'scan' && <QRScanner />}
          {activeTab === 'analytics' && <Analytics />}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-16 text-gray-500 text-sm"
      >
        <p>
          © {new Date().getFullYear()} QR Vision - جميع الحقوق محفوظة
        </p>
      </motion.footer>
    </div>
  );
}

export default App;

