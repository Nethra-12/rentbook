import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Button, Card, Empty, Field, Loader, PageTitle, rupees } from '../components/ui.jsx';

const blank = { name: '', address: '', rooms: '', monthlyRent: '' };

export default function OwnerProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  useEffect(() => {
    api.getProperties().then(setProperties).finally(() => setLoading(false));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const created = await api.createProperty(form);
    setProperties((prev) => [...prev, created]);
    setForm(blank);
    setOpen(false);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle eyebrow="Your buildings" title="Properties">
        <Button onClick={() => setOpen((v) => !v)} variant={open ? 'ghost' : 'primary'}>
          {open ? 'Cancel' : 'Add property'}
        </Button>
      </PageTitle>

      {open && (
        <Card className="p-6 mb-5">
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <Field label="Property name" name="name" value={form.name} onChange={change} required />
            <Field label="Address" name="address" value={form.address} onChange={change} required />
            <Field
              label="Number of rooms"
              name="rooms"
              type="number"
              min="1"
              value={form.rooms}
              onChange={change}
              required
            />
            <Field
              label="Rent per room (₹)"
              name="monthlyRent"
              type="number"
              min="0"
              value={form.monthlyRent}
              onChange={change}
              required
            />
            <div className="sm:col-span-2">
              <Button type="submit">Save property</Button>
            </div>
          </form>
        </Card>
      )}

      {properties.length === 0 ? (
        <Empty title="No properties yet" hint="Add your first building to start assigning rooms." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {properties.map((p) => {
            const filled = Math.round((p.occupied / p.rooms) * 100);
            return (
              <Card key={p._id} className="p-6">
                <p className="font-display text-xl font-bold">{p.name}</p>
                <p className="text-sm text-muted">{p.address}</p>

                <div className="flex gap-6 mt-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Rooms</p>
                    <p className="tnum text-lg font-bold">{p.rooms}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Occupied</p>
                    <p className="tnum text-lg font-bold text-paid">{p.occupied}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Rent</p>
                    <p className="tnum text-lg font-bold">{rupees(p.monthlyRent)}</p>
                  </div>
                </div>

                <div className="h-1.5 bg-line rounded-full mt-5 overflow-hidden">
                  <div className="h-full bg-brand rounded-full" style={{ width: `${filled}%` }} />
                </div>
                <p className="text-xs text-muted mt-2">{filled}% full</p>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
