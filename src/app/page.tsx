import dynamic from 'next/dynamic';

// Dynamically import the HomePage component to avoid SSG issues with Clerk
const HomePage = dynamic(() => import('@/components/HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading ThermoChef...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <HomePage />;
}