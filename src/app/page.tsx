import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Event Organizer Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Manage your events with ease and efficiency
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
        >
          Start your journey
        </Link>
      </div>
    </div>
  );
}
