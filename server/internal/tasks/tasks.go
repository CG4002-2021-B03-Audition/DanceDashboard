package tasks

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/ws"
	"github.com/streadway/amqp"
)

// Tasks is used to encompass all the services that a worker needs to distribute the message
type Tasks struct {
	Pool      *ws.Pool   // gives workers access to the broadcast channel
	DbConn    *sql.DB    // gives workers access to the database
	Client    *ws.Client // gives workers access to client
	SessionID int        // task will be tagged to the session id
	AccountID int        // task will be tagged to the account id
}

// SendTest is a test task for the worker
func (task *Tasks) SendTest(d amqp.Delivery) bool {
	if d.Body == nil {
		fmt.Println("Error, no message body!")
		return false
	}
	fmt.Println(string(d.Body))
	return true
}

// SendDanceMove is a custom task for the worker
func (task *Tasks) SendDanceMove(d amqp.Delivery) (bool, error) {
	// checks if client websocket connection is alive
	if _, ok := task.Pool.Clients[task.Client]; !ok {
		return false, errors.New("client websocket disconnected")
	}
	if d.Body == nil {
		fmt.Println("Error, no message body!")
		return false, nil
	}
	fmt.Println(string(d.Body))
	message := ws.Message{Body: string(d.Body)}

	task.Pool.Broadcast <- message

	// insert moves
	var jsonData map[string]interface{}
	if err := json.Unmarshal(d.Body, &jsonData); err != nil {
		log.Fatal(err)
	}

	queryString := `
		insert into moves (move, delay, accuracy, timestamp, aid, did, sid)
		values ($1, $2, $3, $4, $5, $6, $7)
	`

	delay, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["syncDelay"]), 64)
	if err != nil {
		log.Fatal(err)
	}
	accuracy, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["accuracy"]), 64)
	if err != nil {
		log.Fatal(err)
	}

	res, err := task.DbConn.Exec(
		queryString,
		jsonData["move"],
		delay,
		accuracy,
		fmt.Sprintf("%s", jsonData["timestamp"]),
		task.AccountID,
		1, // did
		task.SessionID,
	)

	if err != nil {
		log.Fatal(err)
	}

	rowCnt, err := res.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	log.Print(rowCnt)
	return true, nil
}

// SendDancePosition is a custom task for the worker
func (task *Tasks) SendDancePosition(d amqp.Delivery) (bool, error) {
	// checks if client websocket connection is alive
	if _, ok := task.Pool.Clients[task.Client]; !ok {
		return false, errors.New("client websocket disconnected")
	}
	if d.Body == nil {
		fmt.Println("Error, no message body!")
		return false, nil
	}
	fmt.Println(string(d.Body))
	message := ws.Message{Body: string(d.Body)}

	task.Pool.Broadcast <- message

	// insert moves
	var jsonData map[string]interface{}
	if err := json.Unmarshal(d.Body, &jsonData); err != nil {
		log.Fatal(err)
	}

	queryString := `
		insert into positions (position, delay, timestamp, aid, did, sid)
		values ($1, $2, $3, $4, $5, $6)
	`

	delay, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["syncDelay"]), 64)
	if err != nil {
		log.Fatal(err)
	}

	res, err := task.DbConn.Exec(
		queryString,
		jsonData["position"],
		delay,
		fmt.Sprintf("%s", jsonData["timestamp"]),
		task.AccountID,
		1, // did
		task.SessionID,
	)

	if err != nil {
		log.Fatal(err)
	}

	rowCnt, err := res.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	log.Print(rowCnt)
	return true, nil
}

/*
GenerateMove returns a json string which replicates move data from external comms
Message format: {
	"dancerId": int,
	"move": string,
	"timestamp": string,
	"syncDelay": string,
	"accuracy": string,
}
*/
func GenerateMove() []byte {
	danceMoves := [8]string{
		"dab",
		"elbowkick",
		"listen",
		"pointhigh",
		"hair",
		"gun",
		"sidepump",
		"wipetable",
	}
	dancerID := "1"
	datetime := time.Now().Format("2006-01-02 15:04:05")
	accuracy := rand.Float64()
	delay := rand.Float64() * 1.5

	// create json string from map and return json string
	m := map[string]string{
		"type":      "move",
		"dancerId":  dancerID,
		"move":      danceMoves[rand.Intn(8)],
		"timestamp": datetime,
		"syncDelay": fmt.Sprintf("%.1f", delay),
		"accuracy":  fmt.Sprintf("%.1f", accuracy),
	}
	tmp, _ := json.Marshal(m)
	return tmp
}

/*
GenerateDanceData returns a slice of maps which contain the fake moves and positions data
*/
func GenerateDanceData() []map[string]interface{} {
	danceMoves := [8]string{
		"dab",
		"elbowkick",
		"listen",
		"pointhigh",
		"hair",
		"gun",
		"sidepump",
		"wipetable",
	}
	dancePosition := [6]string{
		"1 2 3",
		"1 3 2",
		"2 1 3",
		"2 3 1",
		"3 1 2",
		"3 2 1",
	}
	dancerID := "1"
	res := make([]map[string]interface{}, 0)
	for i := 0; i < 20; i++ {
		delay := rand.Float64() * 1.5
		accuracy := rand.Float64()
		if i%3 == 0 {
			position := map[string]interface{}{
				"type":      "position",
				"dancerId":  dancerID,
				"move":      dancePosition[rand.Intn(6)],
				"syncDelay": fmt.Sprintf("%.1f", delay),
			}
			res = append(res, position)
		} else {
			move := map[string]interface{}{
				"type":      "move",
				"dancerId":  dancerID,
				"move":      danceMoves[rand.Intn(8)],
				"syncDelay": fmt.Sprintf("%.1f", delay),
				"accuracy":  fmt.Sprintf("%.1f", accuracy),
			}
			res = append(res, move)
		}
	}

	return res
}

/*
GeneratePosition returns a json string which replicates position data from external comms
Message format: {
	"position": string,
	"timestamp": string,
	"syncDelay": string,
}
*/
func GeneratePosition() []byte {
	dancePosition := [6]string{
		"1 2 3",
		"1 3 2",
		"2 1 3",
		"2 3 1",
		"3 1 2",
		"3 2 1",
	}
	datetime := time.Now().Format("2006-01-02 15:04:05")
	delay := rand.Float64() * 1.5
	m := map[string]string{
		"type":      "position",
		"position":  dancePosition[rand.Intn(6)],
		"timestamp": datetime,
		"syncDelay": fmt.Sprintf("%.1f", delay),
	}
	tmp, _ := json.Marshal(m)
	return tmp
}
