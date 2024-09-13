package routes

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)


func Hello(app *pocketbase.PocketBase) {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/hello/:name", func(c echo.Context) error {
			name := c.PathParam("name")
	
			return c.JSON(http.StatusOK, map[string]string{"message": "Hello " + name})
		}, /* optional middlewares */)
	
		return nil
	})
}