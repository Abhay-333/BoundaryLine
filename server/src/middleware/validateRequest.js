import { ZodError } from "zod";

export const  validateRequest = (schemas) => {
  return (req, res, next) => {
    try {
      const validated = {};

      if (schemas.body) {
        validated.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        validated.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        validated.query = schemas.query.parse(req.query);
      }

      req.validated = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.flatten(),
        });
      }

      next(error);
    }
  };
};