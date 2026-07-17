/* =========================================================
   Moliyaviy boshqaruv (Finance Tracker)
   - Toast, tahrirlash, Dark/Light, oy filtri, CSV, raqam animatsiyasi
========================================================= */

"use strict";

/* ===== DOM ===== */
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const paymentMethodInput = document.getElementById("paymentMethod");
const dateInput = document.getElementById("date");
const quickAmountsEl = document.getElementById("quickAmounts");
const quickCatsEl = document.getElementById("quickCats");
const addCatForm = document.getElementById("addCatForm");
const newCatInput = document.getElementById("newCatInput");
const confirmCatBtn = document.getElementById("confirmCatBtn");
const cancelCatBtn = document.getElementById("cancelCatBtn");
const errorMsg = document.getElementById("errorMsg");

const balanceEl = document.getElementById("balance");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");

const transactionBody = document.getElementById("transactionBody");
const emptyStateEl = document.getElementById("emptyState");
const tableWrapperEl = document.getElementById("tableWrapper");
const chartEmptyEl = document.getElementById("chartEmpty");

const filtersEl = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");

const modalOverlay = document.getElementById("modalOverlay");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modalTitleIcon = document.getElementById("modalTitleIcon");
const modalTitleText = document.getElementById("modalTitleText");
const saveBtnText = document.getElementById("saveBtnText");

const themeToggle = document.getElementById("themeToggle");
const toastContainer = document.getElementById("toastContainer");
const langDropdown = document.getElementById("langDropdown");
const currencyDropdown = document.getElementById("currencyDropdown");
const exportDropdown = document.getElementById("exportDropdown");
const langTrigger = document.getElementById("langTrigger");
const currencyTrigger = document.getElementById("currencyTrigger");
const langCurrent = document.getElementById("langCurrent");
const currencyCurrent = document.getElementById("currencyCurrent");
const monthDropdown = document.getElementById("monthDropdown");
const monthLabel = document.getElementById("monthLabel");
const monthMenu = document.getElementById("monthMenu");
const trendYearDropdown = document.getElementById("trendYearDropdown");
const trendYearLabel = document.getElementById("trendYearLabel");
const trendYearMenu = document.getElementById("trendYearMenu");
const budgetListEl = document.getElementById("budgetList");
const budgetCatInput = document.getElementById("budgetCatInput");
const budgetCatAddBtn = document.getElementById("budgetCatAddBtn");
const budgetScrollShell = document.getElementById("budgetScrollShell");
const budgetScrollbar = document.getElementById("budgetScrollbar");
const budgetScrollThumb = document.getElementById("budgetScrollThumb");
const lineChartEmptyEl = document.getElementById("lineChartEmpty");

/* ===== Holat ===== */
const STORAGE_KEY = "finance_tracker_transactions";
const CATEGORIES_KEY = "finance_tracker_categories";
const THEME_KEY = "finance_tracker_theme";
const LANG_KEY = "finance_tracker_lang";
const CURRENCY_KEY = "finance_tracker_currency";
const BUDGETS_KEY = "finance_tracker_budgets";

let transactions = [];
let categories = [];
let budgets = {};
let currentFilter = "all";
let currentMonth = "all";
let searchQuery = "";
let pieChart = null;
let lineChart = null;
let editingId = null;
let currentLang = "uz";
let currentCurrency = "UZS";
let trendYear = new Date().getFullYear();

const animatedValues = {
    income: 0,
    expense: 0,
    balance: 0,
};

const UZ_MONTHS = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

