package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"time"
)

type CountryConfig struct {
	Name            string `json:"name"`
	Locale          string `json:"locale"`
	Currency        string `json:"currency"`
	Folder          string `json:"folder"`
	WhmcsCurrencyID *int   `json:"whmcsCurrencyId"`
}

var productionPages = []string{
	"404.html",
	"about.html",
	"audio-streaming.html",
	"aviso-legal.html",
	"buscar-dominios.html",
	"centro-de-ayuda.html",
	"contact.html",
	"desarrollo-software.html",
	"hosting-exclusivo.html",
	"hosting-ilimitado.html",
	"index.html",
	"politica-de-privacidad.html",
	"reseller-cpanel.html",
	"reseller-directadmin.html",
	"terminos-del-servicio.html",
	"video-streaming.html",
	"vps-linux-administrado.html",
	"vps-linux-no-administrado.html",
	"vps-linux.html",
	"vps-windows-administrado.html",
	"vps-windows-no-administrado.html",
	"vps-windows.html",
}

var internalSlugs = []string{
	"about",
	"audio-streaming",
	"aviso-legal",
	"buscar-dominios",
	"centro-de-ayuda",
	"contact",
	"desarrollo-software",
	"hosting-exclusivo",
	"hosting-ilimitado",
	"index",
	"politica-de-privacidad",
	"reseller-cpanel",
	"reseller-directadmin",
	"terminos-del-servicio",
	"video-streaming",
	"vps-linux-administrado",
	"vps-linux-no-administrado",
	"vps-linux",
	"vps-windows-administrado",
	"vps-windows-no-administrado",
	"vps-windows",
	"404",
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func syncAssets(src, dst string) error {
	if runtime.GOOS == "windows" {
		// robocopy: copia completa recursiva incluyendo archivos modificados
		cmd := exec.Command("robocopy", src, dst, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS", "/NP")
		_ = cmd.Run()
		return nil
	}
	// Fallback
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		target := filepath.Join(dst, rel)
		if info.IsDir() {
			return os.MkdirAll(target, 0755)
		}
		return copyFile(path, target)
	})
}

func transformHTML(content, countryCode string, cfg CountryConfig) string {
	res := content

	// 1. Reemplazar data-country y lang
	countryRe := regexp.MustCompile(`data-country="[^"]*"`)
	res = countryRe.ReplaceAllString(res, fmt.Sprintf(`data-country="%s"`, countryCode))

	langRe := regexp.MustCompile(`lang="[^"]*"`)
	res = langRe.ReplaceAllString(res, fmt.Sprintf(`lang="%s"`, cfg.Locale))

	// 2. Reemplazar preload de precios
	preloadRe := regexp.MustCompile(`/assets/data/prices/[a-z]{2}\.json`)
	res = preloadRe.ReplaceAllString(res, fmt.Sprintf(`/assets/data/prices/%s.json`, countryCode))

	// 3. Ajustar enlaces internos y canónicos si no es Paraguay (raíz)
	if countryCode != "py" {
		prefix := "/" + countryCode

		for _, slug := range internalSlugs {
			// href="slug" o href="/slug"
			reRelative := regexp.MustCompile(fmt.Sprintf(`href="/?%s(\.html)?(#|")`, regexp.QuoteMeta(slug)))
			res = reRelative.ReplaceAllStringFunc(res, func(m string) string {
				sub := slug
				if sub == "index" {
					sub = ""
				}
				suffix := `"`
				if strings.Contains(m, "#") {
					parts := strings.Split(m, "#")
					suffix = "#" + parts[1]
				}
				if sub == "" {
					return fmt.Sprintf(`href="%s/%s`, prefix, suffix)
				}
				return fmt.Sprintf(`href="%s/%s%s`, prefix, sub, suffix)
			})
		}

		// Canónicos y Open Graph URLs
		canonicalRe := regexp.MustCompile(`https://netz\.com\.py/([^"\s>]*)`)
		res = canonicalRe.ReplaceAllStringFunc(res, func(m string) string {
			if strings.Contains(m, "/assets/") {
				return m
			}
			path := strings.TrimPrefix(m, "https://netz.com.py/")
			path = strings.TrimPrefix(path, "/")
			if path == "" {
				return fmt.Sprintf("https://netz.com.py/%s/", countryCode)
			}
			// Evitar duplicar prefijo
			if strings.HasPrefix(path, countryCode+"/") {
				return m
			}
			return fmt.Sprintf("https://netz.com.py/%s/%s", countryCode, path)
		})
	}

	return res
}

