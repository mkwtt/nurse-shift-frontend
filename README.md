# Nurse Shift Management Frontend

Frontend ระบบจัดการเวรพยาบาล สำหรับหัวหน้าพยาบาลและพยาบาลทั่วไป  
สร้างด้วย [Next.js 13+ App Router](https://nextjs.org/docs/app), Redux Toolkit, Tailwind CSS และเชื่อมต่อกับ Backend API

## 📦 Tech Stack

- [Next.js 13+ (App Router)](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [react-select](https://react-select.com/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- Cookie-based Authentication with JWT

---

## ⚙️ การติดตั้ง

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/mkwtt/nurse-shift-frontend.git
cd nurse-shift-frontend
```

### 2. ติดตั้ง dependencies

```bash
npm install
```

### 3. สร้างไฟล์ `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> 🔐 `NEXT_PUBLIC_API_URL` ควรชี้ไปยัง URL ของ Backend API

---

## 🚀 เริ่มต้นใช้งาน

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

---

## 🧩 โครงสร้างโปรเจกต์

```
src/
├── app/               // Next.js App Router pages
│   ├── login/         // หน้าเข้าสู่ระบบ
│   ├── register/      // หน้าสมัครสมาชิก
│   ├── head-nurse/    // หน้าหัวหน้าพยาบาล (จัดเวร / อนุมัติลา)
│   ├── nurse/         // หน้าพยาบาล (ดูเวร / ขอลา)
│   └── layout.tsx     // Provider Redux Store
├── components/        // UI Components
└──  redux/            // Redux store, authSlice
   └── store.ts

```

---

## ✅ ฟีเจอร์

### 👩‍⚕️ พยาบาล:

- เข้าสู่ระบบ / ลงทะเบียน
- ดูตารางเวรของตัวเอง
- ขอลาจากเวรที่ได้รับมอบหมาย (ถ้ายังไม่เคยขอลา)

### 🧑‍💼 หัวหน้าพยาบาล:

- เข้าสู่ระบบ
- สร้างเวรใหม่
- มอบหมายเวรให้พยาบาล
- ดูรายการขอลา → อนุมัติ / ปฏิเสธ
- เห็นชื่อผู้ที่ขอลา และชื่อผู้อนุมัติ
- เวรและสถานะแสดงแยกสี (pending, approved, rejected)

---

## 💡 คำสั่งอื่น ๆ

### สร้าง production build

```bash
npm run build
```

### ตรวจสอบ TypeScript

```bash
npm run typecheck
```

---

## 📝 หมายเหตุ

- ใช้ cookie สำหรับเก็บ JWT Token (แทน localStorage)
- มีการตรวจสอบสิทธิ์ก่อนเข้าแต่ละหน้า (ตาม role)

---