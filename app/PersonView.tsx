"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function PersonView({ personName }: { personName: string }) {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, [personName]);

  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').eq('person', personName);
    if (data) setExpenses(data);
  };

  const markAsPaid = async (id: string) => {
    await supabase.from('expenses').update({ is_paid: true }).eq('id', id);
    fetchExpenses();
  };

  // NOWA FUNKCJA: Usuwanie wydatku z bazy danych
  const deleteExpense = async (id: string) => {
    // Okienko z upewnieniem się, czy to nie było przypadkowe kliknięcie
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć ten wydatek?");
    if (confirmDelete) {
      await supabase.from('expenses').delete().eq('id', id);
      fetchExpenses(); // Odświeżamy listę, żeby wydatek od razu zniknął z ekranu
    }
  };

  const unpaid = expenses.filter(e => !e.is_paid);
  const paid = expenses.filter(e => e.is_paid);
  const totalDue = unpaid.reduce((suma, wpis) => suma + wpis.amount, 0);

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
          // Zamieniłem <label> na <div>, żeby kliknięcie w ikonkę usuwania nie zaznaczało checkboxa
          <div key={exp.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition">
            <input 
              type="checkbox" 
              className="w-5 h-5 cursor-pointer" 
              onChange={() => markAsPaid(exp.id)} 
            />
            <span className="flex-1 font-medium">
              {exp.category === 'inne' ? exp.description : exp.category}, {exp.month}
            </span>
            <span className="font-bold text-lg">{exp.amount.toFixed(2)} zł</span>
            
            {/* PRZYCISK USUWANIA */}
            <button 
              onClick={() => deleteExpense(exp.id)} 
              className="bg-white text-red-500 border border-red-200 hover:bg-red-500 hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm ml-2"
              title="Usuń ten wydatek"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-4">Historia (Zapłacone):</h3>
      {Object.entries(groupedPaid).map(([miesiace, wpisy]) => (
        <div key={miesiace} className="mb-4">
          <h4 className="font-bold text-gray-700 bg-gray-200 px-3 py-1 rounded">{miesiace}</h4>
          <ul className="pl-4 mt-2">
            {(wpisy as any[]).map((exp: any) => (
              <li key={exp.id} className="text-gray-600 flex items-center justify-between border-b border-gray-100 py-2">
                <div className="flex justify-between flex-1 pr-4">
                  <span>{exp.category === 'inne' ? exp.description : exp.category}</span>
                  <span>{exp.amount.toFixed(2)} zł</span>
                </div>
                
                {/* PRZYCISK USUWANIA W HISTORII (w razie błędu) */}
                <button 
                  onClick={() => deleteExpense(exp.id)} 
                  className="text-red-400 hover:text-red-600 text-xs px-2 py-1 bg-red-50 rounded"
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}