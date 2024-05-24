import miniHelp from './frontend/core/index.js'
import { game, login } from './template.js'
import { waitingRoom } from './template.js'
import { socket } from "./socket.js"
import { Bricks } from './utils.js'
import { killed } from './bomb.js'
import { CheckCollision } from './collisions.js'
import { bonus } from './bonus.js'

// Router initialisation
const initRouter = () => {
    if (!window.location.hash) {
        miniHelp.setHash("/login")
    }
}

initRouter()

export let gamePaused = false
let endGame = false
let idGameLoop
export let TimeNoGame = 0
export let username = ""
export let IDavatar = 0
export let counterPlayer = 0
export let requestTime = 0
export let canCreateBomb = true;
export const bricks = new Bricks(miniHelp.elemID("container"))


const body = document.body

export const reassignTime = (value) => {
    TimeNoGame = value
}

export const reassignCounterPlayer = (value) => {
    counterPlayer = value
}

// Function to check the grid position
export const CheckPositionGrid = (row, column, tagName) => {
    const selectedItem = Array.from(document.querySelectorAll(tagName));
    let toreturned;

    selectedItem.forEach(elem => {
        // Récupération des valeurs de grid-row et grid-column via getPropertyStyle
        const gridRow = parseInt(window.getComputedStyle(elem).getPropertyValue('grid-row').replace('px', ''), 10);
        const gridColumn = parseInt(window.getComputedStyle(elem).getPropertyValue('grid-column').replace('px', ''), 10);

        if (gridRow == parseInt(row) && gridColumn == parseInt(column)) {
            toreturned = elem;
        }
    });

    return toreturned;
}



