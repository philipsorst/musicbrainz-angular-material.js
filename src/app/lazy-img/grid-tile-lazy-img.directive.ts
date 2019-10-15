import {ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({selector: '[mbGridTileLazyImg]'})
export class GridTileLazyImgDirective implements OnChanges
{
    @Input('mbGridTileLazyImg')
    public src: string;

    @HostBinding('src')
    public hostSrc = 'assets/placeholder.gif';

    @HostBinding('style.object-fit')
    public hostStyleObjectFit = 'contain';

    @HostBinding('style.width.px')
    public hostStyleWidthPx: number;

    @HostBinding('style.height.px')
    public hostStyleHeightPx: number;

    @HostBinding('style.opacity')
    public hostStyleOpacity = 0;

    @Input()
    public offset = 1000;

    @Input()
    public objectFit = 'cover';

    private displayed = false;

    constructor(private element: ElementRef, private cd: ChangeDetectorRef)
    {
    }

    public recheck()
    {
        this.displayed = false;
        this.check();
    }

    public check()
    {
        if (
            this.displayed
            || this.isHidden(this.element.nativeElement)
            || !this.isInsideViewport(this.element.nativeElement, this.offset)
        ) {
            return;
        }

        this.displayed = true;
        const dimension = this.getDimension();

        this.hostStyleWidthPx = dimension.width;
        this.hostStyleHeightPx = dimension.height;
        this.hostSrc = this.src;
        this.hostStyleOpacity = 1;
        this.cd.detectChanges();
    }

    /**
     * @override
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        this.displayed = false;
        this.hostStyleOpacity = 0;
        if (this.element.nativeElement.parentElement.offsetWidth > 0) {
            this.check();
        }
    }

    private isInsideViewport(nativeElement, offset: number): boolean
    {
        // console.log('isInsideViewport');
        const ownerDocument = nativeElement.ownerDocument;
        const documentTop = window.pageYOffset || ownerDocument.body.scrollTop;
        const documentLeft = window.pageXOffset || ownerDocument.body.scrollLeft;

        const documentWidth = window.innerWidth || (ownerDocument.documentElement.clientWidth || document.body.clientWidth);
        const documentHeight = window.innerHeight || (ownerDocument.documentElement.clientHeight || document.body.clientHeight);
        const topOffset = nativeElement.getBoundingClientRect().top + documentTop - ownerDocument.documentElement.clientTop;
        const leftOffset = nativeElement.getBoundingClientRect().left + documentLeft - ownerDocument.documentElement.clientLeft;

        // console.log(documentWidth, documentHeight, topOffset, leftOffset);

        const isBelowViewport = documentHeight + documentTop <= topOffset - offset;
        const isAtRightOfViewport = documentWidth + window.pageXOffset <= leftOffset - offset;
        const isAboveViewport = documentTop >= topOffset + offset + nativeElement.offsetHeight;
        const isAtLeftOfViewport = documentLeft >= leftOffset + offset + nativeElement.offsetWidth;

        return !isBelowViewport && !isAboveViewport && !isAtRightOfViewport && !isAtLeftOfViewport;
    }

    private getDimension(): { width: number, height: number }
    {
        return {
            width: this.element.nativeElement.parentElement.offsetWidth,
            height: this.element.nativeElement.parentElement.offsetHeight,
        };
    }

    private isHidden(nativeElement)
    {
        // console.log('isHidden');
        return window.getComputedStyle(nativeElement).display === 'none';
    }
}
