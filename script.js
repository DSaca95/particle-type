document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const mouse = { x: null, y: null };
  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  let lastText = "";
  let lastRenderMode = "";
  let lastDensity = 0;
  let lastColorMode = "";
  let lastFontSize = 125;
  let lastFontWeight = 400;

  let particles = [];

  let lastMouseX = null;
  let lastMouseY = null;
  let cursorSpeed = 0;
  let cursorTrail = [];

  let randomHue = Math.floor(Math.random() * 360);

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastMouseX !== null && lastMouseY !== null) {
      const dx = x - lastMouseX;
      const dy = y - lastMouseY;
      cursorSpeed = Math.hypot(dx, dy);
    }

    lastMouseX = x;
    lastMouseY = y;
    mouse.x = x;
    mouse.y = y;
    cursorTrail.push({ x: mouse.x, y: mouse.y, time: Date.now() });
    if (cursorTrail.length > 30) cursorTrail.shift();
  });

  function generateParticlesFromText(text, density, colorMode, opacity, fontSize) {
  
  const r = +document.getElementById("rSlider").value;
  const g = +document.getElementById("gSlider").value;
  const b = +document.getElementById("bSlider").value;
  
  const h = +document.getElementById("hSlider").value;
  const s = +document.getElementById("sSlider").value;
  const l = +document.getElementById("lSlider").value;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontWeight = +document.getElementById("fontWeight").value;
  ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const renderMode = document.getElementById("renderMode").value;

  if (renderMode === "outline") {
    ctx.strokeStyle = "#fff";
    const outlineWidth = +document.getElementById("outlineWidth").value;
    ctx.lineWidth = outlineWidth;
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  } else {
    ctx.fillStyle = "#fff";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
    
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  particles = [];

  for (let y = 0; y < canvas.height; y += density) {
    for (let x = 0; x < canvas.width; x += density) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      
      const isVisible = (
        (renderMode === "negative" && alpha < 128) ||
        (renderMode !== "negative" && alpha > 128)
      );
      
      if (isVisible) {
        let color;
        if (colorMode === "rgb") {
          color = `rgb(${r}, ${g}, ${b})`;
        } else if (colorMode === "hsl") {
          color = `hsl(${h}, ${s}%, ${l}%)`;
        } else if (colorMode === "random") {
          const randH = Math.floor(Math.random() * 360);
          color = `hsl(${randH}, 100%, 50%)`; // vagy RGB: `rgb(${randR}, ${randG}, ${randB})`
        } else {
          color = "#000";
        }
      
        particles.push({
          x, y,
          baseX: x, baseY: y,
          color, opacity,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    }
  }
}

  function drawParticles() {
    if (document.getElementById("colorMode").value === "random") {
      randomHue = (randomHue + 1) % 360;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      if (mouse.x !== null && mouse.y !== null) {
        const distance = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (distance < 100) {
          const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
          const force = (100 - distance) / 100;
          p.x += Math.cos(angle) * force * 5;
          p.y += Math.sin(angle) * force * 5;
        }
      }

      p.x += (p.baseX - p.x) * 0.05;
      p.y += (p.baseY - p.y) * 0.05;

      
      const time = Date.now() / 500;
      const radius = 1.5 + Math.sin(time + p.pulsePhase) * 1.5;
      
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();

      const shape = document.getElementById("particleShape").value;
      if (shape === "square") {
        ctx.rect(p.x - radius, p.y - radius, radius * 2, radius * 2);
      } else if (shape === "triangle") {
        ctx.moveTo(p.x, p.y - radius);
        ctx.lineTo(p.x - radius, p.y + radius);
        ctx.lineTo(p.x + radius, p.y + radius);
        ctx.closePath();
      } else {
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      }

const fillStyle = document.getElementById("fillStyle").value;
ctx.globalAlpha = p.opacity;
if (fillStyle === "stroke") {
  ctx.strokeStyle = p.color;
  ctx.stroke();
  ctx.lineWidth = +document.getElementById("outlineWidth").value;
} else {
  ctx.fillStyle = p.color;
  ctx.fill();
}
    });
    drawCustomCursor();
    requestAnimationFrame(drawParticles);
  }

  function drawCustomCursor() {
    const shape = document.getElementById("particleShape").value;
    const fillStyle = document.getElementById("fillStyle").value;
    const colorMode = document.getElementById("colorMode").value;

  const r = +document.getElementById("rSlider").value;
  const g = +document.getElementById("gSlider").value;
  const b = +document.getElementById("bSlider").value;
  const h = +document.getElementById("hSlider").value;
  const s = +document.getElementById("sSlider").value;
  const l = +document.getElementById("lSlider").value;

  const opacity = +document.getElementById("opacity").value;
  const baseRadius = 16;
  const dynamicRadius = baseRadius + Math.min(cursorSpeed * 0.5, 20);
  const time = Date.now() / 500;
  const pulse = Math.sin(time) * 2;
  const radius = dynamicRadius + pulse;

  let color;
  if (colorMode === "rgb") {
    color = `rgb(${r}, ${g}, ${b})`;
  } else if (colorMode === "hsl") {
    color = `hsl(${h}, ${s}%, ${l}%)`;
  } else {
    const randH = Math.floor(Math.random() * 360);
    color = `hsl(${randomHue}, 100%, 50%)`;
  }

  if (mouse.x === null || mouse.y === null) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();

  if (shape === "square") {
    ctx.rect(mouse.x - radius, mouse.y - radius, radius * 2, radius * 2);
  } else if (shape === "triangle") {
    ctx.moveTo(mouse.x, mouse.y - radius);
    ctx.lineTo(mouse.x - radius, mouse.y + radius);
    ctx.lineTo(mouse.x + radius, mouse.y + radius);
    ctx.closePath();
  } else {
    ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
  }

  if (fillStyle === "stroke") {
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.lineWidth = +document.getElementById("outlineWidth").value;
  } else {
    ctx.fillStyle = color;
    ctx.fill();
  }

  ctx.restore();

  cursorTrail.forEach((point, i) => {
    const age = Date.now() - point.time;
    const fade = Math.max(0, 1 - age / 500);
    if (fade <= 0) return;

    const radius = 3 + i * 0.2 + Math.sin(time + i * 0.1) * 0.5;
    ctx.globalAlpha = fade * opacity * 0.8;
    ctx.beginPath();

    if (shape === "square") {
      ctx.rect(point.x - radius, point.y - radius, radius * 2, radius * 2);
    } else if (shape === "triangle") {
      ctx.moveTo(point.x, point.y - radius);
      ctx.lineTo(point.x - radius, point.y + radius);
      ctx.lineTo(point.x + radius, point.y + radius);
      ctx.closePath();
    } else {
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    }

    if (fillStyle === "stroke") {
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
  })
}

  function rand(max) {
    return Math.floor(Math.random() * max);
  }
  
  function resizeCanvas() {
    const panelWidth = document.getElementById("controlPanel").offsetWidth;
    canvas.width = window.innerWidth - panelWidth;
    canvas.height = window.innerHeight;
  };
  
  function updateColorControls() {
    const mode = document.getElementById("colorMode").value;
    document.getElementById("sSlider").parentElement.style.display = mode === "rgb" ? "inline-block" : "none";
    document.getElementById("gSlider").parentElement.style.display = mode === "rgb" ? "inline-block" : "none";
    document.getElementById("bSlider").parentElement.style.display = mode === "rgb" ? "inline-block" : "none";
    
    document.getElementById("hSlider").parentElement.style.display = mode === "hsl" ? "inline-block" : "none";
    document.getElementById("sSlider").parentElement.style.display = mode === "hsl" ? "inline-block" : "none";
    document.getElementById("lSlider").parentElement.style.display = mode === "hsl" ? "inline-block" : "none";
  }
  
  function updateColorControls() {
    const mode = document.getElementById("colorMode").value;
  
    const rgbControls = ["rSlider", "gSlider", "bSlider"];
    const hslControls = ["hSlider", "sSlider", "lSlider"];
  
    rgbControls.forEach(id => {
      document.getElementById(id).parentElement.style.display = mode === "rgb" ? "inline-block" : "none";
    });
  
    hslControls.forEach(id => {
      document.getElementById(id).parentElement.style.display = mode === "hsl" ? "inline-block" : "none";
    });
  }
  
  ["rSlider", "gSlider", "bSlider", "hSlider", "sSlider", "lSlider"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    updateColorPreview();
    generateParticlesFromText(
      document.getElementById("textInput").value || "Hello",
      +document.getElementById("density").value,
      document.getElementById("colorMode").value,
      +document.getElementById("opacity").value,
      +document.getElementById("fontSize").value
    );
  });
});

