package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/entity"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/rabbit"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/tasks"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/ws"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/middlewares"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// WsHandler reads message from socket and echos it back
func serveWs(pool *ws.Pool, w http.ResponseWriter, r *http.Request) {
	conn, err := ws.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+V\n", err)
	}
	client := &ws.Client{
		Conn: conn,
		Pool: pool,
	}
	pool.Register <- client
	go client.CheckConn()
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	endpoint := os.Getenv("RABBITMQ_URI")

	router := gin.New()

	// connect to db
	dsn := "host=localhost user=root password=password dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Singapore"
	db, err := sql.Open("postgres", dsn)

	if err != nil {
		log.Fatalf("Cannot connect to db: %v\n", err)
	} else {
		fmt.Printf("Connected to database! %v\n", db)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	router.POST("/login", func(c *gin.Context) {
	})

	// add middlewares
	router.Use(
		gin.Recovery(),
		gin.Logger(),
		// middlewares.BasicAuth(db),
		middlewares.EnableCORS("http://localhost:3000"),
	)

	// add routes
	router.GET("/ping", func(c *gin.Context) {
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
	})

	router.GET("/moves", func(c *gin.Context) {
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
	})

	router.GET("/session", func(c *gin.Context) {
	})

	router.GET("/session/:id", func(c *gin.Context) {
	})

	router.POST("/session/:id", func(c *gin.Context) {
	})

	// initialise websocket routes
	pool := ws.NewPool()
	go pool.Start()

	router.GET("/ws", func(c *gin.Context) {
		serveWs(pool, c.Writer, c.Request)
	})

	// initialise rabbit
	conn, err := rabbit.GetConn(endpoint)
	if err != nil {
		panic(err)
	}

	// initialise tasks
	t := tasks.Tasks{
		Pool:   pool,
		DbConn: db,
	}

	// initialise worker
	worker := rabbit.Worker{
		Conn:  &conn,
		Tasks: &t,
	}

	// For week 7: fake publisher to send dance move info
	go func() {
		for {
			time.Sleep(time.Second * 2)
			data := tasks.GenerateMove()
			conn.Publish(
				"move",
				data)
		}
	}()

	// For week 7: fake publisher to send dance position info
	// go func() {
	// 	for {
	// 		time.Sleep(time.Second * 2)
	// 		data := tasks.GeneratePosition()
	// 		conn.Publish(
	// 			"position",
	// 			data)
	// 	}
	// }()

	// start worker for move
	err = worker.StartWorker("test-queue", "move", 1)
	if err != nil {
		panic(err)
	}

	// start worker for position
	err = worker.StartWorker("test-queue", "position", 1)
	if err != nil {
		panic(err)
	}

	router.Run(":8080")
}
