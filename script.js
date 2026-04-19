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
    window.setTimeout(proceed, 3500);
  } else {
    window.setTimeout(proceed, 1500);
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
        goWithFade("Home.html");
      }
    });
  }

  initializeOnboardingStep(1);
}

if (currentPage === "login" || currentPage === "signup") {
  const authForm = document.querySelector(".login-form");
  if (authForm) {
    authForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showPreloaderThenNavigate("Home.html", 500);
    });
  }
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
    }
  };

  const closeNavOverlay = () => {
    if (navOverlay) {
      navOverlay.classList.remove("is-open");
    }
  };

  if (menuOpenButtons.length > 0 && navOverlay) {
    menuOpenButtons.forEach((button) => {
      button.addEventListener("click", openNavOverlay);
    });
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

const overlayNavLinks = document.querySelectorAll(".home-nav-link");
overlayNavLinks.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-nav-target");
    if (target) {
      const currentPath = window.location.pathname.toLowerCase();
      const isCurrentPage = currentPath.endsWith("/" + target.toLowerCase()) || currentPath.endsWith(target.toLowerCase());
      if (!isCurrentPage) {
        goWithFade(target);
        return;
      }
    }

    overlayNavLinks.forEach((link) => link.classList.remove("home-nav-link-active"));
    item.classList.add("home-nav-link-active");
  });
});

const bottomNavItems = document.querySelectorAll(".app-bottom-nav-item[data-nav-target]");
bottomNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-nav-target");
    if (!target) {
      return;
    }

    const currentPath = window.location.pathname.toLowerCase();
    const isCurrentPage = currentPath.endsWith("/" + target.toLowerCase()) || currentPath.endsWith(target.toLowerCase());

    if (isCurrentPage) {
      bottomNavItems.forEach((link) => link.classList.remove("app-bottom-nav-item-active"));
      item.classList.add("app-bottom-nav-item-active");
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
