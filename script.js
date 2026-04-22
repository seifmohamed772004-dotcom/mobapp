requestAnimationFrame(() => {
  document.body.classList.add("is-visible");
});

const goWithFade = (nextPath) => {
  document.body.classList.remove("is-visible");
  document.body.classList.add("page-exit");
  window.setTimeout(() => {
    window.location.href = nextPath;
  }, 200);
};

const showPreloaderThenNavigate = (nextPath, delayMs) => {
  const overlay = document.createElement("section");
  overlay.className = "preloader-overlay";
  overlay.setAttribute("aria-label", "Loading");

  const logo = document.createElement("img");
  logo.className = "preloader-logo";
  logo.src = "/Assets/Login Logo.png";
  logo.alt = "Creestudios logo";

  overlay.appendChild(logo);
  document.body.appendChild(overlay);

  window.requestAnimationFrame(() => {
    overlay.classList.add("is-visible");
  });

  window.setTimeout(() => {
    window.location.href = nextPath;
  }, delayMs);
};

const currentPage = document.body.dataset.page;
const accountsStorageKey = "cree-accounts";
const pendingSignupStorageKey = "cree-pending-signup";

const readAccounts = () => {
  try {
    const raw = window.localStorage.getItem(accountsStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveAccounts = (accounts) => {
  window.localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
};

const readPendingSignup = () => {
  try {
    const raw = window.sessionStorage.getItem(pendingSignupStorageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.email !== "string" || typeof parsed.password !== "string") {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
};

const savePendingSignup = (account) => {
  window.sessionStorage.setItem(pendingSignupStorageKey, JSON.stringify(account));
};

const clearPendingSignup = () => {
  window.sessionStorage.removeItem(pendingSignupStorageKey);
};

if (currentPage === "splash") {
  const splashVideo = document.querySelector("#splashVideo");
  let hasNavigated = false;

  const proceed = () => {
    if (hasNavigated) {
      return;
    }
    hasNavigated = true;
    goWithFade("Login.html");
  };

  if (splashVideo) {
    splashVideo.addEventListener("ended", proceed);
    splashVideo.addEventListener("error", proceed);
    window.setTimeout(proceed, 1000000);
  } else {
    window.setTimeout(proceed, 1000000);
  }
}

if (currentPage === "onboarding") {
  const steps = Array.from(document.querySelectorAll(".onboarding-step"));
  const backButton = document.querySelector(".onboarding-back");
  const continueButton = document.querySelector(".onboarding-continue");
  const selectedCount = document.querySelector("[data-selected-count]");

  const selections = {
    1: new Set(),
    2: new Set(),
    3: new Set(),
  };

  let activeStep = 1;
  let isAnimatingStep = false;

  const renderStep = () => {
    steps.forEach((step) => {
      const stepNumber = Number(step.dataset.step);
      const isActive = stepNumber === activeStep;
      step.classList.toggle("is-active", isActive);
    });
  };

  const renderControls = () => {
    const currentSelectionCount = selections[activeStep].size;
    const isDisabled = currentSelectionCount < 1;

    if (continueButton) {
      continueButton.classList.toggle("is-disabled", isDisabled);
      continueButton.disabled = isDisabled;
      continueButton.textContent = activeStep === 3 ? "GET STARTED" : "Continue";
    }

    if (selectedCount && activeStep === 2) {
      selectedCount.textContent = String(selections[2].size);
    }
  };

  const applySelectedStyles = () => {
    steps.forEach((step) => {
      const stepNumber = Number(step.dataset.step);
      const options = Array.from(step.querySelectorAll("[data-value]"));
      options.forEach((option) => {
        option.classList.toggle("is-selected", selections[stepNumber].has(option.dataset.value));
      });
    });
  };

  const moveToStep = (stepNumber) => {
    if (isAnimatingStep || stepNumber === activeStep) {
      return;
    }

    const previousStep = steps.find((step) => Number(step.dataset.step) === activeStep);
    const nextStep = steps.find((step) => Number(step.dataset.step) === stepNumber);
    if (!nextStep) {
      return;
    }

    isAnimatingStep = true;
    if (previousStep) {
      previousStep.classList.remove("is-entered");
    }

    window.setTimeout(() => {
      if (previousStep) {
        previousStep.classList.remove("is-active");
      }

      activeStep = stepNumber;
      nextStep.classList.add("is-active");
      window.requestAnimationFrame(() => {
        nextStep.classList.add("is-entered");
      });

      applySelectedStyles();
      renderControls();

      window.setTimeout(() => {
        isAnimatingStep = false;
      }, 200);
    }, 200);
  };

  const initializeOnboardingStep = (stepNumber) => {
    activeStep = stepNumber;
    renderStep();
    const initialStep = steps.find((step) => Number(step.dataset.step) === stepNumber);
    if (initialStep) {
      initialStep.classList.add("is-entered");
    }
    applySelectedStyles();
    renderControls();
  };

  const step1Options = Array.from(document.querySelectorAll('[data-step="1"] [data-value]'));
  step1Options.forEach((option) => {
    option.addEventListener("click", () => {
      selections[1].clear();
      selections[1].add(option.dataset.value);
      applySelectedStyles();
      renderControls();
    });
  });

  const step2Options = Array.from(document.querySelectorAll('[data-step="2"] [data-value]'));
  step2Options.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      if (selections[2].has(value)) {
        selections[2].delete(value);
      } else if (selections[2].size < 5) {
        selections[2].add(value);
      }
      applySelectedStyles();
      renderControls();
    });
  });

  const step3Options = Array.from(document.querySelectorAll('[data-step="3"] [data-value]'));
  step3Options.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      if (selections[3].has(value)) {
        selections[3].delete(value);
      } else {
        selections[3].add(value);
      }
      applySelectedStyles();
      renderControls();
    });
  });

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (isAnimatingStep) {
        return;
      }
      if (activeStep === 1) {
        goWithFade("SignUp.html");
      } else {
        moveToStep(activeStep - 1);
      }
    });
  }

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      if (continueButton.disabled || isAnimatingStep) {
        return;
      }

      if (activeStep < 3) {
        moveToStep(activeStep + 1);
      } else {
        const pendingSignup = readPendingSignup();
        if (pendingSignup) {
          const accounts = readAccounts();
          const exists = accounts.some((account) => account.email === pendingSignup.email);
          if (!exists) {
            accounts.push(pendingSignup);
            saveAccounts(accounts);
          }
          clearPendingSignup();
        }
        goWithFade("Home.html");
      }
    });
  }

  initializeOnboardingStep(1);
}

