package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type responseLogger struct {
	http.ResponseWriter
	statusCode int
}

func (lr *responseLogger) WriteHeader(code int) {
	if lr.statusCode == 0 {
		lr.statusCode = code
		lr.ResponseWriter.WriteHeader(code)
	}
}

func (lr *responseLogger) Write(b []byte) (int, error) {
	if lr.statusCode == 0 {
		lr.statusCode = http.StatusOK
	}
	return lr.ResponseWriter.Write(b)
}

func main() {
	port := "8080"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	root, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error obteniendo directorio actual: %v", err)
	}

	// Directorio de producción si existe
	distDir := filepath.Join(root, "dist")
	hasDist := false
	if fi, err := os.Stat(distDir); err == nil && fi.IsDir() {
		hasDist = true
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Desactivar caché en desarrollo local para reflejar cambios al instante
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")

		reqPath := r.URL.Path
		cleanPath := filepath.Clean(reqPath)
		trimmedPath := strings.TrimPrefix(filepath.FromSlash(cleanPath), "\\")

		// 1. Redirigir si es directorio de país sin barra final (ej. /br -> /br/)
		countryFolders := []string{"br", "ar", "es", "us", "cl", "co", "mx", "system"}
		for _, c := range countryFolders {
			if reqPath == "/"+c {
				http.Redirect(w, r, "/"+c+"/", http.StatusMovedPermanently)
				return
			}
		}

		// Candidatos a resolver (prioridad: dist/, luego root)
		searchDirs := []string{root}
		if hasDist {
			searchDirs = []string{distDir, root}
		}

		// A. Piden la raíz "/"
		if cleanPath == "\\" || cleanPath == "/" || cleanPath == "." {
			for _, dir := range searchDirs {
				idx := filepath.Join(dir, "index.html")
				if _, err := os.Stat(idx); err == nil {
					http.ServeFile(w, r, idx)
					return
				}
			}
		}

		// B. Piden subcarpeta con index.html (ej. /br/, /us/)
		for _, dir := range searchDirs {
			target := filepath.Join(dir, trimmedPath)
			if fi, err := os.Stat(target); err == nil && fi.IsDir() {
				idx := filepath.Join(target, "index.html")
				if _, errIdx := os.Stat(idx); errIdx == nil {
					http.ServeFile(w, r, idx)
					return
				}
			}
		}

		// C. Piden archivo exacto (ej. /assets/css/style.css, /assets/img/efects/..., /revision-precios.html, /br/index.html)
		for _, dir := range searchDirs {
			target := filepath.Join(dir, trimmedPath)
			if fi, err := os.Stat(target); err == nil && !fi.IsDir() {
				http.ServeFile(w, r, target)
				return
			}
		}

		// D. Simulación .htaccess: Piden ruta limpia sin .html (ej. /hosting-ilimitado o /br/hosting-ilimitado)
		for _, dir := range searchDirs {
			targetHTML := filepath.Join(dir, trimmedPath+".html")
			if fi, err := os.Stat(targetHTML); err == nil && !fi.IsDir() {
				http.ServeFile(w, r, targetHTML)
				return
			}
		}

		// E. 404 Not Found
		w.WriteHeader(http.StatusNotFound)
		for _, dir := range searchDirs {
			err404 := filepath.Join(dir, "404.html")
			if content, errRead := os.ReadFile(err404); errRead == nil {
				w.Header().Set("Content-Type", "text/html; charset=utf-8")
				w.Write(content)
				return
			}
		}
		fmt.Fprintf(w, "404 Not Found: %s\n", reqPath)
	})

	// Middleware de logging para ver cada petición en la consola
	loggedHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lr := &responseLogger{ResponseWriter: w, statusCode: 0}
		start := time.Now()
		mux.ServeHTTP(lr, r)
		duration := time.Since(start)
		code := lr.statusCode
		if code == 0 {
			code = http.StatusOK
		}
		fmt.Printf("[%s] %d %-4s %s (%v)\n", time.Now().Format("15:04:05"), code, r.Method, r.URL.Path, duration)
	})

	fmt.Println("=======================================================")
	fmt.Printf("🚀 SERVIDOR LOCAL NETZ (SIMULADOR CPANEL / APACHE)\n")
	if hasDist {
		fmt.Printf("📂 Modo:                  Producción (sirviendo dist/ y fallback root)\n")
	} else {
		fmt.Printf("📂 Modo:                  Desarrollo (sirviendo raíz)\n")
	}
	fmt.Printf("👉 Sitio Principal (PY):  http://localhost:%s/\n", port)
	fmt.Printf("👉 Versión Brasil (BR):   http://localhost:%s/br/\n", port)
	fmt.Printf("👉 Versión EE.UU. (US):   http://localhost:%s/us/\n", port)
	fmt.Printf("👉 Revisión de Precios:   http://localhost:%s/revision-precios.html\n", port)
	fmt.Println("-------------------------------------------------------")
	fmt.Println("   Presiona Ctrl+C en esta ventana para detenerlo")
	fmt.Println("=======================================================")

	if err := http.ListenAndServe(":"+port, loggedHandler); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
