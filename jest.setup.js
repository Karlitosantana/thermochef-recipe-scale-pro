import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }) => <div data-testid="sign-in-button">{children}</div>,
  SignUpButton: ({ children }) => <div data-testid="sign-up-button">{children}</div>,
  UserButton: () => <div data-testid="user-button" />,
  auth: () => Promise.resolve({ userId: 'test-user-id' }),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'