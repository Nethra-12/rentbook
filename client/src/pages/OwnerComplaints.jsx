import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Badge, Button, Card, Empty, Loader, PageTitle } from '../components/ui.jsx';

const FILTERS = ['all', 'pending', 'in-progress', 'resolved'];

export default function OwnerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplaints().then(setComplaints).finally(() => setLoading(false));
  }, []);

  const advance = async (complaint) => {
    const next = complaint.status === 'pending' ? 'in-progress' : 'resolved';
    const updated = await api.updateComplaintStatus(complaint._id, next);
    setComplaints((prev) => prev.map((c) => (c._id === complaint._id ? { ...c, ...updated } : c)));
  };

  // Derived state: filtering happens at render time from the one source
  // of truth. Do not store a second filtered array in state - it goes stale.
  const visible = filter === 'all' ? complaints : complaints.filter((c) => c.status === filter);

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle eyebrow="Tenant requests" title="Maintenance queue" />

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition border ${
              filter === f
                ? 'bg-ink text-white border-ink'
                : 'bg-surface text-muted border-line hover:text-ink'
            }`}
          >
            {f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Empty title="Queue is clear" hint="No requests match this filter right now." />
      ) : (
        <div className="space-y-3">
          {visible.map((c) => (
            <Card key={c._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-lg font-bold">{c.title}</p>
                    <Badge status={c.priority} />
                  </div>
                  <p className="text-sm text-muted mt-1 max-w-xl">{c.description}</p>
                  <p className="text-xs text-muted mt-2">
                    Room {c.room} · {c.tenant?.name || 'Unknown'} · raised {new Date(c.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge status={c.status} />
                  {c.status !== 'resolved' && (
                    <Button variant="ghost" onClick={() => advance(c)}>
                      {c.status === 'pending' ? 'Start work' : 'Mark resolved'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
