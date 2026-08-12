import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Field, Select } from '../components/ui.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tenant',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      return setError('Use at least 6 characters for your password.');
    }
    setBusy(true);
    try {
      const user = await register(form);
      navigate(user.role === 'owner' ? '/owner' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="font-display text-xl font-extrabold mb-10">RentBook</p>
        <h2 className="font-display text-3xl font-bold">Create your account</h2>
        <p className="text-sm text-muted mt-1 mb-8">
          Already registered?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">
            Sign in
          </Link>
        </p>

        <div className="space-y-4">
          <Field label="Full name" name="name" value={form.name} onChange={change} required />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            required
          />
          <Select label="I am a" name="role" value={form.role} onChange={change}>
            <option value="tenant">Tenant — I rent a room</option>
            <option value="owner">Owner — I manage properties</option>
          </Select>
        </div>

        {error && (
          <p className="mt-4 text-sm text-alert bg-alert-soft border border-alert/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" disabled={busy} className="w-full mt-6 py-2.5">
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
