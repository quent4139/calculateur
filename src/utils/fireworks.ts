import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
}

export class Fireworks {
  private particles: Particle[] = [];
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;

  constructor(scene: THREE.Scene) {
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      size: 0.1,
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexColors: true
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  private createExplosion(position: THREE.Vector3, particleCount: number, color: THREE.Color) {
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI * 2;
      const velocity = 0.1 + Math.random() * 0.2;

      this.particles.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          Math.cos(angle) * Math.cos(elevation) * velocity,
          Math.sin(elevation) * velocity,
          Math.sin(angle) * Math.cos(elevation) * velocity
        ),
        color: color.clone(),
        life: 1.0,
        maxLife: 1.0 + Math.random() * 0.5
      });
    }
  }

  trigger(camera: THREE.Camera) {
    const colors = [
      new THREE.Color(0xff0000), // Rouge
      new THREE.Color(0x00ff00), // Vert
      new THREE.Color(0x0000ff), // Bleu
      new THREE.Color(0xffff00), // Jaune
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0x00ffff)  // Cyan
    ];

    // Créer plusieurs explosions à différentes positions
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = 5 + Math.random() * 5;
      const z = (Math.random() - 0.5) * 10;
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.createExplosion(new THREE.Vector3(x, y, z), 50, color);
    }
  }

  update(deltaTime: number) {
    // Mettre à jour les particules
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      if (particle.life <= 0) return false;

      particle.position.add(particle.velocity);
      particle.velocity.y -= deltaTime * 0.5; // Gravité
      return true;
    });

    // Mettre à jour la géométrie
    const positions = new Float32Array(this.particles.length * 3);
    const colors = new Float32Array(this.particles.length * 3);

    this.particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      const alpha = particle.life / particle.maxLife;
      colors[i * 3] = particle.color.r * alpha;
      colors[i * 3 + 1] = particle.color.g * alpha;
      colors[i * 3 + 2] = particle.color.b * alpha;
    });

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.points.parent?.remove(this.points);
  }
}