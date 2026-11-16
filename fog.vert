// Vertex Shader - FogShader [Nicolas]
precision mediump float;

// Atributos provistos por p5.js
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// Matrices provistas por p5.js
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

// Coordenada de textura hacia el fragment shader
varying vec2 v_texcoord;

void main() {
  v_texcoord = aTexCoord;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
