/**
 * Табуляция
 */
function tabHandler(tab) {
	const tabLinks = tab.querySelector('.tab__links');
	const tabItem = tab.querySelectorAll('.tab__item');
	const tabContent = tab.querySelectorAll('.tab__content');
	tabLinks.onclick = function (event) {
		event.preventDefault();
		let item = event.target.closest('.tab__item');
		if (!item) return;
		tabItem.forEach((el) => el.classList.remove('tab__item--is-active'));
		tabContent.forEach((el) => el.classList.remove('tab__content--is-show'));
		item.classList.add('tab__item--is-active');
		let indexContent = event.target.dataset.showContent;
		tabContent[indexContent].classList.add('tab__content--is-show');
	};
}

function tab() {
	const tabs = document.querySelectorAll('.tab');
	if(tabs.length != 0) {
		tabs.forEach(tabHandler);
	}
}

export default tab;