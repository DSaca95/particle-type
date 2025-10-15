# Particle Text Renderer – ver_01.2

Interactive canvas-based text renderer with dynamic particle generation, custom cursor logic, and real-time visual controls.

## ✨ Features

- **Text-to-particle rendering** with adjustable density, font size, and weight
- **Color modes**: RGB, HSL, and dynamic random hue cycling
- **Shape controls**: circle, square, triangle
- **Fill styles**: fill or stroke, with adjustable outline width
- **Custom cursor** that mirrors particle settings and reacts to motion
- **Cursor trail** with fading, pulsing, and shape-matched visuals
- **Mouse interaction**: particle repulsion and return-to-origin animation
- **Responsive canvas** with dynamic resizing

## 🎛 Controls

| Control         | Description                                  |
|----------------|----------------------------------------------|
| `textInput`     | Text to render                               |
| `density`       | Sampling density for particle generation     |
| `fontSize`      | Font size in pixels                          |
| `fontWeight`    | Font weight (100–900)                        |
| `colorMode`     | RGB / HSL / Random                           |
| `rSlider/gSlider/bSlider` | RGB values (0–255)              |
| `hSlider/sSlider/lSlider` | HSL values (0–360 / 0–100%)      |
| `opacity`       | Particle opacity (0–1)                       |
| `renderMode`    | Fill / Outline / Negative                    |
| `fillStyle`     | Fill or Stroke                               |
| `outlineWidth`  | Stroke thickness (1–10px)                    |
| `particleShape` | Circle / Square / Triangle                   |

## 🖱 Custom Cursor

- Mirrors current `shape`, `fillStyle`, and `colorMode`
- Reacts to mouse speed with dynamic scaling and pulsing
- Leaves a fading trail with matching visual style

## 🧠 Interaction Logic

- Particle repulsion within 100px radius of cursor
- Smooth return-to-origin animation
- Random color mode cycles hue gradually for visual harmony

## 📦 Version Notes – `ver_01.2`

- ✅ Added `fontWeight` control with live regeneration
- ✅ Introduced `outlineWidth` slider for stroke customization
- ✅ Refined `random` color mode with slower hue cycling
- ✅ Implemented motion-reactive custom cursor with fading trail
- ✅ Cleaned up scroll-based weight logic

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/particle-text-renderer.git
cd particle-text-renderer
# Open index.html in browser
