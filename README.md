# webCV Frontend

## About

webCV frontend for a portfolio website generator designed for IT professionals. It is built as an engineering thesis deliverable.

Users, after logging in, can fill out their data (basic info, experience, etc.), and then generate a working HTML+CSS+JS personal portfolio website.

Additionally, webCV has an AI CV analyzer built-in, enabling rapid portfolio website data autofill without having to fill all the fields manually.

The core philosophy behind webCV is **user independence** — there is no vendor lock-in, meaning users fully own and control their generated static sites. There is an option to generate a ZIP package for any file hosting, or a one-click deploy to GitHub Pages (free static hosting).

## Tech Stack

This application is built with Single-Page App frontend architecture:

- **Framework:** React
- **Build tool**: Vite
- **Form handling & validation**: react-hook-form + zod
- **Routing**: TanStack Router file-based
- **API Client & Server State Management**: swagger-typescript-api + TanStack Query
- **UI**: shadcn/ui, tailwindcss v4, lucide-react, Stack Sans fonts
- **i18n**: i18next (Polish only)
- **Package manager**: pnpm
- **Deployment**: Azure Container App (Docker) + GitHub Actions workflow

## Setup & Installation

### Backend Setup

First, ensure you have the backend API running (see [webcv-backend](https://github.com/rico-et22/webcv-backend)).

### Docker Installation (production mode only)

This application is fully containerized with a `Dockerfile`.
To run the application via Docker:

1. Clone the repository.
   ```bash
   git clone <repository-url>
   cd webcv-frontend
   ```
2. Ensure your `.env` file is fully configured. (see `.env.example` and dev mode instructions below)
3. Run the application using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
   This will build the production image and spin up the frontend on port `8080`.

### Local / Dev Mode Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd webcv-frontend
   ```

2. **Install dependencies**
   This project STRICTLY uses `pnpm` for package management.

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in the required keys:

   ```bash
   cp .env.example .env
   ```

- `VITE_API_URL` - URL of the backend API (e.g. `http://localhost:3000`)
- `VITE_GITHUB_CLIENT_ID` - GitHub OAuth Client ID

4. **Run the application**

   ```bash
   # watch mode (development)
   pnpm dev

   # build for production
   pnpm build

   # preview production build locally
   pnpm preview
   ```

5. **Access frontend**
   Once the application is running, it will be available at `http://localhost:5173`.

## Acknowledgments & Licensing

This project is licensed under the MIT License.

### AI Co-Development

The following Agentic AI coding assistants provided support during the development process:

- **AI Models:** Gemini 3.1 Pro, Claude Sonnet/Opus 4.6
- **AI Agents/Environments:** Google Antigravity, Gemini CLI
