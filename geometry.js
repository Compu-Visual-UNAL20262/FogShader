// geometry.js - Geometría 3D de la "F" [Ari]
//
// buildFGeometry(): retorna un p5.Geometry que será renderizado con model().
// De momento usa una caja temporal para compilar y renderizar de inmediato.

function buildFGeometry() {
  // p5.js v2.4.0: se usa buildGeometry(callback). beginGeometry()/endGeometry()
  // fueron eliminados en p5.js 2.x.
  return buildGeometry(() => {
    // STUB temporal: caja única para validar el pipeline de render.
    box(80, 120, 30);
  });

  // TODO [Ari]: Reemplazar la caja por la letra "F".
  //
  // IMPORTANTE: este proyecto usa p5.js v2.4.0. Construir toda la geometría
  // DENTRO del callback de buildGeometry(() => { ... }). NO usar
  // beginGeometry() / endGeometry() (eliminados en p5.js 2.x).
  //
  // La "F" se compone de 3 cajas (prismas rectangulares) centradas en (0,0,0),
  // todas con profundidad z en [-15, 15]:
  //
  //   1) Tronco vertical : x en [-50, -20], y en [-75, 75], z en [-15, 15]
  //   2) Brazo superior  : x en [-20,  50], y en [-75, -45], z en [-15, 15]
  //   3) Brazo medio     : x en [-20,  20], y en [-15,  15], z en [-15, 15]
  //
  // Para cada una de las 6 caras de cada caja, emitir 2 triángulos (6 vértices)
  // con vertex(x, y, z, u, v) usando UVs normalizadas en [0.0, 1.0]:
  //   esquina inferior-izq (0,0), inferior-der (1,0),
  //   superior-der (1,1), superior-izq (0,1).
  // Recordar textureMode(NORMAL) ya activo en setup().
}
