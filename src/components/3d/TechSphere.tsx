import React, { useEffect, useRef } from "react";
// Import the Three.js library directly from the installed package
import * as THREE from 'three';

// Define the types for the props, to ensure consistency with TypeScript
interface TechSphereProps {
    // You can add props here if needed, for example, to customize the colors or size
}

export default function TechSphere(props: TechSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Check if a canvas reference exists
    if (!canvasRef.current) return;
    
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 3;
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    // Handle window resizing
    const handleResize = () => {
      // Get the size from the parent container to make it fully responsive
      const container = canvasRef.current?.parentElement;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    handleResize(); // Call it once to set the initial size
    
    // Create the sphere
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
    
    // Add lights to the scene
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
      
      // Rotate the sphere for a cool effect
      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.002;
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Cleanup function: this runs when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []); // Empty dependency array ensures this runs once
  
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-80 z-[-1]"
      />
    </div>
  );
}
