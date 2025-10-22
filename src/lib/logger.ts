type LogLevel = 'info' | 'warn' | 'error'

interface LogData {
  message: string
  level: LogLevel
  timestamp: string
  data?: unknown
  error?: unknown
}

function formatLog(logData: LogData): string {
  const { level, timestamp, message, data, error } = logData
  const prefix = `[${level.toUpperCase()}] ${timestamp}`
  
  let output = `${prefix} - ${message}`
  
  if (data) {
    output += `\n  Data: ${JSON.stringify(data, null, 2)}`
  }
  
  if (error) {
    if (error instanceof Error) {
      output += `\n  Error: ${error.message}\n  Stack: ${error.stack}`
    } else {
      output += `\n  Error: ${JSON.stringify(error, null, 2)}`
    }
  }
  
  return output
}

function log(level: LogLevel, message: string, data?: unknown, error?: unknown) {
  const logData: LogData = {
    message,
    level,
    timestamp: new Date().toISOString(),
    data,
    error,
  }
  
  const formatted = formatLog(logData)
  
  switch (level) {
    case 'error':
      console.error(formatted)
      // TODO: Send to external service (Sentry, LogRocket, etc.)
      break
    case 'warn':
      console.warn(formatted)
      break
    case 'info':
      console.log(formatted)
      break
  }
}

export const logger = {
  info: (message: string, data?: unknown) => {
    log('info', message, data)
  },
  
  warn: (message: string, data?: unknown) => {
    log('warn', message, data)
  },
  
  error: (message: string, error?: unknown, data?: unknown) => {
    log('error', message, data, error)
  },
}
