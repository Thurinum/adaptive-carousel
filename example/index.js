"use strict";
class Carousel {
    carousel;
    itemSets;
    titleTimeout;
    isFullscreen = false;
    isSwitching = false;
    currentIndex = -1;
    currentItemSet;
    constructor(params) {
        this.itemSets = params.itemSets;
        const element = document.querySelector(params.selector);
        if (!element)
            throw new Error(`Carousel element ${params.selector} not found!`);
        this.carousel = element;
        this.carousel.classList.add("carousel");
        for (const itemSet of this.itemSets) {
            if (!itemSet.triggerSelector)
                continue;
            const trigger = document.querySelector(itemSet.triggerSelector);
            if (!trigger)
                throw new Error(`Carousel trigger ${itemSet.triggerSelector} not found!`);
            trigger.addEventListener("click", () => this.show());
        }
    }
    setItemSet(itemSetName) {
        const set = this.getItemSet(itemSetName);
        this.carousel.innerHTML = "";
        this.currentItemSet = set;
        let content = `
			<span class="carousel-close">X</span>
			<span class="carousel-title">Document viewer</span>
			<span class="carousel-resize" title="Toggle fullscreen">&#8690;</span>
			<span class="carousel-page"></span>`;
        if (set.items.length > 1)
            content += `
				<span class="carousel-arrow carousel-arrow-left">&lt;</span>
				<span class="carousel-arrow carousel-arrow-right">&gt;</span>`;
        for (let i = 0; i < set.items.length; i++) {
            const item = set.items[i];
            content += item.isPath
                ? `<${item.tagName} class="carousel-item carousel-item${i}" src="${item.src}"></${item.tagName}>`
                : `<${item.tagName} class="carousel-item carousel-item${i}">${item.src}</${item.tagName}>`;
        }
        this.carousel.innerHTML = content;
        if (set.items.length <= 1)
            return;
        const leftArrow = this.carousel.querySelector(".carousel-arrow-left");
        const rightArrow = this.carousel.querySelector(".carousel-arrow-right");
        leftArrow.addEventListener("click", () => this.toPreviousItem());
        rightArrow.addEventListener("click", () => this.toNextItem());
        leftArrow.style.transform = "translate(0, -50%) scale(1)";
        rightArrow.style.transform = "translate(0, -50%) scale(1)";
        document.querySelector(".carousel-resize")?.addEventListener("click", (e) => {
            if (this.isFullscreen) {
                this.carousel.style.width = "85vw";
                this.carousel.style.height = "80vh";
                e.currentTarget.innerHTML = "&#8690;";
                this.isFullscreen = false;
            }
            else {
                this.carousel.style.width = "100vw";
                this.carousel.style.height = "100%";
                e.currentTarget.innerHTML = "&#8689;";
                this.isFullscreen = true;
            }
        });
        document.querySelector(".carousel-close")?.addEventListener("click", () => this.hide());
        if (set.items.length > 0) {
            this.currentIndex = set.startIndex;
            this.setItem(set.items.length - 1);
        }
        Object.entries(set.style).forEach(([key, value]) => {
            this.carousel.style.setProperty(`--${key}`, value);
        });
    }
    setItem(oldIndex) {
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        let currentSlide = document.querySelector(`.carousel-item${oldIndex}`);
        let newSlide = document.querySelector(`.carousel-item${this.currentIndex}`);
        let title = document.querySelector(".carousel-title");
        let progress = document.querySelector(".carousel-page");
        clearTimeout(this.titleTimeout);
        newSlide.style.transition = "none";
        newSlide.style.opacity = '0';
        if (this.currentIndex - oldIndex > 0)
            newSlide.style.transform = "translate(100%)";
        else
            newSlide.style.transform = "translate(-100%)";
        newSlide.style.display = "block";
        newSlide.style.transition = `transform 1s var(--easing), opacity 1s var(--easing)`;
        setTimeout(function () {
            newSlide.style.transform = "translate(0)";
            newSlide.style.opacity = '1';
        }, 25);
        if (this.currentIndex - oldIndex < 0 && currentSlide !== newSlide)
            currentSlide.style.transform = "translate(+100%)";
        else
            currentSlide.style.transform = "translate(-100%)";
        const currentItem = this.currentItemSet.items[this.currentIndex];
        if (currentItem.isPath)
            title.innerHTML = currentItem.name.replace(/^.*[\\\/]/, '');
        else
            title.innerHTML = currentItem.name;
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
    toNextItem() {
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        if (this.isSwitching)
            return;
        this.isSwitching = true;
        let oldIndex = this.currentIndex;
        this.currentIndex++;
        if (this.currentIndex >= this.currentItemSet.items.length)
            this.currentIndex = 0;
        this.setItem(oldIndex);
    }
    toPreviousItem() {
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        if (this.isSwitching)
            return;
        this.isSwitching = true;
        let oldIndex = this.currentIndex;
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = this.currentItemSet.items.length - 1;
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
    hide() {
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
    getItemSet(name) {
        const itemSet = this.itemSets.find(x => x.name === name);
        if (!itemSet)
            throw new Error(`Carousel item set with name ${name} not found!`);
        return itemSet;
    }
}
class CarouselItemSet {
    name;
    items;
    style;
    triggerSelector;
    startIndex = 0;
    constructor(params) {
        this.name = params.name;
        this.items = params.items;
        this.style = params.style ?? new CarouselStyle({
            highlight: "#ff0000",
            background: "#000000",
            foreground: "#ffffff"
        });
        this.triggerSelector = params.triggerSelector;
        this.startIndex = params.startIndex;
    }
}
class CarouselItem {
    name;
    src;
    isPath;
    tagName;
    constructor(params) {
        this.name = params.name;
        this.tagName = params.tagName;
        this.src = params.src;
        this.isPath = params.isPath;
    }
}
class CarouselStyle {
    highlight;
    foreground;
    background;
    easing;
    constructor(params) {
        this.highlight = params.highlight ?? "azure";
        this.foreground = params.foreground ?? "#ffffff";
        this.background = params.background ?? "#000000";
        this.easing = params.easing ?? "cubic-bezier(0.61,-0.07, 0.31, 1.06)";
    }
}
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
});
carousel.setItemSet('carousel1');
//# sourceMappingURL=index.js.map