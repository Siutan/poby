package createHooks

import (
	"log"
	"poby-server/utils"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnCreateProject(app *pocketbase.PocketBase) {
	app.OnRecordBeforeCreateRequest("projects").Add(func(e *core.RecordCreateEvent) error {
		// app_secret_hash will be sent un hashed, so we need to hash it here
		appSecret, ok := e.Record.Get("app_secret_hash").(string)
		if ok && appSecret != "" {
			hashedAppSecret, err := utils.HashPassword(appSecret)
			if err != nil {
				log.Println("Error hashing app secret:", err)
				return err
			}
			e.Record.Set("app_secret_hash", hashedAppSecret)
		}
		return nil
	})
}
