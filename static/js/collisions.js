import { life, reassignLife } from "./bomb.js";
import { AddBonusBomb, AddBonusFlamme, AddBonusSpeed } from "./bonus.js";
import miniHelp from "./frontend/core/index.js";
import { socket } from "./socket.js";


export const CheckCollision = (players, element, type) => {
    // //console.log(players, element, type);
    if (players.y == element.style.gridColumn && players.x == element.style.gridRow) {
        if (type == "person") {

            reassignLife(life - 30)
            //decrease health bar
            var tabID = [element.id.split("player")[1], players.id.split("player")[1]]
            //console.log(tabID);
            socket.send(JSON.stringify({
                Types: "killOne",
                Content: tabID
            }))

            //kill me
            if (life <= 10) {
                let ennemies = Array.from(miniHelp.selectorAll(".player"))
                let tab = []

                ennemies.forEach(ennemie => {
                    let rmSplitID = ennemie.id.split("player")[1]
                    if (rmSplitID != players.id.split("player")[1]) {
                        tab.push(parseInt(rmSplitID))
                    }
                })

                // sending to kill me to broadCast
                socket.send(JSON.stringify({
                    Types: "kill",
                    Content: {
                        id: parseInt(players.id.split("player")[1]),
                    }
                }))

                let dataKill = {
                    Types: "serverOnekilled",
                    Content: tab
                }
                socket.send(JSON.stringify(dataKill))
            }

            const idElem = element.id.split("player")[1]
            // console.log(idElem)

            let health = miniHelp.elemID("health" + idElem)
            let costElement = parseInt(health.style.width.replace("%", ""))

            // killed element
            if ((costElement - 30) <= 10) {
                let ennemies = Array.from(miniHelp.selectorAll(".player"))
                let tab = []

                ennemies.forEach(ennemie => {
                    let rmSplitID = ennemie.id.split("player")[1]
                    if (rmSplitID != element.id.split("player")[1]) {
                        tab.push(parseInt(rmSplitID))
                    }
                })

                // sending to kill me to broadCast
                socket.send(JSON.stringify({
                    Types: "kill",
                    Content: {
                        id: parseInt(element.id.split("player")[1]),
                    }
                }))

                let dataKill = {
                    Types: "serverOnekilled",
                    Content: tab
                }
                socket.send(JSON.stringify(dataKill))
            }

        } else if (type == "bonus") {
            if (element.id == "bonus8") {
                AddBonusBomb();
            } else if (element.id == "bonus9") {
                AddBonusFlamme();
            } else if (element.id == "bonus10") {
                AddBonusSpeed();
            }
            let data = {
                Types: "removeBonus",
                Content: {
                    tagName: element.id,
                    x: element.style.gridRow,
                    y: element.style.gridColumn
                }
            }
            socket.send(JSON.stringify(data))
        }
    }
}