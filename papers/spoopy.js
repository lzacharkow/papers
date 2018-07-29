import _ from 'lodash';
import Pulp from './Pulp';

function range2d(x, y, cb) {
	_.range(x).forEach(xx => _.range(y).forEach(yy => cb(xx, yy)));
}

class App extends Pulp {
	draw() {
		const box = { width: 400, height: 400 };

		const xAmt = 10;
		const yAmt = 10;

		const boxW = box.width / xAmt;
		const boxH = box.height / yAmt;

		range2d(xAmt, yAmt, (xx, yy) => {
			const x = xx * (boxW) + (window.innerWidth / 2 - box.width / 2);
			const y = yy * (boxH) + (window.innerHeight / 2 - box.height / 2);

			const rect = new this.scene.Path.Rectangle(
				new this.scene.Point(x + 5, y + 5),
				new this.scene.Size(boxW - 5, boxH - 5),
			);

			const tlCircle = new this.scene.Path.Circle(
				new this.scene.Point(x, y),
				boxW / 2 + xx / xAmt * 15,
			);

			const cutBox = rect.subtract(tlCircle);
			cutBox.strokeColor = 'black';

			rect.remove();
			tlCircle.remove();

			// make a bunch of lines to cut with the cutbox
			const numOfSections = 18;
			// const hash = new this.scene.CompoundPath();
			// build the rects first
			_.range(numOfSections).forEach((xLine) => {
				const xXx = (x - 20) + xLine * ((boxW + 20) / numOfSections);
				const rectShape = new this.scene.Path.Line(
					new this.scene.Point(xXx + 5, y + 5),
					new this.scene.Point(xXx + 5, y + boxH + 5),
				);
				rectShape.strokeColor = 'red';
				// rectShape.rotate(rotation);
				const finalRect = rectShape.intersect(cutBox, { stroke: true });
				finalRect.strokeColor = 'red';
				rectShape.remove();
				// hash.addChild(rectShape);
			});

			// const rotation = [0, 45, 90, 90 + 45][Math.floor(Math.random() * 4)];

			// hash.rotate(rotation);

			// const finalShape = hash.intersect(cutBox, { stroke: true });
			// finalShape.strokeColor = 'black';
			cutBox.remove();
			// hash.remove();
			// cutBox.remove();
		});
	}
}

export default App;
