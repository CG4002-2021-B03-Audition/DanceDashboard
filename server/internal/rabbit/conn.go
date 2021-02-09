package rabbit

import "github.com/streadway/amqp"

/*
Conn to hold a connection rabbitmq server
*/
type Conn struct {
	Channel *amqp.Channel
}

/*
GetConn creates a new connection based on a given amqp endpoint
*/
func GetConn(endpoint string) (Conn, error) {
	conn, err := amqp.Dial(endpoint)
	if err != nil {
		return Conn{}, err
	}

	ch, err := conn.Channel()
	return Conn{
		Channel: ch,
	}, err
}
