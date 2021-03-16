package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/controller"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/entity"
	handler "github.com/CG4002-2021-B03-Audition/Dashboard/server/handler"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/rabbit"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/tasks"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/ws"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/middlewares"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/service"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// WsHandler reads message from socket and echos it back
func serveWs(wsType string, task *tasks.Tasks, w http.ResponseWriter, r *http.Request, amqpConn *rabbit.Conn) {
	conn, err := ws.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+V\n", err)
	}
	client := &ws.Client{
		Conn: conn,
		Pool: task.Pool,
	}
	task.Pool.Register <- client
	task.Client = client

	// initialise worker
	worker := rabbit.Worker{
		Conn:  amqpConn,
		Tasks: task,
	}

	if wsType == "action" {
		// start worker for move
		querySid := `
		select sid, aid from sessions 
		where timestamp = (select max(timestamp) from sessions) and sid = (select max(sid) from sessions)
		`

		rows, err := task.DbConn.Query(querySid)
		if err != nil {
			panic(err.Error())
		}
		defer rows.Close()
		for rows.Next() {
			err := rows.Scan(&task.SessionID, &task.AccountID)
			if err != nil {
				log.Fatal(err)
			}
		}
		// increment session id to create a new session
		task.SessionID = task.SessionID + 1
		queryString := `insert into sessions (sid, aid, timestamp) values ($1, $2, $3)`
		res, err := task.DbConn.Exec(
			queryString,
			task.SessionID,
			1, // hack because Accounts is not set up yet
			time.Now().Format("2006-01-02 15:04:05"),
		)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("Started a new session: %v\n", res)

		err = worker.StartWorker("DanceActionsQueue", "action", "events", 1)
		if err != nil {
			panic(err)
		}
	} else if wsType == "imu" {
		// start worker for imu sensor
		err = worker.StartWorker("imu_data", "imu_data", "events", 1)
		if err != nil {
			panic(err)
		}
	}

	go client.CheckConn()
}

var (
	sessionService    service.SessionService       = service.New()
	sessionController controller.SessionController = controller.New(sessionService)
)

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

	// add middlewares
	router.Use(
		gin.Recovery(),
		gin.Logger(),
		// middlewares.BasicAuth(db),
		middlewares.EnableCORS("http://localhost:3000"),
	)

	// initialise websocket routes
	actionPool := ws.NewPool()
	imuPool := ws.NewPool()
	go actionPool.Start()
	go imuPool.Start()

	// initialise tasks
	actionTask := tasks.Tasks{
		Pool:   actionPool,
		DbConn: db,
	}
	imuTask := tasks.Tasks{
		Pool:   imuPool,
		DbConn: db,
	}

	// initialise rabbit
	amqpConn, err := rabbit.GetConn(endpoint)
	if err != nil {
		panic(err)
	}

	router.GET("/ws", func(c *gin.Context) {
		serveWs("action", &actionTask, c.Writer, c.Request, &amqpConn)
	})

	router.GET("/imu", func(c *gin.Context) {
		serveWs("imu", &imuTask, c.Writer, c.Request, &amqpConn)
	})

	router.POST("/login", func(c *gin.Context) {
	})

	// add routes
	router.GET("/ping", handler.GetTestData(db))

	// router.GET("/moves")
	router.GET("/breakdown/:sid", handler.GetMovesBreakdown(db))
	router.GET("/moves/:sid", handler.GetDataInSession(db))
	router.GET("/moves", handler.GetAllMoves(db))

	router.GET("/result/:sid", func(ctx *gin.Context) {
		sid := ctx.Param("sid")
		queryString := "select action, delay, accuracy, timestamp, isCorrect from results where sid = $1"
		rows, err := db.Query(queryString, sid)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()
		var results []entity.Result
		for rows.Next() {
			var result entity.Result
			err := rows.Scan(&result.Name, &result.Delay, &result.Accuracy, &result.Timestamp, &result.IsCorrect)
			if err != nil {
				log.Fatal(err)
			}
			results = append(results, result)
		}
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": results,
		})

	})
	router.POST("/result/:sid", func(ctx *gin.Context) {
		sid := ctx.Param("sid")

		var data struct {
			Actions []entity.Result `json:"actions" binding:"required"`
		}
		if ctx.Bind(&data) != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "",
			})
		}

		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}
		defer tx.Rollback()
		stmt, err := tx.Prepare(`
		insert into results (sid, aid, action, delay, accuracy, timestamp, isCorrect) 
		values ($1, $2, $3, $4, $5, $6, $7)`)
		if err != nil {
			log.Fatal(err)
		}
		for _, action := range data.Actions {
			_, err := stmt.Exec(sid, 1, action.Name, action.Delay, action.Accuracy, action.Timestamp, action.IsCorrect)
			if err != nil {
				break
			}
		}
		err = tx.Commit()
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "",
			})
		} else {
			ctx.JSON(http.StatusOK, gin.H{
				"success": true,
				"message": "",
			})
		}
		defer stmt.Close()
	})

	// router.GET("/sessions", handler.GetAllSessions(db))
	router.GET("/sessions", func(ctx *gin.Context) {
		params := ctx.Request.URL.Query()
		queryResult, err := sessionController.FindAll(db, params)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": err,
			})
		}
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": queryResult,
		})
	})

	router.GET("/lastSession", func(ctx *gin.Context) {
		params := ctx.Request.URL.Query()
		queryResult, err := sessionController.GetLatest(db, params)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": err,
			})
		} else {
			ctx.JSON(http.StatusOK, gin.H{
				"success": true,
				"message": queryResult,
			})
		}
	})

	// router.GET("/session/:id", func(c *gin.Context) {
	// })

	// router.POST("/session/:id", func(c *gin.Context) {
	// })

	// For week 7: fake publisher to send dance position info
	// go func() {
	// 	fmt.Println("Publisher started...")
	// 	danceData := tasks.GenerateDanceData()
	// 	fmt.Println(danceData)
	// 	for i := 0; i < len(danceData); i++ {
	// 		data := danceData[i]
	// 		timestamp := strconv.FormatInt(time.Now().Unix(), 10)
	// 		fmt.Printf("Timestamp: %v\n", timestamp)
	// 		data["timestamp"] = timestamp
	// 		dataToBytes, _ := json.Marshal(data)
	// 		amqpConn.Publish(
	// 			"action",
	// 			dataToBytes,
	// 		)
	// 		time.Sleep(time.Second * 3)
	// 	}
	// 	fmt.Println("Finished publishing messages...")
	// }()

	router.Run(":8080")
}
