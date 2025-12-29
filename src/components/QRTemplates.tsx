import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  WifiIcon,
  UserCircleIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Template {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  fields: Field[];
}

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const templates: Template[] = [
  {
    id: 'wifi',
    name: 'WiFi',
    icon: WifiIcon,
    color: 'from-blue-500 to-cyan-500',
    fields: [
      { name: 'ssid', label: 'اسم الشبكة (SSID)', type: 'text', placeholder: 'MyWiFi', required: true },
      { name: 'password', label: 'كلمة المرور', type: 'text', placeholder: '********' },
      { name: 'encryption', label: 'نوع التشفير', type: 'select', options: ['WPA', 'WEP', 'nopass'], required: true },
      { name: 'hidden', label: 'شبكة مخفية؟', type: 'select', options: ['لا', 'نعم'] }
    ]
  },
  {
    id: 'vcard',
    name: 'بطاقة عمل',
    icon: UserCircleIcon,
    color: 'from-purple-500 to-pink-500',
    fields: [
      { name: 'name', label: 'الاسم الكامل', type: 'text', placeholder: 'محمد أحمد', required: true },
      { name: 'organization', label: 'المؤسسة', type: 'text', placeholder: 'شركة XYZ' },
      { name: 'title', label: 'المسمى الوظيفي', type: 'text', placeholder: 'مدير تقني' },
      { name: 'phone', label: 'رقم الجوال', type: 'tel', placeholder: '+966 50 123 4567' },
      { name: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'name@example.com' },
      { name: 'website', label: 'الموقع الإلكتروني', type: 'url', placeholder: 'https://example.com' },
      { name: 'address', label: 'العنوان', type: 'textarea', placeholder: 'الرياض، المملكة العربية السعودية' }
    ]
  },
  {
    id: 'location',
    name: 'موقع جغرافي',
    icon: MapPinIcon,
    color: 'from-green-500 to-emerald-500',
    fields: [
      { name: 'latitude', label: 'خط العرض', type: 'text', placeholder: '24.7136', required: true },
      { name: 'longitude', label: 'خط الطول', type: 'text', placeholder: '46.6753', required: true },
      { name: 'label', label: 'تسمية المكان', type: 'text', placeholder: 'مكتبنا الرئيسي' }
    ]
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: ChatBubbleLeftRightIcon,
    color: 'from-green-400 to-green-600',
    fields: [
      { name: 'phone', label: 'رقم الجوال (بدون +)', type: 'tel', placeholder: '966501234567', required: true },
      { name: 'message', label: 'الرسالة المسبقة', type: 'textarea', placeholder: 'مرحباً! أود الاستفسار عن...' }
    ]
  },
  {
    id: 'email',
    name: 'بريد إلكتروني',
    icon: EnvelopeIcon,
    color: 'from-orange-500 to-red-500',
    fields: [
      { name: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'contact@example.com', required: true },
      { name: 'subject', label: 'الموضوع', type: 'text', placeholder: 'استفسار' },
      { name: 'body', label: 'محتوى الرسالة', type: 'textarea', placeholder: 'مرحباً،\n\nأود الاستفسار عن...' }
    ]
  },
  {
    id: 'product',
    name: 'منتج',
    icon: ShoppingBagIcon,
    color: 'from-amber-500 to-yellow-500',
    fields: [
      { name: 'name', label: 'اسم المنتج', type: 'text', placeholder: 'iPhone 15 Pro', required: true },
      { name: 'price', label: 'السعر', type: 'text', placeholder: '4999 ريال' },
      { name: 'description', label: 'الوصف', type: 'textarea', placeholder: 'وصف المنتج...' },
      { name: 'url', label: 'رابط المنتج', type: 'url', placeholder: 'https://store.com/product' }
    ]
  }
];

interface QRTemplatesProps {
  onGenerate: (text: string) => void;
}

export default function QRTemplates({ onGenerate }: QRTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateQRText = () => {
    if (!selectedTemplate) return;

    let qrText = '';

    switch (selectedTemplate.id) {
      case 'wifi':
        qrText = `WIFI:T:${formData.encryption || 'WPA'};S:${formData.ssid};P:${formData.password || ''};H:${formData.hidden === 'نعم' ? 'true' : 'false'};;`;
        break;

      case 'vcard':
        qrText = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
ORG:${formData.organization || ''}
TITLE:${formData.title || ''}
TEL:${formData.phone || ''}
EMAIL:${formData.email || ''}
URL:${formData.website || ''}
ADR:;;${formData.address || ''};;;;
END:VCARD`;
        break;

      case 'location':
        qrText = `geo:${formData.latitude},${formData.longitude}${formData.label ? `?q=${encodeURIComponent(formData.label)}` : ''}`;
        break;

      case 'whatsapp':
        qrText = `https://wa.me/${formData.phone}${formData.message ? `?text=${encodeURIComponent(formData.message)}` : ''}`;
        break;

      case 'email':
        qrText = `mailto:${formData.email}?subject=${encodeURIComponent(formData.subject || '')}&body=${encodeURIComponent(formData.body || '')}`;
        break;

      case 'product':
        qrText = `المنتج: ${formData.name}
${formData.price ? `السعر: ${formData.price}` : ''}
${formData.description ? `الوصف: ${formData.description}` : ''}
${formData.url ? `الرابط: ${formData.url}` : ''}`;
        break;
    }

    onGenerate(qrText);
    setSelectedTemplate(null);
    setFormData({});
  };

  if (selectedTemplate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedTemplate.color}`}>
              <selectedTemplate.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{selectedTemplate.name}</h3>
          </div>
          <button
            onClick={() => setSelectedTemplate(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {selectedTemplate.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">اختر...</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={generateQRText} className="btn-primary flex-1">
            إنشاء الرمز
          </button>
          <button onClick={() => setSelectedTemplate(null)} className="btn-secondary">
            إلغاء
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">قوالب جاهزة</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {templates.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleTemplateSelect(template)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${template.color}`}>
              <template.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{template.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
