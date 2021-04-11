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
	Name      string    `json:"name"`
	Timestamp time.Time `json:"timestamp"`
}

type DanceAction struct {
	Name      string    `json:"name"`
	Delay     float64   `json:"delay"`
	Accuracy  float64   `json:"accuracy"`
	Timestamp time.Time `json:"timestamp"`
}

type IMUData struct {
	Timestamp time.Time `json:"timestamp"`
	X         int       `json:"accelX"`
	Y         int       `json:"accelY"`
	Z         int       `json:"accelZ"`
	Yaw       int       `json:"gyroYaw"`
	Pitch     int       `json:"gyroPitch"`
	Roll      int       `json:"gyroRoll"`
	DancerID  int       `json:"dancerId"`
}

type Result struct {
	Name      string  `json:"name" binding:"required"`
	Delay     float64 `json:"delay" binding:"required"`
	Accuracy  float64 `json:"accuracy" binding:"required"`
	Timestamp string  `json:"timestamp" binding:"required"`
	IsCorrect bool    `json:"isCorrect" binding:"required"`
}
