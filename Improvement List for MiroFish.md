# Improvement List for MiroFish

This document tracks the improvements and changes synchronized from the local development environment.

## Backend Improvements

### Configuration (`backend/app/config.py`)
- **Fixed Secret Key**: Changed `SECRET_KEY` from random generation to a fixed default `'mirofish-secret-key'` to prevent session invalidation during restarts in development.
- **Debug Mode**: Changed default `FLASK_DEBUG` from `False` to `True` for better developer experience.

### Error Handling (`backend/app/api/*.py`)
- **Standardized Responses**: Updated `graph.py`, `report.py`, and `simulation.py` to use a consistent error response format.
- **Enhanced Debugging**: API error responses now consistently include full tracebacks (without conditional checks), simplifying debugging for frontend errors.

### Runtime (`backend/run.py`)
- Adjusted imports and startup logic (synchronized with local version).

## Deployment

### Docker (`Dockerfile`)
- **Root Permissions**: Removed `appuser` creation and switching. The container now runs as root, simplifying volume permission management during development.

## Data & Simulation
- **New Simulation Data**: Imported new simulation state (`sim_8e926fb8f26a`) and report (`report_2b0d0a6c3422`) for testing and analysis.
