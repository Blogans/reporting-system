import request from 'supertest';
import { app } from '../../server/index';
import { UserModel, VenueModel, ContactModel, OffenderModel, IncidentModel, WarningModel, BanModel } from '../../server/models';

describe('Incident Reporting System Tests', () => {
  let adminCookie: string;
  let staffCookie: string;
  let staffUser: any;
  let adminUser: any;
  let venue: any;
  let offender: any;
  let incident: any;
  let warning: any;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await VenueModel.deleteMany({});
    await ContactModel.deleteMany({});
    await OffenderModel.deleteMany({});
    await IncidentModel.deleteMany({});
    await WarningModel.deleteMany({});
    await BanModel.deleteMany({});

    // Create an admin user and a staff user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'admin', email: 'admin@test.com', password: 'Password123!', role: 'admin' });
    adminUser = adminResponse.body.user;

    const staffResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'staff', email: 'staff@test.com', password: 'Password123!', role: 'staff' });
    staffUser = staffResponse.body.user;

    // Login and get cookies
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'Password123!' });
    adminCookie = adminLogin.headers['set-cookie']?.[0] || '';

    const staffLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'staff@test.com', password: 'Password123!' });
    staffCookie = staffLogin.headers['set-cookie']?.[0] || '';

    //Variables Definition
    venue = await VenueModel.create({ name: 'Test Venue', address: '123 Test St' });
    offender = await OffenderModel.create({ firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01' });
    incident = await IncidentModel.create({ 
      date: new Date(), 
      description: 'Test incident', 
      venue: venue._id, 
      submittedBy: staffUser._id 
    });
    warning = await WarningModel.create({ 
      date: new Date(), 
      offender: offender._id, 
      incidents: [incident._id], 
      submittedBy: staffUser._id 
    });
    await BanModel.create({ 
      date: new Date(), 
      offender: offender._id, 
      warnings: [warning._id], 
      submittedBy: staffUser._id 
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newuser', email: 'newuser@test.com', password: 'Password123!', role: 'staff' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
    });

    it('should login an existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'staff@test.com', password: 'Password123!' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });
  });
  
  describe('Bans', () => {
    it('should create a new ban', async () => {
      const offender = await OffenderModel.create({ firstName: 'Bob', lastName: 'Smith', dateOfBirth: '1985-05-05' });
      const venue = await VenueModel.create({ name: 'Ban Venue', address: '101 Ban St' });
      const incident = await IncidentModel.create({ date: new Date(), description: 'Ban incident', venue: venue._id, submittedBy: staffUser._id });
      const warning = await WarningModel.create({ date: new Date(), offender: offender._id, incidents: [incident._id], submittedBy: staffUser._id });
      
      const response = await request(app)
        .post('/api/bans')
        .set('Cookie', staffCookie)
        .send({ date: new Date(), offender: offender._id, warnings: [warning._id], submittedBy: staffUser._id });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('ban');
      
    });

    it('should get all bans', async () => {
      const response = await request(app)
        .get('/api/bans')
        .set('Cookie', staffCookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('Contacts', () => {
    it('should create a new contact', async () => {
      const response = await request(app)
        .post('/api/contacts')
        .set('Cookie', adminCookie)
        .send({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '1234567890' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
    });

    it('should get all contacts', async () => {
      const response = await request(app)
        .get('/api/contacts')
        .set('Cookie', staffCookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('Offenders', () => {
    it('should create a new offender', async () => {
      const response = await request(app)
        .post('/api/offenders')
        .set('Cookie', staffCookie)
        .send({ firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
    });

    it('should get all offenders', async () => {
      const response = await request(app)
        .get('/api/offenders')
        .set('Cookie', staffCookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('Incidents', () => {
    it('should create a new incident', async () => {
      const venue = await VenueModel.create({ name: 'Incident Venue', address: '456 Incident St' });
      const response = await request(app)
        .post('/api/incidents')
        .set('Cookie', staffCookie)
        .send({ date: new Date(), description: 'Test incident', venue: venue._id, submittedBy: staffUser._id });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('incident');
      expect(response.body.incident).toHaveProperty('_id');
    });

    it('should get all incidents', async () => {
      const response = await request(app)
        .get('/api/incidents')
        .set('Cookie', staffCookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('Dashboard', () => {
    it('should retrieve accurate dashboard stats', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Cookie', adminCookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        totalIncidents: 1,
        totalWarnings: 1,
        totalBans: 1,
        totalVenues: 1
      });
    });

    it('should retrieve recent incidents and warnings', async () => {
      const incidentsResponse = await request(app)
        .get('/api/dashboard/recent/incidents')
        .set('Cookie', adminCookie);

      expect(incidentsResponse.status).toBe(200);
      expect(Array.isArray(incidentsResponse.body)).toBeTruthy();
      expect(incidentsResponse.body.length).toBe(1);
      expect(incidentsResponse.body[0]._id).toBe(incident._id.toString());

      const warningsResponse = await request(app)
        .get('/api/dashboard/recent/warnings')
        .set('Cookie', adminCookie);

      expect(warningsResponse.status).toBe(200);
      expect(Array.isArray(warningsResponse.body)).toBeTruthy();
      expect(warningsResponse.body.length).toBe(1);
      expect(warningsResponse.body[0]._id).toBe(warning._id.toString());
    });
  });
  
  describe('Warnings', () => {
    it('should create a new warning', async () => {
      const offender = await OffenderModel.create({ firstName: 'Jane', lastName: 'Doe', dateOfBirth: '1990-01-01' });
      const venue = await VenueModel.create({ name: 'Warning Venue', address: '789 Warning St' });
      const incident = await IncidentModel.create({ date: new Date(), description: 'Warning incident', venue: venue._id, submittedBy: staffUser._id });
      
      const response = await request(app)
        .post('/api/warnings')
        .set('Cookie', staffCookie)
        .send({ date: new Date(), offender: offender._id, incidents: [incident._id], submittedBy: staffUser._id });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('warning');
      expect(response.body.warning).toHaveProperty('_id');
    });

    it('should get all warnings', async () => {
      const response = await request(app)
        .get('/api/warnings')
        .set('Cookie', staffCookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('Admin User Management', () => {
    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', adminCookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Cookie', adminCookie)
        .send({ username: 'newuser', email: 'newuser@test.com', password: 'Password123!', role: 'staff' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('_id');
    });

    it('should edit a user', async () => {
      const response = await request(app)
        .put(`/api/users/${staffUser._id}`)
        .set('Cookie', adminCookie)
        .send({ username: 'updatedstaff', role: 'manager' });
      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('updatedstaff');
      expect(response.body.user.role).toBe('manager');
    });
  });

  describe('Venues', () => {
    it('should create a new venue', async () => {
      const response = await request(app)
        .post('/api/venues')
        .set('Cookie', adminCookie)
        .send({ name: 'Test Venue', address: '123 Test St' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('venue');
      expect(response.body.venue).toHaveProperty('_id');
      expect(response.body.message).toBe('Venue created successfully');
    });

    it('should get all venues', async () => {
      const response = await request(app)
        .get('/api/venues')
        .set('Cookie', staffCookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
  
});