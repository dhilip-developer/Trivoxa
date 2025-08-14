import { useEffect, useRef } from "react";

// Define more specific types for THREE
interface Vector3 {
  x: number;
  y: number;
  z: number;
  set(x: number, y: number, z: number): Vector3;
}

interface Object3D {
  position: Vector3;
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  add(object: Object3D): void;
}

interface Camera extends Object3D {
  aspect: number;
  updateProjectionMatrix(): void;
}

interface Renderer {
  setSize(width: number, height: number, updateStyle?: boolean): void;
  render(scene: Scene, camera: Camera): void;
  dispose(): void;
}

interface Material {
  color: number | string;
  wireframe?: boolean;
  emissive?: number | string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
}

// Use Record instead of empty interface
interface Geometry {
  type: string;
  parameters?: Record<string, unknown>;
}

interface Mesh extends Object3D {
  geometry: Geometry;
  material: Material;
}

interface Light extends Object3D {
  intensity: number;
  color: number | string;
}

interface Scene extends Object3D {
  background?: number | string;
}

// Main THREE interface
interface ThreeJS {
  Scene: new () => Scene;
  PerspectiveCamera: new (fov: number, aspect: number, near: number, far: number) => Camera;
  WebGLRenderer: new (params: { canvas: HTMLCanvasElement; alpha?: boolean; antialias?: boolean }) => Renderer;
  SphereGeometry: new (radius: number, widthSegments: number, heightSegments: number) => Geometry;
  MeshStandardMaterial: new (params: Material) => Material;
  Mesh: new (geometry: Geometry, material: Material) => Mesh;
  AmbientLight: new (color: number | string, intensity?: number) => Light;
  PointLight: new (color: number | string, intensity?: number) => Light;
}

export default function TechSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Check if Three.js is loaded
    if (typeof window.THREE === "undefined") {
      const loadThree = async () => {
        const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
        initScene(THREE as unknown as ThreeJS);
      };
      
      // Try to load Three.js
      loadThree().catch(e => console.error("Failed to load Three.js:", e));
      return;
    }
    
    const THREE = window.THREE as ThreeJS;
    initScene(THREE);
    
    function initScene(THREE: ThreeJS) {
      if (!canvasRef.current) return;
      
      // Create scene
      const scene = new THREE.Scene();
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75, 
        canvasRef.current.width / canvasRef.current.height, 
        0.1, 
        1000
      );
      camera.position.z = 3;
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      
      // Handle resize
      const handleResize = () => {
        if (!canvasRef.current) return;
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();
      
      // Create sphere with tech pattern
      const geometry = new THREE.SphereGeometry(1.5, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        color: 0xFF8800, // Orange color
        wireframe: true,
        emissive: 0xFF8800,
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.2,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
      scene.add(ambientLight);
      
      const pointLight1 = new THREE.PointLight(0x00D7C3, 2); // Cyan neon
      pointLight1.position.set(2, 2, 2);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0xFF8800, 2); // Orange
      pointLight2.position.set(-2, -2, 1);
      scene.add(pointLight2);
      
      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the sphere
        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;
        
        renderer.render(scene, camera);
      }
      
      animate();
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    }
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full opacity-80"
      style={{ 
        maxWidth: "600px", 
        maxHeight: "600px" 
      }}
    />
  );
}

// Extend Window interface to include THREE
declare global {
  interface Window {
    THREE?: ThreeJS;
  }
}