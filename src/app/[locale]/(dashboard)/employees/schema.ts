import { z } from 'zod'

export const employeeSchema = z.object({
  employee_id: z.string()
    .min(1, 'Employee ID is required')
    .max(50, 'Employee ID must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Employee ID can only contain letters, numbers, hyphens, and underscores'),
  full_name: z.string()
    .min(1, 'Full name is required')
    .max(255, 'Full name must be less than 255 characters'),
  full_name_en: z.string()
    .max(255, 'Full name (EN) must be less than 255 characters')
    .optional(),
  department: z.string()
    .max(100, 'Department must be less than 100 characters')
    .optional(),
  color: z.string()
    .max(50, 'Color must be less than 50 characters')
    .optional(),
})

export type EmployeeInput = z.infer<typeof employeeSchema>
