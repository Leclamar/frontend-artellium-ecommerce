import express from 'express';
import mongoose from 'mongoose';
import { ClerkExpressRequireAuth } from '@clerk/backend';
import { inngest } from '../inngest/client.js';

const router = express.Router();
const Commission = mongoose.model('Commission');

// Middleware khusus untuk artist
const requireArtist = ClerkExpressRequireAuth({
  authorizedParties: ['http://localhost:3000'],
  role: 'artist'
});

// Middleware khusus untuk client
const requireClient = ClerkExpressRequireAuth({
  authorizedParties: ['http://localhost:3000'],
  role: 'client'
});

// 1. Buat Komisi Baru (Client)
router.post('/', requireClient, async (req, res) => {
  try {
    const { title, description, deadline, budget } = req.body;
    const clientId = req.auth.userId;

    const newCommission = await Commission.create({
      title,
      description,
      deadline: new Date(deadline),
      budget,
      client: clientId,
      status: 'draft'
    });

    // Trigger background job via Inngest
    await inngest.send({
      name: 'commission/created',
      data: {
        commissionId: newCommission._id,
        clientId
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: newCommission._id,
        title: newCommission.title,
        status: newCommission.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// 2. Daftar Komisi (Artist/Client)
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { role } = req.auth.user.publicMetadata;
    const { status } = req.query;

    let query = {};
    if (role === 'artist') {
      query = { artist: userId, ...(status && { status }) };
    } else {
      query = { client: userId, ...(status && { status }) };
    }

    const commissions = await Commission.find(query)
      .populate('client', 'username profileImage')
      .populate('artist', 'username skills')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: commissions.map(comm => ({
        id: comm._id,
        title: comm.title,
        deadline: comm.deadline,
        status: comm.status,
        client: comm.client,
        artist: comm.artist,
        budget: comm.budget
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. Detail Komisi
router.get('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id)
      .populate('client', 'username profileImage')
      .populate('artist', 'username skills portfolio')
      .populate('revisions');

    if (!commission) {
      return res.status(404).json({
        success: false,
        error: 'Commission not found'
      });
    }

    // Authorization check
    const { userId, user } = req.auth;
    const isOwner = [commission.client._id, commission.artist?._id].includes(userId);
    const isAdmin = user.publicMetadata.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    res.json({
      success: true,
      data: {
        id: commission._id,
        title: commission.title,
        description: commission.description,
        deadline: commission.deadline,
        budget: commission.budget,
        status: commission.status,
        client: commission.client,
        artist: commission.artist,
        revisions: commission.revisions,
        createdAt: commission.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. Update Komisi (Artist/Client)
router.put('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);
    const { userId, user } = req.auth;
    const { title, description, status } = req.body;

    if (!commission) {
      return res.status(404).json({
        success: false,
        error: 'Commission not found'
      });
    }

    // Authorization logic
    const isClient = commission.client.equals(userId);
    const isArtist = commission.artist?.equals(userId);
    const isAdmin = user.publicMetadata.role === 'admin';

    if (!isClient && !isArtist && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized update'
      });
    }

    // Field-level permissions
    if (title) commission.title = title;
    if (description) commission.description = description;
    
    // Hanya client bisa update budget
    if (isClient && req.body.budget) {
      commission.budget = req.body.budget;
    }

    // Hanya artist bisa update status tertentu
    if (isArtist && ['in_progress', 'completed'].includes(status)) {
      commission.status = status;
      
      // Trigger event ketika status berubah
      if (status === 'completed') {
        await inngest.send({
          name: 'commission/completed',
          data: {
            commissionId: commission._id,
            artistId: userId
          }
        });
      }
    }

    await commission.save();

    res.json({
      success: true,
      data: {
        id: commission._id,
        title: commission.title,
        status: commission.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// 5. Hapus Komisi (Hanya Client/Admin)
router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);
    const { userId, user } = req.auth;

    if (!commission) {
      return res.status(404).json({
        success: false,
        error: 'Commission not found'
      });
    }

    const isClient = commission.client.equals(userId);
    const isAdmin = user.publicMetadata.role === 'admin';

    if (!isClient && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized deletion'
      });
    }

    await Commission.deleteOne({ _id: req.params.id });

    // Trigger cleanup job
    await inngest.send({
      name: 'commission/deleted',
      data: {
        commissionId: req.params.id
      }
    });

    res.json({
      success: true,
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;