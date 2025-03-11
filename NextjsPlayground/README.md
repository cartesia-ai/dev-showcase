# Cartesia NextJS Template

This is a [Next.js](https://nextjs.org) project template showcasing [Cartesia](https://cartesia.io) text-to-speech (TTS) capabilities integrated with a modern React application.

## Features

- **Text-to-Speech Generation**: Convert text to lifelike speech using Cartesia's AI models
- **Multiple Language Support**: Generate speech in various languages
- **Emotion Control**: Adjust the emotional tone of the generated speech
- **Speed Control**: Customize speech pace from slow to fast
- **Responsive Design**: Works on mobile and desktop devices
- **Multiple Model Support**: Choose between different Cartesia voice models

## Tech Stack

- [Next.js 15](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Cartesia JS](https://www.npmjs.com/package/@cartesia/cartesia-js) - AI speech generation library
- [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/) - JavaScript runtime & package manager

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone this repository
2. Install dependencies:

```bash
bun install
```

### Development Server

Run the development server with:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

```bash
bun run build
```

### Running Production Build

```bash
bun start
```

## Project Structure

- `src/app/` - Main application code
  - `components/` - UI components for TTS interface
  - `hooks/` - Custom React hooks (including useAudio)
  - `actions.ts` - Server actions for Cartesia API integration
  - `constants/` - Application constants and configuration

## Learn More

- [Cartesia Documentation](https://docs.cartesia.io) - learn about Cartesia API features
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [React Documentation](https://react.dev/) - learn about React

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
