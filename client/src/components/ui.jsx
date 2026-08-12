/* Small building blocks reused everywhere. Keeping them in one file
   means a styling change happens once, not in fifteen places. */

export const rupees = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN');

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface border border-line rounded-xl ${className}`}>{children}</div>
  );
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    ghost: 'bg-transparent text-ink border border-line hover:bg-paper',
    danger: 'bg-alert text-white hover:opacity-90',
  };
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
        {label}
      </span>
      <input
        {...props}
        className="w-full px-3 py-2.5 bg-surface border border-line rounded-lg text-ink placeholder:text-muted/60 focus:border-brand outline-none"
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
        {label}
      </span>
      <select
        {...props}
        className="w-full px-3 py-2.5 bg-surface border border-line rounded-lg text-ink focus:border-brand outline-none"
      >
        {children}
      </select>
    </label>
  );
}

export function Badge({ status }) {
  const map = {
    paid: 'bg-paid-soft text-paid',
    resolved: 'bg-paid-soft text-paid',
    pending: 'bg-due-soft text-due',
    'in-progress': 'bg-brand-soft text-brand-dark',
    overdue: 'bg-alert-soft text-alert',
    high: 'bg-alert-soft text-alert',
    medium: 'bg-due-soft text-due',
    low: 'bg-paper text-muted',
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${map[status] || 'bg-paper text-muted'}`}
    >
      {String(status).replace('-', ' ')}
    </span>
  );
}

export function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.18em] text-muted mb-1">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function Empty({ title, hint }) {
  return (
    <Card className="p-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="text-sm text-muted mt-1">{hint}</p>
    </Card>
  );
}

export function Loader() {
  return <p className="text-sm text-muted py-10">Loading…</p>;
}
