# Moliyaviy boshqaruv (Finance Tracker)

Daromad va xarajatlarni kuzatish uchun sof HTML, CSS va JavaScript'da yozilgan zamonaviy, responsive veb-ilova.

## Imkoniyatlar

- ✅ Daromad va xarajat qo'shish
- ✅ Balansni real vaqtda avtomatik hisoblash (ijobiy — yashil, manfiy — qizil)
- ✅ Xatolarni tekshirish (bo'sh maydon yoki noto'g'ri son)
- ✅ Ma'lumotlarni `localStorage` orqali saqlash (sahifa yangilansa ham yo'qolmaydi)
- ✅ Tranzaksiyalarni o'chirish
- ✅ **BONUS:** Filtr — Hammasi / Daromad / Xarajat
- ✅ **BONUS:** Chart.js yordamida Pie chart (daromad/xarajat nisbati)
- ✅ Responsive dizayn (Flexbox + Grid), FontAwesome ikonkalar

## Fayl tuzilmasi

```
Finance-tracker/
├── index.html          # HTML5 struktura
├── styles/
│   └── style.css       # Zamonaviy, responsive dizayn
├── app.js              # Barcha mantiq
└── README.md
```

## Ishga tushirish

Alohida server kerak emas — `index.html` faylini brauzerda ochish kifoya.

Yoki oddiy lokal server bilan:

```bash
# Python bilan
python -m http.server 8000
# keyin brauzerda: http://localhost:8000
```

## Kutubxonalar (CDN)

- [Chart.js](https://www.chartjs.org/) — Pie chart uchun
- [FontAwesome](https://fontawesome.com/) — ikonkalar uchun

> Eslatma: CDN'lar internet ulanishini talab qiladi.
