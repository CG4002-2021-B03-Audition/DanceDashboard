package rabbit

import "github.com/streadway/amqp"

/*
Publish takes in a routing key and data and publishes it to the queue
*/
func (conn Conn) Publish(routingKey string, data []byte) error {
	return conn.Channel.Publish(
		"events",
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:  "application/json",
			Body:         data,
			DeliveryMode: amqp.Persistent,
		})
}
