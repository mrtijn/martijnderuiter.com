import gsap from "gsap";

export class Slider {
    ui: any;
    config: any;
    state: any;
    store: any;
    tl: GSAPStatic.Timeline = gsap.timeline();
    animationFrame: any;
    constructor(el: HTMLElement, config = {}) {
        // Default config
        this.config = {
            duration: 0,
            dragSpeed: 1.75,
            ...config
        };

        // User interface
        this.ui = {
            slider: el,
            slides: el.querySelectorAll(".slider__slide"),
            next_button: document.querySelector(".slider__next"),
            prev_button: document.querySelector(".slider__prev")
        };

        // Slider state
        this.state = {
            current: 0,
            min: 0,
            max: 0,
            mouse: {
                isPressed: false,
                position: {
                    start: 0,
                    current: 0,
                    end: 0
                }
            }
        };

        // Handy values
        this.store = {
            ww: window.outerWidth,
            wh: window.outerHeight
        };

        this.animationFrame = null;
        // Controls

        // Initialize
        this.init();
    }

    init() {
        this.setup();
        this.listeners();

        // @ts-ignore
        // return gsap.utils.pipe(this.setup(), this.listeners());
    }

    setup() {
        this.setBoundaries();
        this.tl = gsap.timeline({
            paused: true,
            defaults: {
                duration: this.config.duration,
                ease: "expo.inOut"
            }
        });

        return "test";
    }

    listeners() {
        // this.ui.prev_button.addEventListener("click", () => this.move("prev"));
        // this.ui.next_button.addEventListener("click", () => this.move("next"));
        window.addEventListener("mousemove", e => this.trackMouseMovement(e));
        window.addEventListener("mousedown", e => {
            this.state.mouse.isPressed = true;
            this.state.mouse.position.start = e.clientX;
        });
        window.addEventListener("mouseup", e => {
            this.state.mouse.isPressed = false;
            this.state.mouse.position.end = e.clientX;
            // if (this.state.mouse.direction === "left") this.move("next");
            // if (this.state.mouse.direction === "right") this.move("prev");
        });
    }

    trackMouseMovement(e: MouseEvent) {
        if (!this.state.mouse.isPressed) return;

        const { x, y } = { x: e.pageX, y: e.pageY };
        console.log(
            this.state.mouse.position.start,
            this.state.mouse.position.current,
            this.state.mouse.position.end
        );
        this.state.mouse.position.current =
            this.state.mouse.position.end +
            (x - this.state.mouse.position.start) * this.config.dragSpeed;

        // console.log(this.state.mouse.position.current);
        this.slide(this.state.mouse.position.current);
    }

    setBoundaries() {
        this.state.min = 0;
        this.state.max = -1 * this.ui.slider.clientWidth + this.store.ww;
    }

    animateSlider(distance: number) {
        if (!this.state.mouse.isPressed) return;
        // console.log(distance);
        gsap.to(this.ui.slider, 0.2, { x: distance });
    }

    slide(distance: number) {
        distance = Math.floor(distance * 100) / 100;
        // console.log(distance);
        // console.log(this.ui.slider);
        this.animateSlider(distance);

        this.animationFrame = requestAnimationFrame(
            this.animateSlider.bind(this)
        );
        // if (this.tl.isActive()) return;
    }
}
