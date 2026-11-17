// texture.js
//
// createFTexture(): retorna un p5.Graphics de 256x256 usado como textura.
// setFogUniforms(): asigna los 4 uniforms compartidos al shader (ya funcional).

function createFTexture() {
  const size = 256;
  const half = size / 2;
  const pg = createGraphics(size, size);

  pg.pixelDensity(1);

  //dibujar los 4 cuadrantes cromáticos (diagnóstico de escala y orientación UV)
  pg.noStroke();

  pg.fill("#4A90E2");
  pg.rect(0, 0, half, half);

  pg.fill("#E86F58");
  pg.rect(half, 0, half, half);

  pg.fill("#F5A623");
  pg.rect(0, half, half, half);

  pg.fill("#50E3C2");
  pg.rect(half, half, half, half);

  // lineas divisorias de cuadrantes 
  pg.stroke(255, 255, 255, 160);
  pg.strokeWeight(2);
  pg.line(half, 0, half, size);
  pg.line(0, half, size, half);

  // letra F central
  pg.noStroke();
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);
  pg.textStyle(BOLD);
  pg.textSize(170);
  pg.text("F", half, half - 8);

  // borde perimetral de contraste para aristas 3D
  pg.noFill();
  pg.stroke("#1A1A1A");
  pg.strokeWeight(8);
  pg.rect(4, 4, size - 8, size - 8);

  return pg;
}

// Asigna los uniforms requeridos por el shader de niebla.
function setFogUniforms(shaderObj, tex, fogColor, fogNear, fogFar) {
  //verificar que el shader esté compilado y listo
  if (!shaderObj || typeof shaderObj.setUniform !== "function") {
    return;
  }

  //verificar que la textura esté disponible
  if (!tex) {
    return;
  }

  shaderObj.setUniform("u_texture", tex);
  shaderObj.setUniform("u_fogColor", fogColor);
  shaderObj.setUniform("u_fogNear", fogNear);
  shaderObj.setUniform("u_fogFar", fogFar);
}
