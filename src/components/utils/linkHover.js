import { animate, stagger } from 'motion';

// Function to animate characters on hover for all instances
const animateCharacters = () => {
  const animatedTextElements = document.querySelectorAll('#link-hover-text');

  animatedTextElements.forEach((link, i) => {
    const characters = link.textContent.trim().split('');
    const linkColor = window.getComputedStyle(link).color;
    link.innerHTML = '';

    const TRANSFORM_STAGGER_SPEED = characters.length > 15 ? 0.015 : 0.025
    const COLOR_STAGGER_SPEED = characters.length > 15 ? 0.005 : 0.025
    const RETURN_SPEED = characters.length > 15 ? 0.175 : .23

    const hideArrow = link.getAttribute('data-hide-arrow') === 'false';

    characters.forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.setAttribute('data-char', char);
      span.style.setProperty('--char-color', linkColor);
      span.classList.add('staggered-character');
      link.appendChild(span);      

        // Check if the character is whitespace and add a class for differentiation
      if (/\s/.test(char)) {
        span.classList.add('whitespace-character');
      }
    });
    
    const staggeredChars = link.querySelectorAll('.staggered-character');
    let hoverTimeout; 

    const handleHoverStart = () => {
      animate(staggeredChars, {
        transform: `translateY(-110%)`,
      }, {
        delay: stagger(TRANSFORM_STAGGER_SPEED),
        duration: .225,
        easing: [.6, 0.4, 0, 0.2]
      });
      animate(staggeredChars, {
        textShadow: [
          null,
          `0px 1em 0px ${linkColor}`,
          `0px 1.1em 0px ${linkColor}`,
          `0px 1em 0px var(--grey-200)`,
          `0px 1em 0px ${linkColor}`,
          `0px 1em 0px ${linkColor}`,
        ],
      }, {
        delay: stagger(COLOR_STAGGER_SPEED),
        easing: [.6, 0.4, 0, 0.2],
        duration: .8,
        direction: "reverse",
      })
      if (hideArrow === true) {
        hoverTimeout = setTimeout(() => {
          link.setAttribute('data-hover-complete', true);
        }, 800);
      }
    }

    const handleHoverEnd = () => {
      if (hideArrow === true) {
        clearTimeout(hoverTimeout);
      }
      animate(staggeredChars, {
        transform: `translateY(0px)`,
      }, {
        delay: stagger(0.035, { from: "center" }),
        duration: RETURN_SPEED,
        easing: [0.2, 0, 0.4, 0.1]
      });
      staggeredChars.forEach(char => {
        // animate shadow upon hover
        animate(char, {
          textShadow: [
            `0px 1em 0px ${linkColor}`,
          ],
        }, {
          delay: .2,
          easing: [.6, 0.4, 0, 0.2],
          duration: 0.15,
        }).finished.then(() => {
          link.setAttribute('data-hover-complete', false)
        })
      })
    }

    link.addEventListener('mouseenter', handleHoverStart);    
    link.addEventListener('mouseleave', handleHoverEnd);
  });
};

// Call the function to animate all instances, ONLY if a user is not on mobile

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  return
} else {
  animateCharacters();
}
