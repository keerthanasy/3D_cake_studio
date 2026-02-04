export const chocolateStreamVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  uniform float uTime;

  // Simple noise
  float hash(float n) { return fract(sin(n) * 1e4); }
  float noise(float x) {
      float i = floor(x);
      float f = fract(x);
      float u = f * f * (3.0 - 2.0 * f);
      return mix(hash(i), hash(i + 1.0), u);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Liquid "Wobble" Logic
    float flowSpeed = 2.0;
    float yPos = position.y * 2.0 + uTime * flowSpeed;
    
    // Create "globs" or thickness variations that travel down
    // A sine wave plus some noise creates irregular thickness
    float thickness = 1.0 + (sin(yPos) * 0.2 + noise(yPos * 2.0) * 0.15);
    
    // Tapering/Wobble
    vec3 animatedPosition = position;
    
    // Apply thickness modification to X and Z to bulge the cylinder
    animatedPosition.x *= thickness;
    animatedPosition.z *= thickness;
    
    // Slower drift/wiggle
    animatedPosition.x += sin(uTime * 1.5 + position.y) * 0.05 * (position.y / -6.0); // Wiggle more at bottom
    animatedPosition.z += cos(uTime * 1.2 + position.y) * 0.05 * (position.y / -6.0);

    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(animatedPosition, 1.0)).xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const chocolateStreamFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform vec3 uColor;
  uniform float uViscosity;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // 1. Base Color (Deep Chocolate)
    vec3 baseColor = uColor;

    // 2. Lighting
    vec3 lightPos = vec3(5.0, 10.0, 5.0);
    vec3 lightDir = normalize(lightPos); // Directional light approx
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * baseColor * 0.5;

    // 3. Specular (Glossy Wet Look)
    // High sharpness (power) for wetness
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0); 
    vec3 specular = vec3(1.0) * spec * 0.8; 

    // 4. Fresnel / Rim (Enhances 3D volume shape)
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
    vec3 rimColor = vec3(0.6, 0.4, 0.3) * fresnel * 0.5;

    // 5. Environmental Reflection approximation (Fake MatCap)
    // Reflect viewing vector off normal
    vec3 ref = reflect(-viewDir, normal);
    // Simple gradient based on reflection y component (sky vs ground)
    float envLight = smoothstep(-0.2, 0.5, ref.y); 
    vec3 envColor = vec3(0.9, 0.9, 1.0) * envLight * 0.2; // Blueish sky reflection tint

    vec3 finalColor = baseColor * 0.3 + diffuse + specular + rimColor + envColor;
    
    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

export const chocolateGlazeFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform vec3 uColor;
  uniform float uProgress; // 0.0 to 1.0, coverage from top
  
  // Reuse same noise logic
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
     const vec4 C = vec4(0.211324865405187, 0.366025403784439,
              -0.577350269189626, 0.024390243902439);
     vec2 i  = floor(v + dot(v, C.yy) );
     vec2 x0 = v -   i + dot(i, C.xx);
     vec2 i1;
     i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
     vec4 x12 = x0.xyxy + C.xxzz;
     x12.xy -= i1;
     i = mod(i, 289.0);
     vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
     + i.x + vec3(0.0, i1.x, 1.0 ));
     vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
     m = m*m ;
     m = m*m ;
     vec3 x = 2.0 * fract(p * C.www) - 1.0;
     vec3 h = abs(x) - 0.5;
     vec3 ox = floor(x + 0.5);
     vec3 a0 = x - ox;
     m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
     vec3 g;
     g.x  = a0.x  * x0.x  + h.x  * x0.y;
     g.yz = a0.yz * x12.xz + h.yz * x12.yw;
     return 130.0 * dot(m, g);
  }

  void main() {
      // --- Drip Cake Logic ---
      bool isTop = vNormal.y > 0.5;
      
      float angle = atan(vWorldPosition.z, vWorldPosition.x);
      
      // Spacing & Drip Shape
      float angleNoise = snoise(vec2(angle * 2.0, 1.0)); 
      float distortedAngle = angle + angleNoise * 0.5; 
      float dripFreq = 18.0; 
      float baseWave = sin(distortedAngle * dripFreq);
      float dripProfile = max(0.0, baseWave);
      float dripShape = pow(dripProfile, 0.4); 
      
      // Length Variation
      float lenNoise = snoise(vec2(angle * 5.0, 2.0)); 
      float globalLenMod = snoise(vec2(angle * 1.5, 5.0)); 
      float randomLength = 0.5 + 0.5 * lenNoise; 
      float clusterLength = 0.5 + 0.5 * globalLenMod;
      
      float maxPossibleLength = 3.0;
      float progressLen = uProgress * maxPossibleLength;
      float thisDripFactor = mix(0.2, 1.0, randomLength * clusterLength); 
      
      // Rim
      float rimScale = smoothstep(0.0, 0.05, uProgress);
      float baseRim = 0.15 + (snoise(vWorldPosition.xz * 5.0) * 0.05); 
      float rimHeight = baseRim * rimScale;
      
      float extension = progressLen * thisDripFactor * dripShape; 
      float totalDripHeight = rimHeight + extension;
      
      float cutoffY = 1.0 - totalDripHeight;
      float edgeN = snoise(vWorldPosition.xz * 15.0) * 0.015;
      cutoffY += edgeN;

      // --- DISCARD LOGIC ---
      if (isTop) {
          float dist = length(vWorldPosition.xz);
          // Spread grows from center
          float spreadRadius = uProgress * 4.0;
          if (dist > spreadRadius) discard;
      } else {
          if (vUv.y < cutoffY) discard;
      }

      // --- LIGHTING (Matched to Stream) ---
      vec3 normal = normalize(vNormal);
      
      // 1. Base Color
      vec3 baseColor = uColor;

      // 2. Lighting (Same light source as stream)
      vec3 lightPos = vec3(5.0, 10.0, 5.0);
      vec3 lightDir = normalize(lightPos); 
      
      // Diffuse
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 diffuse = diff * baseColor * 0.5;

      // 3. Specular (Glossy Wet Look)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0); 
      vec3 specular = vec3(1.0) * spec * 0.8; 

      // 4. Fresnel / Rim (Enhances 3D volume shape)
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
      vec3 rimColor = vec3(0.6, 0.4, 0.3) * fresnel * 0.5;

      // 5. Environmental Reflection approximation
      vec3 ref = reflect(-viewDir, normal);
      float envLight = smoothstep(-0.2, 0.5, ref.y); 
      vec3 envColor = vec3(0.9, 0.9, 1.0) * envLight * 0.2; 

      vec3 finalColor = baseColor * 0.3 + diffuse + specular + rimColor + envColor;
      
      gl_FragColor = vec4(finalColor, 1.0);
  }
`;
