import express from 'express';
import * as venueController from '../controllers/venue.controller';
import { checkPermission } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', venueController.getAllVenues);
router.post('/', checkPermission('MANAGE_VENUES'), venueController.createVenue);
router.get('/:id', venueController.getVenueById);
router.put('/:id', checkPermission('MANAGE_VENUES'), venueController.updateVenue);
router.delete('/:id', checkPermission('MANAGE_VENUES'), venueController.deleteVenue);

// New routes for managing contacts
router.post('/:venueId/contacts/:contactId', checkPermission('MANAGE_VENUES'), venueController.addContactToVenueController);
router.delete('/:venueId/contacts/:contactId', checkPermission('MANAGE_VENUES'), venueController.removeContactFromVenueController);
router.get('/:venueId/contacts', venueController.getContactsForVenueController);

export default router;
