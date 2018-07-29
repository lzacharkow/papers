import _ from 'lodash';
import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		const { Point, Size, Path, Raster, Rectangle, view } = this.scene;
		console.log(this.scene);

		const numOfRings = 50;
		const baseRadius = 20;
		const offset = 11;

		_.range(numOfRings).forEach((i) => {
			const numOfPoints = baseRadius + i * 5;
			const path = new Path();

			_.range(numOfPoints).forEach((a) => {
				const angle = a / numOfPoints * Math.PI * 2;
				const ringMod = i / numOfRings * Math.PI * 2;

				let x = view.center.x + Math.sin(angle) * (baseRadius + i * offset) + Math.sin(angle * 4 - Math.sin(ringMod)*2 + Math.cos(ringMod * 3 - Math.PI) + Math.sin(angle * 5) - Math.cos(angle * 7)) * (i + 1)/numOfRings * 30;
					// * (baseRadius + i * offset + Math.sin(angle * 12) * (i + 3));

				let y = view.center.y + Math.cos(angle) * (baseRadius + i * offset) + Math.cos(angle * 4 - Math.sin(ringMod)*2 + Math.cos(ringMod * 3 - Math.PI) + Math.sin(angle * 5) - Math.cos(angle * 7)) * (i + 1)/numOfRings * 30;
					// * (baseRadius + i * offset + Math.sin(angle * 12) * (i + 3));

				x += Math.sin(y * 0.02) * 10;
				y += Math.cos(x * 0.02) * 10;

				path.addSegment(new Point(x, y));
				path.strokeColor = 'black';
				path.closed = true;
				path.smooth();
			});
		});
	}
}

export default App;
