# Project Notes – SmartFarm

**Project title:** Smart Agriculture & Farm Operation Management Platform

## 1. Problem Statement

Many small and medium farms in India are still managed using paper registers, phone calls and memory. A farmer growing crops like sugarcane, onion, pomegranate and cotton on different plots has to remember which crop is in which field, when it will be ready for harvest, which worker is doing which job, how much fertilizer or pesticide is left, and how much money was spent and earned. Because this information is scattered, tasks get missed, stock runs out at the wrong time and the farmer does not have a clear idea of profit or loss.

SmartFarm brings all this information into one web application, with a dashboard that shows what needs attention today.

## 2. Objectives

1. Show a dashboard with a summary of fields, crops, tasks, stock, money and weather.
2. Manage fields and crop cycles, and show crop growth progress and days left for harvest.
3. Plan farm tasks, assign them to workers and highlight overdue work.
4. Simulate IoT sensors for each field and allow irrigation to be started and stopped.
5. Track inventory and warn when items reach their reorder level.
6. Manage workers and see how many open tasks each worker has.
7. Record income and expenses and show monthly profit.
8. Load a weather forecast and give simple farm advice.
9. Use modern Angular features such as standalone components, signals, lazy loading, guards, reactive forms, custom pipes and directives, and HttpClient.

## 3. Module-wise Description

**Login** – Mock login with email and password. Demo credentials are shown on the page. The logged-in user is saved in localStorage. All other pages are protected by `authGuard`.

**Dashboard** – Six summary cards (fields and acres, active crops, tasks due today, overdue tasks, low stock items, net profit this month), a doughnut chart of crop area, a bar chart of income vs expenses for the last 6 months, an alerts list, today's tasks and today's weather with advice.

**Fields** – Table of farm plots with area, soil type, irrigation type, location and status. Search, status filter, add/edit form in a modal and delete with confirmation.

**Crops** – Crop cycles shown as cards. Each card has a growth progress bar calculated from sowing and harvest dates, a health badge and the days left to harvest (custom `daysLeft` pipe). Filters for stage and health. The form checks that the harvest date is after the sowing date.

**Tasks** – Tasks with type, field, worker, due date, priority and status. Tabs for All, Pending, In Progress, Done and Overdue. Overdue rows are highlighted in red. A "Done" button marks a task as completed.

**Smart Monitoring** – One card per active field showing soil moisture, soil temperature, air humidity and soil pH. Values change slightly every 3 seconds. Each card shows Normal, Warning or Critical status. Irrigation can be started and stopped, and while it is on the moisture goes up. Status changes are added to an alert log. The timer is stopped when the user leaves the page.

**Inventory** – Items with category, quantity, unit, reorder level and cost per unit. Rows at or below the reorder level are highlighted using the custom `appLowStock` directive. The page header shows the low stock count. Restock button, search and category filter.

**Workers** – Workers with role, 10-digit phone number, daily wage and status. The table shows the number of open tasks for each worker, taken from the task service.

**Finance** – Income and expense transactions. Month and type filters, cards for total income, total expenses and net profit, and a chart of expenses by category. Amounts are shown in ₹ using CurrencyPipe.

**Weather & Advisory** – 7-day forecast loaded from `public/data/weather.json` using HttpClient. Advice is generated using simple rules: rain chance above 60% → postpone spraying and irrigation; temperature above 38°C → irrigate in the evening; wind above 20 km/h → avoid pesticide spraying.

**Settings** – Change farm name and owner name (shown in the top bar), switch between light and dark theme, and reset demo data.

## 4. Data Models

All interfaces are in `src/app/core/models/`. Dates are stored as strings in `yyyy-MM-dd` format.

**User** – email, name

**Field** – id, name, area (acres), soilType, irrigation (Drip / Sprinkler / Flood / Rainfed), location, status (Active / Fallow)

**Crop** – id, crop, variety, fieldId, sowingDate, harvestDate, stage (Sowing / Germination / Vegetative / Flowering / Harvest Ready / Harvested), health (Healthy / At Risk / Diseased), expectedYield (quintals)

**Task** – id, title, type (Irrigation / Fertilizing / Spraying / Sowing / Harvesting / Maintenance), fieldId, workerId, dueDate, priority (Low / Medium / High), status (Pending / In Progress / Done)

**InventoryItem** – id, name, category (Seeds / Fertilizer / Pesticide / Equipment / Fuel), quantity, unit, reorderLevel, costPerUnit

**Worker** – id, name, role (Supervisor / Field Worker / Tractor Operator / Sprayer), phone, dailyWage, status (Active / On Leave)

**Transaction** – id, type (Income / Expense), category (Seeds / Fertilizer / Labour / Equipment / Fuel / Crop Sale / Subsidy / Other), amount, date, fieldId (empty for general), note

**SensorReading** – fieldId, fieldName, moisture, temperature, humidity, ph, irrigating

