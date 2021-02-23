package handler

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

/*
GetTestData returns some test data
*/
func GetTestData(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		rows, err := db.Query("select * from test")
		if err != nil {
			panic(err.Error())
		}
		defer rows.Close()
		var (
			id   int
			name string
		)
		for rows.Next() {
			err := rows.Scan(&id, &name)
			if err != nil {
				log.Fatal(err)
			}
			fmt.Println(id, name)
		}
		c.JSON(200, gin.H{
			"message": "pong",
		})
	}
	return gin.HandlerFunc(fn)
}