if (currentPage === "login" || currentPage === "signup") {
  const authForm = document.querySelector(".login-form");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirm-password");
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

  if (authForm && emailInput && passwordInput) {
    authForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;
      if (!email || !password) {
        window.alert("Please enter your email and password.");
        return;
      }
      if (!gmailPattern.test(email)) {
        window.alert("Please enter a valid Gmail address.");
        return;
      }

      if (currentPage === "signup") {
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";
        if (confirmPasswordInput && !confirmPassword) {
          window.alert("Please enter and confirm your password");
          return;
        }
        if (confirmPasswordInput && password !== confirmPassword) {
          window.alert("Passwords do not match.");
          return;
        }

        const accounts = readAccounts();
        const existingAccount = accounts.find((account) => account.email === email);
        const pendingSignup = readPendingSignup();
        if (existingAccount) {
          window.alert("This email is already registered. Please log in.");
          return;
        }
        if (pendingSignup && pendingSignup.email === email) {
          window.alert("This email is already registered. Please log in.");
          return;
        }

        const accountRecord = { email, password };
        savePendingSignup(accountRecord);
        showPreloaderThenNavigate("OnBoarding.html", 500);
        return;
      }

      const accounts = readAccounts();
      const matchedAccount = accounts.find(
        (account) => account.email === email && account.password === password
      );

      if (!matchedAccount) {
        window.alert("Invalid email or password.");
        return;
      }

      showPreloaderThenNavigate("Home.html", 500);
    });
  }
}

