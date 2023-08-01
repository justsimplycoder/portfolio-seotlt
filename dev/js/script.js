import menu from './modules/menu.js'
import tab from './modules/tab.js'
import tippy from 'tippy.js';

menu();
tab();

tippy('.tooltip-info', {
	animation: 'shift-toward-extreme'
});

(function() {
	// Модуль .alert
	function alertHandler(close) {
		close.onclick = function (event) {
			let alertBlock = event.target.closest('.alert');
			if(!alertBlock) return;
			alertBlock.classList.add('is-hide');
			setTimeout(function() {
				alertBlock.remove();
			}, 400);
		};
	}
	const alertClose = document.querySelectorAll('.alert__close');
	if(alertClose.length != 0) {
		alertClose.forEach(alertHandler);
	}

	function numberEl(index) {
		if(index < 10) return '0' + (index + 1);
		return index + 1;
	}

	// Слайдер
	const swiper = new Swiper('.swiper', {
		// Optional parameters
		direction: 'horizontal',
		loop: true,

		// If we need pagination
		pagination: {
			el: '.review__pagination',
			clickable: true,
			renderBullet: function (index, className) {
				return '<span class="' + className + '">' + numberEl(index) + '</span>';
			},
		},

		// Navigation arrows
		navigation: {
			nextEl: '.review__btn-next',
			prevEl: '.review__btn-prev',
		},
	});
})();
