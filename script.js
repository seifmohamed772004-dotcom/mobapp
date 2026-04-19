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
