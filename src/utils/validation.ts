import { z } from 'zod';

// Enhanced validation schemas
export const validationSchemas = {
  // Email validation with enhanced security
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .refine(
      (email) => {
        // Additional email validation
        const parts = email.split('@');
        if (parts.length !== 2) return false;
        
        const [local, domain] = parts;
        
        // Local part validation
        if (local.length > 64) return false;
        if (local.startsWith('.') || local.endsWith('.')) return false;
        if (local.includes('..')) return false;
        
        // Domain validation
        if (domain.length > 253) return false;
        if (!domain.includes('.')) return false;
        
        return true;
      },
      "Please enter a valid email address"
    ),

  // URL validation
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => {
        try {
          const parsedUrl = new URL(url);
          return ['http:', 'https:'].includes(parsedUrl.protocol);
        } catch {
          return false;
        }
      },
      "URL must use HTTP or HTTPS protocol"
    ),

  // Phone number validation
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\+]?[(]?[\d\s\-\(\)]{10,}$/,
      "Please enter a valid phone number"
    ),

  // Password validation with strength requirements
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (password) => /\d/.test(password),
      "Password must contain at least one number"
    )
    .refine(
      (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      "Password must contain at least one special character"
    ),

  // Name validation
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .regex(
      /^[a-zA-Z\s\-']+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  // Message/content validation
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long")
    .refine(
      (message) => {
        // Check for excessive repeated characters
        const repeatedPattern = /(.)\1{4,}/;
        return !repeatedPattern.test(message);
      },
      "Message contains too many repeated characters"
    ),

  // Company name validation
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name is too long")
    .regex(
      /^[a-zA-Z0-9\s\-&.,'"()]+$/,
      "Company name contains invalid characters"
    ),

  // Budget range validation
  budgetRange: z.enum([
    "$500 - $1,000",
    "$1,000 - $5,000", 
    "$5,000 - $10,000",
    "$10,000+"
  ], {
    message: "Please select a valid budget range",
  }),

  // Service selection validation
  service: z.enum([
    "Digital Marketing",
    "Web Design & Development",
    "Branding & Identity",
    "Content Creation",
    "Multiple Services"
  ], {
    message: "Please select a valid service",
  }),
};

// Security validation utilities
export const securityValidation = {
  // Honeypot field validation
  honeypot: z.string().max(0, "Bot detected"),

  // Rate limiting validation
  checkRateLimit: (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
    const key = `rate_limit_${identifier}`;
    const now = Date.now();
    
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        const timePassed = now - data.firstAttempt;
        
        if (timePassed < windowMs) {
          if (data.attempts >= maxAttempts) {
            return {
              allowed: false,
              remainingTime: Math.ceil((windowMs - timePassed) / 1000 / 60)
            };
          }
          
          data.attempts += 1;
        } else {
          // Reset window
          data.firstAttempt = now;
          data.attempts = 1;
        }
        
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        localStorage.setItem(key, JSON.stringify({
          firstAttempt: now,
          attempts: 1
        }));
      }
      
      return { allowed: true };
    } catch (error) {
      console.warn('Rate limiting error:', error);
      return { allowed: true }; // Fail open
    }
  },

  // Content filtering
  containsProfanity: (text: string): boolean => {
    // Basic profanity filter - extend as needed
    const profanityWords = [
      // Add your profanity list here
      'spam', 'scam', 'fake', 'fraud'
    ];
    
    const lowerText = text.toLowerCase();
    return profanityWords.some(word => lowerText.includes(word));
  },

  // SQL injection detection
  containsSQLInjection: (text: string): boolean => {
    const sqlPatterns = [
      /('|(\\u0027)|(\\u00271)|(%27)|(%22))/i,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
      /(script|javascript|vbscript|onload|onerror|onclick)/i,
      /(<|>|%3c|%3e)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(text));
  },

  // XSS detection
  containsXSS: (text: string): boolean => {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(text));
  }
};

// Enhanced contact form schema with security
export const enhancedContactFormSchema = z.object({
  fullName: validationSchemas.name,
  email: validationSchemas.email,
  companyName: validationSchemas.companyName.optional(),
  serviceInterested: validationSchemas.service,
  budgetRange: validationSchemas.budgetRange,
  projectDetails: validationSchemas.message,
  honeypot: securityValidation.honeypot,
}).refine(
  (data) => {
    // Additional security checks
    const textFields = [data.fullName, data.projectDetails, data.companyName].filter(Boolean);
    
    for (const field of textFields) {
      if (securityValidation.containsProfanity(field) ||
          securityValidation.containsSQLInjection(field) ||
          securityValidation.containsXSS(field)) {
        return false;
      }
    }
    
    return true;
  },
  {
    message: "Invalid content detected. Please review your submission.",
    path: ["projectDetails"]
  }
);

export type EnhancedContactFormData = z.infer<typeof enhancedContactFormSchema>;

// Validation utilities
export const validationUtils = {
  // Sanitize user input
  sanitizeText: (text: string): string => {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 5000); // Limit length
  },

  // Validate file uploads
  validateFile: (file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    maxFiles?: number;
  } = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      maxFiles = 1
    } = options;

    const errors: string[] = [];

    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Check for malicious files
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif'];
    const fileName = file.name.toLowerCase();
    
    if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
      errors.push('File type not allowed for security reasons');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};