package tasks

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/streadway/amqp"
)

// TestTask is a custom task for the worker
func TestTask(d amqp.Delivery) bool {
	if d.Body == nil {
		fmt.Println("Error, no message body!")
		return false
	}
	fmt.Println(string(d.Body))
	return true
}

// CreateDanceMove returns a json string which replicates data from external comms
func CreateDanceMove() string {
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

	// create json string from map and return json string
	m := map[string]string{
		"danceMove": danceMoves[rand.Intn(8)],
		"timestamp": datetime,
	}
	tmp, _ := json.Marshal(m)
	return string(tmp)
}
