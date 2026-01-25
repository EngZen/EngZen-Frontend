# EngZen Frontend

A modern, multilingual English learning platform built with Next.js 16, featuring authentication, dark mode, and internationalization.

## Features

- **Authentication System** - Complete auth flow with login, signup, password reset, and remember me functionality
- **Internationalization** - Support for English and Vietnamese using next-intl
- **Dark Mode** - Theme switching with light, dark, and system modes using next-themes
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **Type Safety** - Full TypeScript support with Zod validation
- **Code Quality** - Biome for fast linting and formatting
- **State Management** - React Query (TanStack Query) for server state
- **Responsive Design** - Mobile-first approach with modern layouts

## Tech Stack

- **Framework:** Next.js 16.1.3 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI + shadcn/ui
- **Forms:** React Hook Form + Zod
- **State Management:** TanStack React Query
- **Internationalization:** next-intl
- **Theme:** next-themes
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm

## Prerequisites

- Node.js 20.9.0 or higher
- pnpm 9.15.9 or higher

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/EngZen/EngZen-Frontend.git
cd engzen-frontend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Lint changed files
- `pnpm lint:all` - Lint all files
- `pnpm format` - Format changed files
- `pnpm format:all` - Format all files
- `pnpm check` - Run both lint and format on changed files
- `pnpm check:all` - Run both lint and format on all files

## Project Structure

```
engzen-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   └── [locale]/          # Locale-based routing
│   │       └── (auth)/        # Auth route group
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── providers/        # Context providers
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization config
│   ├── lib/                  # Utility functions
│   └── proxy.ts              # API proxy configuration
├── messages/                  # Translation files
│   ├── en.json               # English translations
│   └── vi.json               # Vietnamese translations
├── public/                    # Static assets
└── biome.json                # Biome configuration
```

## Configuration

### Biome

The project uses Biome for fast linting and formatting. Configuration is in `biome.json`.

### Internationalization

Supported locales: `en` (English), `vi` (Vietnamese)

Translation files are located in the `messages/` directory.

### Theme

The app supports three theme modes:
- Light mode
- Dark mode
- System (follows OS preference)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Contact

EngZen Team - [GitHub](https://github.com/EngZen)
