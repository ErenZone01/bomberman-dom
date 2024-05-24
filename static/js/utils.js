import { createExplosion, dropBomb, life, } from "./bomb.js";
import { bonus } from "./bonus.js";
import miniHelp from "./frontend/core/index.js"
import { CheckPositionGrid } from "./main.js";


export class Bricks {
    constructor(container) {
        this.container = container;
    }


    AddBricks = () => {
        // Définition de la disposition initiale de la carte
        var layout = [
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
            [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
            [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
            [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
            [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
            [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
            [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
            [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
            [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
            [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
            [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
            [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
            [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
        ];

        // Initialiser le compteur de power-ups
        const maxPowerUps = 12;
        const halfPowerUps = maxPowerUps / 2;
        const powerUpTypes = [8, 9, 10]; // Types de power-ups possibles 8 bomb, 9 feu, 10 vitesse

        let powerUpsInTopHalf = 0;
        let powerUpsInBottomHalf = 0;

        function addPowerUpToRegion(startRow, endRow, powerUpCount, maxPowerUpsPerRegion) {
            while (powerUpCount < maxPowerUpsPerRegion) {
                let randomRow = Math.floor(Math.random() * (endRow - startRow)) + startRow;
                let randomColumn = Math.floor(Math.random() * layout[randomRow].length);

                if (layout[randomRow][randomColumn][0] === 2 && layout[randomRow][randomColumn].length === 1) {
                    let powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                    layout[randomRow][randomColumn].push(powerUp);
                    powerUpCount++;
                }
            }
            return powerUpCount;
        }

        // Ajouter les briques et les power-ups initiaux
        for (let row = 0; row < layout.length; row++) {
            for (let column = 0; column < layout[row].length; column++) {
                const tile = layout[row][column][0]; // Obtient la valeur actuelle de la case
                if (tile === 0) { // Si la case est une herbe (0)
                    let isBrick = Math.round(Math.random() * 1); // Génère aléatoirement 0 ou 1
                    if ((2 < row && row < 12 || 3 < column && column < 11) && isBrick === 0) {
                        // Met à jour la case de l'herbe (0) à la brique (2)
                        layout[row][column][0] = 2;
                    }
                }
            }
        }

        // Ajouter des power-ups de manière uniforme
        powerUpsInTopHalf = addPowerUpToRegion(0, Math.floor(layout.length / 2), powerUpsInTopHalf, halfPowerUps);
        powerUpsInBottomHalf = addPowerUpToRegion(Math.floor(layout.length / 2), layout.length, powerUpsInBottomHalf, halfPowerUps);

        return layout; // Retourne la disposition mise à jour
    }

    ChargeMap = (tab, container) => {
        var compteur = 0
        tab.forEach((e, row) => {
            (e).forEach((e2, col) => {
                var status = ""
                var sourceImg = ""
                var sourceImgBonus = ""
                var idBonus = "bonus"
                var bonus = {}
                if (e2[0] == 1) {
                    sourceImg = "./static/img/grid_option2.png"
                    status = "unbreakable"
                } else if (e2[0] == 2) {
                    if (e2.length > 1) {
                        if (e2[1] == 8) {
                            sourceImgBonus = "./static/img/item-bomb.png";
                            idBonus += "8"
                        } else if (e2[1] == 9) {
                            sourceImgBonus = "./static/img/item-fire.png";
                            idBonus += "9"
                        } else if (e2[1] == 10) {
                            sourceImgBonus = "./static/img/item-speed.png";
                            idBonus += "10"
                        }
                        bonus = { tag: 'img', attributes: { id: idBonus, class: "bonus", src: sourceImgBonus, style: "width:100%; height:100%; display: none; grid-row: " + (row + 1) + "; grid-column: " + (col + 1) + ";" }, }
                    }
                    sourceImg = "./static/img/wall.png"
                    status = "breakable"
                } else if (e2[0] == 0) {
                    sourceImg = "./static/img/grid.png"
                    status = "grass"
                }

                miniHelp.moreElems({
                    tag: 'div',
                    attributes: {
                        class: "grid-item", id: status + String(compteur), style: "grid-row: " + (row + 1) + "; grid-column: " + (col + 1) + ";"
                    },
                    children: [
                        {
                            tag: 'img',
                            attributes: { src: sourceImg, style: "width:100%; height:100%" },
                        },
                        bonus != {} ? bonus : {}
                    ]
                }, container)

                compteur++
            })
        });
    }

    RemoveBrick(id) {
        var brick = miniHelp.elemID(id)
        dropBomb(brick)
    }
}

export class Player {
    constructor(id, row, col) {
        this.id = id
        this.col = col
        this.row = row
    }

    Create = (container) => {
        var row = this.row
        var col = this.col
        var id = this.id

        let zone = container
        const player = miniHelp.moreElems({
            tag: 'div',
            attributes: {
                id: "player" + id,
                class: "player",
                style: "grid-row: " + row + "; grid-column: " + col + "; " + `
                width: 40px;
                height: 40px;
                position: relative;`
            },
            children: [
                {
                    tag: 'img',
                    attributes: {
                        class: "player",
                        src: "./static/img/player" + id + ".png",
                        // src: "./static/img/zombie.png",
                        style: `
                        width: 40px;
                        height: 40px;
                        `}
                },
                {
                    tag: 'div',
                    attributes: {
                        class: "healthbarre"
                    },
                    children: [
                        {
                            tag: 'div',
                            attributes: {
                                id: "health" + id,
                                class: "health",
                                style: "width: " + (life + 10) + "%;"
                            }
                        }
                    ]
                }
            ]
        }, zone)
        // Initial position
        this.Move(row, col)

        return player
    }

    Move(x, y) {
        var id = this.id
        let player = miniHelp.elemID("player" + id)
        player.style.gridColumn = y
        player.style.gridRow = x
    }

    Kill() {
        var id = this.id
        miniHelp.removeElem("#player" + id)
    }

    GetPlayerPosition = () => {
        let player = miniHelp.elemID(this.id)
        const gridRow = parseInt(window.getComputedStyle(player).getPropertyValue('grid-row').replace('px', ''), 10);
        const gridColumn = parseInt(window.getComputedStyle(player).getPropertyValue('grid-column').replace('px', ''), 10);
        return { gridRow, gridColumn };
    }

    CreateBombe = (x, y, m) => {
        let zone = miniHelp.elemID("container")

        let img = document.createElement("img")
        img.src = "./static/img/bomb.png";
        img.classList.add("bomb");
        let room = CheckPositionGrid(x, y, ".grid-item");
        img.id = room.id
        let IdRoom = room.id.split("grass")
        room.id = "unbreakable" + IdRoom[1]
        img.style.gridColumn = y;
        img.style.gridRow = x;
        // Initial position
        zone.append(img);
        setTimeout(() => {
            dropBomb(img)

            room.id = "grass" + IdRoom[1]
            createExplosion(y, x, m)
        }, 2000)
    }
}
