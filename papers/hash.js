import _ from 'lodash';
import Pulp from './Pulp';

function range2d(x, y, cb) {
	_.range(x).forEach(xx => _.range(y).forEach(yy => cb(xx, yy)));
}

class App extends Pulp {
	draw() {
		const { Point, Size, Path, Raster, Rectangle } = this.scene;
		console.log(this.scene);

		const size = new Size(18, 18);
		this.maxDensity = 0.8;
		this.minDensity = 0.15;
		this.padding = -10;

		// STEP 1: create preset hashes
		const numOfHashes = 12;
		const hashes = this.makeHashes(size, numOfHashes);

		// this.drawGrid(size);

		// make a raster
		const raster = new Raster('beep.jpg', this.scene.view.center);

		raster.onLoad = () => {
			console.log(raster);

			const xAmt = Math.floor(raster.bounds.size.width / size.width);
			const yAmt = Math.floor(raster.bounds.size.height / size.height);
			console.log(xAmt, yAmt);

			range2d(xAmt, yAmt, (x, y) => {
				const xx = x * size.width + raster.bounds.topLeft.x;
				const yy = y * size.height + raster.bounds.topLeft.y;
				const rect = new Rectangle(new Point(xx, yy), size);

				const color = raster.getAverageColor(rect);
				const shade = (3 - (color.red + color.green + color.blue)) / 3;
				const hashIndex = Math.floor(shade * (hashes.length + 1));

				// white should be empty
				if (hashIndex === 0) return;

				const h = hashes[hashIndex - 1].clone();
				this.scene.project.activeLayer.addChild(h);
				h.strokeColor = 'black';
				h.position = new Point(xx, yy);
			});

			raster.remove();
		};
	}

	makeHashes(size, num) {
		return _.range(num).map(i => this.makeHash(size, i / num));
	}

	makeHash(size, fill) {
		// const maxLines = Math.floor(25 / 60 * size.width);
		// const minLines = Math.floor(0.15 * size.width);

		const maxLines = Math.floor(this.maxDensity * size.width);
		const minLines = Math.floor(this.minDensity * size.width);
		const numOfLines = Math.floor((maxLines - minLines) * fill + minLines);

		const bounds = new this.scene.Path.Rectangle(
			new this.scene.Point(this.padding, this.padding),
			new this.scene.Size(size.width - this.padding * 2, size.height - this.padding * 2)
		);
		bounds.pivot = new this.scene.Point(size.width / 2, size.height / 2);
		bounds.position = new this.scene.Point(0, 0);

		const angle = [22.5, 45, 67.5, 112.5, 135, 157.5][_.random(5)];
		bounds.rotate(angle);

		const finalShape = new this.scene.CompoundPath();

		_.range(numOfLines + 1).forEach((i) => {
			const scaleFactor = 1.5;
			const x = i / numOfLines * size.width * scaleFactor;
			const line = new this.scene.Path.Line(
				new this.scene.Point(-size.width / 2 * scaleFactor + x, -size.height / 2 * scaleFactor),
				new this.scene.Point(-size.width / 2 * scaleFactor + x, size.height / 2 * scaleFactor),
			);
			const finalLine = line.intersect(bounds, { stroke: true });
			line.remove();
			finalShape.addChild(finalLine);
		});

		bounds.remove();

		finalShape.strokeColor = 'red';
		finalShape.rotate(-angle);

		finalShape.remove();

		return finalShape;
	}

	drawGrid(size) {
		const numOfHashes = 12;
		const hashes = this.makeHashes(size, numOfHashes);
		const xAmt = 8;
		const yAmt = 8;
		range2d(xAmt, yAmt, (x, y) => {
			const i = x + y * xAmt;
			const h = hashes[i % numOfHashes].clone();
			this.scene.project.activeLayer.addChild(h);
			h.strokeColor = 'black';

			const xx = this.scene.view.center.x - (xAmt * size.width / 2) + x * (size.width);
			const yy = this.scene.view.center.y - (yAmt * size.height / 2) + y * (size.height);
			h.position = new this.scene.Point(xx, yy);
		});
	}
}

export default App;
