package middleware

import (
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// SetupLogger configures and returns a structured logger
func SetupLogger() *logrus.Logger {
	logger := logrus.New()

	// Set log level based on environment
	logLevel := os.Getenv("LOG_LEVEL")
	switch logLevel {
	case "debug":
		logger.SetLevel(logrus.DebugLevel)
	case "info":
		logger.SetLevel(logrus.InfoLevel)
	case "warn":
		logger.SetLevel(logrus.WarnLevel)
	case "error":
		logger.SetLevel(logrus.ErrorLevel)
	default:
		logger.SetLevel(logrus.InfoLevel)
	}

	// Set formatter
	if os.Getenv("LOG_FORMAT") == "json" {
		logger.SetFormatter(&logrus.JSONFormatter{
			TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
		})
	} else {
		logger.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
		})
	}

	// Set output
	logger.SetOutput(os.Stdout)

	return logger
}

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