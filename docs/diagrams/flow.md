# Budget AI - System Flow Diagrams

## 🔄 User Journey Flow

```
┌─────────────────┐
│   User Visits   │
│   Application   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Authentication │
│     Screen      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   User Login    │
│   / Register    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   Dashboard     │
│   Overview      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Main Features  │
│                 │
│  ┌───────────┐  │
│  │Transactions│  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Budgets  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Reports  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │AI Insights│  │
│  └───────────┘  │
└─────────────────┘
```

## 🔐 Authentication Flow

```
┌─────────────────┐
│  User Input     │
│  (Username/     │
│   Password)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Frontend       │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API Request    │
│  POST /auth/    │
│  login          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Backend        │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Database       │
│  User Lookup    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Password       │
│  Verification   │
│  (bcrypt)       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  JWT Token      │
│  Generation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Token Response │
│  to Frontend    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Store Token    │
│  in Redux       │
└─────────────────┘
```

## 💰 Transaction Management Flow

```
┌─────────────────┐
│  User Clicks    │
│  "Add           │
│  Transaction"   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Transaction    │
│  Form Opens     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  User Fills     │
│  Form Fields    │
│  - Amount       │
│  - Description  │
│  - Category     │
│  - Type         │
│  - Date         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Frontend       │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API Request    │
│  POST /         │
│  transactions   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Backend        │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Database       │
│  Insert         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Success        │
│  Response       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Update Redux   │
│  Store          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  UI Updates     │
│  - Transaction  │
│    List         │
│  - Dashboard    │
│  - Charts       │
└─────────────────┘
```

## 📊 Budget Management Flow

```
┌─────────────────┐
│  User Clicks    │
│  "Create        │
│  Budget"        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Budget Form    │
│  Opens          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  User Fills     │
│  Form Fields    │
│  - Name         │
│  - Amount       │
│  - Category     │
│  - Period       │
│  - Start Date   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API Request    │
│  POST /budgets  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Database       │
│  Insert         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Budget         │
│  Created        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Budget         │
│  Progress       │
│  Calculation    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  UI Updates     │
│  - Budget List  │
│  - Progress     │
│    Bars         │
│  - Dashboard    │
└─────────────────┘
```

## 🤖 AI Insights Flow

```
┌─────────────────┐
│  User Clicks    │
│  "AI Insights"  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API Request    │
│  GET /ai/       │
│  insights       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Backend        │
│  Data           │
│  Collection     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  AI Processing  │
│  - Pandas       │
│  - Scikit-learn │
│  - Statistical  │
│    Analysis     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Generate       │
│  Insights       │
│  - Trends       │
│  - Anomalies    │
│  - Patterns     │
│  - Forecasts    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Response to    │
│  Frontend       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Display        │
│  Insights       │
│  - Cards        │
│  - Charts       │
│  - Tables       │
└─────────────────┘
```

## 📈 Report Generation Flow

```
┌─────────────────┐
│  User Clicks    │
│  "Generate      │
│  Report"        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Date Range     │
│  Selection      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API Request    │
│  GET /reports/  │
│  summary        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Backend        │
│  Data           │
│  Aggregation    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Calculations   │
│  - Totals       │
│  - Percentages  │
│  - Trends       │
│  - Categories   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  PDF Generation │
│  (ReportLab)    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Base64         │
│  Response       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Frontend       │
│  PDF Download   │
└─────────────────┘
```

## 🔄 Data Synchronization Flow

```
┌─────────────────┐
│  Application    │
│  Startup        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check          │
│  Authentication │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  If Authenticated│
│  Load User Data │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Parallel API   │
│  Requests       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  ┌───────────┐  │
│  │Transactions│  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Budgets  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Reports  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │AI Insights│  │
│  └───────────┘  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Update Redux   │
│  Store          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  UI Renders     │
│  with Data      │
└─────────────────┘
```

## 🚨 Error Handling Flow

```
┌─────────────────┐
│  Error Occurs   │
│  (API/Network/  │
│   Validation)   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Error          │
│  Classification │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  ┌───────────┐  │
│  │Network    │  │
│  │Error      │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │Validation │  │
│  │Error      │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │Server     │  │
│  │Error      │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │Auth       │  │
│  │Error      │  │
│  └───────────┘  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Error Handler  │
│  Processes      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  User           │
│  Notification   │
│  - Toast        │
│  - Modal        │
│  - Inline       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Recovery       │
│  Actions        │
│  - Retry        │
│  - Redirect     │
│  - Fallback     │
└─────────────────┘
```

## 🔄 Real-time Updates Flow

```
┌─────────────────┐
│  User Action    │
│  (Add/Edit/     │
│   Delete)       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API Request    │
│  Sent           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Backend        │
│  Processes      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Database       │
│  Updated        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Success        │
│  Response       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Redux Store    │
│  Updated        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  UI Components  │
│  Re-render      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  User Sees      │
│  Immediate      │
│  Changes        │
└─────────────────┘
```

## 📱 Responsive Design Flow

```
┌─────────────────┐
│  User Access    │
│  Application    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Device         │
│  Detection      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Screen Size    │
│  Classification │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  ┌───────────┐  │
│  │Desktop    │  │
│  │(>1024px)  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │Tablet     │  │
│  │(768-1024px)│ │
│  └───────────┘  │
│  ┌───────────┐  │
│  │Mobile     │  │
│  │(<768px)   │  │
│  └───────────┘  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Layout         │
│  Adaptation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Component      │
│  Responsiveness │
│  - Grid Layout  │
│  - Navigation   │
│  - Forms        │
│  - Charts       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Optimized      │
│  User           │
│  Experience     │
└─────────────────┘
```

---
