# Smart Agriculture & Farm Operation Management Platform

**SmartFarm** is an Angular web application for managing daily farm work. It keeps fields, crops, tasks, workers, inventory, money and weather in one place, and shows the important things on a dashboard.

This is a frontend-only project. There is no backend. Demo data for a farm in Maharashtra is loaded on first use and saved in the browser's localStorage. Dates in the demo data are calculated from today's date, so the data always looks current.

Units used: Indian Rupee (₹), acres for area, quintals for yield, dates as `dd MMM yyyy`.

## Features

**Login**
- Email and password login with form validation
- Demo credentials shown on the login page
- Pages are protected by a route guard; logout button in the top bar

**1. Dashboard**
- Cards for total fields and acres, active crops, tasks due today, overdue tasks, low stock items and net profit this month
- Doughnut chart of crop area and bar chart of income vs expenses for the last 6 months
- Alerts list (critical sensor readings, overdue tasks, low stock)
- Today's tasks and today's weather with advice

**2. Fields** – table with search and status filter, add/edit form in a modal, delete with confirmation

**3. Crops** – crop cards with growth progress bar, health badge and days left to harvest; filter by stage and health; add/edit/delete

**4. Tasks** – tabs for All, Pending, In Progress, Done and Overdue; overdue rows highlighted; "Done" button to complete a task; add/edit/delete

**5. Smart Monitoring** – simulated sensors for each active field (soil moisture, soil temperature, air humidity, soil pH), updated every 3 seconds; Normal/Warning/Critical status; start/stop irrigation; alert log

**6. Inventory** – low stock rows highlighted using a custom directive, low stock count in the header, restock button, search and category filter, add/edit/delete

**7. Workers** – workers with role, phone (10 digits), daily wage and status; number of open tasks per worker; add/edit/delete

**8. Finance** – income and expense transactions, month and type filters, income/expense/profit cards, expenses by category chart, add/edit/delete

**9. Weather & Advisory** – 7-day forecast loaded from `public/data/weather.json` using HttpClient, with advice such as:
- rain chance above 60% → postpone spraying and irrigation
- temperature above 38°C → irrigate in the evening
- wind above 20 km/h → avoid pesticide spraying

**10. Settings** – farm name and owner name, light/dark theme, reset demo data

## Tech Stack

- Angular 22 (standalone components, signals, new control flow)
- TypeScript (strict mode)
- Reactive Forms
- Angular Router with lazy loading
- HttpClient
- Chart.js
- CSS with CSS variables
- Material Symbols icons and Inter font (Google Fonts)
- Vitest for unit tests

## Folder Structure

```
src/app/
  core/
    data/        demo data
    guards/      auth guard
    models/      interfaces
    services/    one service per module
    utils/       date helper functions
  shared/
    components/  stat-card, page-header, status-badge, empty-state, modal, confirm-dialog
    directives/  appLowStock
    pipes/       daysLeft
  layout/        shell, sidebar, topbar
  pages/         login, dashboard, fields, crops, tasks, monitoring,
                 inventory, workers, finance, weather, settings, not-found
public/data/weather.json
```

## How to Run

Install packages:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open http://localhost:4200 in the browser.

Build for production:

```bash
npm run build
```

Run unit tests:

```bash
npm test -- --watch=false
```

## Demo Login

- Email: `admin@smartfarm.com`
- Password: `farm123`

To go back to the original demo data, open **Settings → Reset Demo Data**.
