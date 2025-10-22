# Logging & Monitoring Guide

## Overview

โปรเจกต์ใช้ custom logger utility (`src/lib/logger.ts`) สำหรับ logging ทั้งหมด

## Logger API

```typescript
import { logger } from '@/lib/logger'

// Info - สำหรับ general information
logger.info('User logged in', { userId: '123' })

// Warning - สำหรับ non-critical issues
logger.warn('Rate limit approaching', { count: 8 })

// Error - สำหรับ errors
logger.error('Failed to save data', error, { userId: '123' })
```

## Log Levels

### 1. INFO
ใช้สำหรับ:
- Successful operations
- Important state changes
- User actions

```typescript
logger.info('Employee created successfully', { employee_id: 'EMP001' })
logger.info('User logged in', { email: 'user@example.com' })
```

### 2. WARN
ใช้สำหรับ:
- Rate limiting
- Deprecated features
- Non-critical issues

```typescript
logger.warn('Rate limit exceeded for createEmployee')
logger.warn('Using deprecated API', { endpoint: '/old-api' })
```

### 3. ERROR
ใช้สำหรับ:
- Database errors
- API failures
- Unexpected errors

```typescript
logger.error('Failed to create employee', error, { employee_id: 'EMP001' })
logger.error('Database connection failed', error)
```

## Log Format

```
[LEVEL] TIMESTAMP - MESSAGE
  Data: { ... }
  Error: error message
  Stack: stack trace
```

ตัวอย่าง:
```
[ERROR] 2024-01-15T10:30:00.000Z - Failed to create employee
  Data: {
    "employee_id": "EMP001",
    "full_name": "John Doe"
  }
  Error: duplicate key value violates unique constraint
  Stack: Error: duplicate key...
```

## Current Implementation

### Server Actions
- ✅ Employee actions (create, update, delete)
- ✅ Prize actions (create, update, delete)
- ✅ Rate limiting warnings

### Error Boundaries
- ✅ Root error boundary
- ✅ Dashboard error boundary

## Integration with External Services

### Sentry (Recommended)

```bash
bun add @sentry/nextjs
```

```typescript
// src/lib/logger.ts
import * as Sentry from '@sentry/nextjs'

function log(level: LogLevel, message: string, data?: unknown, error?: unknown) {
  // ... existing code ...
  
  if (level === 'error' && error) {
    Sentry.captureException(error, {
      extra: { message, data }
    })
  }
}
```

### LogRocket

```bash
bun add logrocket
```

```typescript
// src/lib/logger.ts
import LogRocket from 'logrocket'

function log(level: LogLevel, message: string, data?: unknown, error?: unknown) {
  // ... existing code ...
  
  if (level === 'error') {
    LogRocket.captureException(error as Error, {
      extra: { message, data }
    })
  }
}
```

### Custom Webhook

```typescript
// src/lib/logger.ts
async function sendToWebhook(logData: LogData) {
  if (process.env.NODE_ENV === 'production') {
    await fetch(process.env.LOGGING_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    })
  }
}
```

## Best Practices

### 1. Log Meaningful Data
```typescript
// ❌ Bad
logger.info('Action completed')

// ✅ Good
logger.info('Employee created', { employee_id: 'EMP001', department: 'IT' })
```

### 2. Don't Log Sensitive Data
```typescript
// ❌ Bad
logger.info('User logged in', { password: 'secret123' })

// ✅ Good
logger.info('User logged in', { email: 'user@example.com' })
```

### 3. Use Appropriate Log Levels
```typescript
// ❌ Bad - Using error for non-errors
logger.error('User clicked button')

// ✅ Good
logger.info('User clicked button', { buttonId: 'submit' })
```

### 4. Include Context
```typescript
// ❌ Bad
logger.error('Failed', error)

// ✅ Good
logger.error('Failed to create employee', error, {
  employee_id: 'EMP001',
  action: 'create',
  timestamp: Date.now()
})
```

## Monitoring Checklist

- [ ] Set up external logging service (Sentry/LogRocket)
- [ ] Configure error alerts
- [ ] Set up performance monitoring
- [ ] Create dashboard for logs
- [ ] Set up log retention policy
- [ ] Configure log sampling (if needed)
- [ ] Test error reporting in production

## Environment Variables

```bash
# .env.local
SENTRY_DSN=https://xxx@sentry.io/xxx
LOGROCKET_APP_ID=xxx/xxx
LOGGING_WEBHOOK_URL=https://your-webhook.com/logs
```

## Viewing Logs

### Development
```bash
# Console output
bun run dev

# Filter by level
bun run dev | grep ERROR
bun run dev | grep WARN
```

### Production (Vercel)
```bash
# View logs
vercel logs

# Follow logs
vercel logs --follow

# Filter by function
vercel logs --function=api/employees
```

## Performance Impact

- Logger is synchronous (minimal overhead)
- External service calls should be async
- Consider log sampling for high-traffic endpoints
- Use structured logging for better parsing

## Next Steps

1. Choose external logging service
2. Set up error alerts
3. Create monitoring dashboard
4. Configure log retention
5. Test in production

---

**Note:** Remember to update this guide when adding new logging points or changing log format.
