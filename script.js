// Load pages dynamically
const pageContent = document.getElementById("page-content");

const loadPages = async () => {
	try {
		// Load home page
		const homeResponse = await fetch("pages/home.html");
		const homeHTML = await homeResponse.text();

		// Load about page
		const aboutResponse = await fetch("pages/about.html");
		const aboutHTML = await aboutResponse.text();

		// Insert content
		if (pageContent) {
			pageContent.innerHTML = homeHTML + aboutHTML;
		}

		// Re-initialize after loading
		reinitializePageScripts();
	} catch (error) {
		console.error("Error loading pages:", error);
	}
};

const reinitializePageScripts = () => {
	// Duplicate projects grid
	const projectsGrid = document.querySelector(".projects-grid");
	if (projectsGrid) {
		const projectCards = [...projectsGrid.children];
		projectCards.forEach((projectCard) => {
			const duplicatedCard = projectCard.cloneNode(true);
			duplicatedCard.setAttribute("aria-hidden", "true");
			projectsGrid.appendChild(duplicatedCard);
		});
	}

	// Re-attach event listeners
	setupTabNavigation();
	setupProjectsModal();
	setupLanguageButtons();
	setupCopyCards();
};

// Wait for DOM to be ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", loadPages);
} else {
	loadPages();
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

	// Get fresh references to tab panels and links
	const currentTabPanels = document.querySelectorAll(".tab-panel");
	const currentTabLinks = document.querySelectorAll(".nav-link");
	const currentProjectModal = document.getElementById("projects-modal");

	currentTabPanels.forEach((panel) => {
		panel.classList.toggle("active", panel.id === validTab);
	});

	currentTabLinks.forEach((link) => {
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
	const currentProjectModal = document.getElementById("projects-modal");
	if (!currentProjectModal) {
		return;
	}
	currentProjectModal.classList.toggle("open", shouldOpen);
};

const setupTabNavigation = () => {
	const tabLinks = document.querySelectorAll(".nav-link");
	const projectOptions = document.querySelectorAll(".project-option");
	const projectDetail = document.getElementById("project-detail");

	// Project name to file mapping
	const projectFileMap = {
		"Altroo": "pages/projects/altroo.html",
		"Hanka": "pages/projects/hanka.html",
		"Monitor Pronatec": "pages/projects/monitor-pronatec.html",
		"Into The Cauldron": "pages/projects/into-the-cauldron.html",
	};

	projectOptions.forEach((option) => {
		option.addEventListener("click", async () => {
			const projectName = option.dataset.project;
			const projectFile = projectFileMap[projectName];

			if (projectFile && projectDetail) {
				try {
					const response = await fetch(projectFile);
					const projectHTML = await response.text();
					projectDetail.innerHTML = projectHTML;

					// Re-attach back button listener
					const backButton = projectDetail.querySelector(".back-to-projects");
					if (backButton) {
						backButton.addEventListener("click", () => {
							projectDetail.innerHTML = "";
							activateTab("home");
						});
					}
				} catch (error) {
					console.error("Error loading project:", error);
					projectDetail.innerHTML = "<p>Erro ao carregar o projeto.</p>";
				}
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
};

const setupProjectsModal = () => {
	const projectNav = document.querySelector(".project-nav");
	const projectModal = document.getElementById("projects-modal");

	if (projectNav) {
		projectNav.addEventListener("mouseenter", () => openProjectsModal(true));
		projectNav.addEventListener("focusin", () => openProjectsModal(true));
		projectNav.addEventListener("click", (event) => {
			event.preventDefault();
			const currentProjectModal = document.getElementById("projects-modal");
			openProjectsModal(!currentProjectModal.classList.contains("open"));
		});
		projectNav.addEventListener("mouseleave", () => {
			setTimeout(() => {
				const currentProjectModal = document.getElementById("projects-modal");
				if (!currentProjectModal?.matches(":hover")) {
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
};

let currentLanguage = "pt";
const translations = {
	pt: {
		language: {
			portuguese: "Português 🇧🇷",
			english: "Inglês 🇺🇸",
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
			faifce: "Product Designer responsável pela estruturação e evolução de soluções digitais para o monitoramento de recursos do Ministério da Educação (MEC). Foco em design de sistemas complexos, usabilidade e transparência na gestão pública.",
			apple: "Product Designer com 11 projetos multiplataforma (iOS, iPadOS, visionOS). Domínio de todo o ciclo de design: pesquisa, ideação, prototipação no Figma, testes de usabilidade e acompanhamento pós-lançamento.",
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
			portuguese: "Portuguese 🇧🇷",
			english: "English 🇺🇸",
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
			faifce: "Product Designer responsible for structuring and evolving digital solutions for monitoring Ministry of Education (MEC) resources. Focus on complex systems design, usability and transparency in public management.",
			apple: "Product Designer with 11 multiplatform projects (iOS, iPadOS, visionOS). Mastery of the entire design cycle: research, ideation, prototyping in Figma, user validation and post-launch follow-up.",
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

	document.querySelectorAll(".language").forEach((button) => {
		const isActive = button.dataset.language === language;
		button.classList.toggle("active", isActive);
		button.setAttribute("aria-pressed", isActive);
	});

	const languageSwitch = document.querySelector(".language-switch");
	if (shouldAnimate && languageChanged && languageSwitch) {
		languageSwitch.classList.remove("changed");
		void languageSwitch.offsetWidth;
		languageSwitch.classList.add("changed");
	}

	currentLanguage = language;
};

const setupLanguageButtons = () => {
	const buttons = document.querySelectorAll(".language");
	buttons.forEach((button) => {
		button.removeEventListener("click", languageClickHandler);
		button.addEventListener("click", languageClickHandler);
	});
	applyLanguage(currentLanguage);
};

const languageClickHandler = (e) => {
	applyLanguage(e.target.dataset.language, true);
};

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

const setupCopyCards = () => {
	setupCopyCard('a[href^="tel:"]', "Número copiado!", "Número de celular copiado");
	setupCopyCard('a[href^="mailto:"]', "E-mail copiado!", "E-mail copiado");
};