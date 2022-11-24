"use strict";

///////////////////////////////////////////////
// COPYLEFT (L) 2020 THURINUM                //
// Customizable popup window/carousel system //
///////////////////////////////////////////////

// Seems like properties must have a value, otehrwise errpr
let settings = {
	slideshow: undefined,
	sets: undefined,
	titleTimeout: undefined,
	isFullscreen: false,
};

class ItemSet {
	constructor(
		name,			// A name for the set. Informative.
		items,			// Array of items content <array of strings>
		isPath,			// Does items contain paths to embed instead of raw content
		index,			// Start slide index
		container,		// Manually set container type (div, embed, etc.) if cannot autodetect.
		trigger,		// Optional slideshow trigger for those items <selector string>
	) {
		this.name = name;
		this.trigger = trigger;
		this.items = items;
		this.isPath = isPath;
		this.index = index;
		this.container = container;
		this.isSliding = false;
	}
}

// Setup a slideshow
function setup(
	target,			// Slideshow element selector <string>
	sets,			// Array of ItemSet that define possible contents <string array>
	preload = true,	// Should we preload all content? <bool>
) {
	if (!(settings.slideshow = document.querySelector(target)))
		throw new Error(`Invalid slideshow target "${target}".`);
	settings.slideshow.setAttribute("class", "slideshow");

	settings.sets = sets;
	settings.preload = preload;

	for (let i = 0; i < sets.length; i++) {
		let set = sets[i];

		// Check if set is a proper object
		if (!typeof (set) == "object")
			throw new Error(`Invalid ttem #${i} for item set "${set.name}" (non-object).`);

		// Check if trigger exists, validate it, and setup event
		if (set.trigger) {
			if (!(document.querySelector(set.trigger)))
				throw new Error(`Invalid trigger for item set ${set.name}.`);

			document.querySelector(set.trigger).addEventListener("click", hide);
		}

		// Hide initially to show with whoosh anim
		settings.slideshow.style.transform = "translate(-10%, -50%) scale(0.9)";
	}
}

// Show slideshow
function show() {
	let target = settings.slideshow;
	target.style.display = "block";
	setTimeout(function () {
		target.style.opacity = "1";
		target.style.transform = "translate(-50%, -50%) scale(1.0)";
	}, 500);
}

// Hide slideshow
function hide() {
	let target = settings.slideshow;
	target.style.transform = "translate(-50%, -50%) scale(0.9)";
	target.style.opacity = "0";

	setTimeout(function () {
		target.style.display = "none";
	}, 500);
}

// Sets the slideshow's content
function setContent(setName) { // Same parameters as above
	function findSet(s) { return s.name === setName; }
	console.log(settings)
	let set = settings.sets.find(findSet);

	if (!set)
		throw new Error(`Set ${setName} does not exist.`);

	let content = "";

	// Basic controls
	content += `<span class="slideshow_close">X</span>
	<span class="slideshow_title">Document viewer</span>
	<span class="slideshow_resize" title="Toggle fullscreen">&#8690;</span>
	<span class="slideshow_progress"></span>`;

	// Only show switching arrows when displaying multiple files
	if (set.items.length > 1)
		content += `<span class="slideshow_arrow slideshow_arrow_left">&lt;</span>
		<span class="slideshow_arrow slideshow_arrow_right">&gt;</span>`;

	for (let i = 0; i < set.items.length; i++) {
		if (set.isPath)
			content += `<${set.container} class="slide slide${i}" src="${set.items[i]}"></${set.container}>`;
		else
			content += set.items[i];
	}

	settings.slideshow.innerHTML = content;

	if (set.items.length > 1) {
		let buttonLeft = document.querySelector(".slideshow_arrow_left");
		let buttonRight = document.querySelector(".slideshow_arrow_right");

		buttonLeft.addEventListener("click", function () {
			// Prevent switching slide when already doing so
			if (set.isSliding)
				return;
			set.isSliding = true;

			let oldIndex = set.index;
			set.index--;
			if (set.index < 0)
				set.index = set.items.length - 1; // Reset slideshow to extremity
			setSlide(set, oldIndex);
		});
		buttonRight.addEventListener("click", function () {
			// Prevent switching slide when already doing so
			if (set.isSliding)
				return;
			set.isSliding = true;

			let oldIndex = set.index;
			set.index++;
			if (set.index >= set.items.length)
				set.index = 0;
			setSlide(set, oldIndex);
		});

		// Show buttons (animated)
		buttonLeft.style.transform = "translate(0, -50%) scale(1)";
		buttonRight.style.transform = "translate(0, -50%) scale(1)";
	}

	// Setup resize button
	document.querySelector(".slideshow_resize").addEventListener("click", function () {
		if (settings.isFullscreen) {
			settings.slideshow.style.width = "85vw";
			settings.slideshow.style.height = "80vh";
			this.innerHTML = "&#8690;"
			settings.isFullscreen = false;
		} else {
			settings.slideshow.style.width = "100vw";
			settings.slideshow.style.height = "100%";
			this.innerHTML = "&#8689;"
			settings.isFullscreen = true;
		}
	});

	// Setup close button
	document.querySelector(".slideshow_close").addEventListener("click", hide);

	// Setup to first slide if there is content
	if (set.items.length > 0)
		setSlide(set, set.items.length - 1);
}

// Set slideshow to slide X
function setSlide(set, oldIndex) {
	let currentSlide = document.querySelector(`.slide${oldIndex}`);
	let newSlide = document.querySelector(`.slide${set.index}`);
	let title = document.querySelector(".slideshow_title");
	let progress = document.querySelector(".slideshow_progress");

	// Clear old animation timer
	clearTimeout(settings.titleTimeout);

	// Update the new slide
	newSlide.style.transition = "none";
	newSlide.style.opacity = '0';

	if (set.index - oldIndex > 0)
		newSlide.style.transform = "translate(100%)";
	else
		newSlide.style.transform = "translate(-100%)";

	newSlide.style.display = "block";
	newSlide.style.transition = `transform 1s cubic-bezier(.68,-0.55,.27,1.55), opacity 1s cubic-bezier(.68,-0.55,.27,1.55)`;

	// Give time to the transition to update
	setTimeout(function () {
		newSlide.style.transform = "translate(0)";
		newSlide.style.opacity = '1';
	}, 25);

	// Hide the old slide
	if (set.index - oldIndex < 0 && currentSlide !== newSlide)
		currentSlide.style.transform = "translate(+100%)";
	else
		currentSlide.style.transform = "translate(-100%)";

	// Update slideshow progress
	if (set.isPath)
		title.innerHTML = set.items[set.index].replace(/^.*[\\\/]/, '');
	else // For now, assume content is HTML
		//settings.slideshow.children[7].children[0].innerHTML
		title.innerHTML = "REDACTED";

	title.style.top = "0";
	settings.titleTimeout = setTimeout(function () {
		title.style.top = "-47px";
	}, 4500);
	progress.innerHTML = `${set.index + 1}/${set.items.length}`;

	if (currentSlide !== newSlide)
		setTimeout(function () {
			currentSlide.style.display = "none";
			set.isSliding = false;
		}, 1000);
}

setup(
	"#carousel",
	[
		new ItemSet("Dummy", [
			"Owo",
			"Uwo",
			"owO",
			"OwO",
			"PwP",
			"UwU"
		], true, 0, "div")
	]
)

window.onload = () => {
	setContent("Dummy");
	show();
}

// export { settings, ItemSet, setup, show, hide, setContent, setSlide }
