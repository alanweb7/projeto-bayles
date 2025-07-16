const Joi = require('joi');

const messageSchema = Joi.object({
  queue: Joi.string().required(),
  message: Joi.object({
    id: Joi.string().required(),
    content: Joi.string().required(),
    timestamp: Joi.string().isoDate().required(),
    metadata: Joi.object({
      sender: Joi.string().required(),
      priority: Joi.string().valid('high', 'medium', 'low').required()
    }).required()
  }).required()
});

function validateMessage(req, res, next) {
  const { error } = messageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  next();
}

module.exports = { validateMessage };
