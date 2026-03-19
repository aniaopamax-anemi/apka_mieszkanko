//test zmiana 


"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- DEFINICJE DANYCH ---

interface Expense {
  id: number;
  osoba: string;
  kategoria: string;
  opis: string;
  kwota: number;
  czy_zaplacone: boolean;
  miesiac: string;
}

interface FormState {
  kategoria: string;
  kwota: string;
  opis: string;
  osoba: string;
  miesiac: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const getMonthsList = () => {
  const months = [];
  for (let i = -3; i <= 2; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    months.push(d.toLocaleString('pl-PL', { month: 'long', year: 'numeric' }));
  }
  return months;
};

// --- KOMPONENTY WIDOKÓW (NA ZEWNĄTRZ) ---

const Menu = ({ setView, lokatorki, setSelectedMonthForPerson }: any) => (
  <div className="flex flex-col gap-4 p-6 text-black">
    <h1 className="text-2xl font-bold text-center mb-6">🏠 Menu Lokatorskie</h1>
    <div className="grid grid-cols-1 gap-3">
      {lokatorki.map((osoba: string) => (
        <button key={osoba} onClick={() => { setSelectedMonthForPerson(null); setView(osoba); }} 
          className="bg-blue-600 text-white p-4 rounded-xl shadow-md font-bold text-left active:scale-95 transition-all">
          👤 Portfel: {osoba}
        </button>
      ))}
      <div className="mt-4 space-y-3">
        <button onClick={() => setView('dodaj')} className="w-full bg-orange-500 text-white p-4 rounded-xl shadow-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
          ➕ Dodaj Nowy Wydatek
        </button>
        <button onClick={() => setView('podsumowanie')} className="w-full bg-emerald-600 text-white p-4 rounded-xl shadow-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
          📊 Tabela Podsumowania
        </button>
      </div>
    </div>
  </div>
);

const WidokDodawania = ({ setView, lokatorki, kategorie, form, setForm, dodajWydatek, months }: any) => (
  <div className="p-6 text-black">
    <button onClick={() => setView('menu')} className="text-blue-600 font-bold mb-6