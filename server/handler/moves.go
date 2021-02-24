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
urlParam {
	sid
}
params {
	aid
	did
	move?
}
*/
func GetMovesInSession(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		sid := c.Param("sid")
		params := c.Request.URL.Query()
		move, ok := params["move"]
		var queryString string
		var rows *sql.Rows
		var err error

		if ok {
			queryString = `
				select move, delay, accuracy, timestamp from moves
				where sid = $1 and aid = $2 and did = $3 and move = $4
			`
			rows, err = db.Query(
				queryString,
				sid,
				params["aid"][0],
				params["did"][0],
				move[0],
			)
		} else {
			queryString = `
				select move, delay, accuracy, timestamp from moves
				where sid = $1 and aid = $2 and did = $3
			`
			rows, err = db.Query(
				queryString,
				sid,
				params["aid"][0],
				params["did"][0],
			)
		}

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

/*
GetAllMoves returns all the moves in an account
params {
	aid
	move?
}
*/
func GetAllMoves(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		params := c.Request.URL.Query()
		move, ok := params["move"]
		var queryString string
		var rows *sql.Rows
		var err error

		if ok {
			queryString = `
				select move, delay, accuracy, timestamp from moves
				where aid = $1 and move = $2
			`
			rows, err = db.Query(
				queryString,
				params["aid"][0],
				move[0],
			)
		} else {
			queryString = `
				select move, delay, accuracy, timestamp from moves
				where aid = $1
			`
			rows, err = db.Query(
				queryString,
				params["aid"][0],
			)
		}

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
