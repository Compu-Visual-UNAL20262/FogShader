// texture.js - Textura procedural y uniforms [Farid]
//
// createFTexture(): retorna un p5.Graphics de 256x256 usado como textura.
// setFogUniforms(): asigna los 4 uniforms compartidos al shader (ya funcional).

function createFTexture() {
  const size = 256;
  const half = size / 2;
  const pg = createGraphics(size, size);

  // Asegurar densidad de píxeles 1:1 independiente de la pantalla (Retina/HiDPI)
  pg.pixelDensity(1);

  // 1. Dibujar los 4 cuadrantes cromáticos (diagnóstico de escala y orientación UV)
  pg.noStroke();

  // Cuadrante Superior Izquierdo: Azul
  pg.fill("#4A90E2");
  pg.rect(0, 0, half, half);

  // Cuadrante Superior Derecho: Coral
  pg.fill("#E86F58");
  pg.rect(half, 0, half, half);

  // Cuadrante Inferior Izquierdo: Amarillo
  pg.fill("#F5A623");
  pg.rect(0, half, half, half);

  // Cuadrante Inferior Derecho: Verde Turquesa
  pg.fill("#50E3C2");
  pg.rect(half, half, half, half);

  // 2. Líneas divisorias de cuadrantes (ejes centrales de simetría)
  pg.stroke(255, 255, 255, 160);
  pg.strokeWeight(2);
  pg.line(half, 0, half, size);
  pg.line(0, half, size, half);

  // 3. Glifo central "F" de calibración asimétrica (detección de giros o espejados UV)
  pg.noStroke();
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);
  pg.textStyle(BOLD);
  pg.textSize(170);
  // Offset vertical (-8px) para compensar la caja tipográfica y centrar la masa óptica
  pg.text("F", half, half - 8);

  // 4. Borde perimetral de contraste para aristas 3D
  // Grosor de 8px centrado en las coordenadas (4, 4) hasta (size - 8, size - 8)
  pg.noFill();
  pg.stroke("#1A1A1A");
  pg.strokeWeight(8);
  pg.rect(4, 4, size - 8, size - 8);

  return pg;
}

// Asigna los uniforms requeridos por el shader de niebla (SPEC-02).
// Incorpora guardas defensivas para evitar excepciones durante la carga asíncrona.
function setFogUniforms(shaderObj, tex, fogColor, fogNear, fogFar) {
  // Salvaguarda: verificar que el shader esté compilado y listo
  if (!shaderObj || typeof shaderObj.setUniform !== "function") {
    return;
  }

  // Salvaguarda: verificar que la textura esté disponible
  if (!tex) {
    return;
  }

  shaderObj.setUniform("u_texture", tex);
  shaderObj.setUniform("u_fogColor", fogColor);
  shaderObj.setUniform("u_fogNear", fogNear);
  shaderObj.setUniform("u_fogFar", fogFar);
}
