"use client";

// App.tsx
import React, { useState } from 'react';
import AddExpenseView from './AddExpenseView';
import PersonView from './PersonView';
import SummaryView from './SummaryView';

export default function App() {
  // useState to nasza pamięć. Aplikacja pamięta tutaj, która zakładka jest aktualnie włączona.
  // Na start ustawiamy widok "Dodaj".
  const [currentView, setCurrentView] = useState('Dodaj');

  // To są wszystkie osoby w mieszkaniu
  const roommates = ['Ania O.', 'Ania P.', 'Ina'];

  // Ta funkcja decyduje, co ma się wyświetlić na ekranie poniżej menu
  const renderView = () => {
    if (currentView === 'Dodaj') return <AddExpenseView />;
    if (currentView === 'Podsumowanie') return <SummaryView />;
    // Jeśli to nie "Dodaj" i nie "Podsumowanie", to znaczy że wybrano konkretną osobę
    if (roommates.includes(currentView)) return <PersonView personName={currentView} />;
  };

  return (
    // Główny kontener aplikacji (szare tło, ładna czcionka)
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">Mieszkanko 🏠</h1>
        
        {/* Pasek nawigacji (Menu) */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {['Ania O.', 'Ania P.', 'Ina', 'Dodaj', 'Podsumowanie'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentView(tab)} // Po kliknięciu zmieniamy widok
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                currentView === tab 
                  ? 'bg-purple-600 text-white shadow-md' // Zaznaczony przycisk
                  : 'bg-white text-gray-600 hover:bg-purple-100' // Zwykły przycisk
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Miejsce, gdzie wyświetla się wybrany przez nas widok */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
