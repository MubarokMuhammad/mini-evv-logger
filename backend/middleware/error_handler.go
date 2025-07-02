package middleware

import (
	"mini-evv-logger/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// ErrorHandlerMiddleware handles errors and provides consistent error responses
func ErrorHandlerMiddleware(logger *logrus.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Handle any errors that occurred during request processing
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			
			logger.WithFields(logrus.Fields{
				"error":  err.Error(),
				"path":   c.Request.URL.Path,
				"method": c.Request.Method,
			}).Error("Request processing error")

			// Determine status code based on error type
			statusCode := http.StatusInternalServerError
			errorMessage := "Internal server error"

			// You can add custom error type checking here
			switch err.Type {
			case gin.ErrorTypeBind:
				statusCode = http.StatusBadRequest
				errorMessage = "Invalid request data"
			case gin.ErrorTypePublic:
				statusCode = http.StatusBadRequest
				errorMessage = err.Error()
			}

			// Send error response
			c.JSON(statusCode, models.ErrorResponse{
				Error: errorMessage,
				Code:  statusCode,
			})
			c.Abort()
		}
	}
}

// RecoveryMiddleware recovers from panics and logs them
func RecoveryMiddleware(logger *logrus.Logger) gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		logger.WithFields(logrus.Fields{
			"panic":  recovered,
			"path":   c.Request.URL.Path,
			"method": c.Request.Method,
		}).Error("Panic recovered")

		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "An unexpected error occurred",
			Code:  http.StatusInternalServerError,
		})
		c.Abort()
	})
}

// CORSMiddleware handles CORS headers
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}