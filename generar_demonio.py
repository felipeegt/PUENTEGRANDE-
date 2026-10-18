from PIL import Image, ImageDraw

# Configuración
CELL_SIZE = 120
COLS = 16
ROWS = 4
IMG_SIZE = (COLS * CELL_SIZE, ROWS * CELL_SIZE)

# Crear imagen
img = Image.new("RGBA", IMG_SIZE, (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Colores para cada movimiento
colors = [
    (100, 200, 255),
    (100, 255, 150),
    (255, 200, 100),
    (255, 150, 255),
    (255, 100, 100),
    (255, 100, 200),
    (50, 50, 50),
    (255, 215, 0),
    (150, 100, 255),
    (0, 255, 255),
    (200, 200, 255),
    (255, 100, 255),
    (255, 50, 50),
    (100, 100, 255),
    (100, 100, 100),
    (0, 255, 200),
]

# Dibujar cada celda
for row in range(ROWS):
    for col in range(COLS):
        x = col * CELL_SIZE
        y = row * CELL_SIZE
        color = colors[row * 4 + col // 4]

        # Fondo
        draw.rectangle([x, y, x + CELL_SIZE, y + CELL_SIZE], fill=color)
        draw.rectangle([x, y, x + CELL_SIZE, y + CELL_SIZE], outline=(255, 255, 255), width=1)

        # Índice
        idx = row * COLS + col
        draw.text((x + 5, y + 5), f"{idx:02d}", fill=(255, 255, 255))

        # Demonio
        cx, cy = x + CELL_SIZE // 2, y + CELL_SIZE // 2

        # Cuerpo
        draw.ellipse([cx - 30, cy - 20, cx + 30, cy + 20], fill=(0, 0, 0))
        # Cabeza
        draw.ellipse([cx - 20, cy - 40, cx + 20, cy - 10], fill=(0, 0, 0))
        # Ojos
        draw.ellipse([cx - 12, cy - 32, cx - 6, cy - 26], fill=(255, 0, 0))
        draw.ellipse([cx + 6, cy - 32, cx + 12, cy - 26], fill=(255, 0, 0))

        # Cuernos (espejo en columnas impares)
        if col % 2 == 1:
            draw.polygon([(cx - 25, cy - 45), (cx - 10, cy - 35), (cx - 15, cy - 50)], fill=(100, 0, 0))
            draw.polygon([(cx + 25, cy - 45), (cx + 10, cy - 35), (cx + 15, cy - 50)], fill=(100, 0, 0))
        else:
            draw.polygon([(cx - 25, cy - 45), (cx - 15, cy - 35), (cx - 10, cy - 50)], fill=(100, 0, 0))
            draw.polygon([(cx + 25, cy - 45), (cx + 15, cy - 35), (cx + 10, cy - 50)], fill=(100, 0, 0))

# Guardar
img.save("void_demon.png")
print("✅ ¡Archivo void_demon.png generado!")
print(f"📐 Tamaño: {IMG_SIZE[0]}x{IMG_SIZE[1]} px")
print(f"📊 Celdas: {COLS}x{ROWS} = {COLS * ROWS}")
