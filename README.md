# BatteryBA — Battery Store

A small e-commerce single-page application for selling car and motorcycle batteries.
Browse the catalog, manage a shopping cart that persists across reloads, and download a
PDF invoice (with VAT) for your order.

Built with **React 18 + Vite** as a front-end project to practice component architecture,
custom hooks and client-side state management.

> **Live demo:** _add your deployment URL here_ (see [Deployment](#deployment))

## Screenshots

> Add real screenshots to `docs/` and reference them here.

| Catalog | Cart & invoice |
| ------- | -------------- |
| `docs/screenshot-catalog.png` | `docs/screenshot-cart.png` |

## Features

- 🛒 **Shopping cart** — add products, increase/decrease quantity and remove items.
- 💾 **Persistent state** — the cart is saved to `localStorage`, so it survives a page reload.
- 🧾 **PDF invoice** — generate and download an invoice with line items, subtotal, 21% VAT and total (`jsPDF` + `jspdf-autotable`).
- 🔔 **Toast notifications** — feedback on every cart action (`react-toastify`).
- 📱 **Responsive & accessible** — cart opens on hover (desktop) or click/keyboard (mobile), with `aria-label`s on interactive controls.

## Tech stack

- [React 18](https://react.dev/)
- [Vite 6](https://vitejs.dev/) (with `@vitejs/plugin-react-swc`)
- [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- [react-toastify](https://fkhadra.github.io/react-toastify/)
- [ESLint 9](https://eslint.org/)
- Bootstrap-derived utility classes (vendored in `src/index.css`)

## Project structure

```
src/
├── components/
│   ├── Battery.jsx     # Single product card
│   └── Header.jsx      # Header + cart dropdown + PDF invoice
├── data/
│   └── db.js           # In-memory product catalog
├── hooks/
│   └── useCart.js      # Cart logic (add/remove/quantity, localStorage)
├── App.jsx             # Composition root
├── main.jsx            # React entry point
└── index.css           # Styles
public/img/             # Product and UI images
```

## Getting started

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL printed in the terminal (Vite defaults to <http://localhost:5173>).

### Available scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## Deployment

This is a static SPA, so it can be hosted on any static host. Config files for the two
most common options are included.

**Vercel** (`vercel.json` included)
1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Vite — just deploy. The build command is `npm run build` and the output directory is `dist`.

**Netlify** (`netlify.toml` included)
1. Push the repository to GitHub.
2. "Add new site" → import from Git at [app.netlify.com](https://app.netlify.com/).
3. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).

After deploying, paste the URL into the **Live demo** link at the top of this file.

## Possible improvements

Ideas to take this further: product search/filtering, real backend + checkout, unit
tests (Vitest + React Testing Library), and a "stock" / "already in cart" indicator on
each product card.

## License

Released under the [MIT License](LICENSE).
