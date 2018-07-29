import _ from 'lodash';
import Pulp from './Pulp';

function range2d(x, y, cb) {
	_.range(x).forEach(xx => _.range(y).forEach(yy => cb(xx, yy)));
}

class App extends Pulp {
	draw() {
		const { Point, Size, Path } = this.scene;
		console.log(this.scene);

		const length = 10;
		const width = 600;
		const height = 600;

		const xAmt = 10;
		const yAmt = 10;
		range2d(xAmt, yAmt, (x, y) => {
			const box = new Path.Rectangle(
				new Point(
					this.scene.view.center.x - width / 2 + x * width / xAmt,
					this.scene.view.center.y - height / 2 + y * height / yAmt,
				),
				new Size(20, 20),
			);
			box.strokeColor = 'black';
			box.rotate(x / (length - 1) * 90);
		});
	}
}

export default App;
