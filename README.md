# jena bathan — portfolio

Built with React 19, Vite, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Structure

```
src/
  components/
    Nav.jsx        nav bar with luggage-tag mark
    Hero.jsx        train-window hero, polaroid frame (add your photo here)
    TechStack.jsx    index-card tech stack grid
    Postcard.jsx     single flip/drag postcard used by Projects
    Projects.jsx     lays out the postcards, handles scatter vs. stacked layout
    Journey.jsx      passport-stamp timeline
    Contact.jsx      postcard-back contact section
    Footer.jsx
    Reveal.jsx       scroll-in-view wrapper (IntersectionObserver)
  data/
    projects.js      edit project copy/links/tags here
  index.css          Tailwind v4 theme tokens + custom keyframes/utilities
  App.jsx
  main.jsx
```

## Where to add real content

- **Photos/screenshots**: every dashed-border box marked `[ photo goes here ]`
  (the hero polaroid, each postcard front) is a placeholder — swap the div's
  content for an `<img>` once you have real photos/screenshots.
- **Project copy**: `src/data/projects.js` — add, remove, or edit postcards
  here. The `layouts` array in `Projects.jsx` controls where each one sits on
  desktop; add more entries if you add more than 6 projects.
- **Colors/fonts**: all defined as CSS custom properties in the `@theme`
  block at the top of `src/index.css` — change a value there and it updates
  everywhere.

## Notes

- Postcards are draggable and flippable on screens ≥760px; below that they
  stack vertically and flip on tap.
- Respects `prefers-reduced-motion`.
