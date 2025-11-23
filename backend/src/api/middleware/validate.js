const { z } = require('zod');

/**
 * Middleware factory to validate request data against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} source - Source of data ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validated = schema.parse(data);

      // Replace request data with validated data
      req[source] = validated;

      // Also store validated data in req.validated for convenience
      if (!req.validated) {
        req.validated = {};
      }
      req.validated[source] = validated;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod errors for user-friendly response
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }

      // Pass other errors to error handler
      next(error);
    }
  };
}

/**
 * Middleware to validate request body
 * @param {z.ZodSchema} schema - Zod schema
 * @returns {Function} Express middleware
 */
function validateBody(schema) {
  return validate(schema, 'body');
}

/**
 * Middleware to validate query parameters
 * @param {z.ZodSchema} schema - Zod schema
 * @returns {Function} Express middleware
 */
function validateQuery(schema) {
  return validate(schema, 'query');
}

/**
 * Middleware to validate route parameters
 * @param {z.ZodSchema} schema - Zod schema
 * @returns {Function} Express middleware
 */
function validateParams(schema) {
  return validate(schema, 'params');
}

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams
};
