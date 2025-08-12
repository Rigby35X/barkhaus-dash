import React from 'react';
import { Heart, Users, DollarSign, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total Pets',
      value: '127',
      change: '+12%',
      changeType: 'increase',
      icon: Heart,
      color: 'text-primary-600',
      href: '/app/pets'
    },
    {
      name: 'Active Volunteers',
      value: '48',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'text-success-600',
      href: '/app/applications'
    },
    {
      name: 'Monthly Donations',
      value: '$12,450',
      change: '+23%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-warning-600',
      href: '/app/campaigns'
    },
    {
      name: 'Adoptions This Month',
      value: '18',
      change: '+5%',
      changeType: 'increase',
      icon: Calendar,
      color: 'text-secondary-600',
      href: '/app/applications'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'adoption',
      message: 'Bella (Golden Retriever) was adopted by the Johnson family',
      time: '2 hours ago',
      icon: Heart,
      color: 'text-success-600',
      href: '/app/pets'
    },
    {
      id: 2,
      type: 'donation',
      message: 'New donation of $500 received from Sarah M.',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'text-warning-600',
      href: '/app/campaigns'
    },
    {
      id: 3,
      type: 'volunteer',
      message: 'Mike Chen signed up as a new volunteer',
      time: '6 hours ago',
      icon: Users,
      color: 'text-primary-600',
      href: '/app/applications'
    },
    {
      id: 4,
      type: 'medical',
      message: 'Max (German Shepherd) completed vaccination schedule',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'text-secondary-600',
      href: '/app/pets'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Adoption Event at Central Park',
      date: 'Tomorrow, 10:00 AM',
      volunteers: 12,
      href: '/app/campaigns'
    },
    {
      id: 2,
      title: 'Volunteer Training Session',
      date: 'Friday, 2:00 PM',
      volunteers: 8,
      href: '/app/applications'
    },
    {
      id: 3,
      title: 'Fundraising Gala',
      date: 'Next Saturday, 6:00 PM',
      volunteers: 25,
      href: '/app/campaigns'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Pet',
      icon: Heart,
      color: 'btn-primary',
      href: '/app/pets'
    },
    {
      title: 'Review Applications',
      icon: Users,
      color: 'btn-secondary',
      href: '/app/applications'
    },
    {
      title: 'Create Campaign',
      icon: DollarSign,
      color: 'btn-success',
      href: '/app/campaigns'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bebas uppercase text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at your rescue.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="stat-card cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(stat.href)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                    <span className="text-sm font-medium text-success-600">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-50`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-xl font-bebas uppercase text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  onClick={() => navigate(activity.href)}
                >
                  <div className={`p-2 rounded-full bg-gray-50`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <h2 className="text-xl font-bebas uppercase text-gray-900 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => navigate(event.href)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{event.volunteers}</p>
                  <p className="text-xs text-gray-500">volunteers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bebas uppercase text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button 
                key={action.title}
                onClick={() => navigate(action.href)}
                className={`${action.color} flex items-center justify-center space-x-2`}
              >
                <Icon className="h-5 w-5" />
                <span>{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;