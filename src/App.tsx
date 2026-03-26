import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  Droplets, 
  Scale, 
  Plus, 
  Calendar, 
  ChevronRight, 
  Brain,
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { HealthMetric, HealthNote, HealthInsight } from './types';
import { getHealthInsights } from './services/gemini';

// Mock Data
const MOCK_METRICS: HealthMetric[] = [
  { id: '1', type: 'steps', value: 8432, unit: 'steps', timestamp: new Date() },
  { id: '2', type: 'heartRate', value: 72, unit: 'bpm', timestamp: new Date() },
  { id: '3', type: 'sleep', value: 7.5, unit: 'hrs', timestamp: new Date() },
  { id: '4', type: 'water', value: 1.8, unit: 'L', timestamp: new Date() },
  { id: '5', type: 'weight', value: 70.5, unit: 'kg', timestamp: new Date() },
];

const CHART_DATA = [
  { day: 'Mon', steps: 6500, sleep: 7 },
  { day: 'Tue', steps: 8200, sleep: 6.5 },
  { day: 'Wed', steps: 7800, sleep: 8 },
  { day: 'Thu', steps: 9100, sleep: 7.5 },
  { day: 'Fri', steps: 10500, sleep: 7 },
  { day: 'Sat', steps: 12000, sleep: 8.5 },
  { day: 'Sun', steps: 8432, sleep: 7.5 },
];

export default function App() {
  const [metrics, setMetrics] = useState<HealthMetric[]>(MOCK_METRICS);
  const [notes, setNotes] = useState<HealthNote[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'journal' | 'stats'>('dashboard');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', mood: 'good' as any });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    const result = await getHealthInsights(metrics, notes);
    setInsights(result);
    setIsLoadingInsights(false);
  };

  const addNote = () => {
    if (!newNote.title || !newNote.content) return;
    const note: HealthNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: newNote.title,
      content: newNote.content,
      mood: newNote.mood,
      timestamp: new Date(),
    };
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', mood: 'good' });
    setShowAddNote(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 md:pb-0 md:pl-20">
      {/* Sidebar / Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:w-20 bg-white border-t md:border-t-0 md:border-r border-slate-200 z-50 flex md:flex-col items-center justify-around md:justify-center gap-8 p-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Activity size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('journal')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'journal' ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <MessageSquare size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`p-3 rounded-2xl transition-all ${activeTab === 'stats' ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <TrendingUp size={24} />
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Vitalis</h1>
            <p className="text-slate-500">Welcome back, your health summary is ready.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2 text-sm font-medium text-slate-600 shadow-sm">
              <Calendar size={16} className="text-brand-500" />
              {format(new Date(), 'EEEE, MMM do')}
            </div>
            <button 
              onClick={() => setShowAddNote(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-full shadow-lg shadow-brand-200 transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Quick Stats Grid */}
            <section className="metric-grid">
              <MetricCard 
                icon={<Activity className="text-orange-500" />} 
                label="Steps" 
                value="8,432" 
                unit="steps" 
                trend="+12%" 
                color="orange"
              />
              <MetricCard 
                icon={<Heart className="text-red-500" />} 
                label="Heart Rate" 
                value="72" 
                unit="bpm" 
                trend="Stable" 
                color="red"
              />
              <MetricCard 
                icon={<Moon className="text-indigo-500" />} 
                label="Sleep" 
                value="7.5" 
                unit="hrs" 
                trend="+5%" 
                color="indigo"
              />
              <MetricCard 
                icon={<Droplets className="text-blue-500" />} 
                label="Water" 
                value="1.8" 
                unit="L" 
                trend="80%" 
                color="blue"
              />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800">Activity Overview</h3>
                  <select className="bg-slate-50 border-none text-sm rounded-lg focus:ring-0">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA}>
                      <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="steps" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSteps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-brand-700 text-white p-6 rounded-3xl shadow-xl shadow-brand-100 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Brain size={20} className="text-brand-200" />
                  <h3 className="font-semibold">AI Health Insights</h3>
                </div>
                
                <div className="flex-1 space-y-4">
                  {isLoadingInsights ? (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-brand-600/50 rounded-2xl" />
                      ))}
                    </div>
                  ) : insights.length > 0 ? (
                    insights.map((insight, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="bg-brand-600/40 p-4 rounded-2xl border border-brand-500/30"
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-200 mb-1">{insight.category}</p>
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-brand-100 leading-relaxed">{insight.description}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-brand-200 text-sm">No insights available yet. Keep tracking your data!</p>
                  )}
                </div>
                
                <button 
                  onClick={fetchInsights}
                  className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                >
                  Refresh Insights
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold">Health Journal</h2>
              <button 
                onClick={() => setShowAddNote(true)}
                className="text-brand-600 font-medium flex items-center gap-1"
              >
                <Plus size={18} /> New Entry
              </button>
            </div>

            <AnimatePresence>
              {notes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                  <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">Your journal is empty. Start writing today!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={note.id} 
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {format(note.timestamp, 'MMM d, h:mm a')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        note.mood === 'great' ? 'bg-green-100 text-green-700' :
                        note.mood === 'good' ? 'bg-blue-100 text-blue-700' :
                        note.mood === 'neutral' ? 'bg-slate-100 text-slate-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {note.mood}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{note.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{note.content}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold">Detailed Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold mb-6">Sleep Quality</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold mb-6">Weekly Goal Progress</h3>
                <div className="space-y-6">
                  <GoalProgress label="Steps" current={58432} target={70000} color="bg-orange-500" />
                  <GoalProgress label="Water" current={12.5} target={14} color="bg-blue-500" />
                  <GoalProgress label="Sleep" current={52} target={56} color="bg-indigo-500" />
                  <GoalProgress label="Workouts" current={3} target={5} color="bg-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddNote && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-serif font-bold mb-6">New Journal Entry</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newNote.title}
                    onChange={e => setNewNote({...newNote, title: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-500"
                    placeholder="How are you feeling?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Mood</label>
                  <div className="flex gap-2">
                    {['great', 'good', 'neutral', 'bad', 'awful'].map(m => (
                      <button 
                        key={m}
                        onClick={() => setNewNote({...newNote, mood: m as any})}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                          newNote.mood === m ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Content</label>
                  <textarea 
                    rows={4}
                    value={newNote.content}
                    onChange={e => setNewNote({...newNote, content: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-500"
                    placeholder="Write your thoughts..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowAddNote(false)}
                  className="flex-1 py-4 text-slate-500 font-medium hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={addNote}
                  className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all"
                >
                  Save Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, trend, color }: any) {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-500',
    red: 'bg-red-50 text-red-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    blue: 'bg-blue-50 text-blue-500',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${colorClasses[color]?.split(' ')[0] || 'bg-slate-50'}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
          trend.includes('+') ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'
        }`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          <span className="text-sm text-slate-400">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function GoalProgress({ label, current, target, color }: any) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-400">{current} / {target}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
