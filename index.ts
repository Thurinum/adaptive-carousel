///////////////////////////////////////////////
// COPYRIGHT (C) 2022 THURINUM               //
// Customizable popup window/carousel system //
///////////////////////////////////////////////

// A set of items in the carousel
interface ICarousel {
	selector: string
	items: ICarouselItem[]
	isFullscreen: boolean
	titleTimeout: number
	startIndex: number
	triggerSelector: string
}
class Carousel implements ICarousel {
	selector: string
	items: ICarouselItem[]
	isFullscreen: boolean
	titleTimeout: number
	startIndex: number
	triggerSelector: string

	constructor(params: ICarousel) {
		this.selector = params.selector
		this.items = params.items
		this.isFullscreen = params.isFullscreen
		this.titleTimeout = params.titleTimeout
		this.startIndex = params.startIndex
		this.triggerSelector = params.triggerSelector
	}
}

interface ICarouselItem {
	name: string
	src: string
	isPath: boolean
	tagName: string
}
class CarouselItem implements ICarouselItem {
	name: string
	src: string
	isPath: boolean
	tagName: string

	constructor(public params: ICarouselItem) {
		this.name = params.name;
		this.tagName = params.tagName;
		this.src = params.src;
		this.isPath = params.isPath;
	}
}

const carousel: Carousel = new Carousel({
	selector: '.carousel',
	items: [
		new CarouselItem({
			name: 'Image 1',
			src: 'https://i.imgur.com/1JZ9Q2r.png',
			isPath: false,
			tagName: 'img'
		}),
	],
	isFullscreen: true,
	titleTimeout: 5000,
	startIndex: 0,
	triggerSelector: ".carousel-trigger"
})
