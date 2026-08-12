import { rupees } from './ui.jsx';

/* ---------------------------------------------------------------
   The signature element of RentBook.

   A tenant opens this app to answer one question: how much do I owe,
   and how long do I have. So instead of a plain number in a box, the
   month is drawn as a strip of days. A marker shows today, a notch
   shows the due date, and the bar fills as the deadline approaches.
   The remaining days are the loudest thing after the amount.
   --------------------------------------------------------------- */

export default function RentCycle({ amount, dueDate }) {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayToday = today.getDate();

  const due = dueDate ? new Date(dueDate) : null;
  const dueDay = due ? due.getDate() : daysInMonth;
  const daysLeft = due ? Math.ceil((due - today) / 86400000) : null;

  const overdue = daysLeft !== null && daysLeft < 0;
  const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

  const accent = overdue ? 'text-alert' : urgent ? 'text-due' : 'text-ink';
  const barColor = overdue ? 'bg-alert' : urgent ? 'bg-due' : 'bg-brand';

  return (
    <section className="bg-surface border border-line rounded-xl p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        Due this month
      </p>

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-2">
        <p className={`tnum text-6xl sm:text-7xl font-extrabold leading-none ${accent}`}>
          {rupees(amount)}
        </p>
        {daysLeft !== null && (
          <p className={`font-display text-lg font-semibold ${accent}`}>
            {overdue
              ? `${Math.abs(daysLeft)} days overdue`
              : daysLeft === 0
                ? 'due today'
                : `${daysLeft} days left`}
          </p>
        )}
      </div>

      {/* The day strip. Each bar is one day of the month. */}
      <div className="mt-8">
        <div className="flex items-end gap-[3px] h-12" aria-hidden="true">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const past = day <= dayToday;
            const isDue = day === dueDay;
            const isToday = day === dayToday;
            return (
              <div
                key={day}
                className={`flex-1 rounded-sm transition-all ${
                  isDue
                    ? `${barColor} h-full`
                    : isToday
                      ? 'bg-ink h-3/4'
                      : past
                        ? 'bg-ink/25 h-1/3'
                        : 'bg-line h-1/3'
                }`}
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-3 text-xs text-muted">
          <span>Day 1</span>
          <span className="font-semibold text-ink">Today · {dayToday}</span>
          <span className={overdue || urgent ? `font-semibold ${accent}` : ''}>
            Due · {dueDay}
          </span>
        </div>
      </div>

      {/* Screen readers get the same information as plain text. */}
      <p className="sr-only">
        {rupees(amount)} due on day {dueDay} of the month. Today is day {dayToday}.
      </p>
    </section>
  );
}
