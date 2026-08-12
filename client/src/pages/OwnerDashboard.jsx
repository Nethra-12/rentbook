import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Loader, rupees } from '../components/ui.jsx';

function Stat({ label, value, hint, tone = 'ink' }) {
  const tones = { ink: 'text-ink', due: 'text-due', paid: 'text-paid' };
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className={`tnum text-3xl font-bold mt-2 ${tones[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </Card>
  );
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOwnerStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const occupancy = Math.round((stats.occupied / stats.rooms) * 100);
  const peak = Math.max(...stats.collections.map((c) => c.amount));

  return (
    <>
      <header className="mb-7">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Portfolio</p>
        <h1 className="font-display text-3xl font-bold mt-1">
          Good to see you, {user.name.split(' ')[0]}
        </h1>
      </header>

      {/* Occupancy is the number that decides an owner's month, so it
          gets the hero treatment instead of a small card. */}
      <Card className="p-6 sm:p-8 mb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Occupancy</p>
            <p className="tnum text-6xl font-extrabold leading-none mt-2">{occupancy}%</p>
          </div>
          <p className="text-sm text-muted">
            <span className="tnum font-semibold text-ink">{stats.occupied}</span> of{' '}
            <span className="tnum">{stats.rooms}</span> rooms filled ·{' '}
            <span className="tnum font-semibold text-due">{stats.vacant}</span> vacant
          </p>
        </div>

        <div className="flex gap-[3px] h-8 mt-6">
          {Array.from({ length: stats.rooms }, (_, i) => (
            <div
              key={i}
              title={i < stats.occupied ? 'Occupied' : 'Vacant'}
              className={`flex-1 rounded-sm ${i < stats.occupied ? 'bg-brand' : 'bg-line'}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted mt-2">One bar, one room.</p>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Properties" value={stats.properties} />
        <Stat label="This month" value={rupees(stats.monthlyIncome)} hint="Expected collection" />
        <Stat label="Pending" value={stats.pendingPayments} hint="Rents unpaid" tone="due" />
        <Stat label="Open repairs" value={stats.openComplaints} hint="Awaiting action" />
      </div>

      {/* A plain CSS bar chart. No chart library needed for six numbers,
          and you can explain every line of it. */}
      <Card className="p-6 mt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted mb-6">
          Collections, last six months
        </p>
        <div className="flex items-end gap-3 h-40">
          {stats.collections.map((c) => (
            <div key={c.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="tnum text-[11px] text-muted">
                {Math.round(c.amount / 1000)}k
              </span>
              <div
                className="w-full bg-brand rounded-t-md min-h-1"
                style={{ height: `${(c.amount / peak) * 100}%` }}
              />
              <span className="text-xs text-muted">{c.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
