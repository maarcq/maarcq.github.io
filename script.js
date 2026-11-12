// Load pages dynamically
const pageContent = document.getElementById("page-content");

const loadPages = async () => {
	if (!pageContent) {
		setupLanguageButtons();
		return;
	}

	try {
		// Load home page
		const homeResponse = await fetch("pages/home.html?v=home-i18n");
		const homeHTML = await homeResponse.text();

		// Load projects page
		const projectsResponse = await fetch("pages/projects.html");
		const projectsHTML = await projectsResponse.text();

		// Load about page
		const aboutResponse = await fetch("pages/about.html");
		const aboutHTML = await aboutResponse.text();

		// Insert content
		if (pageContent) {
			pageContent.innerHTML = homeHTML + projectsHTML + aboutHTML;
		}

		// Re-initialize after loading
		reinitializePageScripts();
	} catch (error) {
		console.error("Error loading pages:", error);
	}
};

const projectAppData = [
	{ name: "Altroo", src: "assets/images/projetcs/AppIcon/Altrooicon.png" },
	{ name: "Into the Cauldron", src: "assets/images/projetcs/AppIcon/ITCicon.png" },
	{ name: "Wanty", src: "assets/images/projetcs/AppIcon/Wantyicon.png" },
	{ name: "Sonharium", src: "assets/images/projetcs/AppIcon/Sonhariumicon.png" },
	{ name: "Find It", src: "assets/images/projetcs/AppIcon/Finditicon.png" },
	{ name: "Hanka", src: "assets/images/projetcs/AppIcon/Hankaicon.png" },
	{ name: "Satty", src: "assets/images/projetcs/AppIcon/Sattyicon.png" },
	{ name: "Saporo", src: "assets/images/projetcs/AppIcon/Saporoicon.png" },
	{ name: "Vision", src: "assets/images/projetcs/AppIcon/Visionicon.png" },
	{ name: "Buzzic", src: "assets/images/projetcs/AppIcon/Buzzicicon.png" },
	{ name: "Atlantic", src: "assets/images/projetcs/AppIcon/Artlanticicon.png" },
];

const setupProjectAppGrid = () => {
	const grid = document.getElementById("project-app-grid");
	const hoverTitle = document.getElementById("projects-title");
	const hoverText = document.getElementById("projects-hover-text");
	const hoverCopy = document.querySelector(".projects-hero-copy");
	const defaultTitle = "Explore meus<br>projetos";
	const defaultText = "Clique em um App para<br>descobrir mais.";
	if (!grid) {
		return;
	}

	const updateProjectCopy = (title, text, useHtml = false) => {
		if (hoverCopy) {
			hoverCopy.classList.toggle("is-app-hovering", !useHtml);
			hoverCopy.classList.remove("is-changing");
			void hoverCopy.offsetWidth;
			hoverCopy.classList.add("is-changing");
		}
		if (hoverTitle) {
			hoverTitle[useHtml ? "innerHTML" : "textContent"] = title;
		}
		if (hoverText) {
			hoverText[useHtml ? "innerHTML" : "textContent"] = text;
		}
	};

	if (grid.children.length === 0) {
		grid.innerHTML = projectAppData.map(({ name, src }) => `
			<button class="project-app-item" type="button" data-project-text="${name} - projeto em desenvolvimento." aria-label="${name}">
				<img class="project-app-icon" src="${src}" alt="${name}" loading="lazy">
				<span class="project-app-name">${name}</span>
			</button>
		`).join("");
	}

	const appItems = grid.querySelectorAll(".project-app-item");
	const getDescriptionForItem = (item) => currentLanguage === "en"
		? (item.dataset.projectTextEn || "Project in development.")
		: (item.dataset.projectText || "Projeto em desenvolvimento.");

	appItems.forEach((item) => {
		const appName = item.getAttribute("aria-label") || item.querySelector(".project-app-name")?.textContent || "Projeto";
		const projectUrl = item.dataset.projectUrl;

		item.addEventListener("click", (event) => {
			if (!projectUrl) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			window.location.href = projectUrl;
		});

		item.addEventListener("mouseenter", () => {
			updateProjectCopy(appName, getDescriptionForItem(item));
		});
	});

	grid.addEventListener("mouseleave", () => {
		updateProjectCopy(defaultTitle, defaultText, true);
	});

	const isMobile = window.matchMedia("(max-width: 700px)").matches;
	if (isMobile && !grid.dataset.mobileAutoplay) {
		let activeIndex = 0;
		const showNextApp = () => {
			appItems.forEach((item) => item.classList.remove("is-autoplaying"));
			const activeItem = appItems[activeIndex];
			if (!activeItem) {
				return;
			}

			const appName = activeItem.getAttribute("aria-label") || activeItem.querySelector(".project-app-name")?.textContent || "Projeto";
			activeItem.classList.add("is-autoplaying");
			updateProjectCopy(appName, getDescriptionForItem(activeItem));
			activeIndex = (activeIndex + 1) % appItems.length;
		};

		grid.dataset.mobileAutoplay = "true";
		showNextApp();
		window.setInterval(showNextApp, 2200);
	}
};

