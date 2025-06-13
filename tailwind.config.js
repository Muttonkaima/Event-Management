module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-gradient-to-r',
    'from-indigo-900', 'to-purple-300',
    'bg-indigo-900','bg-gray-600',
    'from-cyan-900', 'to-blue-300',
    'bg-blue-900',
    'bg-teal-600',
    'from-orange-900', 'to-red-300',
    'bg-red-900',
    'bg-yellow-500',
    'from-green-900', 'to-emerald-300',
    'bg-emerald-900',
    'bg-lime-500',
    'from-blue-500', 'to-green-500',
    'from-pink-500', 'to-yellow-500',
    'from-purple-500', 'to-orange-500',
    'from-red-500', 'to-indigo-500',
    'from-green-400', 'to-blue-400',
    'from-yellow-400', 'to-pink-400',
    // Add any other gradient classes you use dynamically here
  ],
  plugins: [],
};
