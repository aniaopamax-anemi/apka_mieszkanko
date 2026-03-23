"use client";

import React from 'react';
// 1. Ściągamy naszą bąbelkową czcionkę z Google bezpośrednio do tego pliku
import { Rubik_Dirt } from 'next/font/google';

// 2. Konfigurujemy ją (wybieramy polskie znaki 'latin-ext')
const rubik = Rubik_Dirt({ 
  weight: '400', 
  subsets: ['latin', 'latin-ext'] 
});

const TextStyles = {
  // 3. Dodajemy naszą czcionkę do tytułu za pomocą ${rubik.className}
  // Zmieniłem też rozmiar na text-5xl, bo ta czcionka lepiej wygląda, gdy jest większa!
  tytul: `${rubik.className} text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-8 text-center drop-shadow-sm`,
  
  // Reszta zostaje po staremu (zwykła czcionka, wspierająca tryb nocny)
  naglowek: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center transition-colors",
  zwykly: "text-base text-gray-500 dark:text-gray-400 transition-colors",
  sukces: "text-green-700 dark:text-green-300 font-medium bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-xl shadow-sm transition-colors",
  blad: "text-red-700 dark:text-red-300 font-bold bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-xl shadow-sm transition-colors"
} as const;

export const Tytul = (tresc: string) => (
  <h1 className={TextStyles.tytul}>{tresc}</h1>
);

export const Naglowek = (tresc: string) => (
  <h2 className={TextStyles.naglowek}>{tresc}</h2>
);

export const Zwykly = (tresc: string) => (
  <p className={TextStyles.zwykly}>{tresc}</p>
);

export const Komunikat = (tresc: string, typ: 'sukces' | 'blad' = 'sukces') => (
  <div className="flex justify-center my-4">
    <p className={TextStyles[typ]}>
      {typ === 'sukces' ? '🎉 ' : '⚠️ '} 
      {tresc}
    </p>
  </div>
);