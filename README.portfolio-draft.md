# Satellite Orbit Tracker

A web-based satellite visualization project with an interactive globe, satellite selection, orbit-style visuals, and telemetry panels. The current implementation is best described as a **simulation and visualization prototype**, not a verified live satellite-tracking service.

## Current Scope

The application presents a dashboard for exploring satellite-themed visualizations. In the current source:

- The satellite list begins with predefined sample entries.
- Satellite positions in the main hook are animated by updating their display angles.
- The telemetry panel generates changing sample values locally.
- The UI labels the telemetry as a simulation.

These values are illustrative. They are not evidence of live telemetry, authoritative satellite positions, or measured spacecraft health.

## Technology Stack

- Next.js 15 and React
- TypeScript
- satellite.js
- Leaflet and React Leaflet
- Three.js
- Tailwind CSS
- Framer Motion

The dependencies provide a foundation for richer orbital calculations and visualization. Their presence alone does not mean every library is currently used for live orbital propagation.

## Run Locally

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
git clone https://github.com/NAIMAKHAN09/orchids-satellite-orbit-tracker.git
cd orchids-satellite-orbit-tracker
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build and lint

```bash
npm run build
npm run lint
```

These are the scripts declared in `package.json`; successful execution has not been independently verified as part of this documentation pass.

## Engineering Areas

- Interactive satellite-themed data visualization
- Animated orbit-style displays
- Telemetry dashboard UI
- Component-based React architecture
- Potential extension into orbital propagation using TLE or other validated orbital elements

## Important Limitations

Before describing this as a live tracker, connect a documented orbital-element source, implement and validate the propagation and coordinate transformations, define data refresh behavior, and distinguish computed positions from measured telemetry. Document data freshness, assumptions, and accuracy limitations.

## Potential Next Steps

- Add screenshots and a verified live demo.
- Document which components use real data versus simulated values.
- Add tests for orbital calculations once implemented.
- Document data sources, coordinate conventions, and known limitations.

## License

Confirm the intended license before redistributing the project.
