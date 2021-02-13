package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/rabbit"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/tasks"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/ws"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// GinMiddleware to enable CORS
func GinMiddleware(allowOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-CSRF-Token, Token, session, Origin, Host, Connection, Accept-Encoding, Accept-Language, X-Requested-With")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Request.Header.Del("Origin")

		c.Next()
	}
}

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

	// add routes
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
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
	t := tasks.Tasks{pool}

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

	// add middlewares
	router.Use(gin.Recovery(), gin.Logger(), GinMiddleware("http://localhost:3000"))
	router.Run(":8080")
}
