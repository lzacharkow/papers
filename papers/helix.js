import _ from 'lodash';
import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		const { Point, Size, Path, Raster, Rectangle, view } = this.scene;
		const wave = Math.PI * 2;

		const height = 600;
		const width = 600;

		const numberOfYPoints = height;
		const numberOfXPoints = 10;


		// --- MOTHER WAVE --- //

		const motherAmplitude = 10;
		const motherWaves = 2;
		const motherScale = wave * motherWaves;
		const motherStep = motherScale / height;

		// const controlLine = new Path();
		// controlLine.strokeColor = 'black';


		// --- BABY WAVES --- //

		const babyAmplitude = 20; // 40 pixels out on each side
		const babyWaves = 4;
		const babyScale = wave * babyWaves;
		const babyStep = babyScale / height;

		// const wave1 = new Path();
		// wave1.strokeColor = 'red';
		// const wave2 = new Path();
		// wave2.strokeColor = 'blue';


		_.range(numberOfXPoints + 1).forEach((xx) => {
			const xOffset = xx * (width / numberOfXPoints);
			const xStart = (view.center.x - (width / 2)) + xOffset;

			_.range(numberOfYPoints + 1).forEach((i) => {
				const yOffset = i * (height / numberOfYPoints);
				const yStart = view.center.y - (height / 2);


				// --- MOTHER WAVE --- //

				const x = xStart + (Math.sin(yOffset * motherStep) * motherAmplitude); // eslint-disable-line
				const y = yStart + yOffset;

				// controlLine.addSegment(new Point(x, y));


				// --- BABY WAVES --- //

				const wave1x = x + (Math.sin(yOffset * babyStep) * babyAmplitude);
				// wave1.addSegment(new Point(wave1x, y));

				const wave2x = x - (Math.sin(yOffset * babyStep) * babyAmplitude);
				// wave2.addSegment(new Point(wave2x, y));

				if (i % 5 === 0) {
					const waveLine = new Path(
						new Point(wave1x, y),
						new Point(wave2x, y),
					);

					waveLine.strokeColor = 'magenta';
				}
			});
		});
	}
}

export default App;
