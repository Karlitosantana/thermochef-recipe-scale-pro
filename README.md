# Recipe Scale Pro

A web application that converts recipes from any website into optimized Thermomix instructions. Compatible with TM5, TM6, and upcoming TM7 devices.

## Features

- 🔗 **Universal Recipe Parsing** - Convert recipes from any website
- 🤖 **AI-Powered Conversion** - Intelligent conversion to Thermomix instructions
- 🌍 **Multi-Language Support** - Available in 7 languages
- 📱 **Device-Specific Optimization** - Tailored for TM5, TM6, and TM7
- 🖼️ **Image Generation** - Create beautiful recipe images with AI
- 📊 **Nutritional Information** - Automatic calculation per serving

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **AI**: OpenAI GPT-4, Replicate FLUX
- **Payments**: Stripe
- **State Management**: Zustand
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- API keys for: Clerk, OpenAI, Stripe, Replicate

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/recipe-scale-pro.git
cd recipe-scale-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your API keys and database URL

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── lib/             # Core libraries and utilities
├── types/           # TypeScript type definitions
├── store/           # Zustand state management
├── services/        # API services
└── styles/          # Global styles
```

## Pricing Tiers

- **Free**: 5 conversions/month, 25 recipe storage
- **Pro** ($39.99/year): Unlimited conversions and storage
- **Family** ($59.99/year): All Pro features + 5 family accounts

## Legal Compliance

- Not affiliated with Vorwerk or Thermomix®
- Recipe conversions are transformative fair use
- GDPR compliant with full data control
- Clear attribution to original recipe sources

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

This project is licensed under the MIT License.