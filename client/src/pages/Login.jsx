import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Field } from '../components/ui.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // One state object for the whole form is tidier than one per input.
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); // stop the browser reloading the page
    setError('');
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'owner' ? '/owner' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel: the pitch. Hidden on phones to keep the form first. */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-12">
        <p className="font-display text-2xl font-extrabold">RentBook</p>
        <div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05]">
            Rent, bills and repairs.
            <br />
            <span className="text-brand-soft">One ledger.</span>
          </h1>
          <p className="text-white/55 mt-5 max-w-sm">
            Owners see every room at a glance. Tenants see exactly what they owe and
            when it is due. Nobody keeps a paper register any more.
          </p>
        </div>
        <p className="text-xs text-white/35">PG & rental management · MERN</p>
      </div>

      {/* Right panel: the form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-bold">Sign in</h2>
          <p className="text-sm text-muted mt-1 mb-8">
            New here?{' '}
            <Link to="/register" className="text-brand font-medium hover:underline">
              Create an account
            </Link>
          </p>

          <div className="space-y-4">
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              placeholder="you@example.com"
              required
            />
            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              placeholder="••••••"
              required
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-alert bg-alert-soft border border-alert/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full mt-6 py-2.5">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>

          {/* Remove this block once you connect the real backend. */}
          <div className="mt-8 text-xs text-muted border-t border-line pt-4 leading-relaxed">
            <p className="font-semibold text-ink mb-1">Demo logins</p>
            <p>tenant@rentbook.in · 123456</p>
            <p>owner@rentbook.in · 123456</p>
          </div>
        </form>
      </div>
    </div>
  );
}
