/////////////////////////////////////////////////////////
// LICENSED UNDER GPLv3. MADE WITH <3 BY THURINUM. ;3  //
// Customizable popup window/carousel system           //
/////////////////////////////////////////////////////////

// A set of items in the carousel
interface CarouselParams {
	selector: string,
	easing: string,
	itemSets: CarouselItemSet[]
}
class Carousel {
	carousel: HTMLElement
	easing: string
	itemSets: CarouselItemSet[]

	private titleTimeout?: any
	private isFullscreen: boolean = false
	private isSwitching: boolean = false
	private currentIndex: number = -1
	private currentItemSet?: CarouselItemSet

	constructor(params: CarouselParams) {
		this.easing = params.easing;
		this.itemSets = params.itemSets;

		// get the carousel element
		const element = document.querySelector(params.selector);

		if (!element)
			throw new Error(`Carousel element ${params.selector} not found!`);

		this.carousel = element as HTMLElement;
		this.carousel.classList.add("slideshow");

		// setup set triggers
		for (const itemSet of this.itemSets) {
			if (!itemSet.triggerSelector)
				continue;

			const trigger = document.querySelector(itemSet.triggerSelector);

			if (!trigger)
				throw new Error(`Carousel trigger ${itemSet.triggerSelector} not found!`);

			trigger.addEventListener("click", this.show);
		}
	}

	setItemSet(itemSetName: string) {
		const set = this.getItemSet(itemSetName);

		// remove all items from the carousel
		this.carousel.innerHTML = "";
		this.currentItemSet = set;

		// add base controls
		let content = `
			<span class="slideshow_close">X</span>
			<span class="slideshow_title">Document viewer</span>
			<span class="slideshow_resize" title="Toggle fullscreen">&#8690;</span>
			<span class="slideshow_progress"></span>`;

		// show switching arrows when displaying multiple items
		if (set.items.length > 1)
			content += `
				<span class="slideshow_arrow slideshow_arrow_left">&lt;</span>
				<span class="slideshow_arrow slideshow_arrow_right">&gt;</span>`;

		// add every item
		for (let i = 0; i < set.items.length; i++) {
			const item = set.items[i];

			content += item.isPath
				? `<${item.tagName} class="slide slide${i}" src="${item.src}"></${item.tagName}>`
				: `<${item.tagName} class="slide slide${i}">${item.src}</${item.tagName}>`;
		}

		this.carousel.innerHTML = content;

		// set event listeners for the controls
		if (set.items.length <= 1)
			return;

		const leftArrow = this.carousel.querySelector(".slideshow_arrow_left") as HTMLElement;
		const rightArrow = this.carousel.querySelector(".slideshow_arrow_right") as HTMLElement;

		leftArrow.addEventListener("click", () => this.toPreviousItem());
		rightArrow.addEventListener("click", () => this.toNextItem());
		leftArrow.style.transform = "translate(0, -50%) scale(1)";
		rightArrow.style.transform = "translate(0, -50%) scale(1)";

		document.querySelector(".slideshow_resize")?.addEventListener("click", (e) => {
			if (this.isFullscreen) {
				this.carousel.style.width = "85vw";
				this.carousel.style.height = "80vh";
				(e.currentTarget as HTMLElement).innerHTML = "&#8690;"
				this.isFullscreen = false;
			} else {
				this.carousel.style.width = "100vw";
				this.carousel.style.height = "100%";
				(e.currentTarget as HTMLElement).innerHTML = "&#8689;"
				this.isFullscreen = true;
			}
		});

		document.querySelector(".slideshow_close")?.addEventListener("click", () => this.hide());

		// default to first item if there is one
		if (set.items.length > 0) {
			this.currentIndex = set.startIndex!;
			this.setItem(set.items.length - 1);
		}
	}

	setItem(oldIndex: number): void {
		if (!this.currentItemSet) {
			throw new Error("No current item set!");
			return;
		}

		let currentSlide = document.querySelector(`.slide${oldIndex}`) as HTMLElement;
		let newSlide = document.querySelector(`.slide${this.currentIndex}`) as HTMLElement;
		let title = document.querySelector(".slideshow_title") as HTMLElement;
		let progress = document.querySelector(".slideshow_progress") as HTMLElement;

		// Clear old animation timer
		clearTimeout(this.titleTimeout);

		// Update the new slide
		newSlide.style.transition = "none";
		newSlide.style.opacity = '0';

		if (this.currentIndex - oldIndex > 0)
			newSlide.style.transform = "translate(100%)";
		else
			newSlide.style.transform = "translate(-100%)";

		newSlide.style.display = "block";
		newSlide.style.transition = `transform 1s ${this.easing}, opacity 1s ${this.easing}`;

		// Give time to the transition to update
		setTimeout(function () {
			newSlide.style.transform = "translate(0)";
			newSlide.style.opacity = '1';
		}, 25);

		// Hide the old slide
		if (this.currentIndex - oldIndex < 0 && currentSlide !== newSlide)
			currentSlide.style.transform = "translate(+100%)";
		else
			currentSlide.style.transform = "translate(-100%)";

		// Update slideshow progress
		const currentItem = this.currentItemSet.items[this.currentIndex];

		if (currentItem.isPath)
			title.innerHTML = currentItem.name.replace(/^.*[\\\/]/, '');
		else
			title.innerHTML = currentItem.name

		title.style.top = "0";
		this.titleTimeout = setTimeout(function () {
			title.style.top = "-47px";
		}, 4500);
		progress.innerHTML = `${this.currentIndex + 1}/${this.currentItemSet.items.length}`;

		if (currentSlide !== newSlide)
			setTimeout(() => {
				currentSlide.style.display = "none";
				this.isSwitching = false;
			}, 1000);
	}

