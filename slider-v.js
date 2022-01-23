/**
 * Вертикальный слайдер
 */
class VerticalSlider {
	constructor ( config ) {
		this.slider = config.slider ?? false;
		this.auto = config.autoplay ?? false;
		this.interval = config.interval ?? 5000;
		this.stopOnHover = config.stopOnHover ?? true;

		// если есть элемент
		if ( this.slider ) {

			this.leftMask = this.slider.querySelector ( ".slider-v__left .slider__mask" );
			this.rightMask = this.slider.querySelector ( ".slider-v__right .slider__mask" );
			this.prev = this.slider.querySelector ( ".slider-v__prev" );
			this.next = this.slider.querySelector ( ".slider-v__next" );
			this.leftSlides = [ ...this.leftMask.querySelectorAll ( ".slider-v__left .slider-v__slide" ) ];
			this.rightSlides = [ ...this.rightMask.querySelectorAll ( ".slider-v__right .slider-v__slide" ) ];
			this.length = this.leftSlides.length - 1;

			this.init ();
		}

	}

	// инициализация слайдера
	init () {
		// задаем индекс для всех слайдов
		this.leftSlides.forEach ( ( item, index ) => {
			item.dataset.index = index;
		} );

		// задаем индекс для всех слайдов
		this.rightSlides.forEach ( ( item, index ) => {
			item.dataset.index = index;
		} );

		this.prev.addEventListener ( "click", () => {
			this.prevLeft ();
			this.prevRight ();
		} );

		this.next.addEventListener ( "click", () => {
			this.nextLeft ();
			this.nextRight ();
		} );

		// если включена функция авто проигрывания
		if ( this.auto ) {
			this.autoPlay ( this.prev );
		}
	}

	prevLeft () {
		const active = this.getActive ( this.leftSlides );
		const indexActive = this.getIndexActive ( this.leftSlides );
		let prev;

		if ( +indexActive > 0 ) {
			prev = this.getPrev ( this.leftSlides );
		} else {
			prev = this.getLast ( this.leftSlides );
		}

		active.classList.remove ( "active" );
		active.classList.add ( "next" );

		prev.classList.remove ( "prev" );
		prev.classList.remove ( "next" );
		prev.classList.add ( "prevToActive" );
		prev.classList.add ( "active" );

		setTimeout ( () => {
			this.removeNextCls ( active );
			this.removePrevCls ( active );
			this.removePrevCls ( prev );
			this.removePrevCls ( prev );
		}, 300 );
	}

	nextLeft () {
		const active = this.getActive ( this.leftSlides );
		const indexActive = this.getIndexActive ( this.leftSlides );
		let next;

		if ( +indexActive < this.length ) {
			next = this.getNext ( this.leftSlides );
		} else {
			next = this.getFirst ( this.leftSlides );
		}

		active.classList.remove ( "active" );
		active.classList.add ( "prev" );

		next.classList.remove ( "next" );
		next.classList.remove ( "prev" );
		next.classList.add ( "nextToActive" );
		next.classList.add ( "active" );

		setTimeout ( () => {
			this.removeNextCls ( active );
			this.removePrevCls ( active );
			this.removeNextCls ( next );
			this.removePrevCls ( next );
		}, 300 );
	}

	prevRight () {
		const active = this.getActive ( this.rightSlides );
		const indexActive = this.getIndexActive ( this.rightSlides );
		let next;

		if ( +indexActive < this.length ) {
			next = this.getNext ( this.rightSlides );
		} else {
			next = this.getFirst ( this.rightSlides );
		}

		active.classList.remove ( "active" );
		active.classList.add ( "prev" );

		next.classList.remove ( "next" );
		next.classList.remove ( "prev" );
		next.classList.add ( "nextToActive" );
		next.classList.add ( "active" );

		setTimeout ( () => {
			this.removeNextCls ( active );
			this.removePrevCls ( active );
			this.removeNextCls ( next );
			this.removePrevCls ( next );
		}, 300 );
	}

	nextRight () {
		const active = this.getActive ( this.rightSlides );
		const indexActive = this.getIndexActive ( this.rightSlides );
		let prev;

		if ( +indexActive > 0 ) {
			prev = this.getPrev ( this.rightSlides );
		} else {
			prev = this.getLast ( this.rightSlides );
		}

		active.classList.remove ( "active" );
		active.classList.add ( "next" );

		prev.classList.remove ( "prev" );
		prev.classList.remove ( "next" );
		prev.classList.add ( "prevToActive" );
		prev.classList.add ( "active" );

		setTimeout ( () => {
			this.removeNextCls ( active );
			this.removePrevCls ( active );
			this.removePrevCls ( prev );
			this.removePrevCls ( prev );
		}, 300 );
	}

	// вернет текущий активный слайд
	getActive ( slides ) {
		return slides.find ( ( item ) => {
			return item.classList.contains ( "active" );
		} );
	}

// вернет индекс активного слайда
	getIndexActive ( slides ) {
		return this.getActive ( slides ).dataset.index;
	}

// вернет следующий элемет или 0
	getNext ( slides ) {
		return slides[+this.getIndexActive ( slides ) + 1];
	}

// вернет пердыдущий элемет или 0
	getPrev ( slides ) {
		return slides[+this.getIndexActive ( slides ) - 1];
	}

	removeNextCls ( item ) {
		if ( item ) {
			item.classList.remove ( "nextToActive" );
		}
	}

	removePrevCls ( item ) {
		if ( item ) {
			item.classList.remove ( "prevToActive" );
		}
	}

	getLast ( slides ) {
		return slides[this.length];
	}

	getFirst ( slides ) {
		return slides[0];
	}


	// автопролистывание
	autoPlay ( el ) {
		// новое событие клик
		const event = new Event ( 'click' );
		const timer = new Timer ( function () {
			el.dispatchEvent ( event );
		}, this.interval );

		timer.start ();

		// если установлен параметр this.stopOnHover=true
		// то включить действия при наведении мыши
		if ( this.stopOnHover ) {
			// возобновление события автопролистывания если мышка над слайдером
			this.slider.addEventListener ( 'mouseenter', () => {
				timer.stop ();
			}, false );

			// возобновление события автопролистывания если мышка не над слайдером
			this.slider.addEventListener ( 'mouseleave', () => {
				timer.start ();
			} );
		}
	}
}

/**
 * Задает старт и стоп и сброс таймера через setInterval
 */
class Timer {
	constructor ( fn, t ) {
		this.fn = fn;
		this.t = t;
		this.timerObj = setInterval ( this.fn, this.t );
	}

	stop () {
		if ( this.timerObj ) {
			clearInterval ( this.timerObj );
			this.timerObj = null;
		}
		return this;
	}

	start () {
		if ( !this.timerObj ) {
			this.stop ();
			this.timerObj = setInterval ( this.fn, this.t );
		}
		return this;
	}

	reset ( newT = this.t ) {
		this.t = newT;
		return this.stop ().start ();
	}
}


const config = {
	slider: document.querySelector ( '.slider-v' ),
	autoplay: true, // авто проигрывание
	interval: 5000,
	stopOnHover: true,
}
new VerticalSlider ( config );


