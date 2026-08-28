const projectsGrid = document.querySelector(".projects-grid");

if (projectsGrid) {
	const projectCards = [...projectsGrid.children];

	projectCards.forEach((projectCard) => {
		const duplicatedCard = projectCard.cloneNode(true);

		duplicatedCard.setAttribute("aria-hidden", "true");
		projectsGrid.appendChild(duplicatedCard);
	});
}

const setupCopyCard = (selector, feedbackMessage, ariaLabel) => {
	const card = document.querySelector(selector);

	if (!card) {
		return;
	}

	const cardText = card.querySelector("p");
	const originalText = cardText?.textContent.trim();
	let feedbackTimeout;

	card.addEventListener("click", async (event) => {
		event.preventDefault();

		if (!originalText || !cardText) {
			return;
		}

		let copied = false;

		try {
			await navigator.clipboard.writeText(originalText);
			copied = true;
		} catch {
			const temporaryInput = document.createElement("textarea");
			temporaryInput.value = originalText;
			temporaryInput.style.position = "fixed";
			temporaryInput.style.opacity = "0";
			document.body.appendChild(temporaryInput);
			temporaryInput.select();
			copied = document.execCommand("copy");
			temporaryInput.remove();
		}

		if (!copied) {
			return;
		}

		cardText.textContent = feedbackMessage;
		card.setAttribute("aria-label", ariaLabel);
		clearTimeout(feedbackTimeout);
		feedbackTimeout = setTimeout(() => {
			cardText.textContent = originalText;
			card.removeAttribute("aria-label");
		}, 1800);
	});
};

setupCopyCard('a[href^="tel:"]', "Número copiado!", "Número de celular copiado");
setupCopyCard('a[href^="mailto:"]', "E-mail copiado!", "E-mail copiado");