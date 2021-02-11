package rabbit

import (
	"fmt"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/tasks"
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
				if worker.Tasks.SendDanceMove(msg) {
					fmt.Printf("Thread %v: ", threadNum)
					msg.Ack(false)
				} else {
					// negative ACK and requeue message
					msg.Nack(false, true)
				}
			}
			fmt.Println("Rabbit consumer closed - critical error")
		}(i)
	}
	return nil
}
