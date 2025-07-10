document.addEventListener('DOMContentLoaded', function () {
	// Check viewport width and prevent horizontal scroll
	preventHorizontalScroll();

	// Setup mobile menu
	setupMobileMenu();

	// Initialize animations
	initAnimations();

	// Setup testimonial slider
	setupTestimonialSlider();

	// Check for cookie consent
	checkCookieConsent();

	// Progress circle animation
	initProgressCircles();

	// Обработка клика по кнопкам тренировок
	setupTrainingButtons();

	// Установка актуальных дат
	updateDates();

	// Настройка обработчиков форм
	setupForms();

	// Handle window resize events
	window.addEventListener('resize', function () {
		preventHorizontalScroll();
	});
});

// Prevent horizontal scrolling
function preventHorizontalScroll() {
	// Force viewport width and prevent overflow
	document.documentElement.style.width = '100%';
	document.body.style.width = '100%';
	document.documentElement.style.overflowX = 'hidden';
	document.body.style.overflowX = 'hidden';

	// Check for elements that might be causing horizontal scrolling
	const allElements = document.querySelectorAll('*');
	const windowWidth = window.innerWidth;

	allElements.forEach(element => {
		const rect = element.getBoundingClientRect();
		if (rect.width > windowWidth) {
			// Adjust width for elements that are too wide
			element.style.maxWidth = '100%';
			element.style.overflowX = 'hidden';
		}
	});
}

// Mobile menu functionality
function setupMobileMenu() {
	const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
	const mainNav = document.querySelector('.main-nav');

	if (mobileMenuToggle && mainNav) {
		mobileMenuToggle.addEventListener('click', function () {
			mobileMenuToggle.classList.toggle('active');
			mainNav.classList.toggle('active');
		});

		// Close menu when clicking on a link
		const navLinks = document.querySelectorAll('.nav-list a');
		navLinks.forEach(link => {
			link.addEventListener('click', function () {
				mobileMenuToggle.classList.remove('active');
				mainNav.classList.remove('active');
			});
		});

		// Close menu when clicking outside
		document.addEventListener('click', function (event) {
			if (!event.target.closest('.main-nav') && !event.target.closest('.mobile-menu-toggle')) {
				if (mainNav.classList.contains('active')) {
					mobileMenuToggle.classList.remove('active');
					mainNav.classList.remove('active');
				}
			}
		});
	}
}

// Initialize animations
function initAnimations() {
	// Animate elements when they come into view
	const animateOnScroll = function () {
		const elements = document.querySelectorAll('.benefit-card, .training-card, .info-item');

		elements.forEach(element => {
			const position = element.getBoundingClientRect();

			// Check if element is in viewport
			if (position.top < window.innerHeight - 100) {
				element.style.opacity = '1';
				element.style.transform = 'translateY(0)';
			}
		});
	};

	// Set initial state
	const elementsToAnimate = document.querySelectorAll('.benefit-card, .training-card, .info-item');
	elementsToAnimate.forEach(element => {
		element.style.opacity = '0';
		element.style.transform = 'translateY(20px)';
		element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
	});

	// Run on scroll
	window.addEventListener('scroll', animateOnScroll);

	// Run once on page load
	animateOnScroll();
}

