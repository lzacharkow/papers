import _ from 'lodash';
import Pulp from './Pulp';

function range2d(x, y, cb) {
	_.range(y).forEach(yy => _.range(x).forEach(xx => cb(xx, yy)));
}

function chance(prob) {
	return Math.random() <= prob;
}

class App extends Pulp {
	draw() {
		const { Point, Size, Path, Raster, Rectangle, view } = this.scene;
		console.log(this.scene);

		const height = 600;
		const width = height * 0.75;
		const radius = 5;
		const linePadding = 3;

		const xPoints = 15;
		const yPoints = Math.floor(height * xPoints / width * 4/3);

		const map = {};
		range2d(xPoints, yPoints, (xx, yy) => {
			const active = yy === 0 ? !!(Math.random() <= 0.2) : false;
			// const active = Math.random() <= 0.2;
			map[`${xx}-${yy}`] = {
				active,
				targets: [],
			};
		});

		// Start with the active dots and recursively trace paths to the bottom
		function traceStep([x, y], start) {
			const key = `${x}-${y}`;
			if (
				x < xPoints
				&& x >= 0
				&& y < yPoints
				&& y >= 0
				&& (!map[key].active || start)
			) {
				map[key].active = true;
				const left = chance(0.6);
				const right = chance(0.6);
				const neither = false // !left && !right;
				const offset = y % 2 === 0 ? 1 : 0;
				if (left || neither) {
					// exit conditions
					if (x - offset < 0 || y + 1 >= yPoints) return;
					// udpate the graph
					map[key].targets.push([x - offset, y + 1]);
					// recurse
					traceStep([x - offset, y + 1]);
				}
				if (right || neither) {
					// exit conditions
					if (x + 1 - offset >= xPoints || y + 1 >= yPoints) return;
					// udpate the graph
					map[key].targets.push([x + 1 - offset, y + 1]);
					// recurse
					traceStep([x + 1 - offset, y + 1]);
				}
			}
		}

		_.range(xPoints).forEach((x) => {
			if (map[`${x}-0`].active) {
				traceStep([x, 0], true);
			}
		});

		// Draw it

		function getCoords(x, y) {
			const offsetX = (y % 2 === 1) ? Math.floor(width / xPoints / 2) : 0;
			// const offsetX = 0;
			return {
				x: x * width / xPoints + view.center.x - width / 2 + offsetX,
				y: y * height / yPoints + view.center.y - height / 2,
			};
		}

		Object.keys(map).forEach((key) => {
			const coords = key.split('-');
			const cX = +coords[0];
			const cY = +coords[1];
			const { x, y } = getCoords(cX, cY);

			if (map[key].active) {
				const c = new Path.Circle(new Point(x, y), radius);
				c.strokeColor = 'black';
				map[key].targets.forEach((targetIndices) => {
					const targetCoords = getCoords(...targetIndices);

					const angle = Math.PI * 2 - Math.atan2(targetCoords.y - y, targetCoords.x - x) + Math.PI / 2;

					const p1x = x + Math.sin(angle) * (radius + linePadding);
					const p1y = y + Math.cos(angle) * (radius + linePadding);
					const p2x = targetCoords.x + Math.sin(angle - Math.PI) * (radius + linePadding);
					const p2y = targetCoords.y + Math.cos(angle - Math.PI) * (radius + linePadding);
					const l = new Path.Line(
						new Point(p1x, p1y),
						new Point(p2x, p2y),
					);
					l.strokeColor = 'black';
				});
			}
		});
	}
}

export default App;
