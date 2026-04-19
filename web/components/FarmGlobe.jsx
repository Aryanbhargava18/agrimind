import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FarmGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const globeGeometry = new THREE.SphereGeometry(1.75, 96, 96);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: '#123d25',
      roughness: 0.72,
      metalness: 0.08,
      emissive: '#06140d',
      emissiveIntensity: 0.28,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    group.add(globe);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.765, 48, 48),
      new THREE.MeshBasicMaterial({
        color: '#aaff45',
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
    );
    group.add(wire);

    const bandMaterial = new THREE.MeshBasicMaterial({
      color: '#aaff45',
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    for (let index = 0; index < 8; index += 1) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.78 + index * 0.006, 0.006, 8, 160), bandMaterial);
      band.rotation.x = Math.PI / 2 + index * 0.08;
      band.rotation.y = index * 0.22;
      group.add(band);
    }

    const fieldGroup = new THREE.Group();
    const fieldMaterial = new THREE.MeshBasicMaterial({ color: '#aaff45', transparent: true, opacity: 0.82 });
    for (let index = 0; index < 44; index += 1) {
      const lat = THREE.MathUtils.degToRad(-58 + Math.random() * 116);
      const lon = THREE.MathUtils.degToRad(Math.random() * 360);
      const radius = 1.785;
      const patch = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.035), fieldMaterial);
      patch.position.set(
        radius * Math.cos(lat) * Math.cos(lon),
        radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.sin(lon),
      );
      patch.lookAt(0, 0, 0);
      patch.rotateZ(Math.random() * Math.PI);
      fieldGroup.add(patch);
    }
    group.add(fieldGroup);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 2.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: '#aaff45',
        size: 0.018,
        transparent: true,
        opacity: 0.55,
      }),
    );
    scene.add(particles);

    const key = new THREE.PointLight('#aaff45', 9, 10);
    key.position.set(2.2, 2.7, 3.5);
    scene.add(key);
    scene.add(new THREE.AmbientLight('#f5f0e8', 1.6));

    let frameId;
    const animate = () => {
      group.rotation.y += 0.0038;
      group.rotation.x = Math.sin(Date.now() * 0.00035) * 0.08;
      particles.rotation.y -= 0.0008;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
      mount.removeChild(renderer.domElement);
      globeGeometry.dispose();
      globeMaterial.dispose();
      particlesGeometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="globe-shell">
      <div ref={mountRef} className="h-[460px] w-full md:h-[560px]" aria-label="Rotating 3D farm globe" />
      <div className="globe-stat left-4 top-10">
        <span>Pipeline</span>
        <strong>5 nodes</strong>
      </div>
      <div className="globe-stat bottom-12 right-3">
        <span>Grounding</span>
        <strong>RAG</strong>
      </div>
    </div>
  );
}

