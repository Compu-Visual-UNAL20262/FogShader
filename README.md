# WebGL Depth-Based Fog Shader – p5.js & GLSL Implementation

<div align="center">
  <!-- TODO: Replace with actual GIF/screenshot previews once all modules are integrated -->
  <img src="assets/docs/fog_shader_preview.gif" alt="WebGL Depth-Based Fog Shader Scene Preview" width="600" />
  <p><sub><em>Real-time linear depth-based fog implemented in p5.js (WebGL mode) and custom GLSL shaders using <code>gl_FragCoord</code>, inspired by <a href="https://webglfundamentals.org/webgl/webgl-3d-fog-depth-based-gl_FragCoord.html">WebGL Fundamentals</a>.</em></sub></p>
</div>

An interactive 3D computer graphics showcase replicating the classic **Depth-Based Linear Fog (`gl_FragCoord`)** scene from [WebGL Fundamentals](https://webglfundamentals.org/webgl/webgl-3d-fog-depth-based-gl_FragCoord.html), built with [p5.js](https://p5js.org/) (`v2.4.0` WebGL renderer) and custom **GLSL ES 1.00** vertex and fragment shaders.

> 📌 **Academic Context:** Developed for the *Visual Computing (Computación Visual — UNAL 2026-2)* course. Rather than relying on built-in fixed-function fog or vertex-level distance approximations, this project computes per-pixel depth directly in the fragment shader via `gl_FragCoord.z / gl_FragCoord.w`.

---

## 🌫️ Overview & Visual Showcase

### What is Depth-Based Fog (`gl_FragCoord`)?
In 3D computer graphics, **fog** simulates atmospheric scattering by progressively blending distant geometry into a uniform background color. While simpler implementations calculate distance per vertex in the vertex shader, computing fog **per fragment** using `gl_FragCoord` guarantees accurate, perspective-correct depth interpolation across large polygons without vertex-interpolation artifacts.

In this scene, a 3D perspective grid of **45 extruded, textured "F" meshes** (`3 columns × 15 depth rows`) rotates continuously along the Z-axis. As each fragment recedes from the camera, its linear depth is evaluated against dynamic `fogNear` and `fogFar` thresholds to smoothly interpolate between the surface texture color and the sky-blue horizon (`rgb(204, 230, 255)`).

### Visual Previews & Interactive Tests
| Standard Depth Gradient (`fogNear: 500`, `fogFar: 2000`) | Dense Horizon Immersion (`fogNear: 0`, `fogFar: 100`) |
| :---: | :---: |
| ![Standard Fog Gradient](assets/docs/preview_default.png)<br><sub>*Foreground meshes retain crisp procedural textures while distant rows fade smoothly into the sky*</sub> | ![Full Horizon Blend](assets/docs/preview_dense.png)<br><sub>*At close range, geometry blends 100% into `u_fogColor` with zero silhouette artifacts*</sub> |

*(Note: Placeholders above are ready to be populated with final screenshots/GIFs during the integration testing phase.)*

---

## 🎮 Controls & Real-Time Parameters

### Interactive UI & Camera Controls
| Input / Control | Range / Action | Description |
| :--- | :---: | :--- |
| **`fogNear` Slider** | `0` – `2500` *(default: `500`)* | Distance from the camera where fog begins to appear. Fragments closer than `fogNear` render with 100% pure texture color (`fogAmount = 0.0`). |
| **`fogFar` Slider** | `0` – `2500` *(default: `2000`)* | Distance at which fog reaches full opacity. Fragments beyond `fogFar` blend 100% into `u_fogColor` (`fogAmount = 1.0`). |
| **`Velocidad` Slider** | `0.000` – `0.050` *(default: `0.010`)* | Controls the continuous angular rotation speed (`rotateY`) of the 45 3D meshes. |
| **Left Click + Drag** | Orbit Camera (`orbitControl`) | Rotates the camera freely around the 3D scene to inspect depth transitions from arbitrary angles. |
| **Scroll Wheel** | Zoom Camera (`orbitControl`) | Moves the camera closer to or farther from the grid, dynamically shifting fragments through the fog volume. |

---

## 🧮 Mathematical & Shader Pipeline

### 1. Recovering Linear Depth from `gl_FragCoord`
During rasterization, WebGL populates the built-in `gl_FragCoord` vector for every fragment:
- `gl_FragCoord.z` stores the **non-linear** window-space depth normalized to `[0.0, 1.0]`.
- `gl_FragCoord.w` stores $1 / w_{\text{clip}}$, where $w_{\text{clip}}$ corresponds to the linear eye-space depth from the camera.

Dividing these two components recovers the true linear depth (`fogDepth`) in world/eye units:

$$\text{fogDepth} = \frac{\text{gl\_FragCoord.z}}{\text{gl\_FragCoord.w}}$$

### 2. Smooth Hermite Interpolation & Color Mixing
Once `fogDepth` is recovered in [fog.frag](fog.frag), the fragment shader computes a smooth interpolation factor using GLSL's `smoothstep` and blends the sampled texel with the background color:

```glsl
float fogDepth = gl_FragCoord.z / gl_FragCoord.w;
float fogAmount = smoothstep(u_fogNear, u_fogFar, fogDepth);
gl_FragColor = mix(texColor, u_fogColor, fogAmount);
```

### 3. Horizon Color Synchronization
To ensure distant objects vanish seamlessly without visible outlines, the WebGL clear color and the shader fog uniform share identical RGB values:
- **p5.js `background()` (0–255 scale):** `rgb(204, 230, 255)`
- **GLSL `u_fogColor` (Normalized RGBA):** `vec4(0.8, 0.9, 1.0, 1.0)`

---

## 👥 Team & Development Roles

The project was developed under a **contract-driven modular architecture** where each team member owned a distinct layer of the graphics pipeline:

| Developer | Role | Module & Key Contributions |
| :--- | :--- | :--- |
| **Ángel** | **Core Architecture, Camera & UI** (*The Architect*) | Authored [index.html](index.html), [style.css](style.css), and [sketch.js](sketch.js). Established the p5.js `v2.4.0` WebGL canvas, asynchronous shader loading (`async setup` + `await loadShader`), perspective camera (`FOV = PI/3`, `near = 1`, `far = 2500`), `orbitControl()`, instanced rendering loop for the 45 meshes (`X ∈ [-180, 0, 180]`, `Z ∈ [200, -1900]`), and the floating real-time UI slider panel. |
| **Nicolas** | **GLSL Shaders & Depth Math** (*The Shader Engineer*) | Authored [fog.vert](fog.vert) and [fog.frag](fog.frag). Engineered the vertex transformation pipeline (`uProjectionMatrix * uModelViewMatrix`), UV coordinate passing (`v_texcoord`), and per-pixel linear depth fog calculation via `gl_FragCoord.z / gl_FragCoord.w`, `smoothstep()`, and `mix()`. |
| **Ari** | **3D Procedural Geometry & UVs** (*The 3D Modeler*) | Authored [geometry.js](geometry.js). Built the extruded 3D letter **"F"** (`100 × 150 × 30` units, centered at `(0, 0, 0)`) decomposed into three rectangular prisms inside p5.js `buildGeometry()`, with normalized `[0.0, 1.0]` UV coordinates mapped across all 6 faces (36 vertices per prism). |
| **Farid** | **Procedural Texture, Uniforms & QA** (*The Integrator*) | Authored [texture.js](texture.js) and led final module integration. Generated the offscreen `256 × 256` procedural reference texture (`createFTexture()`), implemented the uniform bridge `setFogUniforms()`, and executed the 4 end-to-end integration and horizon verification tests. |

---

## 📁 Project Architecture & File Responsibilities

### Directory Structure
```text
FogShader/
├── assets/
│   └── docs/                   # Documentation screenshots and GIFs (optional/upcoming)
├── p5.min.js                   # Local p5.js v2.4.0 core & WebGL library (offline-ready)
├── index.html                  # HTML5 entry point, UI control panel & ordered script loader
├── style.css                   # Fullscreen viewport reset & glassmorphism floating UI panel
├── fog.vert                    # Custom GLSL Vertex Shader (position projection & UV passthrough)
├── fog.frag                    # Custom GLSL Fragment Shader (gl_FragCoord linear depth fog)
├── geometry.js                 # Procedural 3D extruded "F" mesh builder with normalized UVs
├── texture.js                  # Procedural 256x256 offscreen texture & shader uniform binder
├── sketch.js                   # Main p5.js lifecycle (setup, draw, camera, 45-mesh grid, UI)
└── README.md                   # Project documentation, math breakdown & technical architecture
```

### Module & Function Contracts
- **[index.html](index.html):** Loads the local [p5.min.js](p5.min.js) runtime, mounts the floating `#ui-panel` HUD, and enforces strict sequential script loading (`geometry.js` → `texture.js` → `sketch.js`).
- **[style.css](style.css):** Removes viewport scrollbars (`overflow: hidden`), matches the body background to `rgb(204, 230, 255)`, and styles the top-right translucent control overlay.
- **[sketch.js](sketch.js):** Orchestrates `async setup()` and `draw()`, configures `textureMode(NORMAL)`, sets up camera/perspective matrices, updates UI labels each frame, and renders the 45-object grid.
- **[fog.vert](fog.vert):** Transforms `aPosition` into clip space via `uProjectionMatrix * uModelViewMatrix` and forwards `aTexCoord` to `v_texcoord`.
- **[fog.frag](fog.frag):** Samples `u_texture` and interpolates toward `u_fogColor` using `smoothstep(u_fogNear, u_fogFar, gl_FragCoord.z / gl_FragCoord.w)`.
- **[geometry.js](geometry.js):** Exports `buildFGeometry()`, returning a centered `p5.Geometry` instance composed of three textured boxes aligned with p5.js's `+Y`-downward coordinate system.
- **[texture.js](texture.js):** Exports `createFTexture()` (returning a `256 × 256` `p5.Graphics` buffer) and `setFogUniforms(shaderObj, tex, fogColor, fogNear, fogFar)`.

---

## 🧪 Verification & Acceptance Protocol

Before final submission, the integrated build is validated against four technical benchmarks:
1. **Zero-Error Compilation:** Browser DevTools console (`F12`) confirms clean GLSL shader compilation (`SHADER_INFO_LOG` empty) and zero runtime reference errors.
2. **UV Orientation Check:** The procedural `"F"` drawn on the `256 × 256` texture renders upright and unmirrored across the faces of the 3D `"F"` geometry.
3. **Smooth Depth Attenuation (`fogNear = 500`, `fogFar = 2000`):** Foreground meshes (`Z = 200`, distance `300`) render at full contrast while background rows (`Z = -1900`, distance `2400`) fade smoothly without banding.
4. **Horizon Immersion (`fogNear = 0`, `fogFar = 100`):** All 45 meshes blend completely into `rgb(204, 230, 255)`, leaving zero visible edges against the canvas background.

---

## 📚 References & Research

- **Primary Reference Implementation:** [WebGL Fundamentals – 3D Fog (Depth-Based `gl_FragCoord`)](https://webglfundamentals.org/webgl/webgl-3d-fog-depth-based-gl_FragCoord.html)
- **Theoretical Article:** [WebGL Fundamentals – WebGL Fog Tutorial](https://webglfundamentals.org/webgl/lessons/webgl-fog.html)
- **Graphics Framework Documentation:** [p5.js v2.0+ WebGL & Shaders Reference](https://p5js.org/reference/)
- **GLSL Specification:** [OpenGL ES Shading Language 1.00 Specification (`gl_FragCoord`, `smoothstep`, `mix`)](https://registry.khronos.org/OpenGL/specs/es/2.0/GLSL_ES_Specification_1.00.pdf)

---

## 🚀 Running the Project Locally

Because modern web browsers enforce **CORS (Cross-Origin Resource Sharing)** policies when `loadShader()` fetches `.vert` and `.frag` files via `fetch()`/`XHR`, opening `index.html` directly over `file:///` will be blocked. Run the project through any local HTTP server:

1. Clone the repository:
   ```bash
   git clone https://github.com/Compu-Visual-UNAL20262/FogShader.git
   cd FogShader
   ```
2. Start a local development server:
   - **VS Code:** Right-click [index.html](index.html) and select **"Open with Live Server"**.
   - **Python:**
     ```bash
     python3 -m http.server 8000
     ```
     Open `http://localhost:8000` in your browser.
   - **Node.js:**
     ```bash
     npx serve .
     ```

---

## 🤖 Artificial Intelligence Disclosure & Acknowledgments

Artificial Intelligence tools (**Google Gemini**) were utilized as pair-programming and technical documentation assistants during the development of this project:
- **Modular System Contracts:** Defining strict interfaces, uniform naming conventions, and loading sequences across the four team modules.
- **p5.js v2.4.0 Migration & Debugging:** Adapting legacy `preload()` and `beginGeometry()`/`endGeometry()` workflows to p5.js `2.x` asynchronous `async setup()` (`await loadShader`) and `buildGeometry()` APIs.
- **Documentation & Structuring:** Drafting and formatting this `README.md` with mathematical notation, architecture diagrams, and verification criteria.