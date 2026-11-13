package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
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

type RouteConfig struct {
	Slug       string
	Priority   string
	Changefreq string
}

func main() {
	fmt.Println("==================================================")
	fmt.Println("🗺️  GENERADOR DE SITEMAP.XML MULTIIDIOMA - NETZ")
	fmt.Println("==================================================")

	// 1. Cargar configuración de países y locales
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

	// Orden determinista de países: py (default) primero, luego alfabético
	countryOrder := []string{"py", "ar", "br", "cl", "co", "es", "mx", "us"}

	// 2. Definir rutas públicas y su peso SEO técnico
	routes := []RouteConfig{
		// Home
		{Slug: "index", Priority: "1.0", Changefreq: "daily"},

		// Hosting y Dominios Core
		{Slug: "hosting-ilimitado", Priority: "0.9", Changefreq: "weekly"},
		{Slug: "hosting-exclusivo", Priority: "0.9", Changefreq: "weekly"},
		{Slug: "reseller-cpanel", Priority: "0.9", Changefreq: "weekly"},
		{Slug: "reseller-directadmin", Priority: "0.9", Changefreq: "weekly"},
		{Slug: "buscar-dominios", Priority: "0.9", Changefreq: "weekly"},

		// Servidores VPS y Streaming
		{Slug: "vps-linux", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "vps-linux-administrado", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "vps-linux-no-administrado", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "vps-windows", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "vps-windows-administrado", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "vps-windows-no-administrado", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "audio-streaming", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "video-streaming", Priority: "0.8", Changefreq: "weekly"},
		{Slug: "desarrollo-software", Priority: "0.8", Changefreq: "weekly"},

		// Institucional y Soporte
		{Slug: "about", Priority: "0.7", Changefreq: "monthly"},
		{Slug: "contact", Priority: "0.7", Changefreq: "monthly"},
		{Slug: "centro-de-ayuda", Priority: "0.7", Changefreq: "monthly"},

		// Legal
		{Slug: "terminos-del-servicio", Priority: "0.3", Changefreq: "yearly"},
		{Slug: "politica-de-privacidad", Priority: "0.3", Changefreq: "yearly"},
		{Slug: "aviso-legal", Priority: "0.3", Changefreq: "yearly"},
	}

	today := time.Now().Format("2006-01-02")
	baseURL := "https://netz.com.py"

	// Helper para armar URL canónica limpia según estándares de .htaccess
	buildURL := func(countryCode, slug string) string {
		if countryCode == "py" {
			if slug == "index" {
				return baseURL + "/"
			}
			return fmt.Sprintf("%s/%s", baseURL, slug)
		}
		// Otros países
		if slug == "index" {
			return fmt.Sprintf("%s/%s/", baseURL, countryCode)
		}
		return fmt.Sprintf("%s/%s/%s", baseURL, countryCode, slug)
	}

	var sb strings.Builder
	sb.WriteString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
	sb.WriteString("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n")
	sb.WriteString("        xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n")

	totalURLs := 0

	// 3. Generar bloques <url> para cada ruta y cada país
	for _, route := range routes {
		for _, countryCode := range countryOrder {
			loc := buildURL(countryCode, route.Slug)

			sb.WriteString("  <url>\n")
			sb.WriteString(fmt.Sprintf("    <loc>%s</loc>\n", loc))
			sb.WriteString(fmt.Sprintf("    <lastmod>%s</lastmod>\n", today))
			sb.WriteString(fmt.Sprintf("    <changefreq>%s</changefreq>\n", route.Changefreq))
			sb.WriteString(fmt.Sprintf("    <priority>%s</priority>\n", route.Priority))

			// Etiquetas alternas hreflang (recíprocas para todos los países)
			for _, altCode := range countryOrder {
				altCfg := countries[altCode]
				altURL := buildURL(altCode, route.Slug)
				sb.WriteString(fmt.Sprintf("    <xhtml:link rel=\"alternate\" hreflang=\"%s\" href=\"%s\" />\n", altCfg.Locale, altURL))
			}

			// x-default apuntando a la versión principal (Paraguay / default)
			defaultURL := buildURL("py", route.Slug)
			sb.WriteString(fmt.Sprintf("    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"%s\" />\n", defaultURL))

			sb.WriteString("  </url>\n")
			totalURLs++
		}
	}

	sb.WriteString("</urlset>\n")

	sitemapContent := sb.String()

	// 4. Guardar sitemap.xml en la raíz del proyecto
	rootPath := "sitemap.xml"
	if err := os.WriteFile(rootPath, []byte(sitemapContent), 0644); err != nil {
		fmt.Printf("❌ Error escribiendo %s: %v\n", rootPath, err)
		return
	}
	fmt.Printf("✅ Generado con éxito: %s (%d URLs indexadas)\n", rootPath, totalURLs)

	// 5. Guardar copia en dist/ (carpeta pública lista para cPanel public_html)
	distPath := filepath.Join("dist", "sitemap.xml")
	_ = os.MkdirAll("dist", 0755)
	if err := os.WriteFile(distPath, []byte(sitemapContent), 0644); err != nil {
		fmt.Printf("⚠️ Advertencia escribiendo %s: %v\n", distPath, err)
	} else {
		fmt.Printf("✅ Sincronizado en distribución: %s\n", distPath)
	}

	fmt.Println("==================================================")
	fmt.Printf("🎉 Sitemap completado: 21 rutas x 8 variantes = %d entradas XML con hreflang recíproco y x-default\n", totalURLs)
	fmt.Println("==================================================")
}

