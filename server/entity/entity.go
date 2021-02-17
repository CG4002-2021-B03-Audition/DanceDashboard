package entity

import "time"

type Move struct {
	Move      string    `json:"move"`
	Delay     float64   `json:"delay"`
	Accuracy  float64   `json:"accuracy"`
	Timestamp time.Time `json:"timestamp"`
}
