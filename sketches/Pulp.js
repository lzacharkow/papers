/* eslint-disable class-methods-use-this */
import paper from 'paper/dist/paper-core';

// Extend this in each sketch.
// - Gives canvas element to paper
// - Makes a new paper environment for us

class Pulp {
	constructor(title = 'Pulpy') {
		this.title = title;

		this.scene = new paper.PaperScope();
		this.canvasElement = document.getElementById('canvas');
		this.scene.setup(this.canvasElement);

		this.draw();
	}

	draw() {
		// Put paper logic here.
	}
}

export default Pulp;