if (currentPage === "studio-call") {
  const questionsOverlay = document.querySelector("#studioQuestionsOverlay");
  const questionsOpen = document.querySelector("#studioQuestionsOpen");
  const questionsClose = document.querySelector("#studioQuestionsClose");
  const questionsBackdrop = document.querySelector("#studioQuestionsBackdrop");

  const openStudioQuestions = () => {
    if (!questionsOverlay) {
      return;
    }
    questionsOverlay.classList.add("is-open");
    questionsOverlay.setAttribute("aria-hidden", "false");
  };

  const closeStudioQuestions = () => {
    if (!questionsOverlay) {
      return;
    }
    questionsOverlay.classList.remove("is-open");
    questionsOverlay.setAttribute("aria-hidden", "true");
  };

  if (questionsOpen) {
    questionsOpen.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openStudioQuestions();
    });
  }

  if (questionsClose) {
    questionsClose.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeStudioQuestions();
    });
  }

  if (questionsBackdrop) {
    questionsBackdrop.addEventListener("click", (event) => {
      event.preventDefault();
      closeStudioQuestions();
    });
  }
}

if (currentPage === "create-team") {
  const joinButtons = document.querySelectorAll("[data-join-toggle]");
  joinButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-join-toggle");
      joinButtons.forEach((item) => {
        const isActive = item.getAttribute("data-join-toggle") === mode;
        item.classList.toggle("create-team-join-btn-active", isActive);
        item.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    });
  });

  const paymentButtons = document.querySelectorAll("[data-payment]");
  paymentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      paymentButtons.forEach((item) => {
        item.classList.toggle("create-team-segment-btn-active", item === button);
      });
    });
  });

  const visibilityRadios = document.querySelectorAll("[data-visibility]");
  visibilityRadios.forEach((button) => {
    button.addEventListener("click", () => {
      visibilityRadios.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("create-team-radio-active", isActive);
        item.setAttribute("aria-checked", isActive ? "true" : "false");
      });
    });
  });

  const skillContainer = document.querySelector("#ctSkillActive");
  const skillInput = document.querySelector("#ct-skill");
  const skillAdd = document.querySelector("#ctSkillAdd");

  if (skillContainer) {
    skillContainer.addEventListener("click", (event) => {
      const removeBtn = event.target.closest(".create-team-chip-remove");
      if (!removeBtn) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const chip = removeBtn.closest(".create-team-chip");
      if (chip) {
        chip.remove();
      }
    });
  }

  if (skillAdd && skillInput && skillContainer) {
    skillAdd.addEventListener("click", () => {
      const value = skillInput.value.trim();
      if (!value) {
        return;
      }

      const chip = document.createElement("article");
      chip.className = "create-team-chip create-team-chip-active";
      const label = document.createElement("span");
      label.textContent = value;
      const removeBtn = document.createElement("button");
      removeBtn.className = "create-team-chip-remove pressable";
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remove skill");
      removeBtn.textContent = "×";
      chip.appendChild(label);
      chip.appendChild(removeBtn);
      skillContainer.appendChild(chip);
      skillInput.value = "";
    });
  }
}

