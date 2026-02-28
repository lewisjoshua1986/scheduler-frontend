# Scheduler Pro – Angular Portfolio Project

## Overview
**Scheduler Pro** is a modern, full-featured scheduling and productivity application built with **Angular** as part of my professional portfolio. It is designed to handle individual and team schedules with advanced features inspired by Google Calendar, focusing on **user experience, mobile-first design, and cross-platform compatibility**.

The application supports **drag-and-drop event management**, repeating events, role-based authentication, event sharing, reminders, and much more. It is intended as a showcase of fullstack architecture, scalable frontend design, and future backend API integration.

---

## Live Demo
> Coming soon (link to deployed PWA)

---

## Features

### Core Scheduling
- **Drag & Drop Events** – Easily move events between dates and times.
- **Recurring Events** – Support for daily, weekly, monthly, and custom repeat patterns.
- **Event Creation & Editing** – Add titles, descriptions, time, location, and attachments.
- **Reminders & Notifications** – Custom reminders via email or push notifications.

### Collaboration & Sharing
- **Role-Based Authentication** – Admin, Manager, and User roles with different permissions.
- **User Accounts** – Secure sign-up/login with profile management.
- **Calendar Sharing** – Share full calendars with selected users.
- **Individual Event Sharing** – Share specific events with users via link or email.

### Personalization & UX
- **Custom Colors & Themes** – Personalize event and calendar styles.
- **Mobile-First UI** – Fully responsive design optimized for phones, tablets, and desktops.
- **Voice Commands** – Create and manage events using voice input.
- **Attachments** – Upload files to events (documents, images, links).
- **Custom Views** – Daily, weekly, monthly, and agenda views.

### Advanced & Future Features
- **PWA Ready** – Installable on mobile or desktop as a Progressive Web App.
- **Social Media Integration** – Share events or reminders via social networks.
- **Analytics Dashboard** – View productivity insights and calendar usage statistics.
- **Offline Mode** – Work offline with sync when connection is restored.
- **Third-Party Calendar Integration** – Google Calendar, Outlook, and iCal sync (planned).
- **Search & Filters** – Quickly find events by name, date, or tag.
- **Notifications Hub** – Centralized dashboard for reminders, alerts, and messages.

---

## Tech Stack

- **Frontend:** Angular, TypeScript, RxJS, SCSS
- **State Management:** NgRx / RxJS (planned)
- **Backend (Future):** Node.js, Express, TypeScript, MongoDB / PostgreSQL
- **Authentication:** JWT / OAuth (planned)
- **Build & Deployment:** Angular CLI, Docker, GitHub Pages / PWA deployment
- **Testing:** Jasmine, Karma (unit), Cypress (e2e)

---

## Project Architecture
```
scheduler-frontend/
│
├─ src/
│ ├─ app/
│ │ ├─ core/ # Services, guards, and core utilities
│ │ ├─ shared/ # Shared components, pipes, directives
│ │ ├─ features/scheduler/ # Feature module for scheduler functionality
│ │ │ ├─ pages/ # Main pages like calendar view
│ │ │ ├─ components/ # Event form, event list, drag-drop items
│ │ │ └─ services/ # Event service, notifications
│ │ └─ app-routing.module.ts
│ └─ assets/
│ └─ mock-data/ # Sample JSON events for initial development
```

---

## Roadmap

- [x] Angular scaffold with routing & module structure
- [x] Mock JSON event data
- [ ] Drag-and-drop calendar integration
- [ ] Repeating events
- [ ] User authentication & role-based access
- [ ] Event attachments & file storage
- [ ] Voice command integration
- [ ] Mobile-first PWA deployment
- [ ] Calendar & event sharing
- [ ] Notifications & reminders
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Backend API integration

---

## Installation (Local Dev)

# Clone the repository
git clone https://github.com/YOURUSERNAME/scheduler-frontend.git
cd scheduler-frontend

# Install dependencies
npm install

# Run locally
ng serve

Navigate to http://localhost:4200/ to see the app in action.

## Contribution

This is a personal portfolio project. Suggestions and contributions are welcome via pull requests or issues.

## Contact

Joshua Lewis

lewisjoshua1986@gmail.com
