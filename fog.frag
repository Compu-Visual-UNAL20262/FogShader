// Fragment Shader (STUB funcional) - FogShader [Nicolas]
precision mediump float;

// Coordenada de textura interpolada desde el vertex shader
varying vec2 v_texcoord;

// Uniforms compartidos (asignados por setFogUniforms en texture.js)
uniform sampler2D u_texture;
uniform vec4 u_fogColor;
uniform float u_fogNear;
uniform float u_fogFar;

void main() {
  vec4 texColor = texture2D(u_texture, v_texcoord);

  // STUB temporal: devuelve solo el color de la textura para compilar y renderizar.
  gl_FragColor = texColor;

  // TODO [Nicolas]: Implementar la niebla lineal basada en profundidad.
  // 1) Profundidad en espacio de vista a partir de gl_FragCoord:
  //    float fogDepth = gl_FragCoord.z / gl_FragCoord.w;
  // 2) Factor de mezcla suave entre near y far:
  //    float fogAmount = smoothstep(u_fogNear, u_fogFar, fogDepth);
  // 3) Mezclar el color de la textura con el color de la niebla:
  //    gl_FragColor = mix(texColor, u_fogColor, fogAmount);
}