if (currentPage === "cree-ai") {
  const menuOpenButtons = document.querySelectorAll("[data-cree-menu-open]");
  const sidebar = document.querySelector("#creeSidebar");
  const sidebarBackdrop = document.querySelector("#creeSidebarBackdrop");
  const sidebarMain = document.querySelector("#creeSidebarMain");
  const sidebarPrev = document.querySelector("#creeSidebarPrev");
  const sidebarClose = document.querySelector("#creeSidebarClose");
  const prevCancel = document.querySelector("#creePrevCancel");
  const openPrevButton = document.querySelector("#creeOpenPrevChats");
  const startNewChatButton = document.querySelector("#creeStartNewChat");
  const startNewChatPrevButton = document.querySelector("#creeStartNewChatPrev");
  const backToStudioButton = document.querySelector("#creeBackToStudio");
  const chatThread = document.querySelector("#creeChatThread");
  const chatForm = document.querySelector("#creeChatForm");
  const chatInput = document.querySelector("#creeChatInput");

  const setSidebarPage = (page) => {
    if (!sidebarMain || !sidebarPrev) {
      return;
    }
    sidebarMain.classList.toggle("is-active", page === "main");
    sidebarPrev.classList.toggle("is-active", page === "prev");
  };

  const openSidebar = () => {
    setSidebarPage("main");
    if (sidebar) {
      sidebar.classList.add("is-open");
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.add("is-open");
    }
  };

  const closeSidebar = () => {
    if (sidebar) {
      sidebar.classList.remove("is-open");
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove("is-open");
    }
    setSidebarPage("main");
  };

  const getAiGreeting = () => {
    return "Hello! I'm CREE AI, your creative assistant. How can I help you today?";
  };

  const createBubble = (type, text) => {
    const article = document.createElement("article");
    article.className = "cree-bubble " + (type === "user" ? "cree-bubble-user" : "cree-bubble-ai");
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    article.appendChild(paragraph);
    return article;
  };

  const createNewChat = () => {
    if (!chatThread) {
      return;
    }
    chatThread.innerHTML = "";
    chatThread.appendChild(createBubble("ai", getAiGreeting()));
    closeSidebar();
    if (chatInput) {
      chatInput.value = "";
      chatInput.focus();
    }
  };

  menuOpenButtons.forEach((button) => {
    button.addEventListener("click", openSidebar);
  });

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  if (prevCancel) {
    prevCancel.addEventListener("click", () => setSidebarPage("main"));
  }

  if (openPrevButton) {
    openPrevButton.addEventListener("click", () => setSidebarPage("prev"));
  }

  if (startNewChatButton) {
    startNewChatButton.addEventListener("click", createNewChat);
  }

  if (startNewChatPrevButton) {
    startNewChatPrevButton.addEventListener("click", createNewChat);
  }

  if (backToStudioButton) {
    backToStudioButton.addEventListener("click", () => {
      goWithFade("Home.html");
    });
  }

  if (chatForm && chatInput && chatThread) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = chatInput.value.trim();
      if (!value) {
        return;
      }

      chatThread.appendChild(createBubble("user", value));
      chatInput.value = "";

      window.setTimeout(() => {
        chatThread.appendChild(createBubble("ai", "Absolutely! Creating your first portfolio is exciting. Start by defining your goal, selecting your strongest projects, and telling the story behind each one."));
      }, 200);
    });
  }
}

if (currentPage === "team-chat") {
  const teamChatThread = document.querySelector("#teamChatThread");
  const teamChatForm = document.querySelector("#teamChatForm");
  const teamChatInput = document.querySelector("#teamChatInput");

  const teamAvatarSvg =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M12 11a3 3 0 100-6 3 3 0 000 6z" stroke="#181818" stroke-width="2"/>' +
    '<path d="M5 20v-1a7 7 0 0114 0v1" stroke="#181818" stroke-width="2" stroke-linecap="round"/>' +
    "</svg>";

  const createTeamChatRow = (type, text) => {
    const row = document.createElement("article");
    row.className = "cree-chat-row " + (type === "user" ? "cree-chat-row--user" : "cree-chat-row--ai");

    const avatar = document.createElement("span");
    avatar.className = "cree-msg-avatar " + (type === "user" ? "cree-msg-avatar-user" : "cree-msg-avatar-ai");
    avatar.setAttribute("aria-hidden", "true");
    if (type === "user") {
      avatar.textContent = "U";
    } else {
      avatar.innerHTML = teamAvatarSvg;
    }

    const bubble = document.createElement("article");
    bubble.className = "cree-bubble " + (type === "user" ? "cree-bubble-user" : "cree-bubble-ai");
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    bubble.appendChild(paragraph);
    row.appendChild(avatar);
    row.appendChild(bubble);
    return row;
  };

  if (teamChatForm && teamChatInput && teamChatThread) {
    teamChatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = teamChatInput.value.trim();
      if (!value) {
        return;
      }

      teamChatThread.appendChild(createTeamChatRow("user", value));
      teamChatInput.value = "";

      window.setTimeout(() => {
        teamChatThread.appendChild(
          createTeamChatRow(
            "ai",
            "Echo Studio received your message. The team can reply here or follow up on your next call."
          )
        );
      }, 200);
    });
  }
}

