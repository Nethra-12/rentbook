import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import RentCycle from '../components/RentCycle.jsx';
import { Card, Loader, rupees } from '../components/ui.jsx';

export default function TenantDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  /* useEffect with an empty dependency array runs once after the first
     render. This is where data fetching belongs: React paints the shell
     immediately, then fills it in when the response arrives. */
  useEffect(() => {
    api
      .getTenantSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const bill = summary.currentBill;

  return (
    <>
      <header className="mb-7">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {summary.property} · Room {summary.room}
        </p>
        <h1 className="font-display text-3xl font-bold mt-1">
          Hello, {user.name.split(' ')[0]}
        </h1>
      </header>

      <RentCycle amount={summary.amountDue} dueDate={summary.dueDate} />

      {/* Breakdown of what makes up the amount above. Rent alone is not
          the whole story, and tenants ask about utilities constantly. */}
      {bill && (
        <Card className="mt-5 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted mb-4">
            {bill.month} breakdown
          </p>
          <dl className="space-y-2.5">
            {[
              ['Room rent', bill.rent],
              ['Electricity', bill.electricity],
              ['Water', bill.water],
              ['Internet', bill.internet],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <dt className="text-muted">{label}</dt>
                <dd className="tnum font-medium">{rupees(value)}</dd>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-3 border-t border-line">
              <dt className="font-semibold">Total</dt>
              <dd className="tnum font-bold text-lg">{rupees(summary.amountDue)}</dd>
            </div>
          </dl>
          <Link
            to="/bills"
            className="inline-block mt-5 text-sm font-medium text-brand hover:underline"
          >
            Pay this bill →
          </Link>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Paid so far</p>
          <p className="tnum text-3xl font-bold mt-2">{rupees(summary.totalPaid)}</p>
          <p className="text-sm text-muted mt-1">Since you moved in</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Open requests</p>
          <p className="tnum text-3xl font-bold mt-2">{summary.openComplaints}</p>
          <Link
            to="/complaints"
            className="inline-block text-sm font-medium text-brand hover:underline mt-1"
          >
            {summary.openComplaints ? 'Track them' : 'Report an issue'} →
          </Link>
        </Card>
      </div>
    </>
  );
}
