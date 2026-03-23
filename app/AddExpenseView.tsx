"use client";

import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const categories = ['czynsz', 'woda', 'prąd', 'gaz', 'internet', 'inne'];
const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

export default function AddExpenseView() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [person, setPerson] = useState('Wszyscy');
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!amount) return alert('Podaj kwotę!');
    setIsSaving(true);

    const numericAmount = parseFloat(amount);
    let recordsToInsert = [];

    if (person === 'Wszyscy') {
      const splitAmount = numericAmount / 3;
      recordsToInsert = ['Ania O.', 'Ania P.', 'Ina'].map((p) => ({
        amount: splitAmount,
        category,
        description: category === 'inne' ? description : null,
        person: p,
        month,
        is_paid: false,
      }));
    } else {
      recordsToInsert = [{
        amount: numericAmount,
        category,
        description: category === 'inne' ? description : null,
        person,
        month,
        is_paid: false,
      }];
    }

    const { error } = await supabase.from('expenses').insert(recordsToInsert);

    setIsSaving(false);
    if (error) {
      alert('Coś poszło nie tak!');
    } else {
      alert('Dodano pomyślnie!');
      setAmount('');
      setDescription('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-gray-100 transition-colors">Dodaj nowy rachunek</h2>
      
      <label className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">Kwota (zł)</span>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded p-2 transition-colors focus:ring-2 focus:ring-purple-500 outline-none" placeholder="np. 150.50" />
      </label>

      <label className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">Kategoria</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded p-2 transition-colors focus:ring-2 focus:ring-purple-500 outline-none">
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </label>

      {category === 'inne' && (
        <label className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">Co to dokładnie jest?</span>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded p-2 transition-colors focus:ring-2 focus:ring-purple-500 outline-none" placeholder="np. Środki czystości" />
        </label>
      )}

      <label className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">Kto płaci?</span>
        <select value={person} onChange={(e) => setPerson(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded p-2 transition-colors focus:ring-2 focus:ring-purple-500 outline-none">
          <option value="Wszyscy">Wszyscy (podział na 3)</option>
          <option value="Ania O.">Ania O.</option>
          <option value="Ania P.">Ania P.</option>
          <option value="Ina">Ina</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">Miesiąc rozliczeniowy</span>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded p-2 transition-colors focus:ring-2 focus:ring-purple-500 outline-none">
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>

      <button 
        onClick={handleSave} 
        disabled={isSaving}
        className="mt-4 bg-pink-400 hover:bg-pink-500 dark:bg-pink-500 dark:hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors"
      >
        {isSaving ? 'Zapisywanie...' : 'Zapisz rachunek'}
      </button>
    </div>
  );
}