/* ===== Til (UZ / RU / EN) ===== */
const I18N = {
    uz: {
        appTitle: "Moliyaviy boshqaruv",
        appSubtitle: "Daromad va xarajatlaringizni kuzating",
        newTx: "Yangi tranzaksiya",
        income: "Kirim",
        expense: "Chiqim",
        balance: "Qolgan pul",
        transactions: "Tranzaksiyalar",
        searchPlaceholder: "Tavsif yoki toifa bo'yicha qidirish...",
        allMonths: "Barcha oylar",
        filterAll: "Hammasi",
        colDesc: "Tavsif",
        colCategory: "Toifa",
        colPayment: "To'lov usuli",
        colAmount: "Summa",
        colDate: "Sana",
        emptyTitle: "Hozircha tranzaksiyalar yo'q",
        emptySub: "Yangisini qo'shing",
        emptySearch: "Hech narsa topilmadi",
        emptySearchSub: "Boshqa so'z yoki oy bilan qidiring",
        chartTitle: "Toifalar bo'yicha xarajat",
        chartEmpty: "Xarajatlar uchun ma'lumot yo'q",
        footerTitle: "Ma'lumotlaringiz xavfsiz saqlanadi",
        footer: "Barcha yozuvlar faqat brauzeringizda (LocalStorage) qoladi — serverga yuborilmaydi.",
        modalNew: "Yangi tranzaksiya",
        modalEdit: "Tranzaksiyani tahrirlash",
        quickCat: "Tezkor toifa tanlash",
        newCatPlaceholder: "Yangi toifa nomi...",
        amountLabel: "Summa (so'm)",
        amountPlaceholder: "Masalan: 500000",
        typeLabel: "Turi",
        cancel: "Bekor qilish",
        save: "Saqlash",
        update: "Yangilash",
        close: "Yopish",
        add: "Qo'shish",
        payCash: "Naqd",
        payCard: "Karta",
        payTransfer: "O'tkazma",
        currencyUZS: "so'm",
        currencyUSD: "$",
        currencyRUB: "₽",
        currencyNameUZS: "So'm",
        currencyNameUSD: "Dollar",
        currencyNameRUB: "Rubl",
        currencyTitle: "Valyuta",
        expensePct: "Xarajat",
        themeTitle: "Dark / Light",
        csvTitle: "CSV eksport",
        themeLight: "Yorug' rejim yoqildi",
        themeDark: "Qorong'u rejim yoqildi",
        currencyChanged: "Valyuta o'zgartirildi",
        themeChanged: "Mavzu o'zgartirildi",
        exportReport: "Hisobot",
        reportTitle: "Hisobot eksport",
        exportExcel: "Excel",
        exportPdf: "PDF",
        exportCsv: "CSV",
        budgetTitle: "Byudjet limitlari",
        budgetHint: "Har bir toifa uchun oylik limit belgilang",
        budgetSave: "Saqlash",
        budgetSpent: "Sarflangan",
        budgetLimit: "Limit",
        budgetNoLimit: "Limit yo'q",
        budgetOver: "Limit oshdi!",
        budgetSaved: "Byudjet saqlandi",
        budgetEmpty: "Avval toifa qo'shing",
        budgetAddCat: "Toifa qo'shish",
        trendTitle: "Oylik trend",
        trendEmpty: "Trend uchun ma'lumot yo'q",
        reportEmpty: "Hisobot uchun ma'lumot yo'q",
        reportExcelDone: "Excel hisobot yuklandi",
        reportPdfDone: "PDF hisobot yuklandi",
        reportLibError: "Kutubxona yuklanmadi (internet kerak)",
        txAdded: "Tranzaksiya qo'shildi",
        txUpdated: "Tranzaksiya yangilandi",
        txDeleted: "Tranzaksiya o'chirildi",
        catAdded: "toifasi qo'shildi",
        catRemoved: "o'chirildi",
        catMin: "Kamida bitta toifa qolishi kerak",
        csvEmpty: "Eksport qilish uchun ma'lumot yo'q",
        csvDone: "CSV fayl yuklandi",
        errDesc: "Iltimos, tavsif maydonini to'ldiring.",
        errAmount: "Iltimos, summani kiriting.",
        errNumber: "Summa faqat son bo'lishi kerak.",
        errPositive: "Summa 0 dan katta bo'lishi kerak.",
        saveError: "Saqlashda xato yuz berdi",
        monthFilter: "Oy filtri",
        phFood: "Masalan: Do'kondan non oldim",
        phRent: "Masalan: Uy ijarasi to'landi",
        phTransport: "Masalan: Metro / taksi haqi",
        phUtility: "Masalan: Elektr energiya to'landi",
        phEdu: "Masalan: Kurs / kitob uchun to'lov",
        phOther: "Masalan: Boshqa xarajat",
        catFood: "Oziq-ovqat",
        catRent: "Ijara",
        catTransport: "Transport",
        catUtility: "Kommunal to'lov",
        catEdu: "Ta'lim",
        catOther: "Boshqa",
        m0: "Yanvar", m1: "Fevral", m2: "Mart", m3: "Aprel",
        m4: "May", m5: "Iyun", m6: "Iyul", m7: "Avgust",
        m8: "Sentabr", m9: "Oktabr", m10: "Noyabr", m11: "Dekabr",
        monthsShort: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
        typeIncome: "Kirim",
        typeExpense: "Chiqim",
    },
    ru: {
        appTitle: "Финансовый учёт",
        appSubtitle: "Следите за доходами и расходами",
        newTx: "Новая транзакция",
        income: "Доход",
        expense: "Расход",
        balance: "Остаток",
        transactions: "Транзакции",
        searchPlaceholder: "Поиск по описанию или категории...",
        allMonths: "Все месяцы",
        filterAll: "Все",
        colDesc: "Описание",
        colCategory: "Категория",
        colPayment: "Способ оплаты",
        colAmount: "Сумма",
        colDate: "Дата",
        emptyTitle: "Пока нет транзакций",
        emptySub: "Добавьте новую",
        emptySearch: "Ничего не найдено",
        emptySearchSub: "Попробуйте другой запрос или месяц",
        chartTitle: "Расходы по категориям",
        chartEmpty: "Нет данных о расходах",
        footerTitle: "Ваши данные в безопасности",
        footer: "Все записи хранятся только в браузере (LocalStorage) — на сервер не отправляются.",
        modalNew: "Новая транзакция",
        modalEdit: "Редактировать транзакцию",
        quickCat: "Быстрый выбор категории",
        newCatPlaceholder: "Название новой категории...",
        amountLabel: "Сумма (сум)",
        amountPlaceholder: "Например: 500000",
        typeLabel: "Тип",
        cancel: "Отмена",
        save: "Сохранить",
        update: "Обновить",
        close: "Закрыть",
        add: "Добавить",
        payCash: "Наличные",
        payCard: "Карта",
        payTransfer: "Перевод",
        currencyUZS: "сум",
        currencyUSD: "$",
        currencyRUB: "₽",
        currencyNameUZS: "Сум",
        currencyNameUSD: "Доллар",
        currencyNameRUB: "Рубль",
        currencyTitle: "Валюта",
        expensePct: "Расход",
        themeTitle: "Тёмная / светлая",
        csvTitle: "Экспорт CSV",
        themeLight: "Включён светлый режим",
        themeDark: "Включён тёмный режим",
        currencyChanged: "Валюта изменена",
        themeChanged: "Тема изменена",
        exportReport: "Отчёт",
        reportTitle: "Экспорт отчёта",
        exportExcel: "Excel",
        exportPdf: "PDF",
        exportCsv: "CSV",
        budgetTitle: "Бюджетные лимиты",
        budgetHint: "Укажите месячный лимит для каждой категории",
        budgetSave: "Сохранить",
        budgetSpent: "Потрачено",
        budgetLimit: "Лимит",
        budgetNoLimit: "Нет лимита",
        budgetOver: "Лимит превышен!",
        budgetSaved: "Бюджет сохранён",
        budgetEmpty: "Сначала добавьте категорию",
        budgetAddCat: "Добавить категорию",
        trendTitle: "Месячный тренд",
        trendEmpty: "Нет данных для тренда",
        reportEmpty: "Нет данных для отчёта",
        reportExcelDone: "Excel отчёт скачан",
        reportPdfDone: "PDF отчёт скачан",
        reportLibError: "Библиотека не загрузилась (нужен интернет)",
        txAdded: "Транзакция добавлена",
        txUpdated: "Транзакция обновлена",
        txDeleted: "Транзакция удалена",
        catAdded: "категория добавлена",
        catRemoved: "удалена",
        catMin: "Должна остаться хотя бы одна категория",
        csvEmpty: "Нет данных для экспорта",
        csvDone: "CSV файл скачан",
        errDesc: "Пожалуйста, заполните описание.",
        errAmount: "Пожалуйста, введите сумму.",
        errNumber: "Сумма должна быть числом.",
        errPositive: "Сумма должна быть больше 0.",
        saveError: "Ошибка при сохранении",
        monthFilter: "Фильтр месяца",
        phFood: "Например: Купил хлеб",
        phRent: "Например: Оплата аренды",
        phTransport: "Например: Такси / метро",
        phUtility: "Например: Оплата электричества",
        phEdu: "Например: Оплата курса",
        phOther: "Например: Прочий расход",
        catFood: "Еда",
        catRent: "Аренда",
        catTransport: "Транспорт",
        catUtility: "Коммунальные",
        catEdu: "Образование",
        catOther: "Другое",
        m0: "Январь", m1: "Февраль", m2: "Март", m3: "Апрель",
        m4: "Май", m5: "Июнь", m6: "Июль", m7: "Август",
        m8: "Сентябрь", m9: "Октябрь", m10: "Ноябрь", m11: "Декабрь",
        monthsShort: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
        typeIncome: "Доход",
        typeExpense: "Расход",
    },
    en: {
        appTitle: "Finance Tracker",
        appSubtitle: "Track your income and expenses",
        newTx: "New transaction",
        income: "Income",
        expense: "Expense",
        balance: "Balance",
        transactions: "Transactions",
        searchPlaceholder: "Search by description or category...",
        allMonths: "All months",
        filterAll: "All",
        colDesc: "Description",
        colCategory: "Category",
        colPayment: "Payment",
        colAmount: "Amount",
        colDate: "Date",
        emptyTitle: "No transactions yet",
        emptySub: "Add a new one",
        emptySearch: "Nothing found",
        emptySearchSub: "Try another keyword or month",
        chartTitle: "Expenses by category",
        chartEmpty: "No expense data yet",
        footerTitle: "Your data stays private",
        footer: "All records stay only in your browser (LocalStorage) — nothing is sent to a server.",
        modalNew: "New transaction",
        modalEdit: "Edit transaction",
        quickCat: "Quick category",
        newCatPlaceholder: "New category name...",
        amountLabel: "Amount (UZS)",
        amountPlaceholder: "e.g. 500000",
        typeLabel: "Type",
        cancel: "Cancel",
        save: "Save",
        update: "Update",
        close: "Close",
        add: "Add",
        payCash: "Cash",
        payCard: "Card",
        payTransfer: "Transfer",
        currencyUZS: "UZS",
        currencyUSD: "$",
        currencyRUB: "₽",
        currencyNameUZS: "Som",
        currencyNameUSD: "Dollar",
        currencyNameRUB: "Ruble",
        currencyTitle: "Currency",
        expensePct: "Expense",
        themeTitle: "Dark / Light",
        csvTitle: "Export CSV",
        themeLight: "Light mode enabled",
        themeDark: "Dark mode enabled",
        currencyChanged: "Currency changed",
        themeChanged: "Theme changed",
        exportReport: "Report",
        reportTitle: "Export report",
        exportExcel: "Excel",
        exportPdf: "PDF",
        exportCsv: "CSV",
        budgetTitle: "Budget limits",
        budgetHint: "Set a monthly limit for each category",
        budgetSave: "Save",
        budgetSpent: "Spent",
        budgetLimit: "Limit",
        budgetNoLimit: "No limit",
        budgetOver: "Over budget!",
        budgetSaved: "Budget saved",
        budgetEmpty: "Add a category first",
        budgetAddCat: "Add category",
        trendTitle: "Monthly trend",
        trendEmpty: "No trend data yet",
        reportEmpty: "No data for report",
        reportExcelDone: "Excel report downloaded",
        reportPdfDone: "PDF report downloaded",
        reportLibError: "Library failed to load (internet required)",
        txAdded: "Transaction added",
        txUpdated: "Transaction updated",
        txDeleted: "Transaction deleted",
        catAdded: "category added",
        catRemoved: "removed",
        catMin: "At least one category is required",
        csvEmpty: "No data to export",
        csvDone: "CSV file downloaded",
        errDesc: "Please fill in the description.",
        errAmount: "Please enter the amount.",
        errNumber: "Amount must be a number.",
        errPositive: "Amount must be greater than 0.",
        saveError: "Failed to save",
        monthFilter: "Month filter",
        phFood: "e.g. Bought bread",
        phRent: "e.g. Paid rent",
        phTransport: "e.g. Taxi / metro",
        phUtility: "e.g. Paid electricity",
        phEdu: "e.g. Course payment",
        phOther: "e.g. Other expense",
        catFood: "Food",
        catRent: "Rent",
        catTransport: "Transport",
        catUtility: "Utilities",
        catEdu: "Education",
        catOther: "Other",
        m0: "January", m1: "February", m2: "March", m3: "April",
        m4: "May", m5: "June", m6: "July", m7: "August",
        m8: "September", m9: "October", m10: "November", m11: "December",
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        typeIncome: "Income",
        typeExpense: "Expense",
    },
};

