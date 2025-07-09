import * as THREE from "three";

export default function getStarfield() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  const spread = 800; 
  const innerDistance = 100; 

  for (let i = 0; i < 5000; i++) {
    let x = THREE.MathUtils.randFloatSpread(spread);
    let y = THREE.MathUtils.randFloatSpread(spread);
    let z = THREE.MathUtils.randFloatSpread(spread);

    // skip stars too close to center (where Earth is)
    if (Math.sqrt(x * x + y * y + z * z) < innerDistance) continue;

    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true,
    depthWrite: false,
    transparent: true,
  });

  const stars = new THREE.Points(geometry, material);
  stars.name = "Starfield";
  return stars;
}
