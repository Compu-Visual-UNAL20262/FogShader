// texture.js - Textura procedural y uniforms [Farid]
//
// createFTexture(): retorna un p5.Graphics de 256x256 usado como textura.
// setFogUniforms(): asigna los 4 uniforms compartidos al shader (ya funcional).

function createFTexture() {
  const pg = createGraphics(256, 256);

  // Fondo azul y borde blanco (base temporal lista para renderizar).
  pg.background("#4A90E2");
  pg.noFill();
  pg.stroke(255);
  pg.strokeWeight(6);
  pg.rect(3, 3, 250, 250);

  // TODO [Farid]: Completar el diseño de la textura.
  // 1) Dibujar una cuadrícula dividiendo el lienzo en 4 cuadrantes
  //    (líneas blancas a 128px horizontal y vertical).
  // 2) Dibujar la letra "F" centrada, en negrita:
  //      pg.fill(255);
  //      pg.textAlign(CENTER, CENTER);
  //      pg.textStyle(BOLD);
  //      pg.textSize(180);
  //      pg.text("F", 128, 128);

  return pg;
}

// Asigna los uniforms al shader. Funcional (no es stub).
function setFogUniforms(shaderObj, tex, fogColor, fogNear, fogFar) {
  shaderObj.setUniform("u_texture", tex);
  shaderObj.setUniform("u_fogColor", fogColor);
  shaderObj.setUniform("u_fogNear", fogNear);
  shaderObj.setUniform("u_fogFar", fogFar);
}