if (currentPage === "team-tasks") {
  document.querySelectorAll(".team-tasks-group-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".team-tasks-group");
      if (!group) {
        return;
      }
      group.classList.toggle("team-tasks-group-open");
      const isOpen = group.classList.contains("team-tasks-group-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn.classList.toggle("team-tasks-group-toggle-collapsed", !isOpen);
      const chev = btn.querySelector(".team-tasks-group-chevron");
      if (chev) {
        chev.textContent = isOpen ? "▾" : "›";
      }
    });
  });
}

{
  const searchWrap = document.querySelector(".home-search-wrap");
  const searchInput = searchWrap ? searchWrap.querySelector("input") : null;
  const searchPanel = document.querySelector(".home-search-panel");
  const searchPanelInput = document.querySelector("#homeSearchPanelInput");
  const searchClose = document.querySelector("#homeSearchClose");
  const menuOpenButtons = document.querySelectorAll("[data-menu-open]");
  const navOverlay = document.querySelector(".home-nav-overlay");
  const navBackButton = document.querySelector("#homeNavBack");
  const navLogoutButton = document.querySelector(".home-nav-logout");
  const navFooter = document.querySelector(".home-nav-footer");

  const openSearchPanel = () => {
    if (!searchPanel) {
      return;
    }
    searchPanel.classList.add("is-open");
    window.requestAnimationFrame(() => {
      if (searchPanelInput) {
        searchPanelInput.focus();
      }
    });
  };

  const closeSearchPanel = () => {
    if (searchPanel) {
      searchPanel.classList.remove("is-open");
    }
  };

  if (searchWrap && searchPanel) {
    searchWrap.addEventListener("click", openSearchPanel);
    if (searchInput) {
      searchInput.addEventListener("focus", openSearchPanel);
    }
    if (searchClose) {
      searchClose.addEventListener("click", closeSearchPanel);
    }
  }

  const openNavOverlay = () => {
    closeSearchPanel();
    if (navOverlay) {
      navOverlay.classList.add("is-open");
      if (window.location.hash.toLowerCase() !== "#nav-overlay") {
        window.history.replaceState(null, "", "#nav-overlay");
      }
      return;
    }

    // Fallback for pages that have a burger but no local overlay markup.
    goWithFade("Home.html#nav-overlay");
  };

  const closeNavOverlay = () => {
    if (navOverlay) {
      navOverlay.classList.remove("is-open");
      if (window.location.hash.toLowerCase() === "#nav-overlay") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  };

  if (menuOpenButtons.length > 0 && navOverlay) {
    menuOpenButtons.forEach((button) => {
      button.addEventListener("click", openNavOverlay);
    });
  }

  if (menuOpenButtons.length > 0 && !navOverlay) {
    menuOpenButtons.forEach((button) => {
      button.addEventListener("click", openNavOverlay);
    });
  }

  if (navOverlay && window.location.hash.toLowerCase() === "#nav-overlay") {
    openNavOverlay();
  }

  if (navBackButton) {
    navBackButton.addEventListener("click", closeNavOverlay);
  }

  if (navLogoutButton && navFooter) {
    let logoutArmed = false;
    let logoutTimer = null;

    const disarmLogout = () => {
      logoutArmed = false;
      navFooter.classList.remove("is-logout-armed");
      if (logoutTimer) {
        window.clearTimeout(logoutTimer);
        logoutTimer = null;
      }
    };

    navLogoutButton.addEventListener("click", () => {
      if (!logoutArmed) {
        logoutArmed = true;
        navFooter.classList.add("is-logout-armed");
        logoutTimer = window.setTimeout(disarmLogout, 3000);
        return;
      }

      disarmLogout();
      goWithFade("Login.html");
    });
  }
}

const pressables = document.querySelectorAll(".pressable");

pressables.forEach((element) => {
  const clearPress = () => {
    element.classList.remove("is-pressed");
  };

  element.addEventListener("pointerdown", () => {
    element.classList.add("is-pressed");
  });

  element.addEventListener("pointerup", clearPress);
  element.addEventListener("pointercancel", clearPress);
  element.addEventListener("pointerleave", clearPress);
});

const revealTargets = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealTargets.forEach((target) => observer.observe(target));

const passwordField = document.querySelector("#password");
const passwordToggle = document.querySelector("#passwordToggle");
const passwordToggleIcon = document.querySelector("#passwordToggleIcon");

if (passwordField && passwordToggle && passwordToggleIcon) {
  passwordToggle.addEventListener("click", () => {
    const isHidden = passwordField.type === "password";
    passwordField.type = isHidden ? "text" : "password";
    passwordToggleIcon.src = isHidden ? "/Assets/Shown Icon.png" : "/Assets/Hidden Icon.png";
    passwordToggleIcon.alt = isHidden ? "Password shown icon" : "Password hidden icon";
  });
}

const confirmPasswordField = document.querySelector("#confirm-password");
const confirmPasswordToggle = document.querySelector("#confirm-password-toggle");
const confirmPasswordToggleIcon = document.querySelector("#confirm-password-toggle-icon");

if (confirmPasswordField && confirmPasswordToggle && confirmPasswordToggleIcon) {
  confirmPasswordToggle.addEventListener("click", () => {
    const isHidden = confirmPasswordField.type === "password";
    confirmPasswordField.type = isHidden ? "text" : "password";
    confirmPasswordToggleIcon.src = isHidden ? "/Assets/Shown Icon.png" : "/Assets/Hidden Icon.png";
    confirmPasswordToggleIcon.alt = isHidden ? "Confirm password shown icon" : "Confirm password hidden icon";
  });
}

const likeButtons = document.querySelectorAll("[data-like-toggle]");

likeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const icon = button.querySelector("[data-like-icon]");
    if (!icon) {
      return;
    }

    const isLiked = button.classList.toggle("is-liked");
    icon.src = isLiked ? "/Assets/Liked Icon.png" : "/Assets/Like Icon.png";
    icon.alt = isLiked ? "Liked icon" : "Like icon";
  });
});

