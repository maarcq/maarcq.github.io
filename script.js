const projectsGrid = document.querySelector(".projects-grid");

if (projectsGrid) {
	const projectCards = [...projectsGrid.children];

	projectCards.forEach((projectCard) => {
		const duplicatedCard = projectCard.cloneNode(true);

		duplicatedCard.setAttribute("aria-hidden", "true");
		projectsGrid.appendChild(duplicatedCard);
	});
}

const tabLinks = document.querySelectorAll(".nav-link");
const tabPanels = document.querySelectorAll(".tab-panel");
const projectModal = document.getElementById("projects-modal");
const projectOptions = document.querySelectorAll(".project-option");
const projectDetail = document.getElementById("project-detail");
const projectNav = document.querySelector(".project-nav");

const activateTab = (tabName) => {
	const validTabs = ["home", "sobre", "project-detail"];
	const validTab = validTabs.includes(tabName) ? tabName : "home";

	tabPanels.forEach((panel) => {
		panel.classList.toggle("active", panel.id === validTab);
	});

	tabLinks.forEach((link) => {
		const isProjectLink = link.dataset.tab === "projetos";
		const isActive = isProjectLink ? validTab === "project-detail" : link.dataset.tab === validTab;
		link.classList.toggle("active", isActive);
	});

	if (window.history.replaceState) {
		const hash = validTab === "project-detail" ? "projetos" : validTab;
		window.history.replaceState(null, "", `#${hash}`);
	}
};

const openProjectsModal = (shouldOpen) => {
	if (!projectModal) {
		return;
	}
	projectModal.classList.toggle("open", shouldOpen);
};

if (projectNav) {
	projectNav.addEventListener("mouseenter", () => openProjectsModal(true));
	projectNav.addEventListener("focusin", () => openProjectsModal(true));
	projectNav.addEventListener("click", (event) => {
		event.preventDefault();
		openProjectsModal(!projectModal.classList.contains("open"));
	});
	projectNav.addEventListener("mouseleave", () => {
		setTimeout(() => {
			if (!projectModal?.matches(":hover")) {
				openProjectsModal(false);
			}
		}, 120);
	});
}

if (projectModal) {
	projectModal.addEventListener("mouseleave", () => openProjectsModal(false));
	projectModal.addEventListener("focusout", (event) => {
		if (!projectModal.contains(event.relatedTarget)) {
			openProjectsModal(false);
		}
	});
}

projectOptions.forEach((option) => {
	option.addEventListener("click", () => {
		if (projectDetail) {
			projectDetail.innerHTML = "";
		}
		activateTab("project-detail");
		openProjectsModal(false);
		window.scrollTo({ top: 0, behavior: "auto" });
	});
});

tabLinks.forEach((link) => {
	if (link.dataset.tab === "projetos") {
		return;
	}

	link.addEventListener("click", (event) => {
		event.preventDefault();
		activateTab(link.dataset.tab);
		window.scrollTo({ top: 0, behavior: "auto" });
	});
});

const initialTab = window.location.hash.replace("#", "") || "home";
activateTab(initialTab === "projetos" ? "home" : initialTab);

const languageButtons = document.querySelectorAll(".language");
const languageSwitch = document.querySelector(".language-switch");
let currentLanguage = "pt";
const translations = {
	pt: {
		language: {
			portuguese: "Português",
			english: "Inglês",
		},
		nav: {
			projects: "Projetos",
			about: "Sobre",
			resume: "Baixar currículo",
		},
		hero: {
			iosDev: "iOS Dev",
		},
		projects: {
			title: "Projetos",
			subtitle: "UX/UI Designer | Product Designer | Developer",
			view: "Ver projeto",
		},
		experience: {
			title: "Experiência",
			faifce: "Product Designer no desenvolvimento de um sistema para monitoramento dos recursos financeiros do MEC. Atuo na concepção, estruturação e evolução de soluções digitais focadas em gestão pública.",
			apple: "Com experiência em 11 projetos multiplataforma (iOS, iPadOS, visionOS), atuei em todo o ciclo de design — desde pesquisa e ideação até prototipação no Figma, validação com usuários e acompanhamento pós-lançamento.",
		},
		contact: {
			title: "Entre em contato comigo",
			phone: "Celular",
			email: "Email",
		},
		footer: {
			rights: "© 2026 Marcelle Queiroz. Todos os direitos reservados.",
		},
	},
	en: {
		language: {
			portuguese: "Portuguese",
			english: "English",
		},
		nav: {
			projects: "Projects",
			about: "About",
			resume: "Download resume",
		},
		hero: {
			iosDev: "iOS Developer",
		},
		projects: {
			title: "Projects",
			subtitle: "UX/UI Designer | Product Designer | Developer",
			view: "View project",
		},
		experience: {
			title: "Experience",
			faifce: "Product Designer developing a system to monitor MEC financial resources. I work on the conception, structure, and evolution of digital solutions focused on public administration.",
			apple: "With experience in 11 multiplatform projects (iOS, iPadOS, visionOS), I worked throughout the design cycle — from research and ideation to Figma prototyping, user validation, and post-launch follow-up.",
		},
		contact: {
			title: "Get in touch",
			phone: "Phone",
			email: "Email",
		},
		footer: {
			rights: "© 2026 Marcelle Queiroz. All rights reserved.",
		},
	},
};

const tagTranslations = {
	Financeiro: "Financial",
	Ilustração: "Illustration",
	"Design Gráfico": "Graphic Design",
	Acessibilidade: "Accessibility",
};

const applyLanguage = (language, shouldAnimate = false) => {
	const selectedTranslations = translations[language];
	const languageChanged = currentLanguage !== language;

	document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
	document.title = language === "pt"
		? "Marcelle Queiroz — UX/UI Designer & iOS Dev"
		: "Marcelle Queiroz — UX/UI Designer & iOS Developer";

	document.querySelectorAll("[data-i18n]").forEach((element) => {
		const keys = element.dataset.i18n.split(".");
		let value = selectedTranslations;

		keys.forEach((key) => {
			value = value[key];
		});

		element.textContent = value;
	});

	document.querySelectorAll(".project-button").forEach((button) => {
		button.textContent = selectedTranslations.projects.view;
	});

	document.querySelectorAll(".language").forEach((button) => {
		const label = button.dataset.language === "pt" ? selectedTranslations.language.portuguese : selectedTranslations.language.english;
		button.textContent = label;
	});

	document.querySelectorAll(".tags span").forEach((tag) => {
		const currentText = tag.textContent.trim();
		const translation = Object.entries(tagTranslations)
			.find(([portuguese, english]) => [portuguese, english].includes(currentText));

		if (translation) {
			tag.textContent = language === "pt" ? translation[0] : translation[1];
		}
	});

	languageButtons.forEach((button) => {
		const isActive = button.dataset.language === language;
		button.classList.toggle("active", isActive);
		button.setAttribute("aria-pressed", isActive);
	});

	if (shouldAnimate && languageChanged && languageSwitch) {
		languageSwitch.classList.remove("changed");
		void languageSwitch.offsetWidth;
		languageSwitch.classList.add("changed");
	}

	currentLanguage = language;
};

languageButtons.forEach((button) => {
	button.addEventListener("click", () => applyLanguage(button.dataset.language, true));
});

applyLanguage("pt");

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