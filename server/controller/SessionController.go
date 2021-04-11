package controller

import (
	"database/sql"
	"fmt"
	"net/url"

	"github.com/CG4002-2021-B03-Audition/Dashboard/server/entity"
	"github.com/CG4002-2021-B03-Audition/Dashboard/server/service"
)

// SessionController is an interface for accessing the SessionService
type SessionController interface {
	// FindOne(db *sql.DB, params url.Values) (entity.Session, error)
	FindAll(db *sql.DB, params url.Values) ([]entity.Session, error)
	GetLatest(db *sql.DB, params url.Values) (entity.Session, error)
}

type controller struct {
	service service.SessionService
}

// New initialises the SessionController
func New(service service.SessionService) SessionController {
	return &controller{
		service: service,
	}
}

// func (c *controller) FindOne(db *sql.DB, params url.Values) (entity.Session, error) {
// 	queryResult, err := c.service.GetLatest(db, params)
// 	if err != nil {
// 		return queryResult, err
// 	}
// 	fmt.Printf("%+v\n", queryResult)
// 	return queryResult, err
// }

func (c *controller) FindAll(db *sql.DB, params url.Values) ([]entity.Session, error) {
	queryResult, err := c.service.FindAll(db, params)
	if err != nil {
		return nil, err
	}
	return queryResult, err
}

func (c *controller) GetLatest(db *sql.DB, params url.Values) (entity.Session, error) {
	queryResult, err := c.service.GetLatest(db, params)
	if err != nil {
		return queryResult, err
	}
	fmt.Printf("%+v\n", queryResult)
	return queryResult, err
}
