const projectsGrid = document.querySelector(".projects-grid");

if (projectsGrid) {
	const projectCards = [...projectsGrid.children];

	projectCards.forEach((projectCard) => {
		const duplicatedCard = projectCard.cloneNode(true);

		duplicatedCard.setAttribute("aria-hidden", "true");
		projectsGrid.appendChild(duplicatedCard);
	});
}