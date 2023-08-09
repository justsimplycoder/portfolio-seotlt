import menu from './modules/menu.js'

menu();

function numberEl(index) {
	if(index < 10) return '0' + (index + 1);
	return index + 1;
}

// Слайдер
const swiper1 = new Swiper('#swiper-review', {
	direction: 'horizontal',
	loop: true,
	pagination: {
		el: '.review__pagination',
		clickable: true,
		renderBullet: function (index, className) {
			return '<span class="' + className + '">' + numberEl(index) + '</span>';
		},
	},
	navigation: {
		nextEl: '.review__btn-next',
		prevEl: '.review__btn-prev',
	},
	// effect: 'fade'
});

const swiper2 = new Swiper('#swiper-services', {
	direction: 'horizontal',
	// loop: true,
	pagination: {
		el: '.services__pagination',
		clickable: true,
		type: 'custom',
		renderCustom: function (swiper2, current, total) {
			return numberEl(current - 1) + ' <span>/ ' + numberEl(total - 1) + '</span>';
		}
	},
	navigation: {
		nextEl: '.services__btn-next',
		prevEl: '.services__btn-prev',
	},
});

const feedbackFormInputs = document.querySelectorAll('.feedback__form .form__input');
feedbackFormInputs.forEach(input => {
	input.addEventListener('blur', event => {
		let value = event.target.value;
		if(value !== '') event.target.classList.add('form__input--focus');
		else event.target.classList.remove('form__input--focus');
	});
});

IMask(
	document.getElementById('form-phone'),
	{
		mask: '+{7}(000) 000-00-00',
		lazy: false
	}
)