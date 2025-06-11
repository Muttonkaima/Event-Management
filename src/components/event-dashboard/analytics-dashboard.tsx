'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AnalyticsCard from "./analytics-card";

const AnalyticsDashboard = () => {
  // Sample data for the charts
  const registrationData = [
    { date: 'Jan 1', registrations: 20 },
    { date: 'Jan 2', registrations: 45 },
    { date: 'Jan 3', registrations: 28 },
    { date: 'Jan 4', registrations: 80 },
    { date: 'Jan 5', registrations: 99 },
    { date: 'Jan 6', registrations: 45 },
    { date: 'Today', registrations: 28 },
  ];

  const ticketTypeData = [
    { name: 'VIP', value: 400 },
    { name: 'General', value: 300 },
    { name: 'Student', value: 200 },
    { name: 'Early Bird', value: 100 },
  ];

  const checkInData = [
    { time: '9 AM', checkIns: 120 },
    { time: '10 AM', checkIns: 210 },
    { time: '11 AM', checkIns: 180 },
    { time: '12 PM', checkIns: 150 },
    { time: '1 PM', checkIns: 90 },
    { time: '2 PM', checkIns: 250 },
    { time: '3 PM', checkIns: 320 },
    { time: '4 PM', checkIns: 280 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 25 },
    { name: 'Tablet', value: 10 },
  ];

  const sessions = [
    { name: 'Keynote', attendees: 420, capacity: 500 },
    { name: 'Workshop A', attendees: 180, capacity: 200 },
    { name: 'Panel Discussion', attendees: 150, capacity: 200 },
  ];

  const referrers = [
    { source: 'Social Media', percentage: 45 },
    { source: 'Email Campaign', percentage: 30 },
    { source: 'Direct Traffic', percentage: 15 },
    { source: 'Referral', percentage: 10 },
  ];

  // Define color type for better type safety
  type ColorPalette = {
    [key: string]: string;
    blue: string;
    indigo: string;
    violet: string;
    purple: string;
    fuchsia: string;
    pink: string;
    rose: string;
    amber: string;
    emerald: string;
    teal: string;
    cyan: string;
    sky: string;
  };

  // Color palette
  const COLORS: ColorPalette = {
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    purple: '#a855f7',
    fuchsia: '#d946ef',
    pink: '#ec4899',
    rose: '#f43f5e',
    amber: '#f59e0b',
    emerald: '#10b981',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    sky: '#0ea5e9',
  };
  
  // Get color values as an array for easier iteration
  const COLOR_VALUES = Object.values(COLORS);

  // Color arrays for different charts
  const CHART_COLORS = [COLORS.blue, COLORS.emerald, COLORS.amber, COLORS.rose, COLORS.purple];
  const PIE_COLORS = [COLORS.blue, COLORS.emerald, COLORS.amber, COLORS.rose];
  const DEVICE_COLORS = [COLORS.blue, COLORS.teal, COLORS.amber];
  const BAR_COLORS = [COLORS.indigo, COLORS.violet, COLORS.purple, COLORS.fuchsia];
  
  // Helper function to safely get a color by index
  const getColorByIndex = (index: number, colorArray: string[] = COLOR_VALUES): string => {
    return colorArray[Math.abs(index) % colorArray.length];
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard 
          title="Total Registrations" 
          value="1,245" 
          change="+12% from last month" 
          changeType="positive" 
          icon="user-plus"
          trend="up"
        />
        <AnalyticsCard 
          title="Check-ins" 
          value="876" 
          change="+8.1% from last event" 
          changeType="positive" 
          icon="check-circle"
          trend="up"
        />
        <AnalyticsCard 
          title="Revenue" 
          value="$24,500" 
          change="+19% from last month" 
          changeType="positive" 
          icon="dollar-sign"
          trend="up"
        />
        <AnalyticsCard 
          title="Engagement" 
          value="87%" 
          change="+2.3% from last event" 
          changeType="positive" 
          icon="users"
          trend="up"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Registration Timeline */}
        <Card className="h-[400px] rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Registration Timeline</CardTitle>
            <CardDescription className="text-gray-600">
              Daily registration count over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                  itemStyle={{ color: '#1f2937' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke={COLORS.violet}
                  strokeWidth={2}
                  dot={{ r: 4, fill: COLORS.violet }}
                  activeDot={{ r: 6, fill: COLORS.violet }}
                  name="Registrations"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Registration by Type */}
        <Card className="h-[400px] rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Registration by Type</CardTitle>
            <CardDescription className="text-gray-600">
              Distribution of different ticket types
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ticketTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                  <Tooltip 
                    formatter={(value) => [`${value} registrations`, 'Count']}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                  />
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Check-in Activity */}
      <Card className="w-full rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Check-in Activity</CardTitle>
          <CardDescription className="text-gray-600">
            Hourly check-in patterns during the event
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={checkInData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                formatter={(value) => [`${value} check-ins`, 'Count']}
                labelStyle={{ color: '#1f2937' }}
              />
              <Bar dataKey="checkIns" fill={COLORS.rose} radius={[4, 4, 0, 0]} name="Check-ins" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Top Sessions */}
        <Card className="rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Sessions</CardTitle>
            <CardDescription className="text-gray-600">
              Most attended sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{session.name}</span>
                    <span className="text-gray-600">{session.attendees}/{session.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        backgroundColor: getColorByIndex(i, CHART_COLORS),
                        width: `${(session.attendees / session.capacity) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {Math.round((session.attendees / session.capacity) * 100)}% capacity
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card className="rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Device Usage</CardTitle>
            <CardDescription className="text-gray-600">
              Devices used for check-in
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getColorByIndex(index, DEVICE_COLORS)} 
                    />
                  ))}
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                  />
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card className="rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Referrers</CardTitle>
            <CardDescription className="text-gray-600">
              Where attendees came from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referrers.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.source}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ 
                        backgroundColor: getColorByIndex(index, BAR_COLORS),
                        width: `${item.percentage}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
