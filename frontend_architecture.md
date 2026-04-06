# UAMS Frontend Layout & UI Structure

## 1. Core Layout Structure
The application utilizes a **Consistent Dashboard Framework** designed for high-density information management and role-based navigation.

### 1.1 The Primary Shell (AppShell)
- **Navigation Rail (Sidebar)**: 
  - Fixed-position left-hand navigation.
  - Contains branding (top), primary navigation links (center), and user/logout actions (bottom).
  - Responsive behavior: Collapses to an icon-only rail on tablet and a bottom drawer on mobile.
- **Top Utility Header**:
  - Global Search Bar ($Ctrl + K$).
  - System Notifications (bell icon).
  - Breadcrumb navigation for path context.
- **Dynamic Content Canvas**:
  - The main area where page-specific components are rendered.
  - Utilizes a "Standard Container" with consistent 24px-32px padding.

---

## 2. Component Hierarchies

### 2.1 Dashboard Interface (Staff/Adviser)
- **Top Row**: 4-column Stat Grid (e.g., Total Students, Active Leases, Pending Invoices, Occupancy Rate).
- **Middle Row**: 2-column split (60/40).
  - Left: "Recent Activity" timeline or "Upcoming Leases" table.
  - Right: "Quick Actions" panel and "Staff Assignments" list.
- **Bottom Row**: Full-width data visualization (Analytics charts).

### 2.2 Portal Interface (Student)
- **Header**: Large personalized welcome banner with current lease status summary.
- **Content Grid**: 3-column layout.
  - Column 1: "My Lease" details and documentation status.
  - Column 2: "My Invoices" with immediate "Pay Now" call-to-actions.
  - Column 3: "My Adviser" contact card and "Notifications" feed.

### 2.3 Data Tables (Global Utility)
- **Header**: Title, Record Count, Global Filter Search, and "Add New [Entity]" primary button.
- **Table Body**: Interactive rows with hover states, sortable headers, and multi-select capabilities.
- **Actions Column**: Contextual dropdown menus (Edit, View, Delete, Generate Report).
- **Pagination**: Sticky footer with page controls and "Results per page" selector.

---

## 3. Spatial & UI Guidelines

### 3.1 Grid & Spacing
- **Base Unit**: 4px 
- **Component Padding**: 16px (Dense) / 24px (Standard)
- **Border Radius**: 8px (Small) / 12px (Medium) for Cards / 50% for Avatars

### 3.2 Information Hierarchy
1.  **Level 1 (Primary)**: Bold headings, Primary Action Buttons (high contrast).
2.  **Level 2 (Secondary)**: Metadata text, Secondary Action Buttons (outlined), Input fields.
3.  **Level 3 (Tertiary)**: Breadcrumbs, Helper text, Tooltips, Muted background labels.

---

## 4. Visual Layout Mockup

```
+-----------------------------------------------------------+
| [LOGO] | [SEARCH: Ctrl + K]       [NOTIFS] [USER_AVATAR]  |
+--------+--------------------------------------------------+
|        |                                                  |
| [NAV1] |  Home > Dashboard                                |
|        |                                                  |
| [NAV2] |  +----------+ +----------+ +----------+ +------+ |
|        |  | STAT 1   | | STAT 2   | | STAT 3   | | STAT | |
| [NAV3] |  +----------+ +----------+ +----------+ +------+ |
|        |                                                  |
| [NAV4] |  +--------------------------+  +---------------+ |
|        |  |                          |  |               | |
| [NAV5] |  |     MAIN DATA TABLE      |  | QUICK ACTIONS | |
|        |  |                          |  |               | |
| [EXIT] |  +--------------------------+  +---------------+ |
+--------+--------------------------------------------------+
```
