# User Management Dashboard

A production-ready React + Vite dashboard that manages users with JSONPlaceholder-backed CRUD flows, client-side search, filters, sorting, pagination, validation, error handling, and responsive Bootstrap UI.

## Project Overview

This project was built as a frontend assignment focused on clean architecture, reusable React components, and scalable state management with Context API.

The dashboard fetches users from the JSONPlaceholder API, transforms the API response into a UI-friendly shape, and supports:

- Viewing users in a responsive table
- Adding new users
- Editing existing users
- Deleting users with confirmation
- Instant search across multiple fields
- Multi-field filtering from a collapsible sidebar
- Column sorting with ascending and descending toggle
- Pagination with configurable page sizes
- Inline form validation
- Skeleton loading and API error handling

## Features

- React 19 + Vite setup
- Bootstrap 5 styling with custom CSS polish
- Context API for shared dashboard state
- Fetch API only for network requests
- Manual client-side form validation
- Bootstrap alerts for success and error feedback
- Skeleton table loading state
- Responsive layout for desktop, tablet, and mobile
- Vercel-ready build output

## Tech Stack

- React 19
- Vite
- JavaScript (ES6+)
- Bootstrap 5
- React Icons
- Fetch API
- JSONPlaceholder REST API

## Installation

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### Setup

```bash
npm install
```

## How to Run

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

## API Used

Base URL:

```text
https://jsonplaceholder.typicode.com/users
```

Implemented methods:

- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

## Folder Structure

```text
src/
  api/
    userService.js
  components/
    common/
      AlertMessage.jsx
    layout/
      Header.jsx
      Sidebar.jsx
    users/
      DeleteModal.jsx
      FilterSidebar.jsx
      Pagination.jsx
      SearchBar.jsx
      SkeletonLoader.jsx
      UserForm.jsx
      UserRow.jsx
      UserTable.jsx
  context/
    UserContext.jsx
  hooks/
    useUserContext.js
  pages/
    Dashboard.jsx
  styles/
    index.css
  utils/
    userHelpers.js
    userValidation.js
  App.jsx
  main.jsx
```

## Folder Explanation

- `src/api`: API request helpers and response mapping
- `src/components/common`: reusable shared UI primitives
- `src/components/layout`: top-level dashboard layout blocks
- `src/components/users`: user table, modal, filter, search, and pagination UI
- `src/context`: centralized dashboard state and CRUD actions
- `src/hooks`: custom hooks for consuming Context cleanly
- `src/pages`: page-level composition
- `src/styles`: global and feature-level custom styling
- `src/utils`: pure helper functions for filtering, sorting, pagination, and validation

## Component Explanation

- `Dashboard`: composes the full page and connects UI actions to Context state
- `Header`: renders the dashboard hero section
- `Sidebar`: wraps the dashboard snapshot panel
- `UserTable`: renders the responsive table and sortable headers
- `UserRow`: renders a single user row with action buttons
- `UserForm`: handles add and edit flows with inline validation
- `DeleteModal`: confirms destructive delete actions
- `SearchBar`: handles instant multi-field searching
- `FilterSidebar`: drafts and applies multi-field filters
- `Pagination`: controls page navigation and page size
- `SkeletonLoader`: displays loading placeholders while fetching
- `AlertMessage`: standardizes feedback messaging

## Assumptions

- JSONPlaceholder returns a single `name` field, so the app splits it into:
  - `firstName`: first word
  - `lastName`: remaining words
- The API does not provide `department`, so the app generates a deterministic fallback from:
  - `IT`
  - `HR`
  - `Finance`
  - `Engineering`
  - `Marketing`
  - `Sales`
- JSONPlaceholder does not persist `POST`, `PUT`, or `DELETE`, so successful CRUD actions are mirrored into local state to keep the UI consistent.
- Search is case-insensitive and applies to first name, last name, email, and department.
- Pagination resets sensibly after search, filter, sort, or page-size changes.

## How It Works

1. The app loads users from JSONPlaceholder when the dashboard mounts.
2. `userService.js` maps API users into UI-friendly user objects.
3. `UserContext.jsx` stores users, loading state, errors, form state, search, filters, sort, and pagination.
4. Utility helpers apply search, filter, sort, and pagination in sequence.
5. The dashboard consumes the derived state and renders a responsive Bootstrap UI.
6. CRUD actions call the API first, then update local state after success.

## Error Handling

- Network failures are caught and shown through Bootstrap alert UI.
- Non-OK API responses are converted into readable error messages.
- Form validation prevents invalid submissions before API calls.
- Buttons are disabled during save and delete operations to avoid duplicate actions.
- The app keeps rendering safely even when requests fail.

## Challenges Faced

- Mapping the API's `name` field into separate first and last name values without backend changes
- Simulating persistent CRUD behavior even though JSONPlaceholder does not actually save mutations
- Keeping pagination accurate after search, filters, sort toggles, page-size changes, and local CRUD updates
- Balancing a clean desktop layout with horizontal table scrolling and stacked controls on smaller screens

## Future Improvements

- Add unit and integration tests with React Testing Library
- Persist filters, search, and page state in the URL
- Add toast notifications in addition to alert banners
- Replace mock persistence with a real backend
- Add bulk actions, export options, and role-based access control
- Introduce debounce for search if the dataset grows significantly

## Deployment Instructions

### Deploy to Vercel

1. Push the project to a GitHub repository.
2. Sign in to Vercel and import the repository.
3. Let Vercel detect the framework as `Vite`.
4. Use the default settings or confirm:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click Deploy.


## Screenshots Placeholder

<img width="1920" height="1662" alt="Image" src="https://github.com/user-attachments/assets/a9ed8a90-64e6-4ac4-812b-627828e866e2" />

## Project Walkthrough

- `UserContext.jsx` is the state engine of the app.
- `userService.js` isolates network logic and API-to-UI data mapping.
- `userHelpers.js` contains pure data transformations for searching, filtering, sorting, and pagination.
- `Dashboard.jsx` composes the page and keeps most display logic declarative.
- The UI remains responsive through Bootstrap grid usage plus targeted custom CSS.

