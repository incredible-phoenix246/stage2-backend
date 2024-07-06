import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        res.status(422).json({
          status: "Bad request",
          errors: errorMessages,
          message: "Validation error",
        });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