const appPageRegistry = [
  { file: "Home.html", title: "Home", inner: false },
  { file: "Teams.html", title: "Teams", inner: false },
  { file: "CreeAI.html", title: "CREE AI", inner: false },
  { file: "Alerts.html", title: "Alerts", inner: false },
  { file: "Settings.html", title: "Settings", inner: false },
  { file: "CommunitiesMain.html", title: "Communities", inner: false },
  { file: "FriendsMain.html", title: "Friends", inner: false },
  { file: "ExploreJobs.html", title: "Explore Jobs", inner: false },
  { file: "MyJobs.html", title: "My Jobs", inner: false },
  { file: "AllJobs.html", title: "All Jobs", inner: false },
  { file: "MemberProfile.html", title: "Member Profile", inner: true },
  { file: "FriendMemberProfile.html", title: "Friend Profile", inner: true },
  { file: "CommunityInner.html", title: "Community Inner", inner: true },
  { file: "TeamDetails.html", title: "Team Details", inner: true },
  { file: "TeamChat.html", title: "Team Chat", inner: true },
  { file: "TeamTasks.html", title: "Team Tasks", inner: true },
  { file: "StudioCall.html", title: "Studio Call", inner: true },
  { file: "CreateTeam.html", title: "Create Team", inner: true },
  { file: "JobDetails.html", title: "Job Details", inner: true },
  { file: "CreateJobPosting.html", title: "Create Job Posting", inner: true },
  { file: "RequestedJobInner.html", title: "Requested Job", inner: true },
  { file: "Login.html", title: "Login", inner: false },
  { file: "SignUp.html", title: "Sign Up", inner: false },
  { file: "OnBoarding.html", title: "Onboarding", inner: false },
];

