"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselStyle = exports.CarouselItem = exports.CarouselItemSet = exports.Carousel = void 0;
var Carousel = (function () {
    function Carousel(params) {
        var _this = this;
        this.isFullscreen = false;
        this.isSwitching = false;
        this.currentIndex = -1;
        this.itemSets = params.itemSets;
        var element = document.querySelector(params.selector);
        if (!element)
            throw new Error("Carousel element ".concat(params.selector, " not found!"));
        this.carousel = element;
        this.carousel.classList.add("carousel");
        for (var _i = 0, _a = this.itemSets; _i < _a.length; _i++) {
            var itemSet = _a[_i];
            if (!itemSet.triggerSelector)
                continue;
            var trigger = document.querySelector(itemSet.triggerSelector);
            if (!trigger)
                throw new Error("Carousel trigger ".concat(itemSet.triggerSelector, " not found!"));
            trigger.addEventListener("click", function () { return _this.show(); });
        }
    }
    Carousel.prototype.addItemSet = function (set) {
        this.itemSets = this.itemSets.filter(function (x) { return x.name !== set.name; });
        this.itemSets.push(set);
    };
    Carousel.prototype.setItemSet = function (itemSetName) {
        var _this = this;
        var _a, _b;
        var set = this.getItemSet(itemSetName);
        this.carousel.innerHTML = "";
        this.currentItemSet = set;
        var content = "\n\t\t\t<span class=\"carousel-close\">X</span>\n\t\t\t<span class=\"carousel-title\">Document viewer</span>\n\t\t\t<span class=\"carousel-resize\" title=\"Toggle fullscreen\">&#8690;</span>\n\t\t\t<span class=\"carousel-page\"></span>";
        if (set.items.length > 1)
            content += "\n\t\t\t\t<span class=\"carousel-arrow carousel-arrow-left\">&lt;</span>\n\t\t\t\t<span class=\"carousel-arrow carousel-arrow-right\">&gt;</span>";
        for (var i = 0; i < set.items.length; i++) {
            var item = set.items[i];
            content += item.isPath
                ? "<".concat(item.tagName, " class=\"carousel-item carousel-item").concat(i, "\" src=\"").concat(item.src, "\"></").concat(item.tagName, ">")
                : "<".concat(item.tagName, " class=\"carousel-item carousel-item").concat(i, "\">").concat(item.src, "</").concat(item.tagName, ">");
        }
        this.carousel.innerHTML = content;
        if (set.items.length <= 1)
            return;
        var leftArrow = this.carousel.querySelector(".carousel-arrow-left");
        var rightArrow = this.carousel.querySelector(".carousel-arrow-right");
        leftArrow.addEventListener("click", function () { return _this.toPreviousItem(); });
        rightArrow.addEventListener("click", function () { return _this.toNextItem(); });
        leftArrow.style.transform = "translate(0, -50%) scale(1)";
        rightArrow.style.transform = "translate(0, -50%) scale(1)";
        (_a = document.querySelector(".carousel-resize")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (e) {
            if (_this.isFullscreen) {
                _this.carousel.style.width = "85vw";
                _this.carousel.style.height = "80vh";
                e.currentTarget.innerHTML = "&#8690;";
                _this.isFullscreen = false;
            }
            else {
                _this.carousel.style.width = "100vw";
                _this.carousel.style.height = "100%";
                e.currentTarget.innerHTML = "&#8689;";
                _this.isFullscreen = true;
            }
        });
        (_b = document.querySelector(".carousel-close")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { return _this.hide(); });
        if (set.items.length > 0) {
            this.currentIndex = set.startIndex;
            this.setItem(set.items.length - 1);
        }
        Object.entries(set.style).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            _this.carousel.style.setProperty("--".concat(key), value);
        });
    };
    Carousel.prototype.setItem = function (oldIndex) {
        var _this = this;
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        var currentSlide = document.querySelector(".carousel-item".concat(oldIndex));
        var newSlide = document.querySelector(".carousel-item".concat(this.currentIndex));
        var title = document.querySelector(".carousel-title");
        var progress = document.querySelector(".carousel-page");
        clearTimeout(this.titleTimeout);
        newSlide.style.transition = "none";
        newSlide.style.opacity = '0';
        if (this.currentIndex - oldIndex > 0)
            newSlide.style.transform = "translate(100%)";
        else
            newSlide.style.transform = "translate(-100%)";
        newSlide.style.display = "block";
        newSlide.style.transition = "transform 1s var(--easing), opacity 1s var(--easing)";
        setTimeout(function () {
            newSlide.style.transform = "translate(0)";
            newSlide.style.opacity = '1';
        }, 25);
        if (this.currentIndex - oldIndex < 0 && currentSlide !== newSlide)
            currentSlide.style.transform = "translate(+100%)";
        else
            currentSlide.style.transform = "translate(-100%)";
        var currentItem = this.currentItemSet.items[this.currentIndex];
        if (currentItem.isPath)
            title.innerHTML = currentItem.name.replace(/^.*[\\\/]/, '');
        else
            title.innerHTML = currentItem.name;
        title.style.top = "0";
        this.titleTimeout = setTimeout(function () {
            title.style.top = "-47px";
        }, 4500);
        progress.innerHTML = "".concat(this.currentIndex + 1, "/").concat(this.currentItemSet.items.length);
        if (currentSlide !== newSlide)
            setTimeout(function () {
                currentSlide.style.display = "none";
                _this.isSwitching = false;
            }, 1000);
    };
    Carousel.prototype.toNextItem = function () {
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        if (this.isSwitching)
            return;
        this.isSwitching = true;
        var oldIndex = this.currentIndex;
        this.currentIndex++;
        if (this.currentIndex >= this.currentItemSet.items.length)
            this.currentIndex = 0;
        this.setItem(oldIndex);
    };
    Carousel.prototype.toPreviousItem = function () {
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        if (this.isSwitching)
            return;
        this.isSwitching = true;
        var oldIndex = this.currentIndex;
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = this.currentItemSet.items.length - 1;
        this.setItem(oldIndex);
    };
    Carousel.prototype.show = function () {
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        var target = this.carousel;
        target.style.display = "block";
        setTimeout(function () {
            target.style.opacity = "1";
            target.style.transform = "translate(-50%, -50%) scale(1.0)";
        }, 500);
    };
    Carousel.prototype.hide = function () {
        if (!this.currentItemSet) {
            throw new Error("No current item set!");
            return;
        }
        var target = this.carousel;
        target.style.transform = "translate(-50%, -50%) scale(0.9)";
        target.style.opacity = "0";
        setTimeout(function () {
            target.style.display = "none";
        }, 500);
    };
    Carousel.prototype.getItemSet = function (name) {
        var itemSet = this.itemSets.find(function (x) { return x.name === name; });
        if (!itemSet)
            throw new Error("Carousel item set with name ".concat(name, " not found!"));
        return itemSet;
    };
    return Carousel;
}());
exports.Carousel = Carousel;
var CarouselItemSet = (function () {
    function CarouselItemSet(params) {
        var _a;
        this.startIndex = 0;
        this.name = params.name;
        this.items = params.items;
        this.style = (_a = params.style) !== null && _a !== void 0 ? _a : new CarouselStyle({
            highlight: "#ff0000",
            background: "#000000",
            foreground: "#ffffff"
        });
        this.triggerSelector = params.triggerSelector;
        this.startIndex = params.startIndex;
    }
    return CarouselItemSet;
}());
exports.CarouselItemSet = CarouselItemSet;
var CarouselItem = (function () {
    function CarouselItem(params) {
        this.name = params.name;
        this.tagName = params.tagName;
        this.src = params.src;
        this.isPath = params.isPath;
    }
    return CarouselItem;
}());
exports.CarouselItem = CarouselItem;
var CarouselStyle = (function () {
    function CarouselStyle(params) {
        var _a, _b, _c, _d;
        this.highlight = (_a = params.highlight) !== null && _a !== void 0 ? _a : "azure";
        this.foreground = (_b = params.foreground) !== null && _b !== void 0 ? _b : "#ffffff";
        this.background = (_c = params.background) !== null && _c !== void 0 ? _c : "#000000";
        this.easing = (_d = params.easing) !== null && _d !== void 0 ? _d : "cubic-bezier(0.61,-0.07, 0.31, 1.06)";
    }
    return CarouselStyle;
}());
exports.CarouselStyle = CarouselStyle;
//# sourceMappingURL=index.js.map