document.addEventListener("DOMContentLoaded", () => {
  const roles = ["Web Designer", "Web Developer", "Graphic Designer"];
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const textElement = document.getElementById("text");

  function typeEffect() {
    const currentRole = roles[currentIndex];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    textElement.textContent = currentRole.substring(0, charIndex);

    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 1000); // pause before deleting
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % roles.length;
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }

  typeEffect(); // Start the typing effect
});

document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.querySelector(".skills");
  const skillBars = [
    { id: "skill-html", percentage: 90 },
    { id: "skill-css", percentage: 80 },
    { id: "skill-js", percentage: 55 }
  ];

  let hasAnimated = false;

  function animateSkillBars() {
    if (hasAnimated) return;
    if (isElementInViewport(skillsSection)) {
      skillBars.forEach((skill) => {
        const elem = document.getElementById(skill.id);
        let width = 0;
        const interval = setInterval(() => {
          if (width >= skill.percentage) {
            clearInterval(interval);
          } else {
            width++;
            elem.style.width = width + "%";
          }
        }, 10);
      });
      hasAnimated = true;
    }
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight - 100 &&
      rect.bottom >= 0
    );
  }

  window.addEventListener("scroll", animateSkillBars);
});
