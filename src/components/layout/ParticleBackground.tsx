
import React, { useEffect, useRef } from "react";
import * as THREE from 'three';

export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- Particles Setup ---
        const particlesCount = 4000;
        const orangeGeometry = new THREE.BufferGeometry();
        const whiteGeometry = new THREE.BufferGeometry(); // Distant stars

        const orangePos = new Float32Array(particlesCount * 3);
        const whitePos = new Float32Array(1500 * 3);

        // Circular Initial Spawn for Orange Particles
        for (let i = 0; i < particlesCount * 3; i += 3) {
            const r = Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            orangePos[i] = r * Math.cos(theta);
            orangePos[i + 1] = r * Math.sin(theta);
            orangePos[i + 2] = (Math.random() - 0.5) * 100;
        }

        // Circular Initial Spawn for White Particles
        for (let i = 0; i < 1500 * 3; i += 3) {
            const r = Math.random() * 80;
            const theta = Math.random() * Math.PI * 2;
            whitePos[i] = r * Math.cos(theta);
            whitePos[i + 1] = r * Math.sin(theta);
            whitePos[i + 2] = (Math.random() - 0.5) * 100;
        }

        orangeGeometry.setAttribute('position', new THREE.BufferAttribute(orangePos, 3));
        whiteGeometry.setAttribute('position', new THREE.BufferAttribute(whitePos, 3));

        // --- Create Circle Texture ---
        const createCircleTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(16, 16, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            return new THREE.CanvasTexture(canvas);
        };
        const circleTexture = createCircleTexture();

        // Materials (Redcuced Size)
        const orangeMaterial = new THREE.PointsMaterial({
            size: 0.05, // Reduced from 0.08
            map: circleTexture,
            color: new THREE.Color('#F97316'),
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const whiteMaterial = new THREE.PointsMaterial({
            size: 0.03, // Reduced from 0.05
            map: circleTexture,
            color: new THREE.Color('#FFFFFF'),
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const orangeMesh = new THREE.Points(orangeGeometry, orangeMaterial);
        const whiteMesh = new THREE.Points(whiteGeometry, whiteMaterial);

        scene.add(orangeMesh);
        scene.add(whiteMesh);

        // --- Tech Icons ---
        const createIconTexture = (symbol) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#00000000';
            ctx.clearRect(0, 0, 128, 64);

            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = '#F97316';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, 64, 32);

            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        };

        const icons = [
            'React', 'Vue', 'Angular', 'Node', 'Python', 'Java', 'C++', 'Go', 'Rust',
            'AWS', 'Docker', 'K8s', 'SQL', 'Mongo', 'Redis', 'Git', 'HTML', 'CSS',
            'Sass', 'Tailwind', 'Next', 'Nuxt', 'Svelte', 'Flutter', 'Swift', 'Kotlin',
            'PHP', 'Ruby', 'Linux', 'Azure', 'GCP', 'Figma', 'GraphQL', 'JS', 'TS', '< />', '{ }', 'AI',
            'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'Pandas', 'NumPy',
            'React Native', 'SwiftUI', 'Ionic',
            'Arduino', 'Raspberry Pi', 'IoT', 'MQTT', 'ESP32', 'Embedded', 'ROS', 'Verilog', 'FPGA', 'PCB',
            'Solidity', 'Web3', 'Blockchain', 'Cybersecurity', 'DevOps', 'Jenkins', 'Terraform', 'Ansible'
        ];

        const iconSystems = [];

        icons.forEach(icon => {
            const geometry = new THREE.BufferGeometry();
            const count = 5;
            const positions = new Float32Array(count * 3);

            for (let i = 0; i < count * 3; i += 3) {
                const r = Math.random() * 30;
                const theta = Math.random() * Math.PI * 2;
                positions[i] = r * Math.cos(theta);
                positions[i + 1] = r * Math.sin(theta);
                positions[i + 2] = -10 - (Math.random() * 200);
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                size: 1.5, // Increased for better visibility
                map: createIconTexture(icon),
                transparent: true,
                opacity: 0.9,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const mesh = new THREE.Points(geometry, material);
            scene.add(mesh);
            iconSystems.push({ mesh, geometry, speed: 0.008 + Math.random() * 0.01 });
        });


        camera.position.z = 5;

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            const time = Date.now() * 0.0005;

            // Orange Particles
            const orangePositions = orangeGeometry.attributes.position.array;
            for (let i = 2; i < particlesCount * 3; i += 3) {
                orangePositions[i] += 0.04;
                if (orangePositions[i] > 5) {
                    orangePositions[i] = -60;
                    const r = Math.random() * 3;
                    const theta = Math.random() * Math.PI * 2;
                    orangePositions[i - 2] = r * Math.cos(theta);
                    orangePositions[i - 1] = r * Math.sin(theta);
                } else {
                    orangePositions[i - 2] *= 1.001;
                    orangePositions[i - 1] *= 1.001;
                    orangePositions[i - 2] += Math.sin(time + orangePositions[i] * 0.5) * 0.002;
                    orangePositions[i - 1] += Math.cos(time + orangePositions[i] * 0.5) * 0.002;
                }
            }
            orangeGeometry.attributes.position.needsUpdate = true;

            // White Particles
            const whitePositions = whiteGeometry.attributes.position.array;
            whiteMesh.rotation.z += 0.0001;

            // Tech Icons
            iconSystems.forEach(system => {
                const positions = system.geometry.attributes.position.array;
                for (let i = 2; i < positions.length; i += 3) {
                    positions[i] += system.speed;
                    if (positions[i] > 5) {
                        positions[i] = -200 + (Math.random() * 50);
                        const r = Math.random() * 2;
                        const theta = Math.random() * Math.PI * 2;
                        positions[i - 2] = r * Math.cos(theta);
                        positions[i - 1] = r * Math.sin(theta);
                    } else {
                        positions[i - 2] *= 1.002;
                        positions[i - 1] *= 1.002;
                        positions[i - 2] += Math.sin(time + positions[i]) * 0.003;
                    }
                }
                system.geometry.attributes.position.needsUpdate = true;
            });

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            orangeGeometry.dispose();
            orangeMaterial.dispose();
            whiteGeometry.dispose();
            whiteMaterial.dispose();
            iconSystems.forEach(s => {
                s.geometry.dispose();
                s.mesh.material.dispose();
                if (s.mesh.material.map) s.mesh.material.map.dispose();
            });
            renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none bg-black" />;
}
