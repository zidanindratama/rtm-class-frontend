# Changelog

All notable frontend changes are documented in this file.

## [2026-03-09]
### Added
- Assignment pages under `my-class`:
  - class assignments list
  - assignment detail page
  - student workspace route (`/assignments/:assignmentId/work`) with paged solving flow
  - teacher/admin grading workspace route (`/assignments/:assignmentId/grade`)
  - student submission flow
  - teacher/admin grading flow
- Assignment frontend contract updates:
  - typed submission payload (`answers.format`)
  - attempt history support (`my-attempts`)
  - attachment and per-question grading type support
- Public blog listing and detail integration.
- Class join and my-class flow improvements.
- Class members page and related class action routes.

### Changed
- Assignment UX overhaul:
  - assignment detail page no longer lists long question blocks
  - student solves questions in dedicated workspace page
  - essay pagination set to 5 questions per page in workspace
  - teacher/admin grading moved out from detail page into dedicated grading workspace
  - quick grade layout updated to vertical stack (`score` above `feedback`) for readability
  - student `My Submission` now shows teacher general feedback (`submission.feedback`)
  - submission answers are rendered in human-readable cards (not raw JSON)
- Assignment module refactor:
  - split oversized assignment pages into shared section components/utilities
  - centralized assignment question payload and draft parsing helpers
- Dashboard class detail layout refactor:
  - cleaner top summary
  - reduced redundant sections
  - class actions redesigned for better discoverability
- Sidebar visual style aligned to project branding (soft pastel blue direction).
- Active navigation behavior improved for nested `my-class/*` routes.
- Placeholder copy and form language standardized to English across modules.
- Class/blog form layout and spacing improved for consistency.

### Fixed
- Build-time typing issues in forum and assignment components.
- Role-based action visibility and route behavior consistency in class pages.

## [2026-03-08]
### Added
- Docker deployment files and deployment guide for frontend runtime.

### Changed
- Environment configuration and production compose setup.