// Testimonial slider functionality
function setupTestimonialSlider() {
	const slides = document.querySelectorAll('.testimonial-slide');
	const prevButton = document.querySelector('.prev-slide');
	const nextButton = document.querySelector('.next-slide');

	if (slides.length > 0 && prevButton && nextButton) {
		let currentSlide = 0;
		let isAnimating = false;

		// Hide all slides except the first one
		for (let i = 1; i < slides.length; i++) {
			slides[i].style.display = 'none';
		}

		// Next slide function
		function nextSlide() {
			if (isAnimating) return;
			isAnimating = true;

			slides[currentSlide].style.display = 'none';
			currentSlide = (currentSlide + 1) % slides.length;
			slides[currentSlide].style.display = 'block';
			slides[currentSlide].style.animation = 'fadeIn 0.5s';

			setTimeout(() => {
				isAnimating = false;
			}, 600);
		}

		// Previous slide function
		function prevSlide() {
			if (isAnimating) return;
			isAnimating = true;

			slides[currentSlide].style.display = 'none';
			currentSlide = (currentSlide - 1 + slides.length) % slides.length;
			slides[currentSlide].style.display = 'block';
			slides[currentSlide].style.animation = 'fadeIn 0.5s';

			setTimeout(() => {
				isAnimating = false;
			}, 600);
		}

		// Touch events for mobile swiping
		let touchStartX = 0;
		let touchEndX = 0;
		const slider = document.querySelector('.testimonial-slider');

		if (slider) {
			slider.addEventListener('touchstart', e => {
				touchStartX = e.changedTouches[0].screenX;
			}, { passive: true });

			slider.addEventListener('touchend', e => {
				touchEndX = e.changedTouches[0].screenX;
				handleSwipe();
			}, { passive: true });

			function handleSwipe() {
				const SWIPE_THRESHOLD = 50;
				if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
					nextSlide(); // Swipe left, go next
				} else if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
					prevSlide(); // Swipe right, go previous
				}
			}
		}

		// Event listeners for buttons
		nextButton.addEventListener('click', nextSlide);
		prevButton.addEventListener('click', prevSlide);

		// Stop auto slide on button click
		let autoSlideInterval = setInterval(nextSlide, 5000);

		nextButton.addEventListener('click', () => {
			clearInterval(autoSlideInterval);
			autoSlideInterval = setInterval(nextSlide, 5000);
		});

		prevButton.addEventListener('click', () => {
			clearInterval(autoSlideInterval);
			autoSlideInterval = setInterval(nextSlide, 5000);
		});
	}
}

// Cookie consent functionality
function checkCookieConsent() {
	const cookieBanner = document.getElementById('cookie-banner');
	const acceptButton = document.getElementById('accept-cookies');

	if (cookieBanner && acceptButton) {
		// Check if user has already accepted cookies
		if (!getCookie('cookieConsent')) {
			// Show the banner with animation
			setTimeout(function () {
				cookieBanner.classList.remove('hidden');
			}, 1000);

			// Event listener for accept button
			acceptButton.addEventListener('click', function () {
				setCookie('cookieConsent', 'accepted', 30); // Store consent for 30 days
				cookieBanner.classList.add('hidden');
			});
		}
	}
}

// Progress circle animation
function initProgressCircles() {
	const progressCircles = document.querySelectorAll('.progress-circle');

	progressCircles.forEach(circle => {
		const progressValue = circle.getAttribute('data-progress');
		const radius = 15;
		const circumference = 2 * Math.PI * radius;

		// Create SVG for the progress circle
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '60');
		svg.setAttribute('height', '60');
		svg.setAttribute('viewBox', '0 0 40 40');

		// Create the background circle
		const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		bgCircle.setAttribute('cx', '20');
		bgCircle.setAttribute('cy', '20');
		bgCircle.setAttribute('r', radius);
		bgCircle.setAttribute('fill', 'none');
		bgCircle.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
		bgCircle.setAttribute('stroke-width', '3');

		// Create the progress circle
		const progressCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		progressCircleElement.setAttribute('cx', '20');
		progressCircleElement.setAttribute('cy', '20');
		progressCircleElement.setAttribute('r', radius);
		progressCircleElement.setAttribute('fill', 'none');
		progressCircleElement.setAttribute('stroke', '#FF5470');
		progressCircleElement.setAttribute('stroke-width', '3');
		progressCircleElement.setAttribute('stroke-dasharray', circumference);
		progressCircleElement.setAttribute('stroke-dashoffset', circumference);
		progressCircleElement.setAttribute('transform', 'rotate(-90, 20, 20)');

		// Create text element
		const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute('x', '50%');
		text.setAttribute('y', '50%');
		text.setAttribute('fill', '#FAFAFA');
		text.setAttribute('font-size', '10');
		text.setAttribute('font-weight', 'bold');
		text.setAttribute('text-anchor', 'middle');
		text.setAttribute('dominant-baseline', 'middle');
		text.textContent = progressValue + '%';

		// Append elements to SVG
		svg.appendChild(bgCircle);
		svg.appendChild(progressCircleElement);
		svg.appendChild(text);

		// Clear and append the SVG to the container
		circle.innerHTML = '';
		circle.appendChild(svg);

		// Animate the progress
		setTimeout(() => {
			const offset = circumference - (progressValue / 100) * circumference;
			progressCircleElement.style.transition = 'stroke-dashoffset 1s ease-out';
			progressCircleElement.style.strokeDashoffset = offset;
		}, 500);
	});
}