const CAT_I18N_KEY = {
    "Oziq-ovqat": "catFood",
    "Ijara": "catRent",
    "Transport": "catTransport",
    "Kommunal to'lov": "catUtility",
    "Ta'lim": "catEdu",
    "Boshqa": "catOther",
};

const CAT_PLACEHOLDER_KEY = {
    "Oziq-ovqat": "phFood",
    "Ijara": "phRent",
    "Transport": "phTransport",
    "Kommunal to'lov": "phUtility",
    "Ta'lim": "phEdu",
    "Boshqa": "phOther",
};

function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.uz[key] || key;
}

function currencySuffix() {
    if (currentCurrency === "USD") return ` ${t("currencyUSD")}`;
    if (currentCurrency === "RUB") return ` ${t("currencyRUB")}`;
    return ` ${t("currencyUZS")}`;
}

function currencyLabel() {
    if (currentCurrency === "USD") return t("currencyNameUSD");
    if (currentCurrency === "RUB") return t("currencyNameRUB");
    return t("currencyNameUZS");
}

function updateAmountLabel() {
    const label = document.querySelector('label[for="amount"]');
    if (label) label.textContent = `${t("colAmount")} (${currencyLabel()})`;
}

function currencyDisplay(code) {
    if (code === "USD") {
        return `<i class="fa-solid fa-dollar-sign" style="color:#22c55e"></i><strong>${t("currencyNameUSD")}</strong>`;
    }
    if (code === "RUB") {
        return `<span class="dd-ico rub">₽</span><strong>${t("currencyNameRUB")}</strong>`;
    }
    return `<i class="fa-solid fa-coins" style="color:#f59e0b"></i><strong>${t("currencyNameUZS")}</strong>`;
}

function syncMonthDropdownUI() {
    if (!monthDropdown || !monthLabel || !monthMenu) return;

    monthMenu.querySelectorAll(".dd-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.value === String(currentMonth));
    });

    if (currentMonth === "all") {
        monthLabel.setAttribute("data-i18n", "allMonths");
        monthLabel.textContent = t("allMonths");
    } else {
        monthLabel.removeAttribute("data-i18n");
        monthLabel.textContent = t(`m${currentMonth}`);
    }
}

function syncDropdownUI() {
    // Til
    langCurrent.innerHTML = `<i class="fa-solid fa-globe"></i><strong>${currentLang.toUpperCase()}</strong>`;
    langDropdown.querySelectorAll(".dd-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.value === currentLang);
    });

    // Valyuta
    currencyCurrent.innerHTML = currencyDisplay(currentCurrency);
    currencyDropdown.querySelectorAll(".dd-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.value === currentCurrency);
        const nameEl = item.querySelector("strong");
        if (!nameEl) return;
        if (item.dataset.value === "UZS") nameEl.textContent = t("currencyNameUZS");
        if (item.dataset.value === "USD") nameEl.textContent = t("currencyNameUSD");
        if (item.dataset.value === "RUB") nameEl.textContent = t("currencyNameRUB");
    });

    currencyTrigger.title = t("currencyTitle");
    updateAmountLabel();
    syncMonthDropdownUI();
}

function closeAllDropdowns() {
    [langDropdown, currencyDropdown, exportDropdown, monthDropdown, trendYearDropdown].forEach((dd) => {
        if (!dd) return;
        dd.classList.remove("open");
        const menu = dd.querySelector(".dd-menu");
        const trigger = dd.querySelector(".dd-trigger");
        if (menu) menu.hidden = true;
        if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
}

function toggleDropdown(dd) {
    const isOpen = dd.classList.contains("open");
    closeAllDropdowns();
    if (!isOpen) {
        dd.classList.add("open");
        dd.querySelector(".dd-menu").hidden = false;
        dd.querySelector(".dd-trigger").setAttribute("aria-expanded", "true");
    }
}

function setupDropdown(dd, onPick) {
    if (!dd) return;
    const trigger = dd.querySelector(".dd-trigger");
    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown(dd);
    });
    dd.addEventListener("click", (e) => {
        const item = e.target.closest(".dd-item");
        if (!item || !dd.contains(item)) return;
        e.stopPropagation();
        onPick(item.dataset.value);
        closeAllDropdowns();
    });
}

function translateCategory(name) {
    const key = CAT_I18N_KEY[name];
    return key ? t(key) : name;
}

function translatePayment(method) {
    if (method === "Naqd") return t("payCash");
    if (method === "Karta") return t("payCard");
    if (method === "O'tkazma") return t("payTransfer");
    return method || "—";
}

