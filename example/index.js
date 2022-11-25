// instantiate the carousel (TEST)
const carousel = new Carousel({
	selector: '#carousel',
	itemSets: [
		new CarouselItemSet({
			name: 'carousel1',
			triggerSelector: 'button',
			style: new CarouselStyle({
				highlight: "lightblue",
				foreground: "#eee",
				background: "#222"
			}),
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
					src: 'https://info.cegepmontpetit.ca/assets/photos/mp.png',
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
