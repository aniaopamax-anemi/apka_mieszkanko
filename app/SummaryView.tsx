// SummaryView.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const fixedCategories = ['czynsz', 'woda', 'prąd', 'gaz', 'internet'];

export default function SummaryView() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dueDates, setDueDates] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: expData } = await supabase.from('expenses').select('*');
    if (expData) setExpenses(expData);

    const { data: dueData } = await supabase.from('due_dates').select('*');
    if (dueData) setDueDates(dueData);
  };

  // Aktualizacja dnia w którym rachunek traci ważność (od 1 do 31)
  const updateDueDate = async (category: string, day: string) => {
    let dayNum = parseInt(day);
    if (dayNum < 1) dayNum = 1;
    if (dayNum > 31) dayNum = 31;

    // Supabase 'upsert' pozwala dodać wpis, a jeśli już istnieje, to go aktualizuje
    await supabase.from('due_dates').upsert({ category, due_day: dayNum }, { onConflict: 'category' });
    fetchData(); // Odświeżenie danych z bazy
  };

  // Skomplikowana funkcja grupująca - najpierw po miesiącu, potem po kategorii z sumowaniem kwot
  const summaryByMonth = expenses.reduce((acc, exp) => {
    if (!acc[exp.month]) acc[exp.month] = { totals: {}, inneItems: [] };
    
    // Sumowanie
    acc[exp.month].totals[exp.category] = (acc[exp.month].totals[exp.category] || 0) + exp.amount;
    
    // Zbieranie opisów z "inne"
    if (exp.category === 'inne' && exp.description) {
      acc[exp.month].inneItems.push(`${exp.description} (${exp.amount.toFixed(2)}zł)`);
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Podsumowanie Miesięcy</h2>
        {Object.entries(summaryByMonth).map(([month, data]) => (
          <div key={month} className="mb-6 border rounded-xl overflow-hidden">
            <h3 className="bg-purple-100 text-purple-800 font-bold p-3">{month}</h3>
            <div className="p-4 bg-white grid grid-cols-2 gap-2">
              {Object.entries(data.totals).map(([cat, suma]: any) => (
                <div key={cat} className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="capitalize">{cat}:</span>
                  <span className="font-bold">{suma.toFixed(2)} zł</span>
                </div>
              ))}
            </div>
            {data.inneItems.length > 0 && (
              <div className="p-3 bg-gray-50 text-xs text-gray-500">
                <strong>Szczegóły "inne":</strong> {data.inneItems.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sekcja ustalania terminów zapłaty */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Terminy płatności (dzień miesiąca)</h2>
        <div className="space-y-3">
          {fixedCategories.map(cat => {
            const currentDue = dueDates.find(d => d.category === cat)?.due_day || '';
            return (
              <div key={cat} className="flex justify-between items-center">
                <span className="capitalize font-medium text-gray-700">{cat}</span>
                <input 
                  type="number" 
                  min="1" max="31"
                  defaultValue={currentDue}
                  onBlur={(e) => updateDueDate(cat, e.target.value)} // Zapisuje się, gdy odklikniesz pole
                  placeholder="np. 10"
                  className="w-20 p-2 border rounded text-center shadow-sm"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}