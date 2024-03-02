let canvas = document.querySelector("#canvas");
let reset = document.querySelector(".reset");
let send = document.querySelector(".send");
let digit = document.querySelector(".digit");
let output = document.querySelector(".output");
ctx = canvas.getContext("2d");
canvas.height = 560;
canvas.width = 560;
draw = false;
function getMousePos(canvas, e) {
	var box = canvas.getBoundingClientRect();
	return {
		x: e.clientX - box.left,
		y: e.clientY - box.top,
	};
}
function start(e) {
	draw = true;
	paint(e); //for individual dots
}
function finish() {
	draw = false;
	ctx.beginPath(); //to start individual lines
}

function paint(e) {
	if (!draw) {
		return;
	}
	var position = getMousePos(canvas, e);
	ctx.lineWidth = 10;
	ctx.strokeStyle = "#e6a8ff";
	ctx.lineTo(position.x, position.y);
	ctx.stroke();
	ctx.moveTo(position.x, position.y);
}

reset.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	output.textContent = `Predicted Digit is: `;
	output.classList.remove("output-success");
	output.classList.remove("output-retry");
});

send.addEventListener("click", async () => {
	var backup = ctx.globalCompositeOperation,
		old = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.globalCompositeOperation = "destination-over";
	ctx.fillStyle = `#000000`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let finalImage = canvas.toDataURL("image/jpg");
	// downloadImage(finalImage, "my-canvas.jpg");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(old, 0, 0);
	ctx.globalCompositeOperation = backup;
	// Remove the data:image/png;base64, part from the base64 string
	let base64ImageData = finalImage.split(",")[1];

	try {
		let response = await fetch("http://localhost:5000", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ image: base64ImageData }),
		});

		if (response.ok) {
			let result = await response.json();
			console.log(result); // Log the API response
			output.textContent = `Success! - Predicted Digit is [${result.predicted_digit}]`;
			output.classList.add("output-success");
		} else {
			console.error("Error in API call:", response.statusText);
			output.classList.add("output-retry");
			output.textContent = `Error in API call: ${response.statusText}`;
		}
	} catch (error) {
		console.error("Error in fetch:", error);
		output.classList.add("output-retry");
		output.textContent = `Error in fetch: ${error}`;
	}
});

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mouseup", finish);
canvas.addEventListener("mousemove", paint);
