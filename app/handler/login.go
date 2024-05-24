package handler

import (
	"bomberman-dom/app/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

var DateSecondPlayer = time.Now()
var StatusRoom = "OPEN"
var Player = 0

func AddNewUser(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var timer models.Statement

		if (Player + 1) > 2 {
			diff := time.Since(DateSecondPlayer)
			var time = 20 - int(diff.Seconds())
			if time < 0 {
				StatusRoom = "CLOSE"
			}
		}

		if StatusRoom == "CLOSE" {
			response := map[string]string{
				"status": "Room closed !",
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}
		counter := 0
		var req models.User
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		//counter feature
		for _, user := range ActiveConnections {
			if user.Username != "unknown" {
				counter += 1
			}
		}

		for conn, user := range ActiveConnections {
			if user.Username == "unknown" {
				counter += 1
				req.IDavatar = counter
				ActiveConnections[conn] = req
				break
			}
		}

		// var timeFinal int

		if counter == 2 {
			DateSecondPlayer = time.Now()
			timer.Second = 20
		} else if counter == 4 {
			timer.Second = 10
		} else if counter == 3 {
			diff := time.Since(DateSecondPlayer)
			timer.Second = 20 - int(diff.Seconds())
		}

		var setTime models.SocketElement

		if (timer != models.Statement{}) {
			timer.State = "begin"
			timer.Who = "root"
			timer.Counter = counter
			setTime.Types = "time"
			setTime.Content = timer
			for conn, user := range ActiveConnections {
				if user.Username != "unknown" {
					err = conn.WriteJSON(setTime)
					if err != nil {
						fmt.Println("WebSocket write error:", err)
						break
					}
				}
			}
		}

		// fmt.Println(ActiveConnections)

		response := map[string]string{
			"status":    "success",
			"username":  req.Username,
			"avatar":    strconv.Itoa(req.IDavatar),
			"counter":   strconv.Itoa(counter),
		}

		Player = counter

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
