package handler

import (
	"bomberman-dom/app/models"
	"fmt"

	"github.com/gorilla/websocket"
)

var TabMap interface{}

var CoinA = 16
var CoinB = 28
var CoinC = 208
var CoinD = 196

var Coins = []int{CoinA, CoinB, CoinC, CoinD}

func setMap(c *websocket.Conn) {

	type map_User struct {
		TabMap      interface{} `json:"tabmap"`
		TabPosition []int       `json:"tabPosition"`
	}

	if ActiveConnections[c].Username != "unknown" {
		var elementSending models.SocketElement
		elementSending.Types = "map"
		elementSending.Content = map_User{
			TabMap:      TabMap,
			TabPosition: Coins[:Player],
		}
		err := c.WriteJSON(elementSending)
		if err != nil {
			fmt.Println("WebSocket write error:", err)
		}
	}
}
