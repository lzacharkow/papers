import _ from 'lodash';
import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		const { Point, Size, Path, Raster, Rectangle, view } = this.scene;
		console.log(this.scene);
		console.log('hi');

		// Make a bunch of sine waves in a row down the page.
		// Each wave will have its frequency modulated based
		// on the x axis value.

		const xSize = 433;
		const ySize = 600;

		const xPoints = Math.floor(xSize * 1 / 4);
		const numOfLines = 100;
		const amplitude = 6;
		const baseFreq = 0.1;

		_.range(numOfLines).forEach((yy) => {
			const y = view.center.y - (ySize / 2) + yy * (ySize / (numOfLines - 1));

			const path = new Path();
			path.strokeColor = 'black';

			_.range(xPoints).forEach((xx, i) => {
				const x = view.center.x - (xSize / 2) + xx * (xSize / (xPoints - 1));

				const frequency = (
					// base frequency: this is a number that grows from left to right
					((i - xPoints / 2) * baseFreq + yy / numOfLines * 0.5)
					// we modulate it based on where we are on the y axis using another wave
					* Math.sin(i * 0.1 + Math.sin(yy * 0.2) + yy / numOfLines * (xx % 2 ? 10 : 10))
				);

				const ampModulation = (
					(Math.sin(frequency + yy / numOfLines * 10))
					// scale that by the amplitude, which is growing and
					// shrinking based on where we are on the y axis
					* (amplitude / 2 * (Math.sin(yy * 2 + x * 0.5 + xx)))
					+ Math.sin(i * 0.1) * Math.sin(i * 0.2) * 15
				);

				const ramp = i / xPoints;

				path.addSegment(
					new Point(
						x,
						// start with the base Y value
						y
							// add the sine value at the current frequency
							+ (
								ampModulation * yy / numOfLines
								// Math.sin(frequency) * 15 * (1 - ramp)
								// + ampModulation * (ramp)
							),
					),
				);
			});

			path.smooth();
		});
	}
}

export default App;
