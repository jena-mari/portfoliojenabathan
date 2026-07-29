# Jena Bathan — Portfolio

A playful, interactive portfolio showcasing my software engineering, design work, technical experience, and professional milestones.

The site draws inspiration from Sydney trains, postcards, travel keepsakes, and handmade stationery. It combines those visual ideas with responsive layouts, accessible interactions, and motion designed to make exploring the portfolio feel personal.

## Highlights

- Animated train-door entrance with sound and an Opal card interaction
- Responsive hero section with an optional floating Spotify playlist
- Interactive clothesline displaying technologies and tools
- Draggable, tilting, and flippable project postcards
- Paginated passport-style milestone collection
- Illustrated contact section with direct contact links
- Smooth scrolling and animated section transitions
- Reduced-motion support and keyboard-accessible controls
- Responsive layouts for desktop, tablet, and mobile

## Technology

| Area | Tools |
| --- | --- |
| Interface | React 19, JSX, Tailwind CSS 4 |
| Build system | Vite 8 |
| Animation | Framer Motion, GSAP |
| Scrolling | Lenis |
| Code quality | Oxlint |

## Getting Started

### Requirements

- Node.js 20 or later
- npm

### Installation

```bash
git clone <repository-url>
cd portfoliojenabathan
npm install
npm run dev
```

Vite will display the local development URL in the terminal.

## Available Commands

```bash
npm run dev      # Start the development server
npm run build    # Create an optimized production build
npm run preview  # Preview the production build locally
npm run lint     # Run Oxlint against the source files
```

## Project Structure

```text
portfoliojenabathan/
├── public/
│   ├── fonts/             # Local display fonts
│   └── items/             # Images, animation, audio, and project artwork
├── src/
│   ├── components/        # Page sections and reusable interface components
│   ├── data/              # Project and decorative-item content
│   ├── hooks/             # Shared React hooks
│   ├── App.jsx            # Main page composition
│   ├── index.css          # Theme tokens, global styles, and animations
│   └── main.jsx           # Application entry point
├── index.html
├── package.json
└── vite.config.js
```

## Main Components

- `TrainDoors.jsx` — animated portfolio entrance and boarding interaction
- `Hero.jsx` — introduction, primary calls to action, and Spotify player
- `TechStack.jsx` — interactive technical-skills display
- `Projects.jsx` — project gallery and postcard interactions
- `Journey.jsx` — academic, leadership, and industry milestones
- `Contact.jsx` — contact details and mailbox illustration
- `ScrollSurface.jsx` — section background transitions and connectors

Project content and links are maintained in `src/data/projects.js`. Shared colors, typography, animation utilities, and responsive styling are defined in `src/index.css`.

## Accessibility

The portfolio includes keyboard-operable controls, descriptive labels, responsive touch interactions, visible focus states, and support for the `prefers-reduced-motion` setting.

## Production

Create a deployable build with:

```bash
npm run build
```

The optimized output is generated in `dist/` and can be hosted on any static deployment platform.

## Author

**Jena Bathan**  
[LinkedIn](https://www.linkedin.com/in/jenabathan/) · [GitHub](https://github.com/jena-mari) · [Email](mailto:jenamaribathan@gmail.com)

---

Designed and developed by Jena Bathan.
