import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { 
  ArrowDownTrayIcon, 
  DocumentDuplicateIcon,
  CheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import QRTemplates from './QRTemplates';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      
      // Add logo if exists
      if (logo && ctx) {
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSize = size * 0.2;
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          downloadCanvas();
        };
        logoImg.src = logo;
      } else {
        downloadCanvas();
      }
    };

    const downloadCanvas = () => {
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadSVG = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-code.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateGenerate = (templateText: string) => {
    setText(templateText);
    window.dispatchEvent(new Event('qr-generated'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <QRTemplates onGenerate={handleTemplateGenerate} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            أدخل النص أو الرابط
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب هنا النص أو الرابط الذي تريد تحويله إلى QR Code..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all duration-200"
            rows={4}
          />
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <Cog6ToothIcon className="w-5 h-5" />
          <span className="text-sm font-medium">إعدادات متقدمة</span>
        </button>

        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                لون الرمز
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="h-10 w-20 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                لون الخلفية
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-20 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                الحجم: {size}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                مستوى تصحيح الخطأ
              </label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="L">منخفض (7%)</option>
                <option value="M">متوسط (15%)</option>
                <option value="Q">عالي (25%)</option>
                <option value="H">عالي جداً (30%)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                إضافة شعار/لوقو في المنتصف
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {logo && (
                  <button
                    onClick={() => setLogo(null)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    إزالة
                  </button>
                )}
              </div>
              {logo && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={logo} alt="Logo" className="w-12 h-12 object-contain border rounded" />
                  <span className="text-xs text-gray-500">سيتم عرض اللوقو في منتصف الرمز</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div 
              ref={qrRef}
              className="bg-white p-6 rounded-2xl shadow-lg relative"
            >
              <QRCodeSVG
                value={text}
                size={size}
                fgColor={qrColor}
                bgColor={bgColor}
                level={errorLevel}
                includeMargin={true}
              />
              {logo && (
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded"
                  style={{ width: size * 0.2, height: size * 0.2 }}
                >
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={downloadQR}
                className="btn-primary flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                تحميل PNG
              </button>
              
              <button
                onClick={downloadSVG}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                تحميل SVG
              </button>
              
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-5 h-5 text-green-600" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="w-5 h-5" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {!text && (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <p className="text-lg">ابدأ بكتابة نص أو لصق رابط لتوليد رمز QR</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
