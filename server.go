package main

import (
	"bomberman-dom/app/handler"
	"fmt"
	"net/http"
)


var STATUSROOM = ""

func main() {

	go handler.AllDataPassed()

	fs := http.FileServer(http.Dir("static")) // Assurez-vous que votre fichier CSS est dans le répertoire 'static'
	// http.Handle("/", http.StripPrefix("/", fs))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// http.ServeFile(w, r, filepath.Join("templates", "index.html"))
		http.ServeFile(w, r, "./index.html")
	})

	http.HandleFunc("/login", handler.AddNewUser)

	http.HandleFunc("/ws", handler.HandleWebSocket)

	// Lancement du serveur sur le port 8080
	fmt.Println("Serveur démarré sur http://localhost:5505/")
	err := http.ListenAndServe("localhost:5505", nil)
	if err != nil {
		fmt.Println("Erreur lors du démarrage du serveur:", err)
	}

}
