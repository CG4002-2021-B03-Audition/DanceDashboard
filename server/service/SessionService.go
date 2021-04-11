package service

import (
	"database/sql"
	"log"
	"net/url"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/entity"
)

type SessionService interface {
	FindAll(db *sql.DB, params url.Values) ([]entity.Session, error)
	GetLatest(db *sql.DB, params url.Values) (entity.Session, error)
}

type sessionService struct{}

func New() SessionService {
	return &sessionService{}
}

func (service *sessionService) FindAll(db *sql.DB, params url.Values) ([]entity.Session, error) {
	name, ok := params["name"]
	var queryString string
	var rows *sql.Rows
	var err error

	if !ok {
		queryString = `select sid, aid, name, timestamp from sessions`
		rows, err = db.Query(queryString)
	} else {
		queryString = `
			select sid, aid, name, timestamp from sessions
			where name = $1
		`
		rows, err = db.Query(queryString, name[0])
	}
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var sessions []entity.Session
	for rows.Next() {
		var session entity.Session
		err := rows.Scan(&session.Sid, &session.Aid, &session.Name, &session.Timestamp)

		if err != nil {
			log.Fatal(err)
		}
		sessions = append(sessions, session)
	}
	return sessions, nil
}

func (service *sessionService) GetLatest(db *sql.DB, params url.Values) (entity.Session, error) {
	queryString := `select sid, aid, name, timestamp from sessions where sid = (select max(sid) from sessions);`
	rows, err := db.Query(queryString)
	if err != nil {
		return entity.Session{}, err
	}
	defer rows.Close()
	var result entity.Session

	for rows.Next() {
		err = rows.Scan(&result.Sid, &result.Aid, &result.Name, &result.Timestamp)
		if err != nil {
			return entity.Session{}, err
		}
	}
	return result, nil
}
