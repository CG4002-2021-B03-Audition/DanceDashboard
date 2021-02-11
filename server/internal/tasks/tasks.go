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

// CreateDanceMove returns a json string which replicates data from external comms
func CreateDanceMove() []byte {
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
	position := "1 2 3"

	// create json string from map and return json string
	m := map[string]string{
		"timestamp": datetime,
		"move":      danceMoves[rand.Intn(8)] + "," + fmt.Sprintf("%.1f", accuracy*100),
		"position":  position,
		"syncDelay": fmt.Sprintf("%.1f", delay),
	}
	tmp, _ := json.Marshal(m)
	return tmp
}

/*
Current message format
{
	"id": "1"
	"timestamp": "2021-02-10 10:13:38",
	danceMove: "dab,27.8",
	dancePosition: "1 2 3",
	syncDelay: "1.87",
}
*/
