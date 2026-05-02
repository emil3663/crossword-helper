from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Colors
    bg_color = "#1a1400"
    text_color = "#f6c90e"
    
    # Create image
    img = Image.new("RGB", (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Draw a bold letter "C"
    # Estimate font size as 70% of icon size
    try:
        # Try to find a default font
        font = ImageFont.truetype("arial.ttf", int(size * 0.7))
    except:
        font = ImageFont.load_default()
    
    # Center the text
    text = "C"
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((size - w) / 2, (size - h) / 2 - (h * 0.1)), text, fill=text_color, font=font)
    
    img.save(f"icons/{filename}")
    print(f"Created {filename}")

create_icon(192, "icon-192.png")
create_icon(512, "icon-512.png")
