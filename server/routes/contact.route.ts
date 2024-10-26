import express from 'express';
import * as contactController from '../controllers/contact.controller';
import { checkPermission } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', contactController.getAllContacts);
router.post('/', checkPermission('MANAGE_CONTACTS'), contactController.createContact);
router.get('/:id', contactController.getContactById);
router.put('/:id', checkPermission('MANAGE_CONTACTS'), contactController.updateContact);
router.delete('/:id', checkPermission('MANAGE_CONTACTS'), contactController.deleteContact);

// Routes for managing venues associated with a contact
// router.post('/:contactId/venues/:venueId', checkPermission('MANAGE_CONTACTS'), contactController.addVenueToContactController);
// router.delete('/:contactId/venues/:venueId', checkPermission('MANAGE_CONTACTS'), contactController.removeVenueFromContactController);
// router.get('/:contactId/venues', contactController.getVenuesForContactController);

export default router;