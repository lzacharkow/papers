import _ from 'lodash';
import Pulp from './Pulp';

function range2d(x, y, cb) {
	_.range(y).forEach(yy => _.range(x).forEach(xx => cb(xx, yy)));
}

function chance(prob) {
	return Math.random() <= prob;
}

class CASolver {
	constructor(rule, start, height) {
		this.rules = _.padStart((rule >>> 0).toString(2), 8, '0').split('').map(str => +str);
		this.start = start;
		this.width = start.length;
		this.height = height;
	}

	// solves a line
	applyRule(line) {
		const newLine = line.map(() => 0);
		for (let i = 1; i < line.length - 1; i++) {
			newLine[i] = this.solveNeighbors(line[i - 1], line[i], line[i + 1]);
		}
		return newLine;
	}

	solveNeighbors(a, b, c) {
		if (a === 1 && b === 1 && c === 1) return this.rules[0];
		if (a === 1 && b === 1 && c === 0) return this.rules[1];
		if (a === 1 && b === 0 && c === 1) return this.rules[2];
		if (a === 1 && b === 0 && c === 0) return this.rules[3];
		if (a === 0 && b === 1 && c === 1) return this.rules[4];
		if (a === 0 && b === 1 && c === 0) return this.rules[5];
		if (a === 0 && b === 0 && c === 1) return this.rules[6];
		if (a === 0 && b === 0 && c === 0) return this.rules[7];
		return 0;
	}

	// returns an array
	solve() {
		return _.range(this.height).reduce((acc, y) => {
			if (y === 0) {
				acc.push(this.start);
				return acc;
			}
			acc.push(this.applyRule(acc[y - 1]));
			return acc;
		}, []);
	}
}

class App extends Pulp {
	draw() {
		const { Point, Size, Path, Raster, Rectangle, view } = this.scene;
		console.log(this.scene);

		const width = 550;
		const height = 700;

		const caWidth = 63;
		const caHeight = Math.floor(caWidth * (height/width));

		const start = _.range(caWidth).map(() => 0);
		start[Math.floor(caWidth / 2)] = 1;
		// start[0] = 0;
		start[start.length - 1] = 0;

		const caSolver = new CASolver(
			150,
			start,
			caHeight,
		);

		const ca = caSolver.solve();

		range2d(caWidth, caHeight, (xx, yy) => {
			if (ca[yy][xx] === 0) return;
			const x = xx * (width / caWidth) + view.center.x - width / 2 + Math.sin(yy/height * Math.PI * 40) * 30;
			const y = yy * (height / caHeight) + view.center.y - height / 2;

			// const c = new Path.Circle(new Point(x, y), 2);
			// const c = new Path.Rectangle(new Point(x, y), new Size(5, 5));
			const c = new Path.Line(new Point(x, y), new Point(x + 5, y + 5));
			const c2 = new Path.Line(new Point(x + 5, y), new Point(x, y + 5));
			c.strokeColor = 'black';
			c2.strokeColor = 'black';
		});
	}
}

export default App;
