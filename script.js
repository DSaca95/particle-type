document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
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
    let lastScrollWeight = 400;
    let scrollWeight = 400;
  
    let particles = [];
  
    function generateParticlesFromText(text, density, colorMode, opacity, fontSize) {
    
    const r = +document.getElementById("rSlider").value;
    const g = +document.getElementById("gSlider").value;
    const b = +document.getElementById("bSlider").value;
    
    const h = +document.getElementById("hSlider").value;
    const s = +document.getElementById("sSlider").value;
    const l = +document.getElementById("lSlider").value;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.font = `${scrollWeight} ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    const renderMode = document.getElementById("renderMode").value;
  
    if (renderMode === "outline") {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
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
          const color = colorMode === "rgb" ? `rgb(${r}, ${g}, ${b})` : `hsl(${h}, ${s}, ${l})`;
        
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
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
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
  };
    
    ["rSlider", "gSlider", "bSlider", "hSlider", "sSlider", "lSlider"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      updateColorPreview();
      update();
    });
  });
    
    window.addEventListener("resize", () => {
      resizeCanvas();
      update();
    })
    
    window.addEventListener("scroll", () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollRatio = window.scrollY / maxScroll;
      scrollWeight = Math.round(100 + scrollRatio * 800);
      update();
    });
    
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
      
      const shouldRegenerate =
            text !== lastText ||
            renderMode !== lastRenderMode ||
            density !== lastDensity ||
            colorMode !== lastColorMode ||
            fontSize !== lastFontSize ||
            scrollWeight !== lastScrollWeight;
      
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
  
    resizeCanvas();
    update();
    drawParticles();
  });