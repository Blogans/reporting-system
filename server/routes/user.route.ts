import express from 'express';
import * as userController from '../controllers/user.controller.js';
import * as authController from '../controllers/auth.controller.js';
import { checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/me', userController.getMyUser);
router.get('/:id/venues', userController.getUserVenues);
router.post('/', checkPermission('MANAGE_USERS'), authController.register);
router.get('/:id', userController.getUserById);
router.put('/:id', checkPermission('MANAGE_USERS'), userController.updateUser);
router.delete('/:id', checkPermission('MANAGE_USERS'), userController.deleteUser);
router.post('/:id/venues/:venueId', checkPermission('MANAGE_USERS'), userController.addVenueToUser);
router.delete('/:id/venues/:venueId', checkPermission('MANAGE_USERS'), userController.removeVenueFromUser);


// Routes for managing venues associated with a contact
// router.post('/:contactId/venues/:venueId', checkPermission('MANAGE_CONTACTS'), contactController.addVenueToContactController);
// router.delete('/:contactId/venues/:venueId', checkPermission('MANAGE_CONTACTS'), contactController.removeVenueFromContactController);
// router.get('/:contactId/venues', contactController.getVenuesForContactController);

export default router;