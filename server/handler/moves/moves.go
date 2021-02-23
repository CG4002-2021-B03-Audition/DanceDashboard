package handler

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/entity"
	"github.com/gin-gonic/gin"
)

/*
GetMovesInSession returns all the moves performed in a dance session
*/
func GetMovesInSession(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		params := c.Request.URL.Query()
		rows, err := db.Query(
			"select move, delay, accuracy, timestamp from moves where sid = $1 and aid = $2 and did = $3",
			params["sid"][0],
			params["aid"][0],
			params["did"][0],
		)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": err,
			})
		}
		defer rows.Close()
		var moves []entity.Move
		for rows.Next() {
			var move entity.Move
			err := rows.Scan(&move.Move, &move.Delay, &move.Accuracy, &move.Timestamp)

			if err != nil {
				log.Fatal(err)
			}
			moves = append(moves, move)
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": moves,
		})
	}
	return gin.HandlerFunc(fn)
}
