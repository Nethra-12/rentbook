/* ---------------------------------------------------------------
   A fake backend. It exists so you can build and demo the UI before
   your Express routes are finished. Every function returns a Promise,
   exactly like a real network call, so when you switch USE_MOCK to
   false in client.js not a single component needs to change.
   --------------------------------------------------------------- */

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const db = {
  users: [
    { _id: 'u1', name: 'Nethra S', email: 'tenant@rentbook.in', password: '123456', role: 'tenant' },
    { _id: 'u2', name: 'Ravi Kumar', email: 'owner@rentbook.in', password: '123456', role: 'owner' },
  ],
  bills: [
    { _id: 'b1', month: 'June 2026', rent: 6500, electricity: 620, water: 250, internet: 500, status: 'paid', paidOn: '2026-06-04' },
    { _id: 'b2', month: 'July 2026', rent: 6500, electricity: 740, water: 250, internet: 500, status: 'paid', paidOn: '2026-07-05' },
    { _id: 'b3', month: 'August 2026', rent: 6500, electricity: 810, water: 300, internet: 500, status: 'pending', dueDate: '2026-08-15' },
  ],
  complaints: [
    { _id: 'c1', title: 'Water leakage', description: 'Kitchen sink drips through the night.', priority: 'medium', status: 'in-progress', room: '101', tenant: 'Nethra S', createdAt: '2026-08-02' },
    { _id: 'c2', title: 'Fan not working', description: 'Ceiling fan in room 204 stopped spinning.', priority: 'high', status: 'pending', room: '204', tenant: 'Arun P', createdAt: '2026-08-08' },
    { _id: 'c3', title: 'Wi-Fi slow', description: 'Speeds drop badly after 9pm.', priority: 'low', status: 'resolved', room: '101', tenant: 'Nethra S', createdAt: '2026-07-21' },
  ],
  properties: [
    { _id: 'p1', name: 'Sunrise Ladies PG', address: 'Anna Nagar, Chennai', rooms: 12, occupied: 11, monthlyRent: 6500 },
    { _id: 'p2', name: 'Green Court Residency', address: 'Coimbatore', rooms: 24, occupied: 20, monthlyRent: 7200 },
  ],
};

const billTotal = (b) => b.rent + b.electricity + b.water + b.internet;

export const mockApi = {
  async login(email, password) {
    await wait();
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('That email and password combination does not match an account.');
    const { password: _, ...safe } = user;
    return { token: 'mock-jwt-token', user: safe };
  },

  async register(payload) {
    await wait();
    if (db.users.some((u) => u.email === payload.email)) {
      throw new Error('An account already exists with that email.');
    }
    const user = { _id: `u${db.users.length + 1}`, ...payload };
    db.users.push(user);
    const { password: _, ...safe } = user;
    return { token: 'mock-jwt-token', user: safe };
  },

  async getTenantSummary() {
    await wait();
    const current = db.bills.find((b) => b.status === 'pending');
    return {
      room: '101',
      property: 'Sunrise Ladies PG',
      amountDue: current ? billTotal(current) : 0,
      dueDate: current?.dueDate ?? null,
      openComplaints: db.complaints.filter((c) => c.tenant === 'Nethra S' && c.status !== 'resolved').length,
      totalPaid: db.bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + billTotal(b), 0),
      currentBill: current ?? null,
    };
  },

  async getBills() {
    await wait();
    return db.bills.map((b) => ({ ...b, total: billTotal(b) }));
  },

  async payBill(id) {
    await wait(700);
    const bill = db.bills.find((b) => b._id === id);
    if (bill) {
      bill.status = 'paid';
      bill.paidOn = new Date().toISOString().slice(0, 10);
    }
    return { ...bill, total: billTotal(bill) };
  },

  async getComplaints() {
    await wait();
    return [...db.complaints];
  },

  async createComplaint(payload) {
    await wait();
    const complaint = {
      _id: `c${db.complaints.length + 1}`,
      ...payload,
      status: 'pending',
      room: '101',
      tenant: 'Nethra S',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    db.complaints.unshift(complaint);
    return complaint;
  },

  async updateComplaintStatus(id, status) {
    await wait();
    const complaint = db.complaints.find((c) => c._id === id);
    if (complaint) complaint.status = status;
    return complaint;
  },

  async getProperties() {
    await wait();
    return [...db.properties];
  },

  async createProperty(payload) {
    await wait();
    const property = {
      _id: `p${db.properties.length + 1}`,
      ...payload,
      rooms: Number(payload.rooms),
      occupied: 0,
      monthlyRent: Number(payload.monthlyRent),
    };
    db.properties.push(property);
    return property;
  },

  async getOwnerStats() {
    await wait();
    const rooms = db.properties.reduce((sum, p) => sum + p.rooms, 0);
    const occupied = db.properties.reduce((sum, p) => sum + p.occupied, 0);
    return {
      properties: db.properties.length,
      rooms,
      occupied,
      vacant: rooms - occupied,
      monthlyIncome: db.properties.reduce((sum, p) => sum + p.occupied * p.monthlyRent, 0),
      pendingPayments: 8,
      openComplaints: db.complaints.filter((c) => c.status !== 'resolved').length,
      collections: [
        { month: 'Mar', amount: 182000 },
        { month: 'Apr', amount: 196000 },
        { month: 'May', amount: 201000 },
        { month: 'Jun', amount: 215000 },
        { month: 'Jul', amount: 208000 },
        { month: 'Aug', amount: 163000 },
      ],
    };
  },
};
