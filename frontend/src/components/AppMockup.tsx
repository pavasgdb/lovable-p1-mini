import React from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share, 
  Star,
  Calendar,
  CheckSquare,
  Settings,
  Home,
  TrendingUp,
  ShoppingCart,
  Camera,
  Music,
  MapPin,
  Clock,
  Filter,
  Menu
} from 'lucide-react';
import { GeneratedApp } from '../types';

interface AppMockupProps {
  app: GeneratedApp;
}

const AppMockup: React.FC<AppMockupProps> = ({ app }) => {
  const getAppType = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('task') || lowerPrompt.includes('todo') || lowerPrompt.includes('productivity')) return 'task';
    if (lowerPrompt.includes('social') || lowerPrompt.includes('chat') || lowerPrompt.includes('message')) return 'social';
    if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store')) return 'ecommerce';
    if (lowerPrompt.includes('fitness') || lowerPrompt.includes('health') || lowerPrompt.includes('workout')) return 'fitness';
    if (lowerPrompt.includes('recipe') || lowerPrompt.includes('food') || lowerPrompt.includes('cooking')) return 'recipe';
    if (lowerPrompt.includes('budget') || lowerPrompt.includes('finance') || lowerPrompt.includes('expense')) return 'finance';
    if (lowerPrompt.includes('music') || lowerPrompt.includes('audio') || lowerPrompt.includes('playlist')) return 'music';
    if (lowerPrompt.includes('travel') || lowerPrompt.includes('trip') || lowerPrompt.includes('booking')) return 'travel';
    return 'dashboard';
  };

  const appType = getAppType(app.prompt);
  const [primaryColor, secondaryColor, lightColor, accentColor] = app.themeColors;

  const renderTaskApp = () => (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: lightColor }}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>My Tasks</h1>
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          </div>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
          <button 
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="space-y-3">
          {[
            { title: 'Review project proposal', completed: false, priority: 'high' },
            { title: 'Update team documentation', completed: true, priority: 'medium' },
            { title: 'Schedule client meeting', completed: false, priority: 'low' },
            { title: 'Prepare presentation slides', completed: false, priority: 'high' }
          ].map((task, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <CheckSquare 
                className={`w-5 h-5 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
              />
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">2:00 PM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Home className="w-5 h-5" style={{ color: primaryColor }} />
            <span className="text-xs" style={{ color: primaryColor }}>Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Calendar</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Analytics</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSocialApp = () => (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>{app.name}</h1>
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Stories */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          {['Your Story', 'Alice', 'Bob', 'Carol', 'David'].map((name, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 min-w-0">
              <div 
                className={`w-16 h-16 rounded-full border-2 ${index === 0 ? 'border-gray-300' : 'border-pink-500'} p-1`}
              >
                <div 
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: index === 0 ? '#f3f4f6' : primaryColor }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3].map((post) => (
          <div key={post} className="border-b border-gray-200 pb-4">
            {/* Post Header */}
            <div className="flex items-center space-x-3 px-6 py-4">
              <div className="w-10 h-10 rounded-full" style={{ backgroundColor: primaryColor }}></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">user_{post}</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <button>
                <Menu className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Post Image */}
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 mx-6 rounded-lg mb-4"></div>

            {/* Post Actions */}
            <div className="px-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <Heart className="w-6 h-6 text-gray-600" />
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                  <Share className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="font-semibold text-gray-900 mb-1">1,234 likes</p>
              <p className="text-gray-900">
                <span className="font-semibold">user_{post}</span> Check out this amazing view! 
                <span className="text-blue-600"> #travel #nature</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEcommerceApp = () => (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4" style={{ backgroundColor: lightColor }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>{app.name}</h1>
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-600" />
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span 
                className="absolute -top-2 -right-2 w-4 h-4 text-xs text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                3
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto">
          {['Electronics', 'Fashion', 'Home', 'Sports', 'Books'].map((category, index) => (
            <button 
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                index === 0 ? 'text-white' : 'text-gray-600 bg-gray-100'
              }`}
              style={index === 0 ? { backgroundColor: primaryColor } : {}}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
          <Filter className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((product) => (
            <div key={product} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute top-2 right-2">
                  <Heart className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1">Product {product}</h3>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-500">(4.5)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: primaryColor }}>$99.99</span>
                  <button 
                    className="px-3 py-1 text-xs text-white rounded-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboardApp = () => (
    <div className="bg-gray-50 h-full flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>{app.name}</h1>
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Total Users', value: '12,345', change: '+12%', color: primaryColor },
            { label: 'Revenue', value: '$45,678', change: '+8%', color: secondaryColor },
            { label: 'Orders', value: '1,234', change: '+15%', color: accentColor },
            { label: 'Growth', value: '23%', change: '+5%', color: '#10B981' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <TrendingUp className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h3>
          <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { action: 'New user registered', time: '2 min ago' },
              { action: 'Order #1234 completed', time: '5 min ago' },
              { action: 'Payment received', time: '10 min ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-900">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppMockup = () => {
    switch (appType) {
      case 'task':
        return renderTaskApp();
      case 'social':
        return renderSocialApp();
      case 'ecommerce':
        return renderEcommerceApp();
      case 'fitness':
      case 'recipe':
      case 'finance':
      case 'music':
      case 'travel':
      default:
        return renderDashboardApp();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-900 rounded-2xl p-2 shadow-2xl">
      {/* Phone Frame */}
      <div className="bg-black rounded-xl p-1">
        <div className="bg-white rounded-lg overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          {/* Status Bar */}
          <div className="bg-black text-white px-4 py-1 flex items-center justify-between text-xs">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
          
          {/* App Content */}
          <div className="flex-1 h-full">
            {renderAppMockup()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMockup;