## Packages
framer-motion | For complex animations and page transitions
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes

## Notes
- The app uses a dark/light mode compatible theme but defaults to a dark, modern aesthetic with gradients.
- API endpoints are defined in `@shared/routes`.
- The 'result' field in `ProjectIdea` is a JSONB column, so the frontend needs to parse/type it correctly as `IdeaResult`.
