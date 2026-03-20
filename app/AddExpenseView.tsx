// AddExpenseView.tsx
"use client";

import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const categories = ['czynsz', 'woda', 'prąd', 'gaz', 'internet', 'inne'];
const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

export default function AddExpenseView() {
  // Stan (pamięć) dla poszczególnych pól formularza
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [person, setPerson] = useState('Wszyscy');
  const [month, setMonth] = useState(months[new Date().getMonth()]); // Domyślnie aktualny miesiąc
  const [isSaving, setIsSaving] = useState(false);

  // Funkcja uruchamiana po kliknięciu "Zapisz"
  const handleSave = async () => {
    if (!amount) return alert('Podaj kwotę!');
    setIsSaving(true);

    const numericAmount = parseFloat(amount);
    let recordsToInsert = [];

    // LOGIKA: Podział rachunku na wszystkich lub przypisanie jednej osobie
    if (person === 'Wszyscy') {
      const splitAmount = numericAmount / 3;
      // Tworzymy 3 osobne wpisy, po jednym dla każdej z Was
      recordsToInsert = ['Ania O.', 'Ania P.', 'Ina'].map((p) => ({
        amount: splitAmount,
        category,
        description: category === 'inne' ? description : null,
        person: p,
        month,
        is_paid: false,
      }));
    } else {
      // Wpis tylko dla jednej, konkretnej osoby
      recordsToInsert = [{
        amount: numericAmount,
        category,
        description: category === 'inne' ? description : null,
        person,
        month,
        is_paid: false,
      }];
    }

    // Wysyłamy nasze wpisy do bazy danych (Supabase)
    const { error } = await supabase.from('expenses').insert(recordsToInsert);

    setIsSaving(false);
    if (error) {
      alert('Coś poszło nie tak!');
    } else {
      alert('Dodano pomyślnie!');
      setAmount(''); // Czyścimy pole kwoty po dodaniu
      setDescription('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold border-b pb-2">Dodaj nowy rachunek</h2>
      
      <label className="flex flex-col">
        <span className="text-sm text-gray-500 mb-1">Kwota (zł)</span>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded p-2" placeholder="np. 150.50" />
      </label>

      <label className="flex flex-col">
        <span className="text-sm text-gray-500 mb-1">Kategoria</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded p-2">
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </label>

      {/* Jeśli wybierzesz 'inne', pokazujemy dodatkowe pole na opis */}
      {category === 'inne' && (
        <label className="flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Co to dokładnie jest?</span>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded p-2" placeholder="np. Środki czystości" />
        </label>
      )}

      <label className="flex flex-col">
        <span className="text-sm text-gray-500 mb-1">Kto płaci?</span>
        <select value={person} onChange={(e) => setPerson(e.target.value)} className="border rounded p-2">
          <option value="Wszyscy">Wszyscy (podział na 3)</option>
          <option value="Ania O.">Ania O.</option>
          <option value="Ania P.">Ania P.</option>
          <option value="Ina">Ina</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span className="text-sm text-gray-500 mb-1">Miesiąc rozliczeniowy</span>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded p-2">
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>

      <button 
        onClick={handleSave} 
        disabled={isSaving}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
      >
        {isSaving ? 'Zapisywanie...' : 'Zapisz rachunek'}
      </button>
    </div>
  );
}