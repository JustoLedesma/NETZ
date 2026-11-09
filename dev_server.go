package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	port := "8080"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	root, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error obteniendo directorio actual: %v", err)
	}

	// Si existe la carpeta dist/ generada, servir prioritariamente desde dist/
	baseDir := root
	if distInfo, err := os.Stat(filepath.Join(root, "dist")); err == nil && distInfo.IsDir() {
		baseDir = filepath.Join(root, "dist")
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		reqPath := r.URL.Path

		cleanPath := filepath.Clean(reqPath)
		targetFile := filepath.Join(baseDir, cleanPath)

		// 1. Si es archivo estático (/assets/, /revision-precios.html, etc.) y existe
		fi, err := os.Stat(targetFile)
		if err == nil && !fi.IsDir() {
			http.ServeFile(w, r, targetFile)
			return
		}

		// 2. Si piden directorio raíz o subcarpeta de país (ej. / o /br/ o /us/)
		if err == nil && fi.IsDir() {
			indexCandidate := filepath.Join(targetFile, "index.html")
			if _, errIndex := os.Stat(indexCandidate); errIndex == nil {
				http.ServeFile(w, r, indexCandidate)
				return
			}
		}

		// 3. Simulación .htaccess: si piden /hosting-ilimitado o /br/hosting-ilimitado
		htmlCandidate := targetFile + ".html"
		if _, errHtml := os.Stat(htmlCandidate); errHtml == nil {
			http.ServeFile(w, r, htmlCandidate)
			return
		}

		// 4. Si la ruta es "/" servir index.html
		if cleanPath == "\\" || cleanPath == "/" || cleanPath == "." {
			rootIndex := filepath.Join(baseDir, "index.html")
			if _, errRootIndex := os.Stat(rootIndex); errRootIndex == nil {
				http.ServeFile(w, r, rootIndex)
				return
			}
		}

		// 5. Error 404 simulado con 404.html
		w.WriteHeader(http.StatusNotFound)
		err404 := filepath.Join(baseDir, "404.html")
		if _, errStat := os.Stat(err404); errStat == nil {
			http.ServeFile(w, r, err404)
		} else {
			fmt.Fprintf(w, "404 Not Found")
		}
	})

	fmt.Println("=======================================================")
	fmt.Printf("🚀 Servidor local NETZ (simulación .htaccess cPanel)\n")
	fmt.Printf("📂 Sirviendo desde:       %s\n", baseDir)
	fmt.Printf("👉 Abre en tu navegador:  http://localhost:%s\n", port)
	fmt.Printf("👉 Versión Brasil (BRL):  http://localhost:%s/br/\n", port)
	fmt.Printf("👉 Versión EE.UU. (USD):  http://localhost:%s/us/\n", port)
	fmt.Printf("👉 Revisión de precios:   http://localhost:%s/revision-precios.html\n", port)
	fmt.Println("   Presiona Ctrl+C para detener el servidor")
	fmt.Println("=======================================================")

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
