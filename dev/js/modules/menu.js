/**
 * Показ меню на мобильных устройствах
 * Для работы нужны модули .hamburger, .menu
 */
function menu() {
	const hamburger = document.querySelector('.hamburger');
	const menu = document.querySelector('.menu__lists');
	hamburger.addEventListener('click', function (event) {
		event.preventDefault();
		hamburger.classList.toggle('hamburger--is-active');
		menu.classList.toggle('menu__lists--is-show');
		if(hamburger.classList.contains('hamburger--is-active')) {
			menu.classList.add('menu__lists--is-show');
			menu.classList.remove('menu__lists--is-hide');
		} else {
			menu.classList.remove('menu__lists--is-show');
			menu.classList.add('menu__lists--is-hide');
		}
	});
}

export default menu;