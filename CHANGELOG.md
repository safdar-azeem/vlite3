# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **View Code Feature**: Added a toggle button (`< >`) to all playground demo sections to inspect the source code of the component examples.
  - Implemented `DemoSection.vue` wrapper component with collapsible code panel and "Copy to Clipboard" functionality.
  - Added syntax highlighting for Vue SFC code (template, script, style) using a custom lightweight highlighter.
  - Implemented intelligent code snippet extraction to show only relevant code for each demo section.
- **Refactoring**: Automated refactoring of 47 demo files to use the new `DemoSection` wrapper and expose raw source code via Vite imports.

### Fixed

- Fixed inconsistent section grouping in several demo files (`HeatmapDemo`, `PricingPlanDemo`, `ModalDemo`, etc.) during the automated refactoring process.
- Fixed specific layout issues in `HeatmapDemo.vue` (restored missing responsive container wrapper).
- Fixed syntax highlighting rendering issue where HTML tags were being escaped incorrectly.
