# 📒 Ledgerly  
### Mobile-First Personal Finance Ledger

<p align="center">
  <img src="assets/ledgerly-demo.gif" width="320" alt="Ledgerly Demo">
</p>

<p align="center">
  <b>A simple, professional daily spend, savings, and payables notebook.</b>
</p>

---

## 🔗 Live App

👉 **Try Ledgerly here:**  
**https://vengababu-x.github.io/DailyLedger/**

> Optimized for mobile.  
> Best used as a daily personal finance notebook.

---

## 📌 Overview

**Ledgerly** is a mobile-first personal finance app designed for **daily professional use**.

It helps you:
- track daily expenses
- record savings
- note money you need to pay
- review everything month-by-month

No clutter.  
No unnecessary complexity.  
Just a clean ledger that works.

---

## 📱 Mobile-First UI

<p align="center">
  <img src="assets/mobile-ui.gif" width="280">
</p>

- Designed for phones first
- Touch-friendly controls
- One-screen workflow
- Clean, banking-style layout

---

## ✨ Features

### 🧾 Daily Entries
- Add **Spend**, **Save**, or **To Pay**
- Category-based tracking
- Optional notes

<p align="center">
  <img src="assets/add-entry.gif" width="280">
</p>

---

### 📅 Month Switching
- Navigate between months
- Each month has isolated data
- No accidental overwrites

<p align="center">
  <img src="assets/month-switch.gif" width="280">
</p>

---

### 📊 Visual Insights
- **Bar Chart** → Spend vs Save
- **Pie Chart** → Spending by category

<p align="center">
  <img src="assets/charts.gif" width="300">
</p>

Charts are minimal and support decisions without distraction.

---

### 🗑️ Entry Management
- Delete any entry
- Instant updates
- No broken state

<p align="center">
  <img src="assets/delete-entry.gif" width="280">
</p>

---

## 🧠 Data Model

```js
{
  id: Number,
  type: "spend" | "save" | "pay",
  amount: Number,
  category: String,
  note: String,
  month: "YYYY-MM"
}

Simple, predictable, and easy to extend.
```


---

🛠️ Tech Stack

HTML5

CSS3 (mobile-first)

Vanilla JavaScript

Chart.js

LocalStorage


No backend.
No frameworks.
Runs entirely in the browser.


---

⚡ Getting Started

Clone the repository
```
git clone https://github.com/your-username/ledgerly.git

Open locally

Just open index.html in your browser.

Deploy

Use GitHub Pages for best mobile experience.

```
---

🧹 First-Run Tip

If you tested older versions:

localStorage.clear();

Refresh once to start fresh.


---

📸 Screenshots

<p align="center">
  <img src="assets/screen-1.png" width="220">
  <img src="assets/screen-2.png" width="220">
  <img src="assets/screen-3.png" width="220">
</p>
---

🎯 Philosophy

> “A finance tool should feel boring enough to trust.”



Ledgerly focuses on:

clarity

structure

daily usability


Not trends or gimmicks.


---

🗺️ Roadmap

Export to CSV / Excel

Mark “To Pay” as paid

PWA install

Cloud sync

Multi-currency support



---

📄 License

MIT License
Free to use, modify, and improve.


---

🎥 Adding Animations

Record short screen demos and place them here:
```
assets/
├── ledgerly-demo.gif
├── mobile-ui.gif
├── add-entry.gif
├── month-switch.gif
├── charts.gif
├── delete-entry.gif
```
