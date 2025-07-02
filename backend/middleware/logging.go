package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// LoggingMiddleware creates a gin middleware for logging requests
func LoggingMiddleware(logger *logrus.Logger) gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		logger.WithFields(logrus.Fields{
			"status_code":  param.StatusCode,
			"latency":      param.Latency,
			"client_ip":    param.ClientIP,
			"method":       param.Method,
			"path":         param.Path,
			"user_agent":   param.Request.UserAgent(),
			"error":        param.ErrorMessage,
			"timestamp":    param.TimeStamp.Format(time.RFC3339),
		}).Info("HTTP Request")
		return ""
	})
}

// StructuredLoggingMiddleware provides more detailed structured logging
func StructuredLoggingMiddleware(logger *logrus.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		// Process request
		c.Next()

		// Log request details
		latency := time.Since(start)
		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()
		bodySize := c.Writer.Size()

		if raw != "" {
			path = path + "?" + raw
		}

		logEntry := logger.WithFields(logrus.Fields{
			"status_code": statusCode,
			"latency":     latency,
			"client_ip":   clientIP,
			"method":      method,
			"path":        path,
			"body_size":   bodySize,
			"user_agent":  c.Request.UserAgent(),
		})

		if len(c.Errors) > 0 {
			logEntry = logEntry.WithField("errors", c.Errors.String())
		}

		// Log based on status code
		switch {
		case statusCode >= 500:
			logEntry.Error("Server Error")
		case statusCode >= 400:
			logEntry.Warn("Client Error")
		case statusCode >= 300:
			logEntry.Info("Redirection")
		default:
			logEntry.Info("Success")
		}
	}
}