const handleselect = () => {
    const path = miniHelp.getHash();
    //console.log("path get", path);
    switch (path) {
        case "/login":
            let infoUser = {
                Username: "",
                IDavatar: 0,
            }

            const send = miniHelp.elemID("Go_button")

            // // chosen player
            // let div = miniHelp.elemClassName("player");
            // for (let i = 0; i < div.length; i++) {
            //     //event click for ID Avatar
            //     miniHelp.event("click", div[i], () => {
            //         infoUser.IDavatar = parseInt(div[i].id)
            //     })
            // }

            //event click for getting username in field
            miniHelp.event("click", send, () => {
                infoUser.Username = miniHelp.elemID("nickname").value
                //console.log(infoUser);
                if (infoUser.Username == "") {
                    miniHelp.newElem('div', { class: "Alert", style: "color: red; font-weight: bold;" }, miniHelp.elemID("infoUser"), "Write your username and click to Go")
                    setTimeout(() => {
                        miniHelp.removeElem(".Alert")
                    }, 2000)
                    miniHelp.setHash("/login")
                } else {
                    //fetching infoUser on /login
                    fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(infoUser)
                    })
                        .then(response => response.json())
                        .then(data => {
                            //console.log(data)
                            if (data.status == "success") {
                                username = data.username
                                IDavatar = data.avatar
                                counterPlayer = data.counter
                                // TimeNoGame = data.timeFinal
                                miniHelp.setHash("/waitingRoom")
                            } else if (data.status == "Room closed !") {
                                miniHelp.newElem('div', { class: "Alert", style: "color: red; font-weight: bold;" }, miniHelp.elemID("infoUser"), "Room closed !")
                                setTimeout(() => {
                                    miniHelp.removeElem(".Alert")
                                }, 2000)
                            } else {
                                miniHelp.setHash("/login")
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            })

            break;
        case "/waitingRoom":
            // Sending chats
            miniHelp.event('focus', miniHelp.elemID("message-input"), () => {
                addEventListener('keyup', (e) => {
                    if (e.key == "Enter") {
                        const input = miniHelp.elemID("message-input")
                        if (input.value.trim().length === 0) {
                            return
                        }
                        const message = {
                            to: "chatRoom",
                            from: username,
                            message: input.value
                        }

                        const sending = {
                            types: "chat",
                            content: message,
                        }
                        socket.send(JSON.stringify(sending))
                        miniHelp.elemID("message-input").value = ""
                    }
                })
            })

            break;
        case "/game":
            document.addEventListener('keydown', (event) => {
                let me = miniHelp.elemID("player" + IDavatar)
                if (me != null) {
                    let newX = parseInt(me.style.gridRow)
                    let newY = parseInt(me.style.gridColumn)
                    // //console.log(newX, newY);
                    switch (event.key) {
                        case 'ArrowLeft':
                            if (newY > 2) {
                                for (let i = 1; i <= bonus.speed; i++) {

                                    const check = CheckPositionGrid(newX, newY - 1, ".grid-item")
                                    if (check != "undefined") {
                                        if (check.id.includes("grass")) {
                                            newY--;
                                        }
                                    }
                                }
                            }
                            // me.style = "transform: scaleX(1);"
                            break;
                        case 'ArrowRight':
                            if (newY < 14) {
                                for (let i = 1; i <= bonus.speed; i++) {
                                    
                                    const check = CheckPositionGrid(newX, newY + 1, ".grid-item")
                                    if (check != "undefined") {
                                        if (check.id.includes("grass")) {
                                            newY++;
                                        }
                                    }
                                }
                            }
                            // me.style = "transform: scaleX(-1);"
                            break;
                        case 'ArrowUp':
                            if (newX > 2) {
                                for (let i = 1; i <= bonus.speed; i++) {
                                    
                                    const check = CheckPositionGrid(newX - 1, newY, ".grid-item")
                                    if (check != "undefined") {
                                        if (check.id.includes("grass")) {
                                            newX--;
                                        }
                                    }
                                }
                            }
                            break;
                        case 'ArrowDown':
                            if (newX < 14) {
                                for (let i = 1; i <= bonus.speed; i++) {
                                    
                                    const check = CheckPositionGrid(newX + 1, newY, ".grid-item")
                                    if (check != "undefined") {
                                        if (check.id.includes("grass")) {
                                            newX++;
                                        }
                                    }
                                }
                            }
                            break;
                        case ' ':
                            if (canCreateBomb) {
                                // sending place of bomb
                                let data = {
                                    Types: "bomb",
                                    Content: {
                                        id: me.id,
                                        pos: {
                                            x: newX,
                                            y: newY,
                                        },
                                        bonusFlame: bonus.flamme
                                        // style: me.style.transform,
                                    }
                                }
                                socket.send(JSON.stringify(data))
                                canCreateBomb = false;
                                setTimeout(() => {
                                    canCreateBomb = true;
                                    //console.log("Vous pouvez créer une nouvelle bombe");
                                }, bonus.timer);
                                // 2 secondes de délai
                            } else {
                                //console.log("Attendez 2 secondes avant de créer une nouvelle bombe");
                            }
                            break;
                    }
                    // Sending move to webSocket
                    if (newX != me.style.gridRow || newY != me.style.gridColumn) {
                        let data = {
                            Types: "move",
                            Content: {
                                id: me.id,
                                pos: {
                                    x: newX,
                                    y: newY,
                                },
                                style: me.style.transform,
                            }
                        }
                        socket.send(JSON.stringify(data))

                        var objectMe = {
                            id: me.id,
                            x: newX,
                            y: newY,
                        }

                        //check collision with player
                        let players = Array.from(document.querySelectorAll(".player"))
                        players.forEach((player) => {
                            if (player.id != me.id) {
                                CheckCollision(objectMe, player, "person")
                            }
                        })

                        var bon = CheckPositionGrid(newX, newY, ".bonus")

                        //check collision bonus
                        if (bon) {
                            let elMe = objectMe
                            CheckCollision(elMe, bon, "bonus")
                        }
                    }
                }
            });
            break;
        default:
            break;
    }
}


const callback = () => {
    handleselect()
}

const routes = [
    {
        path: '/',
        component: () => {
            miniHelp.moreElems(login)
            callback()
        },
    },
    {
        path: '/login',
        component: () => {
            miniHelp.moreElems(login)
            callback()
        },
    },
    {
        path: '/waitingRoom',
        component: () => {
            if (username != "") {
                waitingRoom()
                callback()
            }
        },
    },
    {
        path: '/game',
        component: () => {
            if (username != "") {
                miniHelp.moreElems(game)
                callback()
            }
        },
    }
]

//Router link
const Router = new miniHelp.Router(routes, body)

miniHelp.event('hashchange', window, Router.loadPage())

window.addEventListener('load', miniHelp.setHash("/login"))

window.addEventListener('submit', (e) => {
    e.preventDefault();
})

export const setTimer = (timerTime) => {
    let lastTime = null;
    let minute = Math.floor(timerTime / 60);
    let second = timerTime % 60;

    const updateTimer = (timestamp) => {
        if (gamePaused) return;

        if (!lastTime) lastTime = timestamp;

        if (timestamp - lastTime >= 1000) {
            lastTime = timestamp;


            // miniHelp.elemID("timer").innerText = "Time remaining before Game started: " + timerTime
            timerTime--;
            if (timerTime < 0) timerTime = 0;

            minute = Math.floor(timerTime / 60);
            second = timerTime % 60;

            // //console.log(timerTime)
            miniHelp.elemID("timer").innerText = "Time remaining before Game started: " + timerTime
            if (timerTime === 0) {
                console.log(TimeNoGame);
                if (TimeNoGame == 10) {
                    miniHelp.elemID("timer").innerText = "Time remaining before Game started: " + timerTime
                    let valueClosingRoom = {
                        Types: "closeRoom",
                        Content: bricks.AddBricks()
                    }
                    socket.send(JSON.stringify(valueClosingRoom))
                    miniHelp.setHash('/game')
                    //console.log("Le jeu est lancé !");
                } else {
                    miniHelp.elemID("timer").innerText = "Time remaining before Game started: " + timerTime
                    let valueTimerStart = {
                        Types: "time",
                        Content: {
                            state: "begin",
                            who: "root",
                            second: 10,
                            counter: counterPlayer,
                        }
                    }
                    socket.send(JSON.stringify(valueTimerStart))
                }

                // On signale tous les joueurs que c'est la fin et on lance le jeu 
                // gameLoop(timestamp)
                cancelAnimationFrame(requestTime)
                return
            }
        }

        requestTime = requestAnimationFrame(updateTimer);
    }

    updateTimer();
}

const gameLoop = (timestamp) => {

    if (endGame) {
        cancelAnimationFrame(idGameLoop)
        return
    }

    if (lastTime == null) {
        lastTime = timestamp
        requestAnimationFrame(gameLoop)
        return
    }

    elapsedG = timestamp - lastTime


    if (!gamePaused) {
        // Add func on the loop
    }

    lastTime = timestamp
    idGameLoop = requestAnimationFrame(gameLoop)
}