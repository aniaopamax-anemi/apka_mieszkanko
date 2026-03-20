// PersonView.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function PersonView({ personName }: { personName: string }) {
  const [expenses, setExpenses] = useState<any[]>([]);

  // useEffect to funkcja, która "sama z siebie" pobiera dane, gdy tylko włączysz tę zakładkę
  useEffect(() => {
    fetchExpenses();
  }, [personName]);

  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').eq('person', personName);
    if (data) setExpenses(data);
  };

  // Zaznaczanie, że rachunek został zapłacony
  const markAsPaid = async (id: string) => {
    await supabase.from('expenses').update({ is_paid: true }).eq('id', id);
    fetchExpenses(); // Odświeżamy listę po zmianie
  };

  // Dzielimy wydatki na dwie kupki: zapłacone i niezapłacone
  const unpaid = expenses.filter(e => !e.is_paid);
  const paid = expenses.filter(e => e.is_paid);

  // Zliczamy całkowitą kwotę do zapłaty
  const totalDue = unpaid.reduce((suma, wpis) => suma + wpis.amount, 0);

  // Funkcja pomocnicza, która grupuje opłacone wydatki w miesiące
  const groupedPaid = paid.reduce((grupy, wpis) => {
    grupy[wpis.month] = grupy[wpis.month] || [];
    grupy[wpis.month].push(wpis);
    return grupy;
  }, {} as Record<string, any[]>);

  return (
    <div>
      <h2 className="text-3xl font-black text-center text-red-500 mb-8 border-b-2 border-red-100 pb-4">
        Razem do zapłaty: {totalDue.toFixed(2)} zł
      </h2>

      <h3 className="text-xl font-bold mb-4">Do zapłacenia:</h3>
      <div className="flex flex-col gap-2 mb-8">
        {unpaid.length === 0 ? <p className="text-gray-500">Wszystko opłacone! 🎉</p> : null}
        
        {unpaid.map(exp => (
          <label key={exp.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition">
            {/* Kliknięcie checkboxa wysyła informację do bazy danych */}
            <input type="checkbox" className="w-5 h-5" onChange={() => markAsPaid(exp.id)} />
            <span className="flex-1 font-medium">
              {exp.category === 'inne' ? exp.description : exp.category}, {exp.month}
            </span>
            <span className="font-bold text-lg">{exp.amount.toFixed(2)} zł</span>
          </label>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-4">Historia (Zapłacone):</h3>
      {Object.entries(groupedPaid).map(([miesiace, wpisy]) => (
        <div key={miesiace} className="mb-4">
          <h4 className="font-bold text-gray-700 bg-gray-200 px-3 py-1 rounded">{miesiace}</h4>
          <ul className="pl-4 mt-2">
            {wpisy.map(exp => (
              <li key={exp.id} className="text-gray-600 flex justify-between border-b border-gray-100 py-1">
                <span>{exp.category === 'inne' ? exp.description : exp.category}</span>
                <span>{exp.amount.toFixed(2)} zł</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}