const setupSkillsTabs = () => {
	const tabs = document.querySelectorAll(".skills-tab");
	const pills = document.getElementById("skill-pills");
	const select = document.getElementById("skills-select");
	if (!tabs.length || !pills || pills.dataset.ready === "true") {
		return;
	}

	const allSkills = [...pills.children].map((pill) => pill.textContent);
	const tabsContainer = tabs[0].parentElement;
	const skillsByCategory = {
		all: allSkills,
		design: [
			"Mapping experiences",
			"Insights into design solutions",
			"Information architecture",
			"Concepts across fidelity",
			"Wireframing",
			"Prototyping",
			"Responsive design",
			"Visual hierarchy",
			"Design documentation",
			"Design systems",
			"Microinteractions",
		],
		research: [
			"User interviews",
			"Contextual Inquiries",
			"Usability testing",
			"Validation",
			"Heuristic Evaluation",
			"Accessibility audits",
			"Affinity mapping",
			"Qualitative analysis",
			"Personas",
			"Journey mapping",
			"Competitive analysis",
			"Survey Creation",
		],
		apple: [
			"iOS",
			"iPadOS",
			"watchOS",
			"visionOS",
			"ARKit",
			"RealityKit",
			"Core Data",
			"Core ML",
			"HealthKit",
			"SwiftUI",
			"SwiftData",
			"UIKit",
			"SpriteKit",
			"Xcode",
			"SwiftLint",
			"CBL",
			"HIG",
		],
		technical: [
			"REST APIs",
			"Dev Handoff",
			"Git / Github",
			"HTML / CSS",
			"Accessibility development (WCAG)",
		],
	};

	const renderSkills = (category) => {
		const nextPills = skillsByCategory[category].map((skill, index) => {
			const pill = document.createElement("span");
			pill.textContent = skill;
			pill.style.setProperty("--skill-index", index);
			return pill;
		});

		pills.classList.remove("is-refreshing");
		pills.replaceChildren(...nextPills);
		void pills.offsetWidth;
		pills.classList.add("is-refreshing");
	};

	const updateSkillsIndicator = (tab) => {
		if (!tab.offsetWidth) {
			return false;
		}

		tabsContainer.style.setProperty("--skills-indicator-left", `${tab.offsetLeft}px`);
		tabsContainer.style.setProperty("--skills-indicator-width", `${tab.offsetWidth}px`);
		tabsContainer.dataset.indicatorReady = "true";
		tabsContainer.classList.remove("is-initializing");
		return true;
	};

	const selectCategory = (tab) => {
		const category = tab.dataset.skillCategory || "all";
		tabs.forEach((currentTab) => {
			const isActive = currentTab === tab;
			currentTab.classList.toggle("is-active", isActive);
			currentTab.setAttribute("aria-selected", String(isActive));
		});
		if (select) {
			select.value = category;
		}
		updateSkillsIndicator(tab);
		renderSkills(category);
	};

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			selectCategory(tab);
		});
	});

	select?.addEventListener("change", () => {
		const selectedTab = [...tabs].find((tab) => tab.dataset.skillCategory === select.value);
		if (selectedTab) {
			selectCategory(selectedTab);
		}
	});

	const initialTab = tabs[0];
	delete tabsContainer.dataset.indicatorReady;
	tabs.forEach((tab, index) => {
		const isInitialTab = index === 0;
		tab.classList.toggle("is-active", isInitialTab);
		tab.setAttribute("aria-selected", String(isInitialTab));
	});
	if (select) {
		select.value = initialTab.dataset.skillCategory || "all";
	}
	renderSkills(initialTab.dataset.skillCategory || "all");
	const measureInitialIndicator = () => {
		if (!updateSkillsIndicator(initialTab)) {
			requestAnimationFrame(measureInitialIndicator);
		}
	};
	requestAnimationFrame(measureInitialIndicator);

	window.refreshSkillsIndicator = () => {
		const activeTab = [...tabs].find((tab) => tab.getAttribute("aria-selected") === "true") || initialTab;
		requestAnimationFrame(() => {
			updateSkillsIndicator(activeTab);
			requestAnimationFrame(() => updateSkillsIndicator(activeTab));
		});
	};
	window.addEventListener("resize", () => {
		const activeTab = [...tabs].find((tab) => tab.getAttribute("aria-selected") === "true");
		if (activeTab) {
			updateSkillsIndicator(activeTab);
		}
	});

	pills.dataset.ready = "true";
};

