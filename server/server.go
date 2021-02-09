package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/rabbit"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/tasks"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	endpoint := os.Getenv("RABBITMQ_URI")

	router := gin.New()

	// add middlewares
	router.Use(gin.Recovery(), gin.Logger())

	// add routes
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// initialise rabbit
	conn, err := rabbit.GetConn(endpoint)
	if err != nil {
		panic(err)
	}

	// For week 7: fake publisher to send dance move info
	go func() {
		for {
			time.Sleep(time.Second)
			data := tasks.CreateDanceMove()
			conn.Publish(
				"test-key",
				[]byte(data))
		}
	}()

	// start workers
	err = conn.StartWorker("test-queue", "test-key", tasks.TestTask, 2)

	if err != nil {
		panic(err)
	}

	// initialise socket io server
	server, err := socketio.NewServer(nil)
	if err != nil {
		panic(err)
	}

	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		s.Join("dance-session")
		return nil
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
	})

	go server.Serve()
	defer server.Close()

	router.GET("/socket.io/*any", gin.WrapH(server))
	router.POST("/socket.io/*any", gin.WrapH(server))
	router.Run(":8080")
}