func main() {
	start := time.Now()
	fmt.Println("==================================================")
	fmt.Println("🚀 GENERADOR NETZ - DISTRIBUCIÓN ESTÁTICA CPANEL")
	fmt.Println("==================================================")

	// Leer configuración de países
	configBytes, err := os.ReadFile("config/country_currency.json")
	if err != nil {
		fmt.Printf("❌ Error leyendo config/country_currency.json: %v\n", err)
		return
	}

	var countries map[string]CountryConfig
	if err := json.Unmarshal(configBytes, &countries); err != nil {
		fmt.Printf("❌ Error parseando JSON de países: %v\n", err)
		return
	}

	distDir := "dist"

	// Crear dist si no existe
	if err := os.MkdirAll(distDir, 0755); err != nil {
		fmt.Printf("❌ Error creando dist/: %v\n", err)
		return
	}

	// 1. Sincronizar recursos estáticos compartidos
	fmt.Println("📦 Sincronizando /assets/ estáticos compartidos...")
	if err := syncAssets("assets", filepath.Join(distDir, "assets")); err != nil {
		fmt.Printf("❌ Error sincronizando assets: %v\n", err)
		return
	}

	// 2. Copiar archivos de soporte de producción
	supportFiles := []string{".htaccess", "robots.txt", "revision-precios.html", "mailer.php"}
	for _, f := range supportFiles {
		if _, err := os.Stat(f); err == nil {
			fmt.Printf("📄 Copiando %s...\n", f)
			if err := copyFile(f, filepath.Join(distDir, f)); err != nil {
				fmt.Printf("⚠️ Advertencia copiando %s: %v\n", f, err)
			}
		}
	}

	// Copiar carpeta system si existe
	if fi, err := os.Stat("system"); err == nil && fi.IsDir() {
		fmt.Println("📦 Sincronizando /system/...")
		_ = syncAssets("system", filepath.Join(distDir, "system"))
	}

	// Copiar carpeta conexion si existe
	if fi, err := os.Stat("conexion"); err == nil && fi.IsDir() {
		fmt.Println("📦 Sincronizando /conexion/...")
		_ = syncAssets("conexion", filepath.Join(distDir, "conexion"))
	}

	// 3. Procesar las 21 páginas para cada país
	fmt.Println("\n🌐 Generando páginas HTML para cada país...")
	generatedCount := 0

	for countryCode, cfg := range countries {
		targetDir := distDir
		if countryCode != "py" {
			targetDir = filepath.Join(distDir, countryCode)
			if err := os.MkdirAll(targetDir, 0755); err != nil {
				fmt.Printf("❌ Error creando carpeta para %s: %v\n", countryCode, err)
				continue
			}
		}

		fmt.Printf("  ▶ Generando versión [%s] (%s, %s) -> %s\n", countryCode, cfg.Name, cfg.Locale, targetDir)

		for _, page := range productionPages {
			srcPath := page
			// Si existe una versión localizada específica para el país (ej. locales/br/index.html), usarla como base
			localizedPath := filepath.Join("locales", countryCode, page)
			if _, err := os.Stat(localizedPath); err == nil {
				srcPath = localizedPath
			}

			rawBytes, err := os.ReadFile(srcPath)
			if err != nil {
				fmt.Printf("    ⚠️ No se encontró %s, omitiendo...\n", srcPath)
				continue
			}

			transformed := transformHTML(string(rawBytes), countryCode, cfg)
			dstPath := filepath.Join(targetDir, page)

			if err := os.WriteFile(dstPath, []byte(transformed), 0644); err != nil {
				fmt.Printf("    ❌ Error escribiendo %s: %v\n", dstPath, err)
				continue
			}

			// Si es un país diferente a Paraguay, guardar también en la carpeta raíz del proyecto
			// para que Git y cPanel (public_html) tengan las carpetas /br/, /us/, etc. directamente
			if countryCode != "py" {
				rootCountryDir := countryCode
				_ = os.MkdirAll(rootCountryDir, 0755)
				_ = os.WriteFile(filepath.Join(rootCountryDir, page), []byte(transformed), 0644)
			}

			generatedCount++
		}
	}

	fmt.Println("\n==================================================")
	fmt.Printf("✅ Generación completada con éxito en %v\n", time.Since(start))
	fmt.Printf("📊 Total archivos HTML generados: %d páginas en dist/\n", generatedCount)
	fmt.Println("✨ Listo para subir el contenido de dist/ a public_html en cPanel")
	fmt.Println("==================================================")
}