const reinitializePageScripts = () => {
	const projectsGrid = document.querySelector(".home-page .projects-grid");
	if (projectsGrid && !projectsGrid.dataset.carouselReady) {
		const projectCards = [...projectsGrid.children];
		projectCards.forEach((projectCard) => {
			const duplicatedCard = projectCard.cloneNode(true);
			duplicatedCard.setAttribute("aria-hidden", "true");
			projectsGrid.appendChild(duplicatedCard);
		});
		projectsGrid.dataset.carouselReady = "true";
	}

	setupProjectAppGrid();
	setupSkillsTabs();

	// Re-attach event listeners
	setupTabNavigation();
	setupMobileMenu();
	setupLanguageButtons();
	setupCopyCards();
};

// Wait for DOM to be ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		loadPages();
		setupBackButtons();
	});
} else {
	loadPages();
	setupBackButtons();
}

const tabLinks = document.querySelectorAll(".nav-link");
const tabPanels = document.querySelectorAll(".tab-panel");

const activateTab = (tabName) => {
	const validTabs = ["home", "projetos", "sobre"];
	const validTab = validTabs.includes(tabName) ? tabName : "home";

	// Get fresh references to tab panels and links
	const currentTabPanels = document.querySelectorAll(".tab-panel");
	const currentTabLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

	currentTabPanels.forEach((panel) => {
		panel.classList.toggle("active", panel.id === validTab);
	});

	currentTabLinks.forEach((link) => {
		const isActive = link.dataset.tab === validTab;
		link.classList.toggle("active", isActive);
	});

	// Move navigation indicator
	const activeLink = document.querySelector(
    	`.nav-link[data-tab="${validTab}"]`
	);

	const indicator = document.querySelector(".nav-indicator");

	if (activeLink && indicator) {
    	indicator.style.width = `${activeLink.offsetWidth}px`;
    	indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
	}

	if (window.history.replaceState) {
		window.history.replaceState(null, "", `#${validTab}`);
	}
};

const setupTabNavigation = () => {
	const tabLinks = document.querySelectorAll(".nav-link");

	tabLinks.forEach((link) => {
		link.addEventListener("click", (event) => {
			event.preventDefault();
			activateTab(link.dataset.tab);
			window.scrollTo({ top: 0, behavior: "auto" });
		});
	});

	const initialTab = window.location.hash.replace("#", "") || "home";
	activateTab(initialTab);
};

