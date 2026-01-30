<!--
    Developer: Martin Barry
    Project: Philobyte
    Date Created: 01.13.2026
    Date Modified: 01.29.2026
-->

# Philobyte

Philobyte is a compact portfolio/demo site showcasing project status, interactive logic simulations, and a small terminal-style interaction widget.

## Purpose

This site provides a lightweight presentation of projects and experimental modules built with plain HTML, CSS, and vanilla JavaScript. It emphasizes small surface area, accessible markup, and a few interactive demos (Logic Lab and Terminal).

## Features

- Hero landing with logo and call-to-action buttons.
- Interactive "Logic Lab" canvas with simple simulations (procedural dungeon grid, market simulation).
- Operations tracker showing project statuses and progress bars.
- Terminal-style widget for quick interactions and an "uplink" flow that composes an email.
- Timeline and documentation sections for releases/notes.

## Changelog (summary of current features)

All items below reflect the present content as of 2026-01-29.

- `index.html`
  - Structured semantic sections: hero, about, logic lab, tracker, timeline, footer.
  - Includes small terminal modal and interactive controls wired to `assets/js/script.js`.

- `assets/css/styles.css`
  - Theme variables and responsive styles for desktop and mobile.
  - Card, grid, and utility classes for layout and simple animations.

- `assets/js/script.js`
  - Logic for the interactive lab simulations, terminal widget, and small UI helpers.
  - Uplink flow composes a `mailto:` link and copies the message to clipboard as a backup.

## Credit

- Development & Design: Martin Belt

## Notes & Next Steps

- To preview, open `index.html` in a browser. No build step required.
- Suggested improvements: move inline handlers to unobtrusive event listeners, extract simulation code into small modules, and add basic tests or a simple build pipeline for minification.

If you'd like, I can remove remaining inline event handlers, consolidate assets, or add a tiny automated build step (npm + terser/cleancss) and provide commands to run it.
