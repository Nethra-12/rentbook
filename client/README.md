# RentBook — Frontend

## Run it

```bash
cd client
npm install
npm run dev
```

Open http://localhost:3000

Demo logins (mock mode):
- tenant@rentbook.in / 123456
- owner@rentbook.in / 123456

## Connecting your real backend

Open `src/api/client.js` and set:

```js
export const USE_MOCK = false;
```

Your Express server must then be running on port 5000 and expose:

| Method | Route                  | Returns |
|--------|------------------------|---------|
| POST   | /api/auth/register     | { token, user } |
| POST   | /api/auth/login        | { token, user } |
| GET    | /api/tenant/summary    | { room, property, amountDue, dueDate, openComplaints, totalPaid, currentBill } |
| GET    | /api/bills             | [ { _id, month, rent, electricity, water, internet, total, status, dueDate, paidOn } ] |
| POST   | /api/payments/:billId  | updated bill |
| GET    | /api/complaints        | [ { _id, title, description, priority, status, room, tenant, createdAt } ] |
| POST   | /api/complaints        | created complaint |
| PUT    | /api/complaints/:id    | updated complaint |
| GET    | /api/properties        | [ { _id, name, address, rooms, occupied, monthlyRent } ] |
| POST   | /api/properties        | created property |
| GET    | /api/owner/stats       | { properties, rooms, occupied, vacant, monthlyIncome, pendingPayments, openComplaints, collections } |

`user` must be `{ _id, name, email, role }` where role is "tenant" or "owner".

Routes other than auth expect `Authorization: Bearer <token>`.
