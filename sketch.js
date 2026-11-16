// sketch.js - Escena principal, cámara, instancias y UI [Ángel]

let fogShader;
let fGeometry;
let fTexture;

let sliderNear;
let sliderFar;
let sliderSpeed;

let rotationAngle = 0;

// Color de niebla sincronizado con el fondo rgb(204, 230, 255).
const FOG_COLOR = [0.8, 0.9, 1.0, 1.0];

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
  noStroke();

  // p5.js v2.x: loadShader retorna una Promise (ya no existe preload()).
  fogShader = await loadShader("fog.vert", "fog.frag");

  fGeometry = buildFGeometry();
  fTexture = createFTexture();

  // Sliders adjuntados a sus contenedores del panel UI.
  sliderNear = createSlider(0, 2500, 500, 1);
  sliderNear.parent("container-near");

  sliderFar = createSlider(0, 2500, 2000, 1);
  sliderFar.parent("container-far");

  sliderSpeed = createSlider(0, 0.05, 0.01, 0.001);
  sliderSpeed.parent("container-speed");
}

function draw() {
  // Fondo sincronizado con el color de la niebla.
  background(204, 230, 255);

  // Proyección en perspectiva.
  perspective(PI / 3, width / height, 1, 2500);

  // Cámara en (0,0,500) mirando a (0,0,-500) con arriba (0,1,0).
  camera(0, 0, 500, 0, 0, -500, 0, 1, 0);
  orbitControl();

  // Valores actuales de los controles.
  const fogNear = sliderNear.value();
  const fogFar = sliderFar.value();
  const speed = sliderSpeed.value();

  // Activar shader y asignar uniforms.
  shader(fogShader);
  setFogUniforms(fogShader, fTexture, FOG_COLOR, fogNear, fogFar);

  // Actualizar etiquetas de la UI.
  select("#label-near").html("Fog Near: " + fogNear);
  select("#label-far").html("Fog Far: " + fogFar);
  select("#label-speed").html("Velocidad: " + speed.toFixed(3));

  // Avanzar rotación global.
  rotationAngle += speed;

  // Cuadrícula de 45 figuras: 15 filas (z) x 3 columnas (x).
  for (let z = 200; z >= -1900; z -= 150) {
    for (const x of [-180, 0, 180]) {
      push();
      translate(x, 0, z);
      rotateY(rotationAngle + z * 0.002);
      model(fGeometry);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
