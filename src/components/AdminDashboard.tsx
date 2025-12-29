import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClockIcon,
  QrCodeIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface DailyStats {
  date: string;
  qrGenerated: number;
  qrScanned: number;
  visits: number;
}

interface AdminStats {
  totalVisits: number;
  totalQRGenerated: number;
  totalQRScanned: number;
  avgQRPerDay: number;
  peakDay: string;
  dailyStats: DailyStats[];
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'qrvision2025'; // في الإنتاج، استخدم متغيرات البيئة

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = () => {
    const analytics = JSON.parse(localStorage.getItem('qr-vision-analytics') || '{}');
    const dailyData = JSON.parse(localStorage.getItem('qr-vision-daily-stats') || '[]');

    const stats: AdminStats = {
      totalVisits: analytics.totalVisits || 0,
      totalQRGenerated: analytics.qrCodesGenerated || 0,
      totalQRScanned: analytics.qrCodesScanned || 0,
      avgQRPerDay: dailyData.length > 0 
        ? Math.round(analytics.qrCodesGenerated / dailyData.length) 
        : 0,
      peakDay: findPeakDay(dailyData),
      dailyStats: dailyData.slice(-7), // آخر 7 أيام
    };

    setStats(stats);
  };

  const findPeakDay = (data: DailyStats[]): string => {
    if (data.length === 0) return '-';
    const peak = data.reduce((max, curr) => 
      curr.qrGenerated > max.qrGenerated ? curr : max
    );
    return new Date(peak.date).toLocaleDateString('ar-SA', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const exportToCSV = () => {
    if (!stats) return;

    const csvContent = [
      ['التاريخ', 'رموز مولدة', 'رموز ممسوحة', 'زيارات'],
      ...stats.dailyStats.map(day => [
        new Date(day.date).toLocaleDateString('ar-SA'),
        day.qrGenerated,
        day.qrScanned,
        day.visits
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `qr-vision-stats-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearAllData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      localStorage.removeItem('qr-vision-analytics');
      localStorage.removeItem('qr-vision-daily-stats');
      setStats(null);
      alert('تم حذف جميع البيانات بنجاح');
      loadStats();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <LockClosedIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">لوحة تحكم الأدمن</h2>
            <p className="text-gray-600 mt-2">يرجى إدخال كلمة المرور للوصول</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full">
              <LockOpenIcon className="w-5 h-5 inline-block ml-2" />
              تسجيل الدخول
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  const statCards = [
    {
      title: 'إجمالي الزيارات',
      value: stats.totalVisits.toLocaleString('ar-SA'),
      icon: EyeIcon,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      title: 'رموز مولدة',
      value: stats.totalQRGenerated.toLocaleString('ar-SA'),
      icon: QrCodeIcon,
      color: 'from-purple-500 to-pink-500',
      change: '+8%',
    },
    {
      title: 'رموز ممسوحة',
      value: stats.totalQRScanned.toLocaleString('ar-SA'),
      icon: ChartBarIcon,
      color: 'from-green-500 to-emerald-500',
      change: '+15%',
    },
    {
      title: 'متوسط يومي',
      value: stats.avgQRPerDay.toLocaleString('ar-SA'),
      icon: ArrowTrendingUpIcon,
      color: 'from-orange-500 to-red-500',
      change: '+5%',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-purple-600" />
            لوحة تحكم الأدمن
          </h2>
          <p className="text-gray-600 mt-1">إحصائيات شاملة ورؤى متقدمة</p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="btn-secondary"
        >
          تسجيل الخروج
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <card.icon className={`w-8 h-8 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
                <span className="text-green-600 text-sm font-semibold">{card.change}</span>
              </div>
              
              <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
              <p className="text-sm text-gray-500">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-600" />
          نشاط آخر 7 أيام
        </h3>

        {stats.dailyStats.length > 0 ? (
          <div className="space-y-3">
            {stats.dailyStats.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('ar-SA', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(day.qrGenerated / Math.max(...stats.dailyStats.map(d => d.qrGenerated))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-12">{day.qrGenerated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${(day.qrScanned / Math.max(...stats.dailyStats.map(d => d.qrScanned))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-12">{day.qrScanned}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">لا توجد بيانات لعرضها</p>
        )}

        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
            <span>رموز مولدة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded" />
            <span>رموز ممسوحة</span>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            أعلى نشاط
          </h3>
          <p className="text-2xl font-bold text-gray-800">{stats.peakDay}</p>
          <p className="text-sm text-gray-500 mt-1">اليوم الأكثر نشاطاً</p>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            معدل التحويل
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalQRGenerated > 0 
              ? Math.round((stats.totalQRScanned / stats.totalQRGenerated) * 100) 
              : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">نسبة الرموز الممسوحة من المولدة</p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">إجراءات</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={exportToCSV} className="btn-primary flex items-center gap-2">
            <DocumentArrowDownIcon className="w-5 h-5" />
            تصدير البيانات (CSV)
          </button>
          
          <button onClick={clearAllData} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
            حذف جميع البيانات
          </button>
        </div>
      </motion.div>
    </div>
  );
}
