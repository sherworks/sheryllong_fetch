# GoFetch – Shelter Dog Matching App

## Overview

GoFetch! is a front-end web application built with React that allows users to log in, search for adoptable dogs, mark their favorites, and receive a match.

---

## Technologies Used

- React (Vite)
- TypeScript
- Plain CSS (no frameworks)
- Axios for API communication
- React Router DOM
- SessionStorage for state persistence

---

## Core Features (Per Assignment Requirements)

- Login authentication using `/auth/login` API with name and email
- Redirects to the search page upon successful login
- Browse adoptable dogs from `/dogs/search`
- Filter results by breed using checkboxes
- Pagination (Previous, Next, and page numbers)
- Sort dogs alphabetically by breed (ascending/descending toggle)
- Display all dog fields (image, name, breed, age, zip code) except ID
- Mark favorites from search results
- "Match Me with a Dog" button sends selected IDs to `/dogs/match` and displays the match
- Styled popup for displaying the matched dog

---

## Bonus Features (Additional Functionality)

- Responsive card layout that adapts to screen size
- Dark mode toggle with consistent theming
- Persistent login, favorites, sorting, and filters (session storage)
- Live favorite count display in header
- "Clear All Filters" button
- Collapsible breed filter section (collapsed by default)
- Error popup if user attempts match without any selected favorites
- Smooth UI transitions and hover states
- Built-in accessibility considerations and keyboard-friendly controls
- Custom styling with no external CSS frameworks

## How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/sherworks/sheryllong_fetch.git
   cd sheryllong_fetch

   npm install
   npm install react-router-dom
   npm install axios
   npm run dev

This application uses the Fetch API service, which requires third-party cookies to authenticate properly.

Please ensure third-party cookies are enabled in your browser (especially in Incognito mode or Safari) for login and dog browsing features to work correctly
