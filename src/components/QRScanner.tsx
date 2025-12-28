import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { 
  QrCodeIcon,
  DocumentTextIcon,
  LinkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function QRScanner() {
  const [scanResult, setScanResult] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          scanner.clear();
          setIsScanning(false);
        },
        (error) => {
          console.warn(error);
        }
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [isScanning]);

  const isURL = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(scanResult);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        {!isScanning && !scanResult && (
          <div className="text-center">
            <QrCodeIcon className="w-24 h-24 mx-auto mb-6 text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              مسح رمز QR
            </h3>
            <p className="text-gray-600 mb-6">
              استخدم الكاميرا لمسح رموز QR واستخراج المعلومات
            </p>
            <button
              onClick={() => setIsScanning(true)}
              className="btn-primary"
            >
              بدء المسح
            </button>
          </div>
        )}

        {isScanning && (
          <div>
            <div id="qr-reader" className="rounded-xl overflow-hidden"></div>
            <button
              onClick={() => setIsScanning(false)}
              className="btn-secondary w-full mt-4"
            >
              إلغاء المسح
            </button>
          </div>
        )}

        {scanResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800">
                تم المسح بنجاح!
              </h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                {isURL(scanResult) ? (
                  <LinkIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                ) : (
                  <DocumentTextIcon className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1 break-all">
                  <p className="text-sm text-gray-500 mb-1">المحتوى:</p>
                  <p className="text-gray-800 font-mono">{scanResult}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {isURL(scanResult) && (
                <a
                  href={scanResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  فتح الرابط
                </a>
              )}
              
              <button
                onClick={copyToClipboard}
                className="btn-secondary"
              >
                نسخ النص
              </button>
              
              <button
                onClick={() => {
                  setScanResult('');
                  setIsScanning(true);
                }}
                className="btn-secondary"
              >
                مسح آخر
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
