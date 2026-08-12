import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import {
  Badge,
  Button,
  Card,
  Empty,
  Field,
  Loader,
  PageTitle,
  Select,
} from '../components/ui.jsx';

const STAGES = ['pending', 'in-progress', 'resolved'];

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });

  useEffect(() => {
    api.getComplaints().then(setComplaints).finally(() => setLoading(false));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const created = await api.createComplaint(form);
    setComplaints((prev) => [created, ...prev]);
    setForm({ title: '', description: '', priority: 'medium' });
    setOpen(false);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle eyebrow="Repairs & issues" title="Maintenance">
        <Button onClick={() => setOpen((v) => !v)} variant={open ? 'ghost' : 'primary'}>
          {open ? 'Cancel' : 'Report an issue'}
        </Button>
      </PageTitle>

      {open && (
        <Card className="p-6 mb-5">
          <form onSubmit={submit} className="space-y-4">
            <Field
              label="What is wrong"
              name="title"
              value={form.title}
              onChange={change}
              placeholder="Water leakage"
              required
            />
            <label className="block">
              <span className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
                Details
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={change}
                rows={3}
                required
                placeholder="Where it is, when it started, how bad it is."
                className="w-full px-3 py-2.5 bg-surface border border-line rounded-lg focus:border-brand outline-none"
              />
            </label>
            <Select label="Priority" name="priority" value={form.priority} onChange={change}>
              <option value="low">Low — can wait a week</option>
              <option value="medium">Medium — this week</option>
              <option value="high">High — urgent</option>
            </Select>
            <Button type="submit">Send to owner</Button>
          </form>
        </Card>
      )}

      {complaints.length === 0 ? (
        <Empty
          title="Nothing reported yet"
          hint="Something broken in your room? Report it and track the fix here."
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Card key={c._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold">{c.title}</p>
                  <p className="text-sm text-muted mt-1 max-w-xl">{c.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge status={c.priority} />
                  <Badge status={c.status} />
                </div>
              </div>

              {/* Progress track. Order matters here, so a stepped rail is
                  honest structure rather than decoration. */}
              <div className="flex items-center gap-2 mt-5">
                {STAGES.map((stage, i) => {
                  const reached = STAGES.indexOf(c.status) >= i;
                  return (
                    <div key={stage} className="flex-1">
                      <div
                        className={`h-1 rounded-full ${reached ? 'bg-brand' : 'bg-line'}`}
                      />
                      <p
                        className={`text-[11px] mt-1.5 capitalize ${
                          reached ? 'text-brand-dark font-medium' : 'text-muted'
                        }`}
                      >
                        {stage.replace('-', ' ')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
