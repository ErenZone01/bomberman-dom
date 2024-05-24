package models

type User struct {
	Username string `json:"username"`
	IDavatar int    `json:"idAvatar"`
}

type Movement struct {
	Action   string
	Who      string
	Position interface{}
	IDavatar int
}

type Statement struct {
	State   string `json:"state"`
	Who     string `json:"who"`
	Second  int    `json:"second"`
	Counter int    `json:"counter"`
}

type Chat struct {
	To      string `json:"to"`
	From    string `json:"from"`
	Message string `json:"message"`
}

type SocketElement struct {
	Types   string      `json:"types"`
	Content interface{} `json:"content"`
}