**SensorAlert** – time, fieldName, message, status (Normal / Warning / Critical)

**WeatherDay** – date, condition, minTemp, maxTemp, rainChance, humidity, wind

**Advisory** – title, message, level (info / warning / danger)

**AppSettings** – farmName, ownerName, theme (light / dark)

## 5. Angular Concepts Used

| Concept | Where it is used |
| --- | --- |
| Standalone components | All components, e.g. `pages/dashboard/dashboard.ts`, `layout/shell/shell.ts` |
| Component inputs and outputs | `shared/components/stat-card/stat-card.ts`, `shared/components/modal/modal.ts`, `shared/components/confirm-dialog/confirm-dialog.ts`, `layout/sidebar/sidebar.ts` |
| Content projection (ng-content) | `shared/components/page-header/page-header.ts`, `shared/components/modal/modal.ts` |
| Routing | `app.routes.ts` |
| Lazy loading (loadComponent) | `app.routes.ts` – every page is lazy loaded |
| Route guard (functional) | `core/guards/auth-guard.ts` |
| routerLinkActive | `layout/sidebar/sidebar.html` |
| Services | `core/services/` – auth, field, crop, task, inventory, worker, finance, sensor, weather, settings, storage |
| Dependency injection with inject() | All services and pages, e.g. `pages/tasks/tasks.ts` |
| Signals | All services, e.g. `core/services/task.service.ts`; page state like `showForm` and `search` in `pages/fields/fields.ts` |
| computed() | `core/services/task.service.ts` (overdueTasks, todayTasks), `core/services/inventory.service.ts` (lowStockItems), `pages/finance/finance.ts` (summary) |
| effect() | `pages/finance/finance.ts` – updates the chart when the month changes |
| Reactive forms | `pages/login/login.ts` and every page with an add/edit form, e.g. `pages/workers/workers.ts` |
| Validation | Built-in validators (required, email, min, minLength, pattern) in all forms; phone pattern in `pages/workers/workers.ts` |
| Custom validator | `harvestAfterSowing` in `pages/crops/crops.ts` |
| Custom pipe | `shared/pipes/days-left-pipe.ts`, used in `pages/crops/crops.html` and `pages/tasks/tasks.html` |
| Built-in pipes | CurrencyPipe (INR) and DatePipe, e.g. `pages/finance/finance.html` |
| Custom directive | `shared/directives/low-stock.ts`, used in `pages/inventory/inventory.html` |
| HttpClient | `core/services/weather.service.ts` |
| Control flow (@if, @for, @switch, @let) | All templates; `@switch` and `@let` in `pages/monitoring/monitoring.html` |
| Lifecycle hooks | `ngOnInit` / `ngOnDestroy` in `pages/monitoring/monitoring.ts` (start and stop sensor timer), `ngOnDestroy` in `pages/dashboard/dashboard.ts` (destroy charts) |
| localStorage | `core/services/storage.service.ts`, used by all data services |
| Chart.js | `pages/dashboard/dashboard.ts`, `pages/finance/finance.ts` |
| Unit tests | `core/guards/auth-guard.spec.ts`, `core/services/task.service.spec.ts`, `core/services/inventory.service.spec.ts`, `app.spec.ts` |

## 6. Screens to Screenshot

1. Login page (with a validation error)
2. Dashboard – summary cards
3. Dashboard – charts
4. Dashboard – alerts, today's weather and today's tasks
5. Fields – table
6. Fields – add field form with validation errors
7. Crops – crop cards
8. Crops – form showing the harvest date error
9. Tasks – All tab with overdue rows
10. Tasks – Overdue tab
11. Smart Monitoring – sensor cards and alert log
12. Smart Monitoring – irrigation running
13. Inventory – low stock rows and header badge
14. Inventory – restock dialog
15. Workers – table with open task count
16. Workers – form with phone validation error
17. Finance – cards, transactions and chart
18. Weather & Advisory
19. Settings
20. Delete confirmation dialog
21. Dark theme
22. Mobile view with the menu open
23. Page not found

## 7. Limitations

- There is no backend. Data is stored only in the browser's localStorage, so it is lost if browser data is cleared and cannot be shared between devices.
- Login is a mock with one fixed demo account. There are no user roles.
- Sensor readings are simulated using random values and are not saved.
- Weather data comes from a static JSON file, not a live weather service.
- Weather advice uses simple fixed rules.
- The app is available only in English.

## 8. Future Scope

- **Real IoT sensors** – connect actual soil and weather sensors and control irrigation pumps automatically.
- **Backend API** – add a server and database with real user accounts and roles for owner, supervisor and workers.
- **ML crop disease detection** – upload a photo of a leaf and detect diseases using a machine learning model.
- **Mobile app** – a mobile app for workers to see and update their tasks in the field.
- **Multilingual support** – Marathi, Hindi and other regional languages.
- Live weather and mandi price data.
- SMS or WhatsApp alerts for critical readings and overdue tasks.
