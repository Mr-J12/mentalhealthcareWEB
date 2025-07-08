import React, { useState } from 'react';
import { Smile, Meh, Frown, TrendingUp, Calendar } from 'lucide-react';
import { supabase, MoodEntry } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      loadMoodHistory();
    }
  }, [user]);

  const loadMoodHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoodHistory(data || []);
    } catch (error) {
      console.error('Error loading mood history:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodOptions = [
    { value: 1, label: 'Very Low', icon: Frown, color: 'text-red-500', bg: 'bg-red-50' },
    { value: 2, label: 'Low', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50' },
    { value: 3, label: 'Okay', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { value: 4, label: 'Good', icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
    { value: 5, label: 'Excellent', icon: Smile, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const handleMoodSubmit = async () => {
    if (!selectedMood || !user) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_level: selectedMood,
          note: moodNote
        })
        .select()
        .single();

      if (error) throw error;

      setMoodHistory(prev => [data, ...prev]);
      setSelectedMood(null);
      setMoodNote('');
    } catch (error) {
      console.error('Error saving mood entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const averageMood = moodHistory.length > 0 
    ? moodHistory.reduce((sum, entry) => sum + entry.mood_level, 0) / moodHistory.length 
    : 0;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign in to track your mood</h3>
          <p className="text-gray-600">Your mood data will be saved securely</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your mood history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Mood Tracker</h2>
          <p className="text-sm text-gray-600">How are you feeling today?</p>
        </div>
      </div>

      {/* Mood Selection */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Select your current mood:</p>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedMood(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMood === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${option.bg}`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${option.color}`} />
                <span className="text-xs font-medium text-gray-700">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Note */}
      {selectedMood && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's contributing to this mood? (optional)
          </label>
          <textarea
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Share your thoughts..."
          />
          <button
            onClick={handleMoodSubmit}
            disabled={saving}
            className="mt-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Mood'}
          </button>
        </div>
      )}

      {/* Mood Statistics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Your Progress</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {moodHistory.length > 0 ? averageMood.toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600">Average Mood</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{moodHistory.length}</div>
            <div className="text-sm text-gray-600">Days Tracked</div>
          </div>
        </div>
      </div>

      {/* Recent Mood History */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Recent Entries</h3>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {moodHistory.slice(0, 5).map((entry, index) => {
            const mood = moodOptions.find(m => m.value === entry.mood_level);
            const Icon = mood?.icon || Meh;
            return (
              <div key={entry.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <Icon className={`w-5 h-5 ${mood?.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">{mood?.label}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-gray-600 mt-1">{entry.note}</p>
                  )}
                </div>
              </div>
            );
          })}
          {moodHistory.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No mood entries yet. Start tracking your mood above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;