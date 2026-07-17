Finance Tracker
A modern, responsive web application built with pure HTML, CSS, and JavaScript for tracking income and expenses.

Features
✅ Add income and expenses.

✅ Real-time automatic balance calculation (positive — green, negative — red).

✅ Error validation (prevents empty fields or invalid numbers).

✅ Data persistence using localStorage (data is saved even after refreshing the page).

✅ Delete transactions.

✅ BONUS: Filter functionality — All / Income / Expense.

✅ BONUS: Pie chart using Chart.js to visualize income/expense ratio.

✅ Responsive design (Flexbox + Grid), FontAwesome icons.

File Structure
Plaintext
Finance-tracker/
├── index.html          # HTML5 structure
├── styles/
│   └── style.css       # Modern, responsive design
├── app.js              # All application logic
└── README.md
How to Run
No separate server is required — simply open the index.html file in your browser.
Alternatively, you can use a local server:

Bash
# Using Python
python -m http.server 8000
# Then access in your browser: http://localhost:8000
Libraries (CDN)
Chart.js — for Pie chart.

FontAwesome — for icons.

Note: CDNs require an internet connection.