function updateColorPreview() {
  const mode = document.getElementById("colorMode").value;
  const r = +document.getElementById("rSlider").value;
  const g = +document.getElementById("gSlider").value;
  const b = +document.getElementById("bSlider").value;
  const h = +document.getElementById("hSlider").value;
  const s = +document.getElementById("sSlider").value;
  const l = +document.getElementById("lSlider").value;

  const color = mode === "rgb"
    ? `rgb(${r}, ${g}, ${b})`
    : `hsl(${h}, ${s}%, ${l}%)`;

  document.getElementById("colorPreview").style.backgroundColor = color;
}
  
  window.addEventListener("resize", () => {
    resizeCanvas();
    update();
  })
  
  document.getElementById("colorMode").addEventListener("change", () => {
    updateColorControls();
    updateColorPreview();
    update();
  })

  function update() {
    const text = document.getElementById("textInput").value || "Hello";
    const density = +document.getElementById("density").value;
    const opacity = +document.getElementById("opacity").value;
    const colorMode = document.getElementById("colorMode").value;
    const renderMode = document.getElementById("renderMode").value;
    const fontSize = +document.getElementById("fontSize").value;
    const fontWeight = +document.getElementById("fontWeight").value;
    
    const shouldRegenerate =
          text !== lastText ||
          renderMode !== lastRenderMode ||
          density !== lastDensity ||
          colorMode !== lastColorMode ||
          fontSize !== lastFontSize ||
          fontWeight !== lastFontWeight;
    
    if (shouldRegenerate) {
      generateParticlesFromText(text, density, colorMode, opacity, fontSize);
      lastText = text;
      lastRenderMode = renderMode;
      lastDensity = density;
      lastColorMode = colorMode;
      lastFontSize = fontSize;
    } else {
      particles.forEach(p => p.opacity = opacity);
    }
  }

  document.getElementById("textInput").addEventListener("input", update);
  document.getElementById("density").addEventListener("input", update);
  document.getElementById("opacity").addEventListener("input", update);
  document.getElementById("renderMode").addEventListener("change", update);
  document.getElementById("fontSize").addEventListener("input", update);
  document.getElementById("fontWeight").addEventListener("input", update);
  document.getElementById("particleShape").addEventListener("change", update);
  document.getElementById("fillStyle").addEventListener("change", update);
  document.getElementById("outlineWidth").addEventListener("input", update);

  resizeCanvas();
  update();
  drawParticles();
  updateColorControls();
  updateColorPreview();

});