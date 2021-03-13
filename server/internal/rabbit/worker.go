package rabbit

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/tasks"
	"github.com/streadway/amqp"
)

type Worker struct {
	Conn  *Conn
	Tasks *tasks.Tasks
}

func (worker *Worker) initializeWorker(queueName, routingKey, exchange string, concurrency int) <-chan amqp.Delivery {
	// create queue if it doesn't exist
	_, err := worker.Conn.Channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}

	// bind the queue to the routing key
	err = worker.Conn.Channel.QueueBind(queueName, routingKey, exchange, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	// prefetch messages
	prefetchCount := concurrency * 4
	err = worker.Conn.Channel.Qos(prefetchCount, 0, false)
	if err != nil {
		log.Fatal(err)
	}

	msgs, err := worker.Conn.Channel.Consume(
		queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}
	return msgs
}

/*
StartDanceActionWorker creates workers for the amqp queue created.
The msg in queue will only be ACK if the handler returns True.
Task executed by worker depends on the msg received from the queue,
*/
func (worker *Worker) StartDanceActionWorker(
	queueName,
	routingKey,
	events string,
	concurrency int) error {

	msgs := worker.initializeWorker(queueName, routingKey, events, concurrency)

	for i := 0; i < concurrency; i++ {
		fmt.Printf("Processing messages on thread %v...\n", i)

		if queueName == "DanceActionsQueue" {
			go worker.danceActionThread(i, msgs)
		} else if queueName == "imu_data" {

		}
	}
	return nil
}

// danceActionThread processes the message based on whether it was a move or position change
func (worker *Worker) danceActionThread(threadNum int, msgs <-chan amqp.Delivery) {
	for msg := range msgs {
		// can put a switch statement here for multiple tasks
		var isDone bool
		var err error
		switch checkMessageType(msg) {
		case "move":
			isDone, err = worker.Tasks.SendDanceMove(msg)
		case "position":
			isDone, err = worker.Tasks.SendDancePosition(msg)
		}
		if isDone && err == nil {
			fmt.Printf("Thread %v: ", threadNum)
			msg.Ack(false)
		} else if !isDone && err == nil {
			// negative ACK and requeue message
			msg.Nack(false, true)
		} else if err != nil {
			fmt.Printf("Worker stopped: %v\n", err)
			break
		}
	}
	fmt.Println("Dance Action consumer closed - client socket disconnected or amqp error!")
}


/*
checkMessageType checks if the message consumed contains move data or position data
*/
func checkMessageType(d amqp.Delivery) string {
	var jsonData map[string]interface{}
	if err := json.Unmarshal(d.Body, &jsonData); err != nil {
		log.Fatal(err)
	}
	moveType := fmt.Sprintf("%s", jsonData["type"])

	return moveType
}
