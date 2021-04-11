package tasks

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/internal/ws"
	"github.com/streadway/amqp"
)

// Tasks is used to encompass all the services that a worker needs to distribute the message
type Tasks struct {
	Pool      *ws.Pool   // gives workers access to the broadcast channel
	DbConn    *sql.DB    // gives workers access to the database
	Client    *ws.Client // gives workers access to client
	SessionID int        // task will be tagged to the session id
	AccountID int        // task will be tagged to the account id
}

// SendDanceMove is a custom task for the worker to get the dance moves & send to websocket
func (task *Tasks) SendDanceMove(d amqp.Delivery) (bool, error) {
	if isValid, err := validateTask(task, d); !isValid {
		return isValid, err
	}

	fmt.Println(string(d.Body))
	message := ws.Message{Body: string(d.Body)}

	task.Pool.Broadcast <- message

	// insert moves
	var jsonData map[string]interface{}
	if err := json.Unmarshal(d.Body, &jsonData); err != nil {
		log.Fatal(err)
	}

	queryString := `
		insert into moves (move, delay, accuracy, timestamp, aid, did, sid)
		values ($1, $2, $3, to_timestamp($4), $5, $6, $7)
	`

	delay, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["syncDelay"]), 64)
	if err != nil {
		log.Fatal(err)
	}
	accuracy, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["accuracy"]), 64)
	if err != nil {
		log.Fatal(err)
	}

	timestamp, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["timestamp"]), 64)
	if err != nil {
		log.Fatal(err)
	}

	res, err := task.DbConn.Exec(
		queryString,
		jsonData["move"],
		delay,
		accuracy,
		timestamp,
		1, // hack because Accounts is not set up
		1, // did
		task.SessionID,
	)

	if err != nil {
		log.Fatal(err)
	}

	rowCnt, err := res.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	log.Print(rowCnt)
	return true, nil
}

// SendDancePosition is a custom task for the worker to get the dance positons & send to websocket
func (task *Tasks) SendDancePosition(d amqp.Delivery) (bool, error) {
	if isValid, err := validateTask(task, d); !isValid {
		return isValid, err
	}
	fmt.Println(string(d.Body))
	message := ws.Message{Body: string(d.Body)}

	task.Pool.Broadcast <- message

	// insert moves
	var jsonData map[string]interface{}
	if err := json.Unmarshal(d.Body, &jsonData); err != nil {
		log.Fatal(err)
	}

	queryString := `
		insert into positions (position, delay, timestamp, aid, did, sid)
		values ($1, $2, to_timestamp($3), $4, $5, $6)
	`

	delay, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["syncDelay"]), 64)
	if err != nil {
		log.Fatal(err)
	}
	timestamp, err := strconv.ParseFloat(fmt.Sprintf("%s", jsonData["timestamp"]), 64)
	if err != nil {
		log.Fatal(err)
	}

	res, err := task.DbConn.Exec(
		queryString,
		jsonData["position"],
		delay,
		timestamp,
		1, // hack because Accounts is not set up
		1, // did
		task.SessionID,
	)

	if err != nil {
		log.Fatal(err)
	}

	_, err = res.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	return true, nil
}

// SendIMUData is a custom task for the worker to process IMU data & send to websocket
func (task *Tasks) SendIMUData(msg amqp.Delivery) (bool, error) {
	if isValid, err := validateTask(task, msg); !isValid {
		return isValid, err
	}
	// var expectedStringArray []entity.IMUData
	var expectedStringArray []map[string]interface{}
	err := json.Unmarshal(msg.Body, &expectedStringArray)
	if err != nil {
		log.Fatal(err)
	}
	for _, obj := range expectedStringArray {
		obj["type"] = "imu"
		// fmt.Printf("%+v\n", obj)
		jsonString, err := json.Marshal(obj)
		if err != nil {
			log.Fatal(err)
		}
		// fmt.Println(string(jsonString))
		message := ws.Message{Body: string(jsonString)}
		// fmt.Printf("%+v\n", message)
		task.Pool.Broadcast <- message
	}
	// fmt.Printf("%v\n", expectedStringArray)
	// message := ws.Message{Body: string(msg.Body)}

	return true, nil
}

// SendFlag is a custom task for the worker to send a start/stop/finished flag to the client
func (task *Tasks) SendFlag(msg amqp.Delivery) (bool, error) {
	if isValid, err := validateTask(task, msg); !isValid {
		return isValid, err
	}
	fmt.Println(string(msg.Body))
	message := ws.Message{Body: string(msg.Body)}
	task.Pool.Broadcast <- message

	return true, nil
}

// SendEmu is a custom task for the worker to send a start/stop/finished flag to the client
func (task *Tasks) SendEmg(msg amqp.Delivery) (bool, error) {
	if isValid, err := validateTask(task, msg); !isValid {
		return isValid, err
	}
	fmt.Println(string(msg.Body))
	message := ws.Message{Body: string(msg.Body)}
	task.Pool.Broadcast <- message

	// TODO: insert emg data into table here

	return true, nil
}

/*
GenerateDanceData returns a slice of maps which contain the fake moves and positions data
*/
func GenerateDanceData() []map[string]interface{} {
	danceMoves := []string{
		"dab",
		"elbowkick",
		"listen",
		"pointhigh",
		"hair",
		"gun",
		"sidepump",
		"wipetable",
	}

	danceActions := [20]string{
		"pointhigh",
		"dab",
		"3 1 2",
		"wipetable",
		"2 1 3",
		"gun",
		"elbowkick",
		"3 2 1",
		"hair",
		"listen",
		"1 2 3",
		"sidepump",
		"elbowkick",
		"3 2 1",
		"hair",
		"listen",
		"1 2 3",
		"sidepump",
		"dab",
		"dab",
	}
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(danceActions), func(i, j int) { danceActions[i], danceActions[j] = danceActions[j], danceActions[i] })

	dancerID := "1"
	res := make([]map[string]interface{}, 0)
	for i := 0; i < 20; i++ {
		var danceAction map[string]interface{}
		action := danceActions[i]
		delay := rand.Float64() * 1.5
		accuracy := rand.Float64()

		if contains(action, danceMoves) {
			danceAction = map[string]interface{}{
				"type":      "move",
				"dancerId":  dancerID,
				"move":      action,
				"syncDelay": fmt.Sprintf("%.1f", delay),
				"accuracy":  fmt.Sprintf("%.1f", accuracy),
			}
		} else {
			danceAction = map[string]interface{}{
				"type":      "position",
				"dancerId":  dancerID,
				"position":  action,
				"syncDelay": fmt.Sprintf("%.1f", delay),
			}
		}
		res = append(res, danceAction)
	}

	return res
}

func contains(s1 string, list []string) bool {
	for _, s2 := range list {
		if s1 == s2 {
			return true
		}
	}
	return false
}

func validateTask(task *Tasks, d amqp.Delivery) (bool, error) {
	var isAlive, hasMessage bool
	var err error

	if _, ok := task.Pool.Clients[task.Client]; !ok {
		isAlive, err = false, errors.New("client websocket disconnected")
	} else {
		isAlive, err = true, nil
	}
	if d.Body == nil {
		hasMessage, err = false, fmt.Errorf("%w, no message body", err)
	} else {
		hasMessage, err = true, fmt.Errorf("%w", err)
	}
	return hasMessage && isAlive, err
}
