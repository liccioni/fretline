<<<<<<< Updated upstream
# Fretline – Guitar Practice App

Fretline is a focused guitar practice tool built for **real daily guitar practice**.  
Create structured **multi-drill practice sessions** with timing, metronome, and automatic transitions — so you can focus on playing, not tapping your phone.

This project prioritizes **discipline, clarity, and repeatability** over gimmicks.

---

## What Fretline Is

Fretline lets you:
- Build timed practice sessions (20, 30, 60+ minutes)
- Combine different drill types in one session
- Run sessions hands-free while playing guitar
- Practice with a metronome and countdowns
- Progress automatically from drill to drill

It is designed to become a **daily practice ritual**, not a game.

---

## Core Features

- Session builder with ordered drills  
- Automatic drill transitions  
- Countdown before drills  
- Metronome with accented downbeat  
- Visual beat and bar indicators  
- Fullscreen session runner  
- Local-only (no backend required)  
- Type-safe drill and session models  
- Test-guarded timing and transitions  

---

## Planned Drill Types

- Generic drill (name + BPM + duration)
- Note location drill (fretboard training)
- Triad location drill
- Spider / finger independence drill
- Rhythm & timing drills

---

## Getting Started

Clone the repo:

```bash
git clone https://github.com/liccioni/fretline.git
cd fretline
```

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## Project Structure

```
src/
  blocks/        # Drill components
  session/       # Session runner logic
  types/         # Drill & session models
  utils/         # Timing & audio helpers
  test/          # Test setup

docs/
  spec-v1.md     # Product specification

App.tsx          # App entry UI
main.tsx         # React entry point
```

---

## Product Specification

The product scope and rules live in:

```
docs/spec-v1.md
```

This spec is the **source of truth**.

**No feature should be added unless it aligns with the spec.**

---

## Development Rules

- SessionRunner controls **all timing**
- Drills are **data-driven**
- UI never controls timing logic
- New features require passing tests
- Keep commits small and meaningful
- Avoid feature creep

---

## Testing

Run tests with:

```bash
npm test
```

Timing, countdown, and session progression are **guarded by tests**.

---

## Philosophy

Fretline is built on three principles:

1. **Practice > Features**
2. **Clarity > Cleverness**
3. **Discipline > Motivation**

This tool exists to make you **a better musician**, not to entertain you.

---

## License

MIT License  
See `LICENSE` for details.
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> Stashed changes
