import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening with your events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Total Events', value: '24', change: '+12%', trend: 'up' },
          { title: 'Upcoming Events', value: '8', change: '+3', trend: 'up' },
          { title: 'Attendees', value: '1,254', change: '+8.2%', trend: 'up' },
          { title: 'Completion Rate', value: '92%', change: '+5%', trend: 'up' },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              <span className={`ml-2 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Events</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendees</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { name: 'Tech Conference 2023', date: 'Jun 15, 2023', attendees: '245', status: 'Upcoming' },
                  { name: 'Product Launch', date: 'May 28, 2023', attendees: '189', status: 'Completed' },
                  { name: 'Team Workshop', date: 'May 20, 2023', attendees: '32', status: 'Completed' },
                ].map((event, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{event.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{event.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{event.attendees}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === 'Upcoming' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {[
              { 
                title: 'Tech Conference 2023', 
                date: 'Jun 15, 2023', 
                time: '9:00 AM - 5:00 PM',
                location: 'Convention Center, Bangalore'
              },
              { 
                title: 'Team Meetup', 
                date: 'Jun 22, 2023', 
                time: '2:00 PM - 4:00 PM',
                location: 'Office, 3rd Floor'
              },
              { 
                title: 'Client Presentation', 
                date: 'Jun 28, 2023', 
                time: '11:00 AM - 12:30 PM',
                location: 'Conference Room A'
              },
            ].map((event, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{event.date} • {event.time}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.location}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            View all events
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
