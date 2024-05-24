import miniHelp from "./frontend/core/index.js"
import { IDavatar, counterPlayer, username } from "./main.js"


export const login = {
    tag: "div",
    attributes: {
        class: "login"
    },
    children: [
        {
            tag: 'div',
            attributes: {
                class: "ombre"
            },
            children: []
        },
        {
            tag: "div",
            attributes: {
                id: "infoUser"
            },
            children: [
                {
                    tag: "label",
                    attributes: {
                        "for": "nickname"
                    },
                    textContent: "Enter your nickname"
                },
                {
                    tag: "br",
                    attributes: {}
                },
                {
                    tag: "input",
                    attributes: {
                        type: "text",
                        id: "nickname"
                    }
                }
            ]
        },
        // {
        //     tag: "h2",
        //     attributes: {},
        //     textContent: "Choose your player"
        // },
        // {
        //     tag: "div",
        //     attributes: {
        //         class: "players"
        //     },
        //     children: [
        //         {
        //             tag: "button",
        //             attributes: {
        //                 class: "player",
        //                 id: 1
        //             },
        //             children: [
        //                 {
        //                     tag: "img",
        //                     attributes: {
        //                         src: "./static/img/player1.png",
        //                         height: "300px",
        //                         width: "300px",
        //                         alt: ""
        //                     },
        //                     children: []
        //                 }
        //             ]
        //         },
        //         {
        //             tag: "button",
        //             attributes: {
        //                 class: "player",
        //                 id: 2
        //             },
        //             children: [
        //                 {
        //                     tag: "img",
        //                     attributes: {
        //                         src: "./static/img/player2.png",
        //                         height: "300px",
        //                         width: "300px",
        //                         alt: ""
        //                     },
        //                     children: []
        //                 }
        //             ]
        //         },
        //         {
        //             tag: "button",
        //             attributes: {
        //                 class: "player",
        //                 id: 3
        //             },
        //             children: [
        //                 {
        //                     tag: "img",
        //                     attributes: {
        //                         src: "./static/img/player3.png",
        //                         height: "300px",
        //                         width: "300px",
        //                         alt: ""
        //                     },
        //                     children: []
        //                 }
        //             ]
        //         },
        //         {
        //             tag: "button",
        //             attributes: {
        //                 class: "player",
        //                 id: 4
        //             },
        //             children: [
        //                 {
        //                     tag: "img",
        //                     attributes: {
        //                         src: "./static/img/player4.png",
        //                         height: "300px",
        //                         width: "300px",
        //                         alt: ""
        //                     },
        //                     children: []
        //                 }
        //             ]
        //         }
        //     ]
        // },
        {
            tag: "button",
            attributes: {
                id: "Go_button"
            },
            textContent: "Go"
        }
    ]
}

export const room = {
    tag: "div",
    attributes: {},
    children: [
        {
            tag: "h1",
            attributes: {},
            textContent: "ROOM"
        },
        {
            "tag": "div",
            "attributes": {
                "class": "chat_group"
            },
            "children": []
        },
        {
            tag: "h2",
            attributes: {},
            textContent: "Time"
        },
        {
            tag: "p",
            attributes: {},
            textContent: "tu es en attente"
        }
    ]
}

export const game =
{
    tag: "div",
    attributes: {
        class: "container",
        id: "container",
        style: `width: max-content;
        height: max-content;
        display: grid;
        grid-template-columns: repeat(15, 1fr);
        grid-template-rows: repeat(15, 1fr);
        gap: 1px;
        background-color: black;
        position: absolute;
        justify-content: center;
        align-items: center;`,
    },
    children: []
}

export const waitingRoom = () => {

    const body = miniHelp.selector('body')

    miniHelp.moreElems(
        {
            tag: "div",
            attributes: {
                class: "debut"
            },
            children: [
                {
                    tag: 'div',
                    attributes: {
                        class: "ombre"
                    },
                    children: []
                },
                {
                    tag: 'h1',
                    attributes: {
                        class: "room"
                    },
                    children: [

                    ], textContent: "ROOM"
                },
                {
                    tag: 'div',
                    attributes: {
                        class: "conteur"
                    },
                    children: [
                        {
                            tag: 'h1',
                            attributes: {id : "counterPlayer"},
                            children: [], textContent: counterPlayer
                        },
                    ]
                },
                {
                    tag: 'div',
                    attributes: {
                        id: "timer"
                    },
                    children: [

                    ], textContent: "Time remaining before Game started:"
                },
                {
                    tag: "div",
                    attributes: {
                        class: "chatbox"
                    },
                    children: [
                        {
                            tag: "div",
                            attributes: {
                                id: "message",
                                class: "messages"
                            },
                            children: []
                        },
                        {
                            tag: "form",
                            attributes: {
                                class: "message-form"
                            },
                            children: [
                                {
                                    tag: "input",
                                    attributes: {
                                        type: "text",
                                        id: "message-input",
                                        class: "message-input",
                                        placeholder: "Écrivez un message..."
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'div',
                            attributes: {
                                id: "user-space"
                            },
                            children: [
                                {
                                    tag: 'h1',
                                    attributes: {
                                        id: "user-space-title"
                                    },
                                    textContent: username
                                },
                                {
                                    tag: 'div',
                                    attributes: {
                                        id: "user-space-content"
                                    },
                                    children: [
                                        {
                                            tag: 'img',
                                            attributes: {
                                                src: "./static/img/player" + IDavatar + ".png",
                                                height: "200px",
                                                width: "200px",
                                                alt: ""
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
        },
        miniHelp.selector('body') // or another parent element
    );
}

