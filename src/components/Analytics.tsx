import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  QrCodeIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalVisits: number;
  qrCodesGenerated: number;
  qrCodesScanned: number;
  lastVisit: string;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    qrCodesGenerated: 0,
    qrCodesScanned: 0,
    lastVisit: new Date().toISOString(),
  });

  useEffect(() => {
    // Load analytics from localStorage
    const stored = localStorage.getItem('qr-vision-analytics');
    if (stored) {
      setAnalytics(JSON.parse(stored));
    }

    // Update visit count
    const currentData = stored ? JSON.parse(stored) : analytics;
    const updatedData = {
      ...currentData,
      totalVisits: currentData.totalVisits + 1,
      lastVisit: new Date().toISOString(),
    };
    
    setAnalytics(updatedData);
    localStorage.setItem('qr-vision-analytics', JSON.stringify(updatedData));

    // Update daily stats
    updateDailyStats('visits');

    // Listen for custom events
    const handleQRGenerated = () => {
      setAnalytics(prev => {
        const updated = { ...prev, qrCodesGenerated: prev.qrCodesGenerated + 1 };
        localStorage.setItem('qr-vision-analytics', JSON.stringify(updated));
        updateDailyStats('qrGenerated');
        return updated;
      });
    };

    const handleQRScanned = () => {
      setAnalytics(prev => {
        const updated = { ...prev, qrCodesScanned: prev.qrCodesScanned + 1 };
        localStorage.setItem('qr-vision-analytics', JSON.stringify(updated));
        updateDailyStats('qrScanned');
        return updated;
      });
    };

    window.addEventListener('qr-generated', handleQRGenerated);
    window.addEventListener('qr-scanned', handleQRScanned);

    return () => {
      window.removeEventListener('qr-generated', handleQRGenerated);
      window.removeEventListener('qr-scanned', handleQRScanned);
    };
  }, []);

  const updateDailyStats = (type: 'visits' | 'qrGenerated' | 'qrScanned') => {
    const today = new Date().toISOString().split('T')[0];
    const dailyStats = JSON.parse(localStorage.getItem('qr-vision-daily-stats') || '[]');
    
    const todayIndex = dailyStats.findIndex((stat: any) => stat.date === today);
    
    if (todayIndex >= 0) {
      dailyStats[todayIndex][type] = (dailyStats[todayIndex][type] || 0) + 1;
    } else {
      dailyStats.push({
        date: today,
        visits: type === 'visits' ? 1 : 0,
        qrGenerated: type === 'qrGenerated' ? 1 : 0,
        qrScanned: type === 'qrScanned' ? 1 : 0,
      });
    }
    
    // Keep only last 30 days
    if (dailyStats.length > 30) {
      dailyStats.shift();
    }
    
    localStorage.setItem('qr-vision-daily-stats', JSON.stringify(dailyStats));
  };

  const stats = [
    {
      icon: UserGroupIcon,
      label: 'إجمالي الزيارات',
      value: analytics.totalVisits.toLocaleString('ar-SA'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: QrCodeIcon,
      label: 'رموز QR المولدة',
      value: analytics.qrCodesGenerated.toLocaleString('ar-SA'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ChartBarIcon,
      label: 'رموز QR الممسوحة',
      value: analytics.qrCodesScanned.toLocaleString('ar-SA'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: ClockIcon,
      label: 'آخر زيارة',
      value: new Date(analytics.lastVisit).toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <ChartBarIcon className="w-8 h-8 text-blue-600" />
          الإحصائيات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative overflow-hidden bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`}></div>
              
              <div className="relative">
                <stat.icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800 text-center">
            💡 يتم حفظ البيانات محلياً في متصفحك ولا يتم إرسالها إلى أي خادم خارجي
          </p>
        </div>
      </motion.div>
    </div>
  );
}