function applyLanguage() {
    document.documentElement.lang = currentLang === "uz" ? "uz" : currentLang;
    document.title = `${t("appTitle")} | Finance Tracker`;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key) el.placeholder = t(key);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        const key = el.getAttribute("data-i18n-title");
        if (key) el.title = t(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
        const key = el.getAttribute("data-i18n-aria");
        if (key) el.setAttribute("aria-label", t(key));
    });

    setModalMode(!!editingId);
    updateDescriptionPlaceholder();
    syncDropdownUI();
    if (categories.length) renderCategories();
    render();
}

function initLanguage() {
    const saved = localStorage.getItem(LANG_KEY);
    currentLang = saved === "ru" || saved === "en" ? saved : "uz";
}

function initCurrency() {
    const saved = localStorage.getItem(CURRENCY_KEY);
    currentCurrency = saved === "USD" || saved === "RUB" ? saved : "UZS";
}

setupDropdown(langDropdown, (value) => {
    currentLang = value;
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
});

setupDropdown(currencyDropdown, (value) => {
    currentCurrency = value;
    localStorage.setItem(CURRENCY_KEY, currentCurrency);
    syncDropdownUI();
    render();
    showToast(`${t("currencyChanged")}: ${t(
        value === "USD" ? "currencyNameUSD" : value === "RUB" ? "currencyNameRUB" : "currencyNameUZS"
    )}`, "info");
});

setupDropdown(monthDropdown, (value) => {
    currentMonth = value;
    syncMonthDropdownUI();
    render();
});

setupDropdown(trendYearDropdown, (value) => {
    trendYear = Number(value);
    if (trendYearLabel) trendYearLabel.textContent = String(trendYear);
    trendYearMenu?.querySelectorAll(".dd-item").forEach((item) => {
        item.classList.toggle("active", Number(item.dataset.value) === trendYear);
    });
    renderLineChart();
    renderBudgets();
});

document.addEventListener("click", closeAllDropdowns);

const DEFAULT_CATEGORIES = [
    "Oziq-ovqat", "Ijara", "Transport", "Kommunal to'lov", "Ta'lim", "Boshqa",
];

const CATEGORY_CONFIG = {
    "Oziq-ovqat": { icon: "fa-utensils", color: "#10b981" },
    "Ijara": { icon: "fa-house", color: "#6366f1" },
    "Transport": { icon: "fa-car", color: "#f59e0b" },
    "Kommunal to'lov": { icon: "fa-bolt", color: "#06b6d4" },
    "Ta'lim": { icon: "fa-graduation-cap", color: "#a855f7" },
    "Boshqa": { icon: "fa-tag", color: "#94a3b8" },
};

const COLOR_PALETTE = [
    "#ec4899", "#84cc16", "#ef4444", "#14b8a6", "#f97316",
    "#8b5cf6", "#eab308", "#22d3ee", "#fb7185", "#4ade80",
];

const PAYMENT_ICONS = {
    "Naqd": "fa-money-bill-wave",
    "Karta": "fa-credit-card",
    "O'tkazma": "fa-arrow-right-arrow-left",
};

function colorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

function getCategoryConfig(category) {
    if (CATEGORY_CONFIG[category]) return CATEGORY_CONFIG[category];
    return { icon: "fa-tag", color: colorFromString(category || "Boshqa") };
}

function getPaymentIcon(method) {
    return PAYMENT_ICONS[method] || "fa-wallet";
}

function updateDescriptionPlaceholder() {
    const category = categoryInput.value || "Boshqa";
    const key = CAT_PLACEHOLDER_KEY[category];
    descriptionInput.placeholder = key
        ? t(key)
        : `${t("colDesc")}: ${category}`;
}

/* ===== LocalStorage ===== */
function loadTransactions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveTransactions() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
        showToast(t("saveError"), "error");
    }
}

function loadCategories() {
    try {
        const data = localStorage.getItem(CATEGORIES_KEY);
        const parsed = data ? JSON.parse(data) : null;
        if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) { /* ignore */ }
    return [...DEFAULT_CATEGORIES];
}

function saveCategories() {
    try {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) { /* ignore */ }
}

function loadBudgets() {
    try {
        const data = localStorage.getItem(BUDGETS_KEY);
        const parsed = data ? JSON.parse(data) : null;
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
        return {};
    }
}

function saveBudgets() {
    try {
        localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    } catch (e) { /* ignore */ }
}

/* ===== Formatlash ===== */
function formatMoney(value) {
    const rounded = Math.round(value * 100) / 100;
    const [intPart, decPart] = Math.abs(rounded).toString().split(".");
    const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const sign = rounded < 0 ? "-" : "";
    return decPart ? `${sign}${withSpaces}.${decPart}` : `${sign}${withSpaces}`;
}

function formatDate(timestamp) {
    const d = new Date(timestamp);
    const months = t("monthsShort");
    return `${d.getDate()}-${months[d.getMonth()]}, ${d.getFullYear()}`;
}

function todayISO() {
    const d = new Date();
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function toISODate(timestamp) {
    const d = new Date(timestamp);
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function escapeCsv(str) {
    const s = String(str ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

/* ===== Toast ===== */
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon =
        type === "error" ? "fa-circle-exclamation" :
        type === "info" ? "fa-circle-info" : "fa-circle-check";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hiding");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, 2800);
}

/* ===== Dark / Light ===== */
function applyTheme(theme) {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("light", isLight);
    themeToggle.innerHTML = isLight
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
    themeToggle.title = t("themeTitle");
    themeToggle.setAttribute("aria-label", t("themeTitle"));
    localStorage.setItem(THEME_KEY, theme);
    if (pieChart) {
        pieChart.options.plugins.legend.labels.color = isLight ? "#0f172a" : "#e6edf3";
        pieChart.data.datasets[0].borderColor = isLight ? "#ffffff" : "#10151c";
        pieChart.update();
    }
    if (lineChart) {
        const textColor = isLight ? "#0f172a" : "#e6edf3";
        const gridColor = isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)";
        lineChart.options.plugins.legend.labels.color = textColor;
        lineChart.options.scales.x.ticks.color = textColor;
        lineChart.options.scales.y.ticks.color = textColor;
        lineChart.options.scales.x.grid.color = gridColor;
        lineChart.options.scales.y.grid.color = gridColor;
        lineChart.update();
    }
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved === "light" ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("light") ? "dark" : "light";
    applyTheme(next);
    showToast(next === "light" ? t("themeLight") : t("themeDark"), "info");
});

/* ===== Raqam animatsiyasi ===== */
function animateNumber(el, from, to, duration, suffix) {
    if (suffix === undefined) suffix = currencySuffix();
    const start = performance.now();
    const diff = to - from;

    function frame(now) {
        const tProgress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - tProgress, 3);
        const value = from + diff * eased;
        el.textContent = `${formatMoney(value)}${suffix}`;
        if (tProgress < 1) requestAnimationFrame(frame);
        else el.textContent = `${formatMoney(to)}${suffix}`;
    }

    requestAnimationFrame(frame);
}

/* ===== Modal ===== */
function setModalMode(isEdit) {
    if (isEdit) {
        modalTitleIcon.className = "fa-solid fa-pen";
        modalTitleText.textContent = t("modalEdit");
        saveBtnText.textContent = t("update");
    } else {
        modalTitleIcon.className = "fa-solid fa-plus";
        modalTitleText.textContent = t("modalNew");
        saveBtnText.textContent = t("save");
    }
}

