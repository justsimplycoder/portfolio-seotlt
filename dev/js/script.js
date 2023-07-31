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

	// Слайдер
	const swiper = new Swiper('.swiper', {
		// Optional parameters
		direction: 'horizontal',
		loop: true,

		// If we need pagination
		pagination: {
			el: '.swiper-pagination',
		},

		// Navigation arrows
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},

		// And if we need scrollbar
		// scrollbar: {
		//   el: '.swiper-scrollbar',
		// },
	});
})();
