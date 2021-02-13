package ws

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Body string `json:"body"`
}

func (c *Client) CheckConn() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		if _, _, err := c.Conn.NextReader(); err != nil {
			break
		}
	}
}
