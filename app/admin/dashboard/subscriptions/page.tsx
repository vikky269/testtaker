'use client';

// app/admin/dashboard/subscriptions/page.tsx
// Admin view of all parent subscription form submissions

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Subscription {
  id:                 string;
  created_at:         string;
  email:              string;
  student_first_name: string;
  student_last_name:  string;
  student_email:      string;
  student_gender:     string;
  student_school:     string;
  grade_level:        string;
  gpa:                string | null;
  relationship:       string;
  parent_first_name:  string;
  parent_last_name:   string;
  parent_phone:       string;
  parent_email:       string;
  household_address:  string;
  programme_package:  string;
  availability:       string;
  start_date:         string;
  additional_info:    string | null;
  referral_source:    string;
}

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const packageColor = (pkg: string) => {
  if (pkg.includes('Package 1') || pkg.includes('Package I')) return 'bg-blue-50 text-blue-700';
  if (pkg.includes('Package 2') || pkg.includes('Package II')) return 'bg-green-50 text-green-700';
  if (pkg.includes('Package 3') || pkg.includes('Package III')) return 'bg-purple-50 text-purple-700';
  return 'bg-gray-100 text-gray-600';
};

const DetailRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  value ? (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  ) : null
);

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-xs font-bold uppercase tracking-widest text-[#3a5a09] mt-5 mb-1 border-b border-green-100 pb-1">{title}</h3>
);

export default function SubscriptionsPage() {
  const [subs, setSubs]       = useState<Subscription[]>([]);
  const [filtered, setFiltered] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [pkgFilter, setPkgFilter] = useState('All');
  const [selected, setSelected] = useState<Subscription | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) { setSubs(data); setFiltered(data); }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let out = [...subs];
    if (pkgFilter !== 'All') out = out.filter(s => s.programme_package.includes(pkgFilter));
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(s =>
        `${s.student_first_name} ${s.student_last_name}`.toLowerCase().includes(q) ||
        s.parent_email.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    setFiltered(out);
  }, [subs, search, pkgFilter]);

  const pkgOptions = ['All', 'Package 1', 'Package 2', 'Package 3'];

  if (loading) return <div className="p-8 text-gray-500">Loading subscriptions...</div>;

  return (
    <div className="max-w-7xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Parent Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">
          All enrolment form submissions from parents of newly enrolled students.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total',     val: subs.length,                                          color: 'text-gray-800',   bg: 'bg-gray-50' },
          { label: 'Package 1', val: subs.filter(s => s.programme_package.includes('Package 1')).length, color: 'text-blue-700',  bg: 'bg-blue-50' },
          { label: 'Package 2', val: subs.filter(s => s.programme_package.includes('Package 2')).length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Package 3', val: subs.filter(s => s.programme_package.includes('Package 3')).length, color: 'text-purple-700',bg: 'bg-purple-50' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 text-center border border-white`}>
            <p className={`text-2xl font-extrabold ${color}`}>{val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={pkgFilter} onChange={e => setPkgFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none cursor-pointer">
          {pkgOptions.map(p => <option key={p}>{p}</option>)}
        </select>
        <span className="hidden sm:flex items-center text-xs text-gray-400 whitespace-nowrap">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'STUDENT', 'GRADE', 'PARENT', 'PHONE', 'PACKAGE', 'START DATE', 'SUBMITTED', 'DETAILS'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No submissions found</td></tr>
              ) : filtered.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 text-sm">{s.student_first_name} {s.student_last_name}</p>
                    <p className="text-xs text-gray-400">{s.student_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.grade_level}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800">{s.parent_first_name} {s.parent_last_name}</p>
                    <p className="text-xs text-gray-400">{s.parent_email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.parent_phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${packageColor(s.programme_package)}`}>
                      {s.programme_package.split('—')[0].trim()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(s.start_date)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmt(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(s)}
                      className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selected.student_first_name} {selected.student_last_name}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">Submitted {fmt(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 text-lg">✕</button>
            </div>

            <div className="px-6 py-5">

              {/* Package badge */}
              <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-4 ${packageColor(selected.programme_package)}`}>
                {selected.programme_package.split('—')[0].trim()}
              </span>

              <SectionTitle title="Student Information" />
              <DetailRow label="Full Name"    value={`${selected.student_first_name} ${selected.student_last_name}`} />
              <DetailRow label="Student Email" value={selected.student_email} />
              <DetailRow label="Gender"       value={selected.student_gender} />
              <DetailRow label="School"       value={selected.student_school} />
              <DetailRow label="Grade Level"  value={selected.grade_level} />
              <DetailRow label="GPA / Avg Grade" value={selected.gpa} />

              <SectionTitle title="Parent / Guardian Information" />
              <DetailRow label="Relationship" value={selected.relationship} />
              <DetailRow label="Full Name"    value={`${selected.parent_first_name} ${selected.parent_last_name}`} />
              <DetailRow label="Phone"        value={selected.parent_phone} />
              <DetailRow label="Email"        value={selected.parent_email} />
              <DetailRow label="Address"      value={selected.household_address} />
              <DetailRow label="Form Email"   value={selected.email} />

              <SectionTitle title="Programme Details" />
              <DetailRow label="Package Selected"  value={selected.programme_package} />
              <DetailRow label="Availability"      value={selected.availability} />
              <DetailRow label="Potential Start"   value={fmt(selected.start_date)} />

              <SectionTitle title="Additional" />
              <DetailRow label="Additional Info"   value={selected.additional_info} />
              <DetailRow label="How They Found Us" value={selected.referral_source} />

              <button onClick={() => setSelected(null)}
                className="mt-6 w-full py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}