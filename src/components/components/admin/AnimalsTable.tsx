'use client';

import * as React from 'react';

type Animal = {
  id: string | number;
  name: string;
  status?: string;
  species?: string;
  breed?: string;
  location?: string;
};

export default function AnimalsTable({ rows }: { rows: Animal[] }) {
  if (!rows?.length) return <div className="text-sm text-neutral-500">No animals found.</div>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Name</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2 text-left font-medium">Species</th>
            <th className="px-3 py-2 text-left font-medium">Breed</th>
            <th className="px-3 py-2 text-left font-medium">Location</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="px-3 py-2">{a.name}</td>
              <td className="px-3 py-2">{a.status ?? '-'}</td>
              <td className="px-3 py-2">{a.species ?? '-'}</td>
              <td className="px-3 py-2">{a.breed ?? '-'}</td>
              <td className="px-3 py-2">{a.location ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
