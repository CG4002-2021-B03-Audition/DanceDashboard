package handler

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/entity"
	"github.com/gin-gonic/gin"
)

/*
GetAllSessions returns all sids
params {
	date?
}
*/
func GetAllSessions(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		params := c.Request.URL.Query()
		date, ok := params["date"]

		var queryString string
		var rows *sql.Rows
		var err error

		if !ok {
			queryString = `select sid, aid, timestamp from sessions`
			rows, err = db.Query(queryString)
		} else {
			queryString = `
				select sid, aid, timestamp 
				from sessions 
				where timestamp = to_date($1, 'YYYYMMDD')
			`
			rows, err = db.Query(queryString, date[0])
		}

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": err,
			})
		}

		defer rows.Close()
		var sessions []entity.Session
		for rows.Next() {
			var session entity.Session
			err := rows.Scan(&session.Sid, &session.Aid, &session.Timestamp)

			if err != nil {
				log.Fatal(err)
			}
			sessions = append(sessions, session)
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": sessions,
		})
	}
	return gin.HandlerFunc(fn)
}
