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

/*
StartWorker creates workers for the amqp queue created.
The msg in queue will only be ACK if the handler returns True.
Task executed by worker depends on the msg received from the queue,
*/
func (worker *Worker) StartWorker(
	queueName,
	routingKey string,
	concurrency int) error {

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
		return err
	}

	// bind the queue to the routing key
	err = worker.Conn.Channel.QueueBind(queueName, routingKey, "events", false, nil)
	if err != nil {
		return err
	}

	// prefetch messages
	prefetchCount := concurrency * 4
	err = worker.Conn.Channel.Qos(prefetchCount, 0, false)
	if err != nil {
		return nil
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
		return err
	}

	for i := 0; i < concurrency; i++ {
		fmt.Printf("Processing messages on thread %v...\n", i)
		go func(threadNum int) {
			for msg := range msgs {
				// can put a switch statement here for multiple tasks
				var isDone bool
				var err error
				switch checkMessageType(msg) {
				case "move":
					isDone, err = worker.Tasks.SendDanceMove(msg)
					// case "position":
					// 	isDone, err = worker.Tasks.SendDancePosition(msg);
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
			fmt.Println("Rabbit consumer closed - client socket disconnected or amqp error!")
		}(i)
	}
	return nil
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
