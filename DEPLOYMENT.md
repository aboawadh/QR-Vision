# دليل النشر على GitHub و Vercel

## 📦 رفع المشروع على GitHub

### الطريقة 1: استخدام GitHub CLI (إذا كان مثبتاً)
```bash
cd /Users/asim/QR-Gen/qr-vision
gh repo create qr-vision --public --source=. --remote=origin --push
```

### الطريقة 2: الرفع اليدوي

1. **إنشاء repository جديد على GitHub**:
   - اذهب إلى https://github.com/new
   - اسم المشروع: `qr-vision`
   - الوصف: "منصة متكاملة لتوليد ومسح رموز QR بتقنية عالية 🚀"
   - اختر Public
   - لا تضف README أو .gitignore أو License

2. **ربط المشروع المحلي بـ GitHub**:
```bash
cd /Users/asim/QR-Gen/qr-vision
git remote add origin https://github.com/YOUR_USERNAME/qr-vision.git
git branch -M main
git push -u origin main
```

---

## 🚀 النشر على Vercel

### الطريقة 1: استخدام Vercel CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
cd /Users/asim/QR-Gen/qr-vision
vercel --prod
```

### الطريقة 2: من خلال واجهة Vercel

1. اذهب إلى https://vercel.com/new
2. استورد المشروع من GitHub
3. اختر repository `qr-vision`
4. إعدادات البناء (تلقائية):
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. اضغط Deploy

---

## ⚙️ إعدادات Vercel (اختيارية)

يمكنك إضافة متغيرات البيئة إذا احتجت:
- اذهب إلى Settings → Environment Variables
- أضف المتغيرات المطلوبة

---

## 🔗 الروابط المهمة

بعد النشر ستحصل على:
- **GitHub**: `https://github.com/YOUR_USERNAME/qr-vision`
- **Vercel**: `https://qr-vision.vercel.app` (أو اسم نطاق مخصص)

---

## 📝 ملاحظات

- المشروع جاهز للنشر بدون أي تعديلات إضافية
- جميع التبعيات محددة في `package.json`
- الإعدادات موجودة في `vercel.json`
- Git repository مهيأ ومجهز

---

## 🎯 الخطوات السريعة

إذا كنت تريد البدء سريعاً:

```bash
cd /Users/asim/QR-Gen/qr-vision

# إذا كان لديك GitHub CLI
gh repo create qr-vision --public --source=. --remote=origin --push

# ثم النشر على Vercel
npx vercel --prod
```

انتهى! 🎉
