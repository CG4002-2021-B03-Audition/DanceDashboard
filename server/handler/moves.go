package handler

import (
	"database/sql"
	"fmt"
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
func GetDataInSession(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		sid := c.Param("sid")
		params := c.Request.URL.Query()
		var queryString string
		var rows *sql.Rows
		var err error

		queryString = `
			select move as name, delay, accuracy, timestamp from moves where sid = $1 and aid = $2 and did = $3
			union 
			select position as name, delay, -1 as accuracy, timestamp from positions where sid = $1 and aid = $2 and did = $3
			order by timestamp;
		`
		rows, err = db.Query(
			queryString,
			sid,
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
		var danceData []entity.DanceAction
		for rows.Next() {
			var action entity.DanceAction
			err := rows.Scan(&action.Name, &action.Delay, &action.Accuracy, &action.Timestamp)

			if err != nil {
				log.Fatal(err)
			}
			danceData = append(danceData, action)
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": danceData,
		})
	}
	return gin.HandlerFunc(fn)
}

/*
GetMovesBreakdown returns the breakdown of all moves
*/
func GetMovesBreakdown(db *sql.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		sid := c.Param("sid")
		var queryString string
		var rows *sql.Rows
		var err error

		queryString = `
			select move, count(*) from moves group by move, sid having sid = $1;
		`
		rows, err = db.Query(
			queryString,
			sid,
		)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": err,
			})
		}
		defer rows.Close()
		res := make([][]string, 0)
		for rows.Next() {
			row := make([]string, 2)
			err := rows.Scan(&row[0], &row[1])

			if err != nil {
				log.Fatal(err)
			}
			res = append(res, row)
		}
		fmt.Println(rows)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": res,
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
