import { animate, stagger } from 'motion';

// Function to animate characters on hover for all instances
const animateCharacters = () => {
  const animatedTextElements = document.querySelectorAll('#link-hover-text');

  animatedTextElements.forEach((link, i) => {
    const characters = link.textContent.trim().split('');
    link.innerHTML = '';

    
    characters.forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.setAttribute('data-char', char);
      span.classList.add('staggered-character');
      link.appendChild(span);      
    });
    
    const staggeredChars = link.querySelectorAll('.staggered-character');

    const handleHoverStart = () => {
      animate(staggeredChars, {
        transform: `translateY(-110%)`,
      }, {
        delay: stagger(0.05),
        duration: .25,
        easing: [.6, 0.4, 0, 0.2]
      });
      animate(staggeredChars, {
        textShadow: [
          null,
          `0px 1em 0px var(--black)`,
          `0px 1.1em 0px var(--black)`,
          `0px 1em 0px var(--yellow)`,
          `0px 1em 0px var(--black)`,
          `0px 1em 0px var(--black)`,
        ],
      }, {
        delay: stagger(0.03),
        easing: [.6, 0.4, 0, 0.2],
        duration: .8,
        direction: "reverse",
      })
    }

    const handleHoverEnd = () => {
      animate(staggeredChars, {
        transform: `translateY(0px)`,
      }, {
        delay: stagger(0.035, { from: "center" }),
        duration: .3,
        easing: [0.2, 0, 0.4, 0.1]
      });
      staggeredChars.forEach(char => {
        // animate shadow upon hover
        animate(char, {
          textShadow: [
            `0px 1em 0px black`,
          ],
        }, {
          delay: .2,
          easing: [.6, 0.4, 0, 0.2],
          duration: 0.15,
        })
      })
    }

    link.addEventListener('mouseenter', handleHoverStart);    
    link.addEventListener('mouseleave', handleHoverEnd);
  });
};

// Call the function to animate all instances
animateCharacters();