	toNextItem(): void {
		if (!this.currentItemSet) {
			throw new Error("No current item set!");
			return;
		}

		// prevent switching item when already doing so
		if (this.isSwitching)
			return;

		this.isSwitching = true;

		let oldIndex = this.currentIndex;
		this.currentIndex--;

		// reset to opposite end if at the start
		if (this.currentIndex < 0)
			this.currentIndex = this.currentItemSet.items.length - 1;

		this.setItem(oldIndex);
	}

	toPreviousItem(): void {
		if (!this.currentItemSet) {
			throw new Error("No current item set!");
			return;
		}

		// prevent switching item when already doing so
		if (this.isSwitching)
			return;

		this.isSwitching = true;

		let oldIndex = this.currentIndex;
		this.currentIndex++;

		// reset to opposite end if at the end
		if (this.currentIndex >= this.currentItemSet.items.length)
			this.currentIndex = 0;

		this.setItem(oldIndex);
	}

	show() {
		if (!this.currentItemSet) {
			throw new Error("No current item set!");
			return;
		}

		let target = this.carousel;
		target.style.display = "block";
		setTimeout(function () {
			target.style.opacity = "1";
			target.style.transform = "translate(-50%, -50%) scale(1.0)";
		}, 500);
	}

	hide(): void {
		if (!this.currentItemSet) {
			throw new Error("No current item set!");
			return;
		}

		let target = this.carousel;
		target.style.transform = "translate(-50%, -50%) scale(0.9)";
		target.style.opacity = "0";

		setTimeout(function () {
			target.style.display = "none";
		}, 500);
	}

	private getItemSet(name: string): CarouselItemSet {
		const itemSet = this.itemSets.find(x => x.name === name);

		if (!itemSet)
			throw new Error(`Carousel item set with name ${name} not found!`);

		return itemSet;
	}
}

interface CarouselItemSetParams {
	name: string
	items: CarouselItem[]
	triggerSelector?: string
	startIndex?: number
}
class CarouselItemSet {
	name: string
	items: CarouselItem[]
	triggerSelector?: string
	startIndex?: number = 0 // TODO: Unused

	constructor(params: CarouselItemSetParams) {
		this.name = params.name
		this.items = params.items
		this.triggerSelector = params.triggerSelector
		this.startIndex = params.startIndex
	}
}

interface CarouselItemParams {
	name: string
	src: string
	isPath: boolean
	tagName: string
}
class CarouselItem {
	name: string
	src: string
	isPath: boolean
	tagName: string

	constructor(params: CarouselItemParams) {
		this.name = params.name;
		this.tagName = params.tagName;
		this.src = params.src;
		this.isPath = params.isPath;
	}
}

// instantiate the carousel (TEST)
const carousel = new Carousel({
	selector: '#carousel',
	easing: "cubic-bezier(0.61,-0.07, 0.31, 1.06)",
	itemSets: [
		new CarouselItemSet({
			name: 'carousel1',
			startIndex: 0,
			items: [
				new CarouselItem({
					name: 'image1',
					src: 'https://picsum.photos/id/1/1000',
					isPath: true,
					tagName: 'img'
				}),
				new CarouselItem({
					name: 'image2',
					src: 'https://picsum.photos/id/2/1000',
					isPath: true,
					tagName: 'img'
				}),
				new CarouselItem({
					name: 'image3',
					src: 'https://picsum.photos/id/3/1000',
					isPath: true,
					tagName: 'img'
				}),
				new CarouselItem({
					name: 'image4',
					src: 'https://picsum.photos/id/4/1000',
					isPath: true,
					tagName: 'img'
				}),
				new CarouselItem({
					name: 'image5',
					src: 'https://picsum.photos/id/5/1000',
					isPath: true,
					tagName: 'img'
				}),
			]
		}),
	]
})

carousel.setItemSet('carousel1');
carousel.show();
