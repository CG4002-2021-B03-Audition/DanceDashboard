package rabbit

import (
	"fmt"

	"github.com/streadway/amqp"
)

/*
StartWorker creates consumers to the amqp queue created.
A worker can take in a custom handler which is the task its supposed to execute.
The msg in queue will only be ACK if the handler returns True.
*/
func (conn Conn) StartWorker(
	queueName,
	routingKey string,
	handler func(d amqp.Delivery) bool,
	concurrency int) error {

	// create queue if it doesn't exist
	_, err := conn.Channel.QueueDeclare(
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
	err = conn.Channel.QueueBind(queueName, routingKey, "events", false, nil)
	if err != nil {
		return err
	}

	// prefetch messages
	prefetchCount := concurrency * 4
	err = conn.Channel.Qos(prefetchCount, 0, false)
	if err != nil {
		return nil
	}

	msgs, err := conn.Channel.Consume(
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
		go func() {
			for msg := range msgs {
				if handler(msg) {
					msg.Ack(false)
				} else {
					// negative ACK and requeue message
					msg.Nack(false, true)
				}
			}
			fmt.Println("Rabbit consumer closed - critical error")
		}()
	}
	return nil
}
