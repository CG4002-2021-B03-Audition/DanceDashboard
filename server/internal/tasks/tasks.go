package tasks

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/ws"
	"github.com/streadway/amqp"
)

// Tasks is used to encompass all the services that a worker needs to distribute the message
type Tasks struct {
	Pool *ws.Pool // gives workers access to the broadcast channel
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
func (task *Tasks) SendDanceMove(d amqp.Delivery) bool {
	if d.Body == nil {
		fmt.Println("Error, no message body!")
		return false
	}
	fmt.Println(string(d.Body))
	message := ws.Message{Body: string(d.Body)}
	task.Pool.Broadcast <- message
	return true
}

/*
GenerateMove returns a json string which replicates move data from external comms
Message format: {
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
	datetime := time.Now().Format("2006-01-02 15:04:05")
	accuracy := rand.Float64()
	delay := rand.Float64() * 1.5

	// create json string from map and return json string
	m := map[string]string{
		"move":      danceMoves[rand.Intn(8)],
		"timestamp": datetime,
		"syncDelay": fmt.Sprintf("%.1f", delay),
		"accuracy":  fmt.Sprintf("%.1f", accuracy),
	}
	tmp, _ := json.Marshal(m)
	return tmp
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
		"position":  dancePosition[rand.Intn(6)],
		"timestamp": datetime,
		"syncDelay": fmt.Sprintf("%.1f", delay),
	}
	tmp, _ := json.Marshal(m)
	return tmp
}
