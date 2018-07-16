import _ from 'lodash';
import Pulp from './Pulp';

function range2d(x, y, cb) {
	_.range(x).forEach(xx => _.range(y).forEach(yy => cb(xx, yy)));
}

class App extends Pulp {
	draw() {
		const padding = { x: 100, y: 200 };

		const lines = [];

		const xAmt = 50;
		const yAmt = 10;

		range2d(xAmt, yAmt, (xx, yy) => {
			const x = xx * (window.innerWidth - padding.x * 2) / xAmt + padding.x;
			let y = yy * (window.innerHeight - padding.y * 2) / yAmt + padding.y;

			// each x coordinate gets offset by the Y's sine value
			const sinOffset = Math.sin(xx / xAmt * Math.PI * 4);
			const sinOffsetInDegrees = (sinOffset) * (180 / Math.PI);
			y += sinOffset * 50;

			const line1 = new this.scene.Path.Line(
				new this.scene.Point(x + 5, y),
				new this.scene.Point(x + 5, y + 10),
			);
			line1.rotate(sinOffsetInDegrees + 45 + yy * 4);
			line1.strokeColor = 'black';

			lines.push(line1);
		});
	}
}

export default App;
