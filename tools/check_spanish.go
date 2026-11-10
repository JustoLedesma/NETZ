package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var spanishPattern = regexp.MustCompile(`(?i)\b(más|información|servicios|hosting|planes|características|contacto|nosotros|precios|dominios|registro|ayuda|términos|privacidad|servidores|administrado|revendedor|cuenta|cuentas|año|mes|gratis|disco|espacio|tráfico|ilimitado|soporte|garantía|reembolso|contratar|comprar|activación|inmediata|copias|seguridad|ver|todos|volver|iniciar|sesión|contraseña)\b`)

func main() {
	files, err := os.ReadDir("us")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	for _, f := range files {
		if !strings.HasSuffix(f.Name(), ".html") {
			continue
		}
		path := filepath.Join("us", f.Name())
		file, err := os.Open(path)
		if err != nil {
			continue
		}

		scanner := bufio.NewScanner(file)
		lineNum := 0
		spanishLines := 0
		var examples []string

		for scanner.Scan() {
			lineNum++
			line := scanner.Text()
			// Ignorar script y style tags
			if strings.Contains(line, "<script") || strings.Contains(line, "<style") || strings.Contains(line, "crisp") {
				continue
			}
			matches := spanishPattern.FindAllString(line, -1)
			if len(matches) > 0 {
				spanishLines++
				if len(examples) < 5 {
					clean := strings.TrimSpace(line)
					if len(clean) > 80 {
						clean = clean[:80] + "..."
					}
					examples = append(examples, fmt.Sprintf("L%d: %s", lineNum, clean))
				}
			}
		}
		file.Close()

		fmt.Printf("📄 %s: %d Spanish lines\n", f.Name(), spanishLines)
		for _, ex := range examples {
			fmt.Printf("   %s\n", ex)
		}
	}
}

