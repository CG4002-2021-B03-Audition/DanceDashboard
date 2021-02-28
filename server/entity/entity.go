package entity

import "time"

type Move struct {
	Move      string    `json:"move"`
	Delay     float64   `json:"delay"`
	Accuracy  float64   `json:"accuracy"`
	Timestamp time.Time `json:"timestamp"`
}

type Session struct {
	Sid       int       `json:"sid"`
	Aid       int       `json:"aid"`
	Timestamp time.Time `json:"timestamp"`
}

type DanceAction struct {
	Name      string    `json:"name"`
	Delay     float64   `json:"delay"`
	Accuracy  float64   `json:"accuracy"`
	Timestamp time.Time `json:"timestamp"`
}
