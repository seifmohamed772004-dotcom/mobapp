requestAnimationFrame(() => {
  document.body.classList.add("is-visible");
});

const goWithFade = (nextPath) => {
  document.body.classList.remove("is-visible");
  document.body.classList.add("page-exit");
  window.setTimeout(() => {
    window.location.href = nextPath;
  }, 450);
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
