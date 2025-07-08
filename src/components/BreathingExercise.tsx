import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const { user } = useAuth();

  const phases = {
    inhale: { duration: 4, next: 'hold', text: 'Breathe In', color: 'from-blue-400 to-cyan-400' },
    hold: { duration: 4, next: 'exhale', text: 'Hold', color: 'from-purple-400 to-pink-400' },
    exhale: { duration: 6, next: 'inhale', text: 'Breathe Out', color: 'from-green-400 to-emerald-400' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            const currentPhase = phases[phase];
            const nextPhase = currentPhase.next as 'inhale' | 'hold' | 'exhale';
            setPhase(nextPhase);
            
            if (nextPhase === 'inhale') {
              setCycle(prev => prev + 1);
              setTotalCycles(prev => prev + 1);
            }
            
            return phases[nextPhase].duration;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleBreathing = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    
    if (newIsActive) {
      setSessionStartTime(new Date());
    } else if (sessionStartTime && user) {
      saveBreathingSession();
    }
  };

  const resetBreathing = () => {
    if (isActive && sessionStartTime && user) {
      saveBreathingSession();
    }
    setIsActive(false);
    setPhase('inhale');
    setSeconds(4);
    setCycle(0);
    setSessionStartTime(null);
  };

  const saveBreathingSession = async () => {
    if (!user || !sessionStartTime) return;

    const durationMinutes = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
    
    try {
      await supabase
        .from('breathing_sessions')
        .insert({
          user_id: user.id,
          cycles_completed: cycle,
          duration_minutes: Math.max(1, durationMinutes)
        });
    } catch (error) {
      console.error('Error saving breathing session:', error);
    }
  };

  const currentPhase = phases[phase];
  const progress = ((currentPhase.duration - seconds) / currentPhase.duration) * 100;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl">
        <div className="text-center">
          <Wind className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign in to track your breathing</h3>
          <p className="text-gray-600">Your breathing sessions will be saved securely</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
          <Wind className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Breathing Exercise</h2>
          <p className="text-sm text-gray-600">4-4-6 breathing pattern</p>
        </div>
      </div>

      {/* Breathing Circle */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-48 h-48 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div 
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentPhase.color} transition-all duration-1000 ease-in-out`}
            style={{
              transform: `scale(${phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 0.8})`,
              opacity: 0.8
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">{seconds}</div>
              <div className="text-sm font-medium text-gray-600">{currentPhase.text}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${currentPhase.color} transition-all duration-1000`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-800 mb-2">{currentPhase.text}</p>
          <p className="text-sm text-gray-600">
            {phase === 'inhale' && "Slowly breathe in through your nose"}
            {phase === 'hold' && "Hold your breath gently"}
            {phase === 'exhale' && "Slowly breathe out through your mouth"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={toggleBreathing}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetBreathing}
            className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Current Session</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{cycle}</div>
            <div className="text-sm text-gray-600">Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">
              {sessionStartTime ? Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000) : 0}
            </div>
            <div className="text-sm text-gray-600">Minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;