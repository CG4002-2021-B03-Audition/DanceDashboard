package storage

import (
	"database/sql"

	_ "github.com/jackc/pgx"
)

func InitialiseDb() (*sql.DB, error) {
	dsn := "host=localhost user=root password=password dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Singapore"
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		panic(err)
	}
	return db, err
}
