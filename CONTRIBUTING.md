# Contributing to MiroFish

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to MiroFish. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Setup the environment**:
    ```bash
    npm run easy
    ```
    This script will help you configure your `.env` file and install all dependencies for both frontend and backend.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Project Structure

*   **`backend/`**: Python Flask application.
    *   Uses `uv` for dependency management.
    *   Requires Python 3.12 (pinned in `.python-version`).
*   **`frontend/`**: Vue 3 + Vite application.
    *   Uses `npm` for dependency management.
*   **`static/`**: Static assets.

## Development Workflow

1.  Create a new branch for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
2.  Make your changes.
3.  Run tests (if applicable):
    *   Backend: `cd backend && uv run pytest`
4.  Commit your changes using clear commit messages.

## Code Style

*   **Python**: Follow PEP 8.
*   **JavaScript/Vue**: Follow standard Vue 3 practices.

## Pull Requests

1.  Push your branch to your fork.
2.  Open a Pull Request against the `main` branch.
3.  Describe your changes clearly in the PR description.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub.
