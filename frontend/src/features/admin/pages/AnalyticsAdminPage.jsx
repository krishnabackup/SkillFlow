import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getEnrollemtsStatus, getSummary, getTopCourses } from '../../../services/analytics';

export default function AdminAnalytics() {
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
       try {
        const fetchAllAnalytics = async () => {
           const summary = await getSummary()
           const topCourses = await getTopCourses({limit : 10})
           const enrollmentStatus =  await getEnrollemtsStatus({range : 30})
           setSummary(summary)
           setTopCourses(topCourses)
           setSeries(enrollmentStatus)
        }
        fetchAllAnalytics()
       }
       catch(error) {
        console.log("Error fetching",error)
       }
       
  }, []);

  if (!summary) return <div>Loading analytics...</div>;

  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card title="Total Users" value={summary.totalUsers} />
        <Card title="Active Users (30d)" value={summary.activeUsers} />
        <Card title="Total Enrollments" value={summary.totalEnrollments} />
        <Card title="Courses" value={summary.coursesCount} />
        <Card title="Avg Completion" value={`${summary.avgCompletion}%`} />
      </div>

      {/* Enrollments Over Time */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-white">Daily Enrollments</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={series}>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#00bcd4" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Courses */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4 text-white">Top Courses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topCourses}>
            <XAxis dataKey="title" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="enrollments" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Reusable small Card component
const Card = ({ title, value }) => (
  <div className="bg-gray-800 text-center p-4 rounded-lg shadow">
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-white text-2xl font-semibold">{value}</p>
  </div>
);
