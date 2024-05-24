import miniHelp from "./frontend/core/index.js";
import { CheckPositionGrid, IDavatar, bricks, reassignCounterPlayer, reassignTime, requestTime, setTimer, username } from './main.js';
import { Player } from "./utils.js";

let tabOfPlayers = []

// export const socket = new WebSocket("ws://localhost:5505/ws");
export const socket = new WebSocket("ws://localhost:5505/ws");
socket.onopen = function () {
    //console.log("Connected to WebSocket server");
};

socket.onmessage = function (event) {
    // data to receive
    var data = JSON.parse(event.data)

    // chat feature
    if (data.types == "chat") {
        // Adding component message for a good vue
        miniHelp.newElem('div', { class: "msg" }, miniHelp.elemID("message"), data.content.from + ": " + data.content.message)
        // //console.log("received !");
    }

    // timer feature
    if (data.types == "time") {
        if (data.content.state == "begin") {
            if (data.content.who == "root") {
                // if (data.content.counter != 3) {
                reassignTime(data.content.second)
                // }

                // if (IDavatar == 3) {
                //     if (data.content.second == 10) {
                //         reassignTime(data.content.second)
                //     }
                // }

                // //console.log(TimeNoGame);
                // //console.log(requestTime);
                cancelAnimationFrame(requestTime)
                setTimer(data.content.second)
                reassignCounterPlayer(data.content.counter)
                // if (miniHelp.getHash == "/waitingRoom") {
                miniHelp.elemID("counterPlayer").innerText = data.content.counter
                // }
            }
        }
    }

    // Adding map and create each players
    if (data.types == "map") {
        //console.log(data.content.tabmap)
        bricks.ChargeMap(data.content.tabmap, miniHelp.elemID("container"))

        let count = 0
        let tab = data.content.tabPosition
        tab.forEach(pos => {
            const elem = miniHelp.elemID("grass" + pos)
            // //console.log(elem)
            const x = elem.style.gridRow
            const y = elem.style.gridColumn

            //create any player
            const player = new Player(++count, x, y)
            player.Create(miniHelp.elemID("container"))

            if (count == 1 || count == 4) {
                const iplayer = miniHelp.elemID("player" + count)
                iplayer.style.transform = "scaleX(-1)"
            }

            //Adding to tabOfPlayers
            tabOfPlayers.push(player)
        })
    }

    // move player feature
    if (data.types == "move") {

        let id = data.content.id
        let pos = data.content.pos
        let style = data.content.style

        const play = tabOfPlayers[parseInt(id.split("player")[1]) - 1]

        play.Move(pos.x, pos.y)

        const iplayer = miniHelp.elemID(id)
        iplayer.style.transform = style
    }

    //Place bomb feature
    if (data.types == "bomb") {
        let id = data.content.id
        let pos = data.content.pos
        let bon = data.content.bonusFlame

        const play = tabOfPlayers[parseInt(id.split("player")[1]) - 1]

        play.CreateBombe(pos.x, pos.y, bon)
    }

    //remove player of the map
    if (data.types == "kill") {
        let id = data.content.id
        const play = tabOfPlayers[parseInt(id) - 1]
        play.Kill()
    }

    if (data.types == "killOne") {
        let tabId = data.content
        tabId.forEach(id => {
            let health = miniHelp.elemID("health" + id)
            let cost = parseInt(health.style.width.replace("%", ""))

            if (cost > 10) {
                cost -= 30
                health.style.width = (cost) + "%"
            }
        })
    }

    if (data.types == "removeBonus") {
        let tagName = data.content.tagName
        let xBonus = data.content.x
        let yBonus = data.content.y
        let elem = CheckPositionGrid(xBonus, yBonus, "#" + tagName)
        elem.remove()
        CheckPositionGrid(xBonus, yBonus, ".grid-item").firstChild.style.display = "block"
    }

    if (data.types == "win") {
        let winnerName = data.content.username
        let finalText = winnerName
        if (winnerName == username) {
            finalText = "You"
        }
        miniHelp.newElem("h1", { style: "text-align: center; font-size: 70px; color: black; z-index: 30; z-index: 30; position: absolute; background-color: aliceblue;" }, miniHelp.selector("body"), finalText + " win !")
        //console.log(finalText + " win !")
    }
}

// socket.onclose = function () {
//     //console.log("Disconnected from WebSocket server");
// };

// socket.send("Ok !")

// const HowManyRest = (tab) => {
//     let count
//     tag.forEach(player => {
//         let health = miniHelp.elemID("health" + player.id.split("player")[1])
//         let cost = parseInt(health.style.width.replace("%", ""))
//         if (cost > 10) {
//             count++
//         }
//     })

//     return count
// }

