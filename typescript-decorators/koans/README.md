# Koan Directory Pattern

Each numbered koan directory uses the same files:

- `README.md`: the concept and the exercise prompt
- `exercise.ts`: the implementation the test imports
- `exercise.test.ts`: executable assertions for the behavior
- `solution.ts`: a reference implementation for comparison
- `notes.md`: reflection prompts after the test passes

Modern standard decorator koans are numbered from `01` upward. Legacy experimental decorator koans are numbered from `90` upward so the boundary stays visible.
