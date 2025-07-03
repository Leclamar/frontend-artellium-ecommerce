import Commission from '../models/Commission.js';
import { inngest } from '../inngest/client.js';

export const createCommission = async (req, res) => {
  try {
    const { title, description, budget, deadline, tags } = req.body;
    const clientId = req.auth.userId;

    const commission = await Commission.create({
      title,
      description,
      client: clientId,
      budget,
      deadline,
      tags,
      status: 'pending'
    });

    // Trigger new commission event
    await inngest.send({
      name: 'commission.created',
      data: {
        commissionId: commission._id,
        clientId
      }
    });

    res.status(201).json({
      success: true,
      data: commission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getCommission = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id)
      .populate('client', 'username avatar')
      .populate('artist', 'username skills portfolio');

    if (!commission) {
      return res.status(404).json({
        success: false,
        error: 'Commission not found'
      });
    }

    // Authorization check
    const isClient = commission.client._id.equals(req.auth.userId);
    const isArtist = commission.artist?._id.equals(req.auth.userId);
    const isAdmin = req.auth.user.publicMetadata.role === 'admin';

    if (!isClient && !isArtist && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    res.json({
      success: true,
      data: commission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { userId, user } = req.auth;

    const commission = await Commission.findById(id);
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

    // Field-level permissions
    if (isClient || isAdmin) {
      if (updates.title) commission.title = updates.title;
      if (updates.description) commission.description = updates.description;
      if (updates.budget) commission.budget = updates.budget;
      if (updates.tags) commission.tags = updates.tags;
    }

    if (isArtist || isAdmin) {
      if (updates.status) {
        commission.status = updates.status;
        
        if (updates.status === 'completed') {
          await inngest.send({
            name: 'commission.completed',
            data: {
              commissionId: commission._id,
              artistId: userId
            }
          });
        }
      }
    }

    await commission.save();

    res.json({
      success: true,
      data: commission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteCommission = async (req, res) => {
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

    await commission.deleteOne();

    await inngest.send({
      name: 'commission.deleted',
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
};

export const listCommissions = async (req, res) => {
  try {
    const { userId, user } = req.auth;
    const { status, sort } = req.query;
    
    let query = {};
    let populateOptions = [];

    if (user.publicMetadata.role === 'artist') {
      query.artist = userId;
      populateOptions = [{ path: 'client', select: 'username avatar' }];
    } else {
      query.client = userId;
      populateOptions = [{ path: 'artist', select: 'username skills' }];
    }

    if (status) {
      query.status = status;
    }

    const sortOptions = sort === 'oldest' 
      ? { createdAt: 1 } 
      : { createdAt: -1 };

    const commissions = await Commission.find(query)
      .populate(populateOptions)
      .sort(sortOptions);

    res.json({
      success: true,
      data: commissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};