import { Request, Response, NextFunction } from 'express';

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
};

/**
 * Sanitize MongoDB queries to prevent NoSQL injection
 */
export const sanitizeMongoQuery = (query: any): any => {
  if (typeof query !== 'object' || query === null) {
    return query;
  }

  // Remove MongoDB operators from user input
  const dangerous = ['$where', '$regex', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin'];
  
  const sanitized: any = {};
  
  for (const key in query) {
    if (dangerous.includes(key)) {
      continue; // Skip dangerous operators
    }
    
    if (typeof query[key] === 'object' && query[key] !== null) {
      sanitized[key] = sanitizeMongoQuery(query[key]);
    } else if (typeof query[key] === 'string') {
      sanitized[key] = sanitizeString(query[key]);
    } else {
      sanitized[key] = query[key];
    }
  }
  
  return sanitized;
};

/**
 * Middleware to sanitize request body
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeMongoQuery(req.body);
  }
  next();
};

/**
 * Middleware to sanitize query parameters
 */
export const sanitizeQuery = (req: Request, res: Response, next: NextFunction) => {
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeMongoQuery(req.query);
  }
  next();
};

/**
 * Middleware to sanitize params
 */
export const sanitizeParams = (req: Request, res: Response, next: NextFunction) => {
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeMongoQuery(req.params);
  }
  next();
};

/**
 * Combined sanitization middleware
 */
export const sanitizeAll = (req: Request, res: Response, next: NextFunction) => {
  sanitizeBody(req, res, () => {});
  sanitizeQuery(req, res, () => {});
  sanitizeParams(req, res, () => {});
  next();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
