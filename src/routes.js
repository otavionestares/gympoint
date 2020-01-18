import { Router } from 'express';
import SessionController from './app/controllers/sessionController';
import StudentController from './app/controllers/studentController';
import PlanController from './app/controllers/planController';
import RegistrationController from './app/controllers/registrationController';
import CheckinController from './app/controllers/checkinController';
import HelpOrderController from './app/controllers/helpOrderController';
import authMiddleware from './middlewares/auth';

const routes = new Router();

// Login
routes.post('/sessions', SessionController.store);

// Only user with token allowed to change data
routes.use(authMiddleware);

// Store Students
routes.post('/students', StudentController.store);
// Update Students
routes.put('/students', StudentController.update);
// List Students
routes.get('/students', StudentController.index);

// Check In
routes.post('/students/:id/checkin', CheckinController.store);

// List Check In
routes.get('/students/checkins', CheckinController.index);

// Store Plans
routes.post('/plans', PlanController.store);
// List Plans
routes.get('/plans', PlanController.index);
// Remove Plans
routes.delete('/plans/:id', PlanController.delete);
// Update Pland
routes.put('/plans', PlanController.update);

// Store Registrations
routes.post('/registrations', RegistrationController.store);
// Update Registrations
routes.put('/registrations', RegistrationController.update);
// List Registrations
routes.get('/registrations', RegistrationController.index);
// Delete Registrations
routes.delete('/registrations/:id', RegistrationController.delete);

// Store Help Orders
routes.post('/students/:id/help-orders', HelpOrderController.store);
// List Help Orders
routes.get('/students/:id/help-orders', HelpOrderController.index);
// Answer question from studens
routes.post('/help-orders/:id/answer', HelpOrderController.answer);

export default routes;