const navLabelTargetFallbacks = {
  "PROFILE": "MemberProfile.html",
  "FRIEND LINKS": "FriendsMain.html",
  "NOTIFICATIONS": "Alerts.html",
  "ADD PAGE": "CreateJobPosting.html",
  "REPORTS": "TeamTasks.html",
};

const isCurrentTargetPath = (target) => {
  if (!target) {
    return false;
  }
  const currentPath = window.location.pathname.toLowerCase();
  const normalizedTarget = target.toLowerCase();
  return currentPath.endsWith("/" + normalizedTarget) || currentPath.endsWith(normalizedTarget);
};

const hydrateOverlayNav = () => {
  const navContainers = document.querySelectorAll(".home-nav-links");
  if (navContainers.length === 0) {
    return;
  }

  navContainers.forEach((container) => {
    const existingLinks = Array.from(container.querySelectorAll(".home-nav-link"));
    const linkedTargets = new Set(
      existingLinks
        .map((link) => (link.getAttribute("data-nav-target") || "").toLowerCase())
        .filter(Boolean)
    );

    // Auto-link existing overlay labels that were missing targets.
    existingLinks.forEach((link) => {
      const hasTarget = !!link.getAttribute("data-nav-target");
      if (hasTarget) {
        return;
      }
      const normalizedLabel = (link.textContent || "").trim().toUpperCase();
      const fallbackTarget = navLabelTargetFallbacks[normalizedLabel];
      if (fallbackTarget) {
        link.setAttribute("data-nav-target", fallbackTarget);
        linkedTargets.add(fallbackTarget.toLowerCase());
      }
    });

    // Ensure every known page appears in overlay nav if it isn't linked yet.
    appPageRegistry.forEach((page) => {
      const normalizedTarget = page.file.toLowerCase();
      if (linkedTargets.has(normalizedTarget)) {
        return;
      }

      const button = document.createElement("button");
      button.className = "home-nav-link pressable";
      button.type = "button";
      button.textContent = page.title.toUpperCase();
      button.setAttribute("data-nav-target", page.file);
      if (page.inner) {
        button.setAttribute("data-inner-page", "true");
      }
      container.appendChild(button);
      linkedTargets.add(normalizedTarget);
    });
  });
};

hydrateOverlayNav();

const overlayNavLinks = document.querySelectorAll(".home-nav-link");
overlayNavLinks.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-nav-target");
    if (target && !isCurrentTargetPath(target)) {
      goWithFade(target);
      return;
    }

    overlayNavLinks.forEach((link) => link.classList.remove("home-nav-link-active"));
    item.classList.add("home-nav-link-active");
  });

  const target = item.getAttribute("data-nav-target");
  if (target && isCurrentTargetPath(target)) {
    overlayNavLinks.forEach((link) => link.classList.remove("home-nav-link-active"));
    item.classList.add("home-nav-link-active");
  }
});

const bottomNavItems = document.querySelectorAll(".app-bottom-nav-item[data-nav-target]");

const navPageGroups = {
  home: new Set(["home", "communities-main", "community-inner", "friends-main", "member-profile", "friendmemberprofile"]),
  jobs: new Set([
    "teams",
    "team-details",
    "studio-call",
    "create-team",
    "team-chat",
    "team-tasks",
    "explore-jobs",
    "my-jobs",
    "all-jobs",
    "job-details",
    "create-job-posting",
    "requested-job-inner",
  ]),
  cree: new Set(["cree-ai"]),
  alerts: new Set(["alerts"]),
};