const setupMobileMenu = () => {
	const menu = document.getElementById("mobile-menu");
	const menuButton = document.querySelector(".mobile-menu-button");
	const menuLinks = document.querySelectorAll(".mobile-nav-link");
	if (!menu || !menuButton || menu.dataset.ready === "true") {
		return;
	}

	const closeMenu = () => {
		menu.classList.remove("is-open");
		menu.setAttribute("aria-hidden", "true");
		menuButton.setAttribute("aria-expanded", "false");
	};

	menuButton.addEventListener("click", () => {
		const isOpen = menu.classList.toggle("is-open");
		menu.setAttribute("aria-hidden", String(!isOpen));
		menuButton.setAttribute("aria-expanded", String(isOpen));
	});

	menu.querySelectorAll("[data-mobile-menu-close]").forEach((element) => {
		element.addEventListener("click", closeMenu);
	});

	menuLinks.forEach((link) => {
		link.addEventListener("click", (event) => {
			event.preventDefault();
			activateTab(link.dataset.tab);
			closeMenu();
			window.scrollTo({ top: 0, behavior: "auto" });
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeMenu();
		}
	});

	menu.dataset.ready = "true";
};

function setupBackButtons() {
	document.querySelectorAll("[data-go-back]").forEach((button) => {
		if (button.dataset.ready === "true") {
			return;
		}

		button.addEventListener("click", () => {
			if (window.history.length > 1) {
				window.history.back();
				return;
			}

			window.location.href = "../../index.html#projetos";
		});
		button.dataset.ready = "true";
	});
}

let currentLanguage = document.documentElement.lang === "en" ? "en" : "pt";
const translations = {
	pt: {
		language: {
			portuguese: "Português 🇧🇷",
			english: "Inglês 🇺🇸",
		},
		nav: {
			projects: "Projetos",
			about: "Sobre",
			resume: "Baixar Currículo",
		},
		hero: {
			iosDev: "iOS Developer",
		},
		home: {
			altrooImageAlt: "Projeto Altroo",
			monitorImageAlt: "Projeto Monitor Pronatec",
			cauldronImageAlt: "Projeto Into the Cauldron",
			wantyImageAlt: "Projeto Wanty",
			sonhariumImageAlt: "Projeto Sonharium",
			sandboxImageAlt: "Projeto Sandbox",
			sattyImageAlt: "Projeto Satty",
			hankaImageAlt: "Projeto Hanka",
		},
		projects: {
			title: "Projetos em destaque",
			subtitle: "UX/UI Designer | Product Designer | Developer",
			view: "Ver projeto",
			heroTitle: "Explore meus<br>projetos",
			heroDescriptionFirst: "Aqui você encontra uma seleção dos projetos que fizeram parte da minha trajetória em design e desenvolvimento de produtos digitais.",
			heroDescriptionSecond: "Cada projeto nasceu de um desafio diferente e foi uma oportunidade para transformar ideias em experiências mais simples, intuitivas e significativas.",
			heroHoverText: "Clique em um App para<br>descobrir mais.",
			exploreProjects: "Explorar projetos",
			appsList: "Lista de apps",
			phoneImageAlt: "iPhone com papel de parede colorido",
		},
		experience: {
			title: "Experiência",
			faifceOrganization: "Fundação de Apoio ao Ensino, a Pesquisa e a Extensão do IFCE – FAIFCE",
			faifce: "Product Designer responsável pela estruturação e evolução de soluções digitais para o monitoramento de recursos do Ministério da Educação (MEC). Foco em design de sistemas complexos, usabilidade e transparência na gestão pública.",
			apple: "Product Designer com 11 projetos multiplataforma (iOS, iPadOS, visionOS). Domínio de todo o ciclo de design: pesquisa, ideação, prototipação no Figma, testes de usabilidade e acompanhamento pós-lançamento.",
		},
		about: {
			greeting: "Olá",
			engineeringBadge: "Engenharia",
			summary: "Graduanda em Engenharia de Telecomunicações, UI/UX Designer e Desenvolvedora iOS com experiência no Apple Developer Academy. Atuo na criação de produtos digitais, aplicando design centrado no usuário, pensamento estratégico e colaboração com times de tecnologia para transformar necessidades reais em experiências intuitivas e eficientes.",
			professionalExperience: "Experiência Profissional",
			websiteDesignDescription: "Product Designer responsável pela estruturação e evolução de soluções digitais para o monitoramento de recursos do Ministério da Educação (MEC). Foco em design de sistemas complexos, usabilidade e transparência na gestão pública.",
			mobileAppDescription: "Com experiência em 11 projetos multiplataforma (iOS, iPadOS, visionOS), atuei em todo o ciclo de design — desde pesquisa e ideação até prototipação no Figma, validação com usuários e acompanhamento pós-lançamento.",
			creativeDevelopmentDescription: "Atuação no desenvolvimento full-cycle de produtos para o ecossistema Apple, participando de projetos para iOS, iPadOS, visionOS, watchOS e tvOS. Experiência em todo o ciclo de vida do produto, desde a ideação até o design final e implementação.",
			education: "Educação",
			certificates: "Certificados",
			telecommunicationsDegree: "Bacharelado em Engenharia de Telecomunicações",
			instituteName: "Instituto Federal de Educação, Ciência e Tecnologia do Ceará",
			mandarin: "Mandarim",
			skills: "Habilidades",
			tools: "Ferramentas",
			allSkills: "Tudo",
			skillsCategories: "Categorias de habilidades",
		},
		contact: {
			title: "Entre em contato comigo",
			phone: "Celular",
			email: "Email",
		},
		footer: {
			rights: "© 2026 Marcelle Queiroz. Todos os direitos reservados.",
		},
		altroo: {
			about: "Sobre",
			problem: "Problema",
			objective: "Objetivo",
			workflow: "Workflow",
			branding: "Branding",
			app: "App",
			research: "Investigação",
			ideation: "Ideação",
			interfaces: "Interfaces",
			validation: "Validação",
			interviews: "Entrevistas",
			navigableHiFi: "Hi-fi Navegável",
			usabilityTesting: "Teste de Usabilidade",
			metrics: "Métricas",
			aboutDescription: "Aplicativo mobile projetado para cuidadores, que centraliza registros de cuidado e transforma informações do dia a dia em relatórios automáticos, facilitando a comunicação clara e contínua entre cuidadores e familiares.",
			aboutTechnology: "Desenvolvido em Swift, ele combina UIKit, SwiftUI, Combine, CoreData e CloudKit garantindo sincronização segura, funcionalidade offline e comunicação integrada.",
			problemDescription: "\"Cuidadores enfrentam dificuldades para manter registros de cuidado <strong>atualizados e centralizados</strong> ao longo do tempo, o que compromete a <strong>comunicação</strong> eficiente com familiares, outros cuidadores e a equipe médica.\"",
			objectiveDescription: "Criar um aplicativo para <strong>cuidadores profissionais</strong> que centralize os registros de cuidado de forma simples e organizada, facilitando o <strong>acompanhamento contínuo dos pacientes e a tomada de decisão</strong> no dia a dia.",
			appDescription: "Entre remédios, recados e consultas,<br>quem cuida precisa de organização,<br>precisa de controle.<br>E é pra isso que o altroo existe.",
			caseLabel: "Conheça o Altroo UX Case",
			projectCategories: "Categorias do projeto",
			workflowSteps: "Etapas do workflow",
			projectInformation: "Informações do projeto",
			role: "Atuação",
			duration: "Duração",
			durationValue: "5 meses",
			caseDate: "Dezembro 2025",
			investigation: "Investigação",
			investigationSubtitle: "Da rotina de quem cuida às decisões de produto.",
			deskResearch: "Desk Research",
			deskResearchDescription: "Realizei o levantamento do perfil demográfico do público-alvo.",
			ageInsightTitle: "6 em cada 10",
			ageInsightDescription: "cuidadores têm 50 anos ou mais.<br>O público é majoritariamente de meia-idade.",
			designDirection: "Direção para o design",
			designDirectionDescription: "Priorizar clareza, acessibilidade e acesso simples às principais funcionalidades.",
			benchmarking: "Benchmarking",
			benchmarkingDescription: "Analisei forças e fraquezas de soluções digitais voltadas para cuidadores.",
			accessibilityInsightTitle: "Acessibilidade",
			accessibilityInsightDescription: "As soluções analisadas apresentaram navegação confusa e dificuldade de acesso às funções principais.",
			similarApps: "Aplicativos similares analisados",
			interviewsDescription: "Conversei com 8 cuidadores para compreender a rotina, as dificuldades e as ferramentas utilizadas. Os insights foram analisados de forma colaborativa.",
			paperRecordsInsightTitle: "Registros em papel",
			paperRecordsInsightDescription: "A organização, a padronização e o compartilhamento das informações entre cuidadores eram dificultados.",
			miroInsights: "Agrupamento dos insights das entrevistas · Miro",
			ideationSubtitle: "Priorizar valor e simplificar o caminho.",
			ideationDescription: "A partir dos insights da pesquisa, defini o fluxo do aplicativo e priorizei os requisitos com a matriz Impacto × Esforço, equilibrando valor para o usuário e viabilidade no prazo do projeto.",
			userFlowCaption: "Trecho do fluxo do usuário organizado por funcionalidades · FigJam",
			paperWireframes: "Wireframes em papel",
			paperWireframesDescription: "Considerando o prazo do projeto, iniciei o planejamento das telas de formulário em papel, explorando diferentes versões para definir campos mais claros e rápidos de preencher conforme os tipos de entrada de dados.",
			paperWireframesCaption: "Explorações de campos e formulários em papel.",
			interfacesDescription: "Por meio de ciclos iterativos guiados por feedbacks de usuários, desenvolvi o protótipo de alta fidelidade no Figma. As decisões buscaram manter a interface limpa, intuitiva e eficiente.",
			interfaceComparisonTitle: "Tela Hoje: do primeiro desenho à versão refinada",
			interfaceVersionOne: "Versão 1.0 · oportunidades identificadas",
			interfaceVersionTwo: "Versão 2.0 · refinamentos aplicados",
			standardizedHeader: "Header padronizado",
			standardizedHeaderDescription: "O header dinâmico competia com “Adicionar Registro”. A versão padronizada concentra as informações essenciais e direciona a ação principal.",
			clearHierarchy: "Hierarquia clara",
			clearHierarchyDescription: "Seções e categorias bem delimitadas, apoiadas por ícones, passaram a diferenciar os tipos de atividade.",
			contextualAction: "Ação em contexto",
			contextualActionDescription: "A ação universal exigia no mínimo dois cliques. O botão de adicionar em cada tipo de registro passou a permitir o registro rápido e contextual.",
			validationDescription: "Foram realizados cinco testes para avaliar a eficiência da aplicação nas principais tarefas de cuidado. Os cenários exploraram o registro de atividades e a percepção dos participantes sobre o produto.",
			validationUseScenario: "Cenário de uso",
			validationUseScenarioDescription: "“Pense em duas atividades que você acha importante realizar pela manhã quanto ao cuidado do paciente e insira-as no aplicativo.”",
			validationUserPerception: "Percepção do usuário",
			validationUserPerceptionDescription: "“Considerando os cenários apresentados, de que forma o aplicativo atendeu, ou não, às suas expectativas?”",
			validationResultsTitle: "O que os resultados indicam",
			validationResultsDescription: "A avaliação considerou a taxa de conclusão de tarefas, o tempo de execução e o questionário SUS (System Usability Scale).",
			validationUsability: "Usabilidade geral",
			validationSusScore: "Pontuação SUS",
			validationUsabilityDescription: "Acima da média de usabilidade de 68 pontos.",
			validationStrength: "Ponto forte",
			validationHighestScore: "Maior pontuação média",
			validationStrengthDescription: "“Eu acho que gostaria de usar esse sistema com frequência.”",
			validationOpportunity: "Oportunidade de melhoria",
			validationLowestScore: "Menor pontuação média",
			validationOpportunityDescription: "“Eu acho que precisaria de ajuda de uma pessoa com conhecimentos técnicos para usar o sistema.”",
			styleGuideTitle: "Style Guide e Design System",
			styleGuideDescription: "Padronizei componentes críticos e estilos visuais para reduzir variações na implementação e facilitar a comunicação com o time técnico.",
			colorVariables: "Variáveis de cor no Style Guide",
			designSystemComponents: "Componentes do Design System",
			learnings: "Aprendizados",
			learningsTitle: "Valor percebido validado. Fluxos ainda podem ser mais simples.",
			learningsDescription: "Os resultados indicam alto valor percebido pelos usuários. Algumas tarefas, porém, ainda foram consideradas complexas. Os próximos esforços se concentram em otimizar a edição e a exclusão de registros, com feedbacks mais claros e melhor recuperação de erros.",
			empathyLearning: "Empatia com o usuário",
			empathyLearningDescription: "Participar de um projeto com usuários com menor familiaridade com smartphones reforçou a importância de pensar a partir da perspectiva do público, priorizando clareza e acessibilidade no sistema.",
			productLeadershipLearning: "Liderança e visão de produto",
			productLeadershipLearningDescription: "Planejar um produto end-to-end, da delimitação do problema à validação, atuando como Product Manager, trouxe aprendizados sobre tomada de decisão baseada em dados e comunicação entre stakeholders.",
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
			resume: "Download Resume",
		},
		hero: {
			iosDev: "iOS Developer",
		},
		home: {
			altrooImageAlt: "Altroo project",
			monitorImageAlt: "Monitor Pronatec project",
			cauldronImageAlt: "Into the Cauldron project",
			wantyImageAlt: "Wanty project",
			sonhariumImageAlt: "Sonharium project",
			sandboxImageAlt: "Sandbox project",
			sattyImageAlt: "Satty project",
			hankaImageAlt: "Hanka project",
		},
		projects: {
			title: "Featured projects",
			subtitle: "UX/UI Designer | Product Designer | Developer",
			view: "View project",
			heroTitle: "Explore my<br>projects",
			heroDescriptionFirst: "Here you will find a selection of projects that shaped my journey in design and digital product development.",
			heroDescriptionSecond: "Each project began with a different challenge and was an opportunity to turn ideas into simpler, more intuitive and meaningful experiences.",
			heroHoverText: "Click an App to<br>discover more.",
			exploreProjects: "Explore projects",
			appsList: "List of apps",
			phoneImageAlt: "iPhone with colorful wallpaper",
		},
		experience: {
			title: "Experience",
			faifceOrganization: "Foundation for Teaching, Research and Extension Support of IFCE – FAIFCE",
			faifce: "Product Designer responsible for structuring and evolving digital solutions for monitoring Ministry of Education (MEC) resources. Focus on complex systems design, usability and transparency in public management.",
			apple: "Product Designer with 11 multiplatform projects (iOS, iPadOS, visionOS). Mastery of the entire design cycle: research, ideation, prototyping in Figma, user validation and post-launch follow-up.",
		},
		about: {
			greeting: "Hello",
			engineeringBadge: "Engineering",
			summary: "Telecommunications Engineering undergraduate, UI/UX Designer and iOS Developer with experience at the Apple Developer Academy. I create digital products using user-centered design, strategic thinking and collaboration with technology teams to turn real needs into intuitive and efficient experiences.",
			professionalExperience: "Professional Experience",
			websiteDesignDescription: "Product Designer responsible for structuring and evolving digital solutions for monitoring Ministry of Education (MEC) resources. Focused on complex systems design, usability and transparency in public management.",
			mobileAppDescription: "With experience in 11 multiplatform projects (iOS, iPadOS, visionOS), I worked across the entire design cycle, from research and ideation to prototyping in Figma, user validation and post-launch follow-up.",
			creativeDevelopmentDescription: "Full-cycle development of products for the Apple ecosystem, contributing to projects for iOS, iPadOS, visionOS, watchOS and tvOS. Experience across the entire product lifecycle, from ideation to final design and implementation.",
			education: "Education",
			certificates: "Certificates",
			telecommunicationsDegree: "Bachelor's degree in Telecommunications Engineering",
			instituteName: "Federal Institute of Education, Science and Technology of Ceará",
			mandarin: "Mandarin",
			skills: "Skills",
			tools: "Tools",
			allSkills: "All",
			skillsCategories: "Skill categories",
		},
		contact: {
			title: "Get in touch",
			phone: "Phone",
			email: "Email",
		},
		footer: {
			rights: "© 2026 Marcelle Queiroz. All rights reserved.",
		},
		altroo: {
			about: "About",
			problem: "Problem",
			objective: "Objective",
			workflow: "Workflow",
			branding: "Branding",
			app: "App",
			research: "Research",
			ideation: "Ideation",
			interfaces: "Interfaces",
			validation: "Validation",
			interviews: "Interviews",
			navigableHiFi: "Navigable Hi-fi",
			usabilityTesting: "Usability Testing",
			metrics: "Metrics",
			aboutDescription: "A mobile app designed for caregivers that centralizes care records and turns everyday information into automatic reports, making clear and continuous communication between caregivers and families easier.",
			aboutTechnology: "Developed in Swift, it combines UIKit, SwiftUI, Combine, CoreData and CloudKit for secure synchronization, offline functionality and integrated communication.",
			problemDescription: "\"Caregivers struggle to keep care records <strong>up to date and centralized</strong> over time, which compromises effective <strong>communication</strong> with family members, other caregivers and the medical team.\"",
			objectiveDescription: "Create an app for <strong>professional caregivers</strong> that centralizes care records in a simple and organized way, making continuous patient monitoring and <strong>day-to-day decision-making</strong> easier.",
			appDescription: "Between medication, notes and appointments,<br>caregivers need organization,<br>they need control.<br>That is what altroo is here for.",
			caseLabel: "Explore the Altroo UX Case",
			projectCategories: "Project categories",
			workflowSteps: "Workflow steps",
			projectInformation: "Project information",
			role: "Role",
			duration: "Duration",
			durationValue: "5 months",
			caseDate: "December 2025",
			investigation: "Investigation",
			investigationSubtitle: "From caregivers' routines to product decisions.",
			deskResearch: "Desk Research",
			deskResearchDescription: "I surveyed the target audience's demographic profile.",
			ageInsightTitle: "6 out of 10",
			ageInsightDescription: "caregivers are 50 years old or older.<br>The audience is mostly middle-aged.",
			designDirection: "Design direction",
			designDirectionDescription: "Prioritize clarity, accessibility and simple access to the main features.",
			benchmarking: "Benchmarking",
			benchmarkingDescription: "I analyzed the strengths and weaknesses of digital solutions for caregivers.",
			accessibilityInsightTitle: "Accessibility",
			accessibilityInsightDescription: "The analyzed solutions presented confusing navigation and difficulty accessing the main features.",
			similarApps: "Similar apps analyzed",
			interviewsDescription: "I spoke with 8 caregivers to understand their routines, challenges and tools. The insights were analyzed collaboratively.",
			paperRecordsInsightTitle: "Paper records",
			paperRecordsInsightDescription: "Organizing, standardizing and sharing information among caregivers was difficult.",
			miroInsights: "Grouping of interview insights · Miro",
			ideationSubtitle: "Prioritize value and simplify the path.",
			ideationDescription: "Based on the research insights, I defined the app flow and prioritized requirements with the Impact × Effort matrix, balancing user value and feasibility within the project timeline.",
			userFlowCaption: "Excerpt from the user flow organized by functionality · FigJam",
			paperWireframes: "Paper wireframes",
			paperWireframesDescription: "Considering the project timeline, I started planning the form screens on paper, exploring different versions to define clearer and faster fields to complete according to each type of data input.",
			paperWireframesCaption: "Explorations of paper fields and forms.",
			interfacesDescription: "Through iterative cycles guided by user feedback, I developed the high-fidelity prototype in Figma. The decisions aimed to keep the interface clean, intuitive and efficient.",
			interfaceComparisonTitle: "Today screen: from the first sketch to the refined version",
			interfaceVersionOne: "Version 1.0 · opportunities identified",
			interfaceVersionTwo: "Version 2.0 · refinements applied",
			standardizedHeader: "Standardized header",
			standardizedHeaderDescription: "The dynamic header competed with “Add Record”. The standardized version concentrates essential information and directs the main action.",
			clearHierarchy: "Clear hierarchy",
			clearHierarchyDescription: "Clearly defined sections and categories, supported by icons, now differentiate the types of activities.",
			contextualAction: "Contextual action",
			contextualActionDescription: "The universal action required at least two taps. An add button for each record type now enables quick, contextual entry.",
			validationDescription: "Five tests were conducted to assess the application's efficiency in the main care tasks. The scenarios explored activity recording and participants' perception of the product.",
			validationUseScenario: "Usage scenario",
			validationUseScenarioDescription: "“Think of two activities that you consider important to carry out in the morning regarding patient care and enter them in the app.”",
			validationUserPerception: "User perception",
			validationUserPerceptionDescription: "“Considering the scenarios presented, how did the app meet, or fail to meet, your expectations?”",
			validationResultsTitle: "What the results indicate",
			validationResultsDescription: "The evaluation considered task completion rate, execution time and the SUS (System Usability Scale) questionnaire.",
			validationUsability: "Overall usability",
			validationSusScore: "SUS score",
			validationUsabilityDescription: "Above the average usability score of 68 points.",
			validationStrength: "Strength",
			validationHighestScore: "Highest average score",
			validationStrengthDescription: "“I think I would like to use this system frequently.”",
			validationOpportunity: "Opportunity for improvement",
			validationLowestScore: "Lowest average score",
			validationOpportunityDescription: "“I think I would need help from someone with technical knowledge to use the system.”",
			styleGuideTitle: "Style Guide and Design System",
			styleGuideDescription: "I standardized critical components and visual styles to reduce implementation variations and facilitate communication with the technical team.",
			colorVariables: "Color variables in the Style Guide",
			designSystemComponents: "Design System components",
			learnings: "Learnings",
			learningsTitle: "Validated perceived value. Flows can still be simpler.",
			learningsDescription: "The results indicate high perceived value among users. Some tasks, however, were still considered complex. The next efforts focus on optimizing record editing and deletion, with clearer feedback and better error recovery.",
			empathyLearning: "Empathy for the user",
			empathyLearningDescription: "Taking part in a project with users less familiar with smartphones reinforced the importance of thinking from the audience's perspective, prioritizing clarity and accessibility in the system.",
			productLeadershipLearning: "Leadership and product vision",
			productLeadershipLearningDescription: "Planning an end-to-end product, from defining the problem to validation, while acting as Product Manager brought lessons about data-driven decision-making and communication among stakeholders.",
		},
	},
};

const tagTranslations = {
	Financeiro: "Financial",
	Ilustração: "Illustration",
	"Design Gráfico": "Graphic Design",
	Acessibilidade: "Accessibility",
	"Recursos Públicos": "Public Resources",
	Mandarim: "Mandarin",
	Protótipo: "Prototype",
};

const applyLanguage = (language, shouldAnimate = false) => {
	const selectedTranslations = translations[language];
	const languageChanged = currentLanguage !== language;

	document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
	document.title = language === "pt"
		? "Marcelle Queiroz — UX/UI Designer & iOS Developer"
		: "Marcelle Queiroz — UX/UI Designer & iOS Developer";

	document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach((element) => {
		const translationKey = element.dataset.i18n || element.dataset.i18nHtml;
		const keys = translationKey.split(".");
		let value = selectedTranslations;

		keys.forEach((key) => {
			value = value[key];
		});

		if (element.hasAttribute("data-i18n-html")) {
			element.innerHTML = value;
		} else {
			element.textContent = value;
		}
	});

	document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
		const keys = element.dataset.i18nAriaLabel.split(".");
		let value = selectedTranslations;

		keys.forEach((key) => {
			value = value[key];
		});

		element.setAttribute("aria-label", value);
	});

	document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
		const keys = element.dataset.i18nAlt.split(".");
		let value = selectedTranslations;

		keys.forEach((key) => {
			value = value[key];
		});

		element.setAttribute("alt", value);
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

	window.refreshSkillsIndicator?.();
	if (document.fonts?.ready) {
		document.fonts.ready.then(() => window.refreshSkillsIndicator?.());
	}

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