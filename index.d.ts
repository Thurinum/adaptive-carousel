export interface CarouselParams {
    selector: string;
    itemSets: CarouselItemSet[];
}
export declare class Carousel {
    carousel: HTMLElement;
    itemSets: CarouselItemSet[];
    private titleTimeout?;
    private isFullscreen;
    private isSwitching;
    private currentIndex;
    private currentItemSet?;
    constructor(params: CarouselParams);
    addItemSet(set: CarouselItemSet): void;
    setItemSet(itemSetName: string): void;
    setItem(oldIndex: number): void;
    toNextItem(): void;
    toPreviousItem(): void;
    show(): void;
    hide(): void;
    private getItemSet;
}
export interface CarouselItemSetParams {
    name: string;
    items: CarouselItem[];
    style?: CarouselStyle;
    triggerSelector?: string;
    startIndex?: number;
}
export declare class CarouselItemSet {
    name: string;
    items: CarouselItem[];
    style: CarouselStyle;
    triggerSelector?: string;
    startIndex?: number;
    constructor(params: CarouselItemSetParams);
}
export interface CarouselItemParams {
    name: string;
    src: string;
    isPath: boolean;
    tagName: string;
}
export declare class CarouselItem {
    name: string;
    src: string;
    isPath: boolean;
    tagName: string;
    constructor(params: CarouselItemParams);
}
export interface CarouselStyleParams {
    highlight?: string;
    foreground?: string;
    background?: string;
    easing?: string;
}
export declare class CarouselStyle {
    highlight: string;
    foreground: string;
    background: string;
    easing: string;
    constructor(params: CarouselStyleParams);
}