function openModal() {
    editingId = null;
    setModalMode(false);
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    dateInput.value = todayISO();
    updateQuickCatActive();
    setTimeout(() => descriptionInput.focus(), 50);
}

function openEditModal(tx) {
    editingId = tx.id;
    setModalMode(true);
    descriptionInput.value = tx.description;
    amountInput.value = tx.amount;
    categoryInput.value = tx.category || categories[0];
    paymentMethodInput.value = tx.paymentMethod || "Naqd";
    dateInput.value = toISODate(tx.date);
    form.querySelector(`input[name="type"][value="${tx.type}"]`).checked = true;

    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    updateQuickCatActive();
    setTimeout(() => descriptionInput.focus(), 50);
}

function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    form.reset();
    editingId = null;
    setModalMode(false);
    closeAddCatForm();
    clearError();
}

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAllDropdowns();
    if (modalOverlay.classList.contains("open")) closeModal();
});

function showError(message) {
    errorMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    errorMsg.classList.add("show");
}

function clearError() {
    errorMsg.textContent = "";
    errorMsg.classList.remove("show");
}

/* ===== Qo'shish / tahrirlash ===== */
function saveTransaction(event) {
    event.preventDefault();
    clearError();

    const description = descriptionInput.value.trim();
    const rawAmount = amountInput.value.trim();
    const category = categoryInput.value;
    const paymentMethod = paymentMethodInput.value;
    const type = form.querySelector('input[name="type"]:checked').value;

    if (description === "") {
        showError(t("errDesc"));
        descriptionInput.focus();
        return;
    }
    if (rawAmount === "") {
        showError(t("errAmount"));
        amountInput.focus();
        return;
    }

    const amount = Number(rawAmount);
    if (Number.isNaN(amount)) {
        showError(t("errNumber"));
        amountInput.focus();
        return;
    }
    if (amount <= 0) {
        showError(t("errPositive"));
        amountInput.focus();
        return;
    }

    const date = dateInput.value
        ? new Date(`${dateInput.value}T00:00:00`).getTime()
        : Date.now();

    if (editingId) {
        const idx = transactions.findIndex((t) => t.id === editingId);
        if (idx !== -1) {
            transactions[idx] = {
                ...transactions[idx],
                description,
                amount,
                category,
                paymentMethod,
                type,
                date,
            };
            saveTransactions();
            render();
            closeModal();
            showToast(t("txUpdated"), "success");
            return;
        }
    }

    transactions.push({
        id: Date.now(),
        description,
        amount,
        category,
        paymentMethod,
        type,
        date,
    });

    saveTransactions();
    render();
    closeModal();
    showToast(t("txAdded"), "success");
}

quickAmountsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-btn");
    if (!btn) return;
    const add = Number(btn.dataset.amount);
    const current = Number(amountInput.value) || 0;
    amountInput.value = current + add;
    clearError();
    amountInput.focus();
});

/* ===== Toifalar ===== */
function renderCategories() {
    const selected = categoryInput.value;

    categoryInput.innerHTML = categories
        .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(translateCategory(c))}</option>`)
        .join("");
    if (categories.includes(selected)) categoryInput.value = selected;

    quickCatsEl.innerHTML = "";
    categories.forEach((c) => {
        const cfg = getCategoryConfig(c);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quick-cat";
        btn.dataset.category = c;
        btn.innerHTML = `
            <i class="fa-solid ${cfg.icon}" style="color:${cfg.color}"></i>
            ${escapeHtml(translateCategory(c))}
            <span class="cat-remove" title="${escapeHtml(t("catRemoved"))}"><i class="fa-solid fa-xmark"></i></span>
        `;
        quickCatsEl.appendChild(btn);
    });

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "quick-cat quick-cat-add";
    addBtn.setAttribute("aria-label", t("add"));
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    quickCatsEl.appendChild(addBtn);

    updateQuickCatActive();
}

function updateQuickCatActive() {
    quickCatsEl.querySelectorAll(".quick-cat").forEach((btn) => {
        if (btn.classList.contains("quick-cat-add")) return;
        btn.classList.toggle("active", btn.dataset.category === categoryInput.value);
    });
    updateDescriptionPlaceholder();
}

quickCatsEl.addEventListener("click", (e) => {
    if (e.target.closest(".quick-cat-add")) {
        openAddCatForm();
        return;
    }
    const removeEl = e.target.closest(".cat-remove");
    if (removeEl) {
        e.stopPropagation();
        const btn = removeEl.closest(".quick-cat");
        removeCategory(btn.dataset.category);
        return;
    }
    const btn = e.target.closest(".quick-cat");
    if (!btn) return;
    categoryInput.value = btn.dataset.category;
    updateQuickCatActive();
});

categoryInput.addEventListener("change", updateQuickCatActive);

function openAddCatForm() {
    addCatForm.hidden = false;
    newCatInput.value = "";
    newCatInput.classList.remove("error");
    newCatInput.focus();
}

function closeAddCatForm() {
    addCatForm.hidden = true;
    newCatInput.value = "";
    newCatInput.classList.remove("error");
}

function createCategory(name) {
    const trimmed = (name || "").trim();
    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (trimmed === "" || exists) return false;

    categories.push(trimmed);
    saveCategories();
    if (categoryInput) categoryInput.value = trimmed;
    renderCategories();
    renderBudgets();
    showToast(`"${trimmed}" ${t("catAdded")}`, "success");
    return true;
}

function addCategory() {
    const name = newCatInput.value.trim();
    if (!createCategory(name)) {
        newCatInput.classList.add("error");
        newCatInput.focus();
        return;
    }
    closeAddCatForm();
}

function addBudgetCategory() {
    if (!budgetCatInput) return;
    const name = budgetCatInput.value.trim();
    if (!createCategory(name)) {
        budgetCatInput.classList.add("error");
        budgetCatInput.focus();
        return;
    }
    budgetCatInput.value = "";
    budgetCatInput.classList.remove("error");
    budgetCatInput.focus();
}

function removeCategory(name) {
    if (categories.length <= 1) {
        showToast(t("catMin"), "error");
        return;
    }
    categories = categories.filter((c) => c !== name);
    if (budgets[name] != null) {
        delete budgets[name];
        saveBudgets();
    }
    saveCategories();
    if (categoryInput.value === name) categoryInput.value = categories[0];
    renderCategories();
    renderBudgets();
    showToast(`"${name}" ${t("catRemoved")}`, "info");
}

confirmCatBtn.addEventListener("click", addCategory);
cancelCatBtn.addEventListener("click", closeAddCatForm);
newCatInput.addEventListener("input", () => newCatInput.classList.remove("error"));
newCatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addCategory();
    } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeAddCatForm();
    }
});

if (budgetCatAddBtn) {
    budgetCatAddBtn.addEventListener("click", addBudgetCategory);
}
if (budgetCatInput) {
    budgetCatInput.addEventListener("input", () => budgetCatInput.classList.remove("error"));
    budgetCatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addBudgetCategory();
        }
    });
}

/* ===== O'chirish ===== */
function deleteTransaction(id, rowEl) {
    const remove = () => {
        transactions = transactions.filter((t) => t.id !== id);
        saveTransactions();
        render();
        showToast(t("txDeleted"), "info");
    };

    if (rowEl) {
        rowEl.classList.add("removing");
        rowEl.addEventListener("animationend", remove, { once: true });
    } else {
        remove();
    }
}

/* ===== Filtrlash ===== */
function getMonthFiltered() {
    if (currentMonth === "all") return transactions;
    const month = Number(currentMonth);
    return transactions.filter((t) => new Date(t.date).getMonth() === month);
}

function getVisibleTransactions() {
    return getMonthFiltered().filter((t) => {
        const matchesFilter = currentFilter === "all" || t.type === currentFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            q === "" ||
            t.description.toLowerCase().includes(q) ||
            (t.category || "").toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });
}

/* ===== Hisoblash / balans ===== */
function calculateTotals(list = getMonthFiltered()) {
    let income = 0;
    let expense = 0;
    list.forEach((t) => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
}

function renderBalance() {
    const { income, expense, balance } = calculateTotals();

    animateNumber(totalIncomeEl, animatedValues.income, income, 600);
    animateNumber(totalExpenseEl, animatedValues.expense, expense, 600);
    animateNumber(balanceEl, animatedValues.balance, balance, 700);

    animatedValues.income = income;
    animatedValues.expense = expense;
    animatedValues.balance = balance;

    balanceEl.classList.remove("positive", "negative");
    if (balance > 0) balanceEl.classList.add("positive");
    else if (balance < 0) balanceEl.classList.add("negative");

    updateProgress(income, expense);
}

function updateProgress(income, expense) {
    let percent = 0;
    if (income > 0) percent = Math.min((expense / income) * 100, 100);
    else if (expense > 0) percent = 100;

    progressBar.style.width = `${percent}%`;
    progressBar.classList.toggle("danger", percent > 80);
    progressLabel.textContent = `${t("expensePct")}: ${Math.round(percent)}%`;
}

/* ===== Jadval ===== */
function renderTable() {
    const visible = getVisibleTransactions();
    const monthList = getMonthFiltered();
    transactionBody.innerHTML = "";

    if (visible.length === 0) {
        tableWrapperEl?.classList.add("is-empty");
        emptyStateEl.style.display = "block";
        emptyStateEl.innerHTML =
            monthList.length === 0
                ? `<i class="fa-solid fa-inbox"></i><p class="empty-title">${t("emptyTitle")}</p><p class="empty-sub">${t("emptySub")}</p>`
                : `<i class="fa-solid fa-magnifying-glass"></i><p class="empty-title">${t("emptySearch")}</p><p class="empty-sub">${t("emptySearchSub")}</p>`;
        return;
    }

    tableWrapperEl?.classList.remove("is-empty");
    emptyStateEl.style.display = "none";

    [...visible]
        .sort((a, b) => b.date - a.date)
        .forEach((tx) => {
            const sign = tx.type === "income" ? "+" : "-";
            const category = tx.category || "Boshqa";
            const cfg = getCategoryConfig(category);
            const paymentMethod = tx.paymentMethod || "—";
            const payIcon = getPaymentIcon(paymentMethod);

            const tr = document.createElement("tr");
            tr.className = tx.type === "income" ? "row-income" : "row-expense";
            tr.innerHTML = `
                <td><div class="td-desc">${escapeHtml(tx.description)}</div></td>
                <td>
                    <span class="cat-badge"
                          style="color:${cfg.color};background:${cfg.color}22;border-color:${cfg.color}55">
                        <i class="fa-solid ${cfg.icon}"></i> ${escapeHtml(translateCategory(category))}
                    </span>
                </td>
                <td>
                    <span class="pay-badge">
                        <i class="fa-solid ${payIcon}"></i> ${escapeHtml(translatePayment(paymentMethod))}
                    </span>
                </td>
                <td class="td-amount">${sign}${formatMoney(tx.amount)}${currencySuffix()}</td>
                <td class="td-date">${formatDate(tx.date)}</td>
                <td class="col-action">
                    <button class="edit-btn" data-id="${tx.id}" aria-label="${escapeHtml(t("update"))}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="delete-btn" data-id="${tx.id}" aria-label="${escapeHtml(t("catRemoved"))}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            transactionBody.appendChild(tr);
        });
}

/* ===== Chart ===== */
function renderChart() {
    const canvas = document.getElementById("pieChart");
    const list = getMonthFiltered();
    const byCategory = {};

    list.forEach((t) => {
        if (t.type !== "expense") return;
        const cat = t.category || "Boshqa";
        byCategory[cat] = (byCategory[cat] || 0) + t.amount;
    });

    const labels = Object.keys(byCategory);
    const displayLabels = labels.map(translateCategory);

    if (labels.length === 0) {
        canvas.style.display = "none";
        chartEmptyEl.style.display = "block";
        chartEmptyEl.textContent = t("chartEmpty");
        if (pieChart) {
            pieChart.destroy();
            pieChart = null;
        }
        return;
    }

    if (typeof Chart === "undefined") {
        canvas.style.display = "none";
        chartEmptyEl.style.display = "block";
        chartEmptyEl.textContent = t("chartEmpty");
        return;
    }

    canvas.style.display = "block";
    chartEmptyEl.style.display = "none";

    const isLight = document.documentElement.classList.contains("light");
    const values = labels.map((c) => byCategory[c]);
    const colors = labels.map((c) => getCategoryConfig(c).color);
    const borderColor = isLight ? "#ffffff" : "#10151c";

    const data = {
        labels: displayLabels,
        datasets: [{
            data: values,
            backgroundColor: colors,
            borderColor,
            borderWidth: 3,
            hoverOffset: 8,
        }],
    };

    if (pieChart) {
        pieChart.data = data;
        pieChart.options.plugins.legend.labels.color = isLight ? "#0f172a" : "#e6edf3";
        pieChart.update();
    } else {
        pieChart = new Chart(canvas, {
            type: "doughnut",
            data,
            options: {
                responsive: true,
                cutout: "60%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: isLight ? "#0f172a" : "#e6edf3",
                            padding: 14,
                            font: { size: 12 },
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${formatMoney(ctx.parsed)}${currencySuffix()}`,
                        },
                    },
                },
            },
        });
    }
}

/* ===== Byudjet limitlari ===== */
function getCategorySpent(category) {
    const month =
        currentMonth === "all" ? new Date().getMonth() : Number(currentMonth);
    const year = trendYear || new Date().getFullYear();

    return transactions.reduce((sum, tx) => {
        if (tx.type !== "expense") return sum;
        if ((tx.category || "Boshqa") !== category) return sum;
        const d = new Date(tx.date);
        if (d.getMonth() !== month || d.getFullYear() !== year) return sum;
        return sum + tx.amount;
    }, 0);
}

function renderBudgets() {
    if (!budgetListEl) return;

    if (!categories.length) {
        budgetListEl.innerHTML = `<p class="budget-empty">${t("budgetEmpty")}</p>`;
        requestAnimationFrame(updateBudgetScrollbar);
        return;
    }

    budgetListEl.innerHTML = categories
        .map((cat) => {
            const cfg = getCategoryConfig(cat);
            const limit = Number(budgets[cat]) || 0;
            const spent = getCategorySpent(cat);
            const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            const fillClass =
                limit > 0 && spent / limit > 1
                    ? "danger"
                    : limit > 0 && spent / limit >= 0.8
                      ? "warn"
                      : "";
            const meta =
                limit > 0
                    ? `<span class="budget-meta-label">${t("budgetSpent")}:</span> <strong>${formatMoney(spent)}</strong> / <strong>${formatMoney(limit)}${currencySuffix()}</strong>`
                    : `<span class="budget-meta-label">${t("budgetSpent")}:</span> <strong>${formatMoney(spent)}${currencySuffix()}</strong> <span class="budget-meta-sep">·</span> <span class="budget-meta-muted">${t("budgetNoLimit")}</span>`;
            const over =
                limit > 0 && spent > limit
                    ? `<span class="budget-meta over">${t("budgetOver")}</span>`
                    : `<span class="budget-meta">${meta}</span>`;

            return `
            <div class="budget-item" data-category="${escapeHtml(cat)}">
                <div class="budget-top">
                    <div class="budget-name" style="color:${cfg.color}">
                        <i class="fa-solid ${cfg.icon}"></i>
                        ${escapeHtml(translateCategory(cat))}
                    </div>
                    ${over}
                </div>
                <div class="budget-bar">
                    <div class="budget-fill ${fillClass}" style="width:${limit > 0 ? pct : 0}%"></div>
                </div>
                <div class="budget-edit">
                    <div class="budget-stepper">
                        <input type="number" min="0" step="1000" value="${limit || ""}"
                            placeholder="${t("budgetLimit")}" data-budget-input="${escapeHtml(cat)}" />
                        <div class="budget-spin" aria-hidden="true">
                            <button type="button" class="budget-spin-btn" data-budget-step="up" data-budget-cat="${escapeHtml(cat)}" tabindex="-1">
                                <i class="fa-solid fa-chevron-up"></i>
                            </button>
                            <button type="button" class="budget-spin-btn" data-budget-step="down" data-budget-cat="${escapeHtml(cat)}" tabindex="-1">
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                    <button type="button" class="budget-save" data-budget-save="${escapeHtml(cat)}">
                        ${t("budgetSave")}
                    </button>
                </div>
            </div>`;
        })
        .join("");

    requestAnimationFrame(updateBudgetScrollbar);
}

function updateBudgetScrollbar() {
    if (!budgetListEl || !budgetScrollbar || !budgetScrollThumb) return;

    const { scrollTop, scrollHeight, clientHeight } = budgetListEl;
    const needsScroll = scrollHeight > clientHeight + 2;
    budgetScrollbar.classList.toggle("is-hidden", !needsScroll);
    if (!needsScroll) return;

    const trackH = budgetScrollbar.clientHeight;
    const thumbH = Math.max(36, (clientHeight / scrollHeight) * trackH);
    const maxTop = Math.max(0, trackH - thumbH);
    const top = maxTop === 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    budgetScrollThumb.style.height = `${thumbH}px`;
    budgetScrollThumb.style.transform = `translateY(${top}px)`;
}

function setupBudgetScrollbar() {
    if (!budgetListEl || !budgetScrollbar || !budgetScrollThumb) return;

    let scrollTimer = null;
    budgetListEl.addEventListener("scroll", () => {
        updateBudgetScrollbar();
        budgetScrollShell?.classList.add("is-scrolling");
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => budgetScrollShell?.classList.remove("is-scrolling"), 500);
    });

    window.addEventListener("resize", updateBudgetScrollbar);

    let dragging = false;
    let startY = 0;
    let startScroll = 0;

    budgetScrollThumb.addEventListener("pointerdown", (e) => {
        dragging = true;
        startY = e.clientY;
        startScroll = budgetListEl.scrollTop;
        budgetScrollThumb.classList.add("is-dragging");
        budgetScrollThumb.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    budgetScrollThumb.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const { scrollHeight, clientHeight } = budgetListEl;
        const trackH = budgetScrollbar.clientHeight;
        const thumbH = budgetScrollThumb.offsetHeight;
        const maxTop = Math.max(1, trackH - thumbH);
        const delta = e.clientY - startY;
        const scrollRange = scrollHeight - clientHeight;
        budgetListEl.scrollTop = startScroll + (delta / maxTop) * scrollRange;
    });

    const endDrag = () => {
        dragging = false;
        budgetScrollThumb.classList.remove("is-dragging");
    };
    budgetScrollThumb.addEventListener("pointerup", endDrag);
    budgetScrollThumb.addEventListener("pointercancel", endDrag);

    budgetScrollbar.addEventListener("pointerdown", (e) => {
        if (e.target === budgetScrollThumb) return;
        const rect = budgetScrollbar.getBoundingClientRect();
        const thumbH = budgetScrollThumb.offsetHeight;
        const y = e.clientY - rect.top - thumbH / 2;
        const trackH = budgetScrollbar.clientHeight;
        const maxTop = Math.max(1, trackH - thumbH);
        const ratio = Math.min(1, Math.max(0, y / maxTop));
        const { scrollHeight, clientHeight } = budgetListEl;
        budgetListEl.scrollTop = ratio * (scrollHeight - clientHeight);
    });
}

budgetListEl.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-budget-step]");
    if (stepBtn) {
        const cat = stepBtn.dataset.budgetCat;
        const dir = stepBtn.dataset.budgetStep;
        const input = budgetListEl.querySelector(`[data-budget-input="${CSS.escape(cat)}"]`);
        if (!input) return;
        const step = Number(input.step) || 1000;
        const current = Number(input.value) || 0;
        const next = dir === "up" ? current + step : Math.max(0, current - step);
        input.value = String(next);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        return;
    }

    const btn = e.target.closest("[data-budget-save]");
    if (!btn) return;
    const cat = btn.dataset.budgetSave;
    const input = budgetListEl.querySelector(`[data-budget-input="${CSS.escape(cat)}"]`);
    const value = Number(input?.value) || 0;
    if (value > 0) budgets[cat] = value;
    else delete budgets[cat];
    saveBudgets();
    renderBudgets();
    showToast(t("budgetSaved"), "success");
});

/* ===== Line chart (oylik trend) ===== */
function populateTrendYears() {
    const years = new Set([new Date().getFullYear()]);
    transactions.forEach((tx) => years.add(new Date(tx.date).getFullYear()));
    const sorted = [...years].sort((a, b) => b - a);
    if (!sorted.includes(trendYear)) trendYear = sorted[0];

    if (trendYearLabel) trendYearLabel.textContent = String(trendYear);
    if (!trendYearMenu) return;

    trendYearMenu.innerHTML = sorted
        .map(
            (y) =>
                `<button type="button" class="dd-item${y === trendYear ? " active" : ""}" data-value="${y}" role="option"><strong>${y}</strong></button>`
        )
        .join("");
}

function getMonthlyTrend(year) {
    const income = Array(12).fill(0);
    const expense = Array(12).fill(0);
    transactions.forEach((tx) => {
        const d = new Date(tx.date);
        if (d.getFullYear() !== year) return;
        const m = d.getMonth();
        if (tx.type === "income") income[m] += tx.amount;
        else expense[m] += tx.amount;
    });
    return { income, expense };
}

function renderLineChart() {
    const canvas = document.getElementById("lineChart");
    if (!canvas) return;

    populateTrendYears();
    const { income, expense } = getMonthlyTrend(trendYear);
    const hasData = income.some((v) => v > 0) || expense.some((v) => v > 0);
    const labels = Array.from({ length: 12 }, (_, i) => t(`m${i}`));
    const isLight = document.documentElement.classList.contains("light");

    if (!hasData) {
        canvas.style.display = "none";
        lineChartEmptyEl.style.display = "block";
        lineChartEmptyEl.textContent = t("trendEmpty");
        if (lineChart) {
            lineChart.destroy();
            lineChart = null;
        }
        return;
    }

    if (typeof Chart === "undefined") {
        canvas.style.display = "none";
        lineChartEmptyEl.style.display = "block";
        return;
    }

    canvas.style.display = "block";
    lineChartEmptyEl.style.display = "none";

    const data = {
        labels,
        datasets: [
            {
                label: t("income"),
                data: income,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                tension: 0.35,
                fill: true,
                pointRadius: 3,
            },
            {
                label: t("expense"),
                data: expense,
                borderColor: "#f43f5e",
                backgroundColor: "rgba(244, 63, 94, 0.12)",
                tension: 0.35,
                fill: true,
                pointRadius: 3,
            },
        ],
    };

    const textColor = isLight ? "#0f172a" : "#e6edf3";
    const gridColor = isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)";

    if (lineChart) {
        lineChart.data = data;
        lineChart.options.plugins.legend.labels.color = textColor;
        lineChart.options.scales.x.ticks.color = textColor;
        lineChart.options.scales.y.ticks.color = textColor;
        lineChart.options.scales.x.grid.color = gridColor;
        lineChart.options.scales.y.grid.color = gridColor;
        lineChart.update();
    } else {
        lineChart = new Chart(canvas, {
            type: "line",
            data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: textColor, usePointStyle: true, padding: 14 },
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) =>
                                `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}${currencySuffix()}`,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: textColor, maxRotation: 45, minRotation: 0 },
                        grid: { color: gridColor },
                    },
                    y: {
                        ticks: {
                            color: textColor,
                            callback: (v) => formatMoney(v),
                        },
                        grid: { color: gridColor },
                    },
                },
            },
        });
    }
}

/* ===== Hisobot eksport (CSV / Excel / PDF) ===== */
function getReportRows() {
    return [...transactions]
        .sort((a, b) => b.date - a.date)
        .map((tx) => ({
            [t("colDesc")]: tx.description,
            [t("colCategory")]: translateCategory(tx.category || "Boshqa"),
            [t("colPayment")]: translatePayment(tx.paymentMethod || ""),
            [t("colAmount")]: tx.type === "expense" ? -tx.amount : tx.amount,
            [t("typeLabel")]: tx.type === "income" ? t("typeIncome") : t("typeExpense"),
            [t("colDate")]: formatDate(tx.date),
        }));
}

function exportCsv() {
    if (transactions.length === 0) {
        showToast(t("reportEmpty"), "error");
        return;
    }

    const header = [
        t("colDesc"), t("colCategory"), t("colPayment"),
        t("colAmount"), t("typeLabel"), t("colDate"),
    ];
    const rows = transactions.map((tx) => [
        escapeCsv(tx.description),
        escapeCsv(translateCategory(tx.category || "Boshqa")),
        escapeCsv(translatePayment(tx.paymentMethod || "")),
        tx.type === "expense" ? -tx.amount : tx.amount,
        tx.type === "income" ? t("typeIncome") : t("typeExpense"),
        escapeCsv(formatDate(tx.date)),
    ].join(","));

    const csv = "\uFEFF" + [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-tracker-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t("csvDone"), "success");
}

function exportExcel() {
    if (transactions.length === 0) {
        showToast(t("reportEmpty"), "error");
        return;
    }
    if (typeof XLSX === "undefined") {
        showToast(t("reportLibError"), "error");
        return;
    }

    const rows = getReportRows();
    const totals = calculateTotals(transactions);
    const summary = [
        { [t("colDesc")]: t("income"), [t("colAmount")]: totals.income },
        { [t("colDesc")]: t("expense"), [t("colAmount")]: totals.expense },
        { [t("colDesc")]: t("balance"), [t("colAmount")]: totals.balance },
    ];

    const wb = XLSX.utils.book_new();
    const wsTx = XLSX.utils.json_to_sheet(rows);
    const wsSum = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsTx, "Transactions");
    XLSX.utils.book_append_sheet(wb, wsSum, "Summary");
    XLSX.writeFile(wb, `finance-report-${todayISO()}.xlsx`);
    showToast(t("reportExcelDone"), "success");
}

function exportPdf() {
    if (transactions.length === 0) {
        showToast(t("reportEmpty"), "error");
        return;
    }
    const jspdfNS = window.jspdf;
    if (!jspdfNS || !jspdfNS.jsPDF) {
        showToast(t("reportLibError"), "error");
        return;
    }

    const { jsPDF } = jspdfNS;
    const doc = new jsPDF({ orientation: "landscape" });
    const totals = calculateTotals(transactions);

    doc.setFontSize(16);
    doc.text(t("appTitle"), 14, 16);
    doc.setFontSize(10);
    doc.text(`${todayISO()} · ${currencyLabel()}`, 14, 23);
    doc.text(
        `${t("income")}: ${formatMoney(totals.income)} | ${t("expense")}: ${formatMoney(totals.expense)} | ${t("balance")}: ${formatMoney(totals.balance)}`,
        14,
        30
    );

    const body = [...transactions]
        .sort((a, b) => b.date - a.date)
        .map((tx) => [
            tx.description,
            translateCategory(tx.category || "Boshqa"),
            translatePayment(tx.paymentMethod || ""),
            `${tx.type === "expense" ? "-" : "+"}${formatMoney(tx.amount)}`,
            tx.type === "income" ? t("typeIncome") : t("typeExpense"),
            formatDate(tx.date),
        ]);

    if (typeof doc.autoTable === "function") {
        doc.autoTable({
            startY: 36,
            head: [[
                t("colDesc"), t("colCategory"), t("colPayment"),
                t("colAmount"), t("typeLabel"), t("colDate"),
            ]],
            body,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [16, 185, 129] },
        });
    }

    doc.save(`finance-report-${todayISO()}.pdf`);
    showToast(t("reportPdfDone"), "success");
}

exportDropdown.querySelectorAll("[data-export]").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.stopPropagation();
        const type = item.dataset.export;
        closeAllDropdowns();
        if (type === "excel") exportExcel();
        else if (type === "pdf") exportPdf();
        else exportCsv();
    });
});

document.getElementById("exportTrigger").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(exportDropdown);
});

/* ===== Render ===== */
function render() {
    renderBalance();
    renderTable();
    renderChart();
    renderLineChart();
    renderBudgets();
}

/* ===== Hodisalar ===== */
form.addEventListener("submit", saveTransaction);
descriptionInput.addEventListener("input", clearError);
amountInput.addEventListener("input", clearError);

filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    filtersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
    renderTable();
});

searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderTable();
});

transactionBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
        const tx = transactions.find((t) => t.id === Number(editBtn.dataset.id));
        if (tx) openEditModal(tx);
        return;
    }
    const delBtn = e.target.closest(".delete-btn");
    if (!delBtn) return;
    deleteTransaction(Number(delBtn.dataset.id), delBtn.closest("tr"));
});

/* ===== Ishga tushirish ===== */
initLanguage();
initCurrency();
initTheme();
transactions = loadTransactions();
categories = loadCategories();
budgets = loadBudgets();
setupBudgetScrollbar();
applyLanguage();