const navIconMap = {
  home: {
    selected: "/Assets/Home Icon Nav.png",
    unselected: "/Assets/Home Icon Nav (Unselected).png",
  },
  jobs: {
    selected: "/Assets/Work Icon Nav (Selected).png",
    unselected: "/Assets/Work Icon Nav.png",
  },
  cree: {
    selected: "/Assets/Cree Ai Icon Nav (Selected).png",
    unselected: "/Assets/Cree Ai Nav.png",
  },
  alerts: {
    selected: "/Assets/Alert Icon Nav (Selected).png",
    unselected: "/Assets/Alert Icon Nav.png",
  },
};

const getNavKeyFromItem = (item) => {
  const label = (item.getAttribute("aria-label") || "").toLowerCase();
  if (label.includes("home")) {
    return "home";
  }
  if (label.includes("job")) {
    return "jobs";
  }
  if (label.includes("cree")) {
    return "cree";
  }
  if (label.includes("alert")) {
    return "alerts";
  }
  return null;
};

const getActiveNavKeyForPage = () => {
  const pageKey = (currentPage || "").toLowerCase();
  if (navPageGroups.home.has(pageKey)) {
    return "home";
  }
  if (navPageGroups.jobs.has(pageKey)) {
    return "jobs";
  }
  if (navPageGroups.cree.has(pageKey)) {
    return "cree";
  }
  if (navPageGroups.alerts.has(pageKey)) {
    return "alerts";
  }
  return null;
};

const applyBottomNavVisualState = () => {
  const activeNavKey = getActiveNavKeyForPage();
  bottomNavItems.forEach((item) => {
    const key = getNavKeyFromItem(item);
    const icon = item.querySelector("img");
    const label = item.querySelector("span");
    const isActive = !!activeNavKey && key === activeNavKey;

    item.classList.toggle("app-bottom-nav-item-active", isActive);
    item.style.opacity = isActive ? "1" : "0.5";

    if (label) {
      label.style.color = isActive ? "#55A887" : "#FFEEDC";
      label.style.opacity = isActive ? "1" : "0.5";
    }

    if (icon && key && navIconMap[key]) {
      icon.src = isActive ? navIconMap[key].selected : navIconMap[key].unselected;
      icon.style.opacity = isActive ? "1" : "0.5";
    }
  });
};

applyBottomNavVisualState();

bottomNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-nav-target");
    if (!target) {
      return;
    }

    const currentPath = window.location.pathname.toLowerCase();
    const isCurrentPage = currentPath.endsWith("/" + target.toLowerCase()) || currentPath.endsWith(target.toLowerCase());

    if (isCurrentPage) {
      applyBottomNavVisualState();
      return;
    }

    goWithFade(target);
  });
});

const iosSwitches = document.querySelectorAll("[data-ios-switch]");
iosSwitches.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const isOn = toggle.classList.toggle("is-on");
    toggle.setAttribute("aria-checked", isOn ? "true" : "false");
  });
});

const settingsLogoutButton = document.querySelector("[data-settings-logout]");
if (settingsLogoutButton) {
  settingsLogoutButton.addEventListener("click", () => {
    goWithFade("Login.html");
  });
}

const teamViewButtons = document.querySelectorAll(".teams-action-button-outline");
teamViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    goWithFade("TeamDetails.html");
  });
});

const genericNavTargets = document.querySelectorAll("[data-nav-target]");
genericNavTargets.forEach((item) => {
  if (
    item.classList.contains("app-bottom-nav-item") ||
    item.classList.contains("home-nav-link")
  ) {
    return;
  }

  const navigateToTarget = () => {
    const target = item.getAttribute("data-nav-target");
    if (!target) {
      return;
    }
    goWithFade(target);
  };

  item.addEventListener("click", navigateToTarget);

  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToTarget();
    }
  });
});