// Обработка клика по кнопкам тренировок
function setupTrainingButtons() {
	const trainingButtons = document.querySelectorAll('.training-btn');
	if (trainingButtons.length > 0) {
		trainingButtons.forEach(button => {
			button.addEventListener('click', function (e) {
				e.preventDefault();

				// Получаем тип тренировки из атрибута data-training
				const trainingType = this.getAttribute('data-training');

				// Прокручиваем страницу к форме заказа
				const contactSection = document.getElementById('kontakt');
				contactSection.scrollIntoView({ behavior: 'smooth' });

				// Устанавливаем выбранную тренировку в селекте
				setTimeout(() => {
					const trainingSelect = document.getElementById('training-type');
					if (trainingSelect) {
						// Находим опцию с соответствующим значением
						for (let i = 0; i < trainingSelect.options.length; i++) {
							if (trainingSelect.options[i].value === trainingType) {
								trainingSelect.selectedIndex = i;
								break;
							}
						}
					}
				}, 800); // Небольшая задержка, чтобы прокрутка успела завершиться
			});
		});
	}
}

// Функция для обновления всех дат на сайте
function updateDates() {
	// Обновление года в футере
	const currentYearElements = document.querySelectorAll('#current-year');
	const currentYear = new Date().getFullYear();

	currentYearElements.forEach(element => {
		element.textContent = currentYear;
	});

	// Обновление полной даты в правовых документах
	const currentDateElements = document.querySelectorAll('.current-date');
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const formattedDate = new Date().toLocaleDateString('de-DE', options);

	currentDateElements.forEach(element => {
		element.textContent = formattedDate;
	});

	// Обработка тегов в sitemap.xml через серверный скрипт
	// Это будет обрабатываться на сервере при запросе sitemap.xml
}

// Настройка обработчиков форм
function setupForms() {
	// Probetraining form handler
	const probetrainingForm = document.getElementById('probetraining-form');
	if (probetrainingForm) {
		probetrainingForm.addEventListener('submit', function (e) {
			// Formspree будет обрабатывать отправку формы
			// Добавляем только редирект на страницу благодарности после успешной отправки
			const formAction = probetrainingForm.getAttribute('action');
			if (formAction.includes('formspree.io')) {
				// Добавляем скрытое поле для редиректа
				const redirectInput = document.createElement('input');
				redirectInput.type = 'hidden';
				redirectInput.name = '_next';
				redirectInput.value = window.location.origin + '/danke.html';
				probetrainingForm.appendChild(redirectInput);
			}
		});
	}

	// Newsletter form handler
	const newsletterForm = document.getElementById('newsletter-form');
	if (newsletterForm) {
		newsletterForm.addEventListener('submit', function (e) {
			// Formspree будет обрабатывать отправку формы
			// Для формы подписки на рассылку не делаем редирект
			const formAction = newsletterForm.getAttribute('action');
			if (formAction.includes('formspree.io')) {
				// Добавляем скрытое поле для настройки ответа
				const subjectInput = document.createElement('input');
				subjectInput.type = 'hidden';
				subjectInput.name = '_subject';
				subjectInput.value = 'Neue Newsletter-Anmeldung';
				newsletterForm.appendChild(subjectInput);
			}
		});
	}
}

// Cookie functions
function setCookie(name, value, days) {
	let expires = '';
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function getCookie(name) {
	const nameEQ = name + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			return decodeURIComponent(c.substring(nameEQ.length, c.length));
		}
	}
	return null;
} 