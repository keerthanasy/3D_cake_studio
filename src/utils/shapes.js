import * as THREE from "three";

export const getHeartShape = () => {
  const heart = new THREE.Shape();
  const x = 0,
    y = 0;
  heart.moveTo(x + 0.5, y + 0.5);
  heart.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
  heart.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
  heart.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
  heart.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
  heart.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
  heart.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
  return heart;
};

export const getStarShape = () => {
  const star = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? 1.5 : 0.75;
    const angle = (i / 10) * Math.PI * 2;
    if (i === 0)
      star.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    else star.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  star.closePath();
  return star;
};

export const getMickeyShape = () => {
  const shape = new THREE.Shape();
  // Simple geometry for now to fix errors
  const R = 1.0;
  shape.absarc(0, 0, R, 0, Math.PI * 2, false);
  return shape;
};

export const getDoraShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(0, -1);
  shape.bezierCurveTo(0.6, -1, 1.2, -0.8, 1.4, -0.4);
  shape.lineTo(1.5, 0.5);
  shape.bezierCurveTo(1.5, 1.5, -1.5, 1.5, -1.5, 0.5);
  shape.lineTo(-1.4, -0.4);
  shape.bezierCurveTo(-1.2, -0.8, -0.6, -1, 0, -1);
  return shape;
};

export const getBujjiShape = () => {
  const shape = new THREE.Shape();
  const w = 1.2;
  const h = 1.0;
  shape.moveTo(-w, -h);
  shape.lineTo(w, -h); // Chin
  shape.lineTo(w, h); // R Side
  shape.bezierCurveTo(w / 2, h + 0.2, -w / 2, h + 0.2, -w, h);
  shape.lineTo(-w, -h); // L Side
  return shape;
};
