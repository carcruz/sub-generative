const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048]
};

const colors = ["#087799", "#33CFFF", "#17B6E5", "#994C00", "#E67E17"];

const sketch = ({ width, height }) => {
  const count = 55;
  const margin = width * 0.12;
  const fontFamily = '"Andale Mono"';
  const palette = colors;
  const background = "hsl(0, 0%, 0%)";
  const characters = "_".split("");

  const createGrid = () => {
    const points = [];
    const frequency = random.range(1, 1.25);

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = x / (count - 1);
        let v = y / (count - 1);

        const [dx, dy] = random.insideSphere(0.05);
        u += dx;
        v += dy;

        const n = random.noise2D(u * frequency, v * frequency);
        const size = n * 0.5 + 0.5;
        const baseSize = width * 0.02;
        const sizeOffset = width * 0.05;

        points.push({
          color: random.pick(palette),
          size: Math.abs(baseSize * size + random.gaussian() * sizeOffset),
          rotation: n * Math.PI * 0.5,
          character: random.pick(characters),
          position: [u, v]
        });
      }
    }
    return points;
  };

  const grid = createGrid();

  return ({ context, width, height }) => {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    grid.forEach(({ position, rotation, size, color, character }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.fillStyle = context.strokeStyle = color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `${size}px ${fontFamily}`;

      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = 0.85;
      context.fillText(character, 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
