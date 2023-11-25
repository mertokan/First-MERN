import express from 'express'
import {
  createListing,
  test,
  deleteListing,
  updateListing,
  getListing,
} from '../controllers/listing.controller.js'
import {verifyToken} from '../utils/verifyUser.js'

const router = express.Router()

router.get('/test', test)
router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updateListing)
router.get('/get/:id', getListing)

export default router