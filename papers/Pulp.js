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

		this.createExportToSVGButton();
		this.draw();
	}

	draw() {
		// Put paper logic here.
	}

	createExportToSVGButton() {
		// We're makin' us a button
		this.exportButton = document.createElement('button');
		this.exportButton.className = 'export';
		this.exportButton.appendChild(document.createTextNode('Export to SVG'));
		document.body.append(this.exportButton);

		// And we're wiring up a click handler
		this.exportButton.addEventListener('click', () => {
			// Show some feedback before we lock up the browser
			this.exportButton.textContent = 'Building ...';

			// Gross setTimeout to give the browser a chance to render
			// the text into the button before we lock it up generating
			// our svg data.
			setTimeout(() => {
				// Tell paper to generate an SVG to string
				const svgData = this.scene.project.exportSVG({ asString: true });

				// Now we're going to use an old hack to get the browser
				// to download our data as an SVG file. First make an
				// <a> tag...
				const downloadLink = window.document.createElement('a');
				// Then set its URL to a data blob...
				downloadLink.href = window.URL.createObjectURL(new window.Blob([svgData], { type: 'text/svg' }));
				downloadLink.download = 'paper-sketch.svg';
				// Then put it in the body, click it, and remove it.
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);

				// More feedback.
				this.exportButton.textContent = 'Saved ✔︎';

				// And reset it in case you wanna do it again.
				this.exportButton.setTimeout(() => {
					this.exportButton.textContent = 'Export to SVG';
				}, 1000);
			}, 0);
		});
	}
}

export default Pulp;
