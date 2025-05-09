# 42_events
# 42 Abu Dhabi Event Management Website

This repository contains the source code for a responsive, multilingual event management website tailored specifically for the 42 Abu Dhabi community. It supports English, Arabic (RTL), and French languages and utilizes official 42 Abu Dhabi branding and colors.

## 🎯 Project Overview

This web application allows users to view, search, and filter upcoming events effortlessly. Admins have secure access to manage events, including CRUD operations, bulk CSV uploads, and event data export. Real-time synchronization and offline caching functionalities enhance user experience.

## 🌐 Live Deployment

* **Live URL**: \[Insert your deployed URL here]

## 🚀 Features

* **Multilingual support:** English, Arabic (RTL), French
* **Responsive UI:** Optimized for mobile, tablet, and desktop
* **Event management:** Create, edit, delete, bulk upload (CSV)
* **Real-time synchronization:** Immediate event updates across tabs
* **Secure OAuth login:** Integrated with 42 OAuth
* **Offline support:** Progressive Web App functionality (cached data)
* **Event export:** CSV and calendar (.ics) file downloads

## 🎨 Official Colors

* Primary: `#00BABC` (Cyan)
* Secondary/Text: `#FFFFFF` (White)
* Background: `#121212` (Dark Charcoal)

## 🛠️ Tech Stack

* **Frontend:** ReactJS, Tailwind CSS
* **Backend:** Firebase Firestore
* **Authentication:** 42 OAuth
* **Multilingual Support:** React-i18next
* **Deployment:** Vercel or Netlify

## 📌 Installation & Setup

### Prerequisites

* Node.js (v16+ recommended)
* npm or yarn

### Steps

1. Clone the repository:

```bash
git clone [repository URL]
cd 42-event-management
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in your root directory and add:

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_42_CLIENT_ID=
REACT_APP_42_CLIENT_SECRET=
```

4. Run the application:

```bash
npm run dev
```

## 📥 Deployment

Push changes to GitHub and deploy automatically via:

* [Vercel](https://vercel.com/docs)

## ✅ Quality Checks

* Multilingual functionality tested (including Arabic RTL)
* Responsive and consistent UI across devices
* Secure OAuth authentication verified
* Real-time synchronization and offline support thoroughly tested

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Contact

For inquiries or contributions:

* [Your GitHub Profile](https://github.com/your-username)
* [Your Email](mailto:your.email@example.com)

---

**Built for the 42 Abu Dhabi Community ❤️**
