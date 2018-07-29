import _ from 'lodash';
import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		const { Point, Size, Path, Raster, Rectangle, view } = this.scene;
		console.log(this.scene);

		const yPoints = 100;
		const height = 600;
		const width = 800;

		const spirals = 20;
		const radius = 20;
		const yScale = 0.5;

		const numOfCoils = 20;

		_.range(numOfCoils).forEach((xx) => {
			const path = new Path();

			const centerX = xx / numOfCoils + (xx * (width / (numOfCoils - 1))) + view.center.x - width / 2;
			_.range(yPoints).forEach((yy) => {
				// const centerX = view.center.x;
				const centerY = yy / yPoints * height + (view.center.y - height / 2);

				const angle = yy / yPoints * Math.PI * 2 * spirals + xx / numOfCoils * 10;

				const x = centerX + Math.sin(angle) * radius;
				const y = centerY + Math.cos(angle) * radius * yScale;

				path.addSegment(new Point(x, y));
			});

			path.strokeColor = 'black';
			path.smooth();
		});
	}
}

export default App;
