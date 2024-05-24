import miniHelp from "./frontend/core/index.js";
import { CheckPositionGrid, IDavatar } from "./main.js";
import { socket } from "./socket.js";

const originalFrameWidth = 84; // Original width of a single frame
const originalFrameHeight = 104; // Original height of a single frame
const frameWidth = 32; // Desired width of a single frame
const frameHeight = 32; // Desired height of a single frame
const framesInFirstRow = 5; // Number of frames in the first row
const framesInSecondRow = 2; // Number of frames in the second row
const numFrames = framesInFirstRow + framesInSecondRow; // Total number of frames

let currentFrame = 0;
let lastFrameTime = 0;
const frameDuration = 100; // Duration of each frame in milliseconds
export let life = 90
export let killed = false

export const reassignLife = (value) => {
    life = value
}

//drop bomb
export const dropBomb = (bomb) => { bomb.remove() }

export const createExplosion = (gridColumn, gridRow, radius) => {

    let zone = miniHelp.elemID("container")

    const positions = []

    positions.push({ column: gridColumn, row: gridRow, direction: "middle" });
    let up = true;
    let right = true;
    let left = true;
    let down = true;

    // Ajouter les positions à gauche et à droite
    for (let i = 1; i <= radius; i++) {
        left = left ? !CheckPositionGrid(gridRow, gridColumn - i, ".grid-item").id.includes("unbreakable") : false
        if (left) {
            positions.push({ column: gridColumn - i, row: gridRow, direction: "left" });
        }
        right = right ? !CheckPositionGrid(gridRow, gridColumn + i, ".grid-item").id.includes("unbreakable") : false

        if (right) {
            positions.push({ column: gridColumn + i, row: gridRow, direction: "right" });
        }

        up = up ? !CheckPositionGrid(gridRow - i, gridColumn, ".grid-item").id.includes("unbreakable") : false

        if (up) {
            positions.push({ column: gridColumn, row: gridRow - i, direction: "up" });
        }

        down = down ? !CheckPositionGrid(gridRow + i, gridColumn, ".grid-item").id.includes("unbreakable") : false

        if (down) {
            positions.push({ column: gridColumn, row: gridRow + i, direction: "down" });
        }
    }

    const animations = positions.map(({ column, row }) => {
        let room = CheckPositionGrid(row, column, ".grid-item");
        
        if (room && !room.id.includes("unbreakable")) {
            return animationExplosion(room, zone, column, row);
        }
        return Promise.resolve(); // Return a resolved promise for positions that don't animate
    });

    // Wait for all animations to complete
    Promise.all(animations).then(() => {
        // //console.log('All animations completed');
    });
}

export const animateSprite = (explosion, timestamp, resolve) => {
    let currentFrame = 0;
    let lastFrameTime = timestamp;

    const step = (timestamp) => {
        if (timestamp - lastFrameTime >= frameDuration) {
            // Calculate current frame's row and column
            let frameX, frameY;

            if (currentFrame < framesInFirstRow) {
                // Frames in the first row
                frameX = currentFrame;
                frameY = 0;
            } else {
                // Frames in the second row
                frameX = currentFrame - framesInFirstRow;
                frameY = 1;
            }

            const xPos = -(frameX * originalFrameWidth);
            const yPos = -(frameY * originalFrameHeight);

            // Update the background position of the sprite
            explosion.style.backgroundPosition = `${xPos}px ${yPos}px`;

            // Move to the next frame
            currentFrame++;
            lastFrameTime = timestamp;
        }

        // Request the next frame if not at the end
        if (currentFrame < numFrames) {
            requestAnimationFrame(step);
        } else {
            var region = explosion
            let players = Array.from(document.querySelectorAll(".player"))
            players.forEach((e) => {
                if (e.style.gridColumn == region.style.gridColumn && e.style.gridRow == region.style.gridRow) {
                    let id = e.id.split("player")
                    let health = miniHelp.elemID("health" + id[1])
                    let cost = parseInt(health.style.width.replace("%", ""))

                    if (cost > 10) { health.style.width = (cost - 30) + "%" }
                }
            });

            const me = miniHelp.elemID("player" + IDavatar)
            if (me != null) {
                if (me.style.gridColumn == region.style.gridColumn && me.style.gridRow == region.style.gridRow) {
                    life -= 30
                    if (life <= 10) {

                        let ennemies = Array.from(miniHelp.selectorAll(".player"))
                        let tab = []

                        ennemies.forEach(ennemie => {
                            let rmSplitID = parseInt(ennemie.id.split("player")[1])
                            if (rmSplitID != IDavatar) {
                                tab.push(rmSplitID)
                            }
                        })

                        let data = {
                            Types: "kill",
                            Content: {
                                id: IDavatar,
                            }
                        }
                        killed = true
                        socket.send(JSON.stringify(data))

                        let dataKill = {
                            Types: "serverOnekilled",
                            Content: tab
                        }
                        socket.send(JSON.stringify(dataKill))
                    }
                }
            }


            // var exp = explosion


            //checkcollosion
            //let e = getPlayerPosition()
            resolve(); // Resolve the promise when animation is complete
            dropBomb(explosion)
        }
    }

    requestAnimationFrame(step);
}

export const animationExplosion = (room, zone, gridColumn, gridRow) => {

    return new Promise((resolve) => {
        let explosion = document.createElement("div");
        explosion.classList.add("sprite");
        explosion.id = "bomb" + room.id;

        //si la room est breakable elle sera detruite et transformer en grass
        if (room.id.includes("breakable")) {
            let newRoom = Array.from(document.querySelectorAll("#" + room.id))
            //console.log("A casser: ", newRoom);
            newRoom.forEach(e => {
                let idRoom = e.id.split("breakable")
                e.id = "grass" + idRoom[1]
                // e.style = "background-image: url('./static/img/grid.png')"
                if (e.firstChild) {
                    e.firstChild.src = "./static/img/grid.png"
                }
            })
        }


        var bonus = CheckPositionGrid(gridRow, gridColumn, ".bonus")
        if (bonus != null) {
            bonus.style.display = "block"
            let parent = CheckPositionGrid(gridRow, gridColumn, ".grid-item")
            if (parent) {
                parent.firstChild.style.display = "none"
            }
        }
        explosion.style.gridColumn = gridColumn;
        explosion.style.gridRow = gridRow;
        zone.append(explosion);

        requestAnimationFrame((timestamp) => animateSprite(explosion, timestamp, resolve));
    });
}
