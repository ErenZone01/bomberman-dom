package handler

import (
	"bomberman-dom/app/models"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var ChanGame = make(chan models.SocketElement)

var ActiveConnections = make(map[*websocket.Conn]models.User)

var maxConnections = 4

func AddConnection(conn *websocket.Conn, user models.User) error {

	if len(ActiveConnections) >= maxConnections {
		return fmt.Errorf("maximum number of connections reached")
	}

	ActiveConnections[conn] = user
	return nil
}

func RemoveConnection(conn *websocket.Conn) {
	delete(ActiveConnections, conn)
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {

	// Upgrade HTTP connection to WebSocket
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	if StatusRoom == "CLOSE" {
		return
	}

	AddConnection(conn, models.User{Username: "unknown", IDavatar: 0})
	defer delete(ActiveConnections, conn)

	// fmt.Println(ActiveConnections)

	// Handle WebSocket messages
	for {
		var elementSending models.SocketElement

		errMsg := conn.ReadJSON(&elementSending)
		if errMsg != nil {
			fmt.Println("WebSocket read error:", errMsg)
			break
		}

		if elementSending.Types == "closeRoom" {
			if TabMap == nil {
				StatusRoom = "CLOSE"
				TabMap = elementSending.Content
			}
			setMap(conn)
		} else {
			ChanGame <- elementSending
		}
	}
}

func AllDataPassed() {
	for {
		select {
		case element := <-ChanGame:

			if element.Types == "win" {
				StatusRoom = "OPEN"
			}

			for conn := range ActiveConnections {
				err := conn.WriteJSON(element)
				if err != nil {
					fmt.Println("WebSocket write error:", err)
					break
				}
			}

			if element.Types == "serverOnekilled" {
				Player -= 1
				// fmt.Println("nbr plays: ", Player)
				if Player == 1 {

					content := element.Content

					// fmt.Println("content:", content)

					item := content.([]interface{})

					valueWinner := 0.0

					for num := range item {
						if item[num] != nil {
							valueWinner, _ = item[num].(float64)
						}
					}

					var killed models.SocketElement
					killed.Types = "win"

					for _, user := range ActiveConnections {
						if user.IDavatar == int(valueWinner) {
							killed.Content = models.User{
								Username: user.Username,
							}
							break
						}
					}

					for conn := range ActiveConnections {
						err := conn.WriteJSON(killed)
						if err != nil {
							fmt.Println("WebSocket write error:", err)
							break
						}
					}
				}
			}

		default:
			// time.Sleep(time.Millisecond * 100)
		}

		if len(ActiveConnections) == 0 {
			StatusRoom = "OPEN"
			TabMap = nil
		}
	}
}
