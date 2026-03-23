"use client";

// App.tsx
import React, { useState } from 'react';
import AddExpenseView from './AddExpenseView';
import PersonView from './PersonView';
import SummaryView from './SummaryView';
import { Tytul, Komunikat, Zwykly, Naglowek } from './style';

export default function App() {
  const [currentView, setCurrentView] = useState('Dodaj');
  const roommates = ['Ania O.', 'Ania P.', 'Ina'];

  const renderView = () => {
    if (currentView === 'Dodaj') return <AddExpenseView />;
    if (currentView === 'Podsumowanie') return <SummaryView />;
    if (roommates.includes(currentView)) return <PersonView personName={currentView} />;
  };

  return (
    // Dodałem: dark:bg-black (w nocy czarne tło) i dark:text-gray-100 (w nocy jasny tekst)
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-100 font-sans p-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {Tytul("MIESZKANKO")}
        
        {/* Pasek nawigacji (Menu) */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {['Ania O.', 'Ania P.', 'Ina', 'Dodaj', 'Podsumowanie'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentView(tab)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                currentView === tab 
                  ? 'bg-purple-600 text-white shadow-md' 
                  // Dodałem nocne kolory dla niezaznaczonych przycisków:
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dodałem: dark:bg-gray-900 (w nocy główne okno będzie elegancko ciemnoszare) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          {renderView()}
        </div>
      </div>
    </div>
  );
} 
///