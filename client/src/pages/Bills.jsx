import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Badge, Button, Card, Loader, PageTitle, rupees } from '../components/ui.jsx';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    api.getBills().then(setBills).finally(() => setLoading(false));
  }, []);

  const pay = async (id) => {
    setPayingId(id);
    const updated = await api.payBill(id);
    // Replace just the one bill in state; never mutate the array in place,
    // or React will not notice the change and will skip the re-render.
    setBills((prev) => prev.map((b) => (b._id === id ? { ...b, ...updated } : b)));
    setPayingId(null);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle eyebrow="Your ledger" title="Bills & payments" />

      <div className="space-y-3">
        {bills
          .slice()
          .reverse()
          .map((bill) => (
            <Card key={bill._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-lg font-bold">{bill.month}</p>
                    <Badge status={bill.status} />
                  </div>
                  <p className="text-sm text-muted mt-1">
                    {bill.status === 'paid'
                      ? `Paid on ${bill.paidOn}`
                      : `Due by ${bill.dueDate}`}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <p
                    className={`tnum text-2xl font-bold ${
                      bill.status === 'paid' ? 'text-muted' : 'text-due'
                    }`}
                  >
                    {rupees(bill.total)}
                  </p>
                  {bill.status === 'paid' ? (
                    <Button variant="ghost" onClick={() => window.print()}>
                      Receipt
                    </Button>
                  ) : (
                    <Button onClick={() => pay(bill._id)} disabled={payingId === bill._id}>
                      {payingId === bill._id ? 'Processing…' : 'Pay now'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Line items, quietly. Present but not competing with the total. */}
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-4 border-t border-line text-xs text-muted">
                <span>Rent {rupees(bill.rent)}</span>
                <span>Electricity {rupees(bill.electricity)}</span>
                <span>Water {rupees(bill.water)}</span>
                <span>Internet {rupees(bill.internet)}</span>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
}
