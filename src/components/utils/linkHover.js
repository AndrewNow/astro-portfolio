import { animate, stagger } from 'motion';

// Function to create and animate characters on hover for all instances
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
        delay: stagger(0.05, { from: "center" }),
        duration: .35,
        easing: [.6, 0.4, 0, 0.2]
      });
      staggeredChars.forEach(char => {
        // animate shadow upon hover
        animate(char, {
          textShadow: [
            `0px 1em 1px var(--black)`,
            `0px 1em 3px var(--grey-300)`,
            `0px 1em 0px var(--grey-200)`,
            `0px 1em 1px var(--grey-100)`,
            `0px 1em 10px var(--yellow)`,
          ],
        }, {
          delay: (Math.random() * .95) + 0.05,
          easing: [.6, 0.4, 0, 0.2],
          duration: 1.6,
          direction: "alternate",
          repeat: Infinity,
        })
      })
    }

    const handleHoverEnd = () => {
      animate(staggeredChars, {
        transform: `translateY(0px)`,
      }, {
        delay: stagger(0.05, { from: "center" }),
        duration: .35,
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
          duration: 0.5,
        })
      })
    }

    // Mouseenter event
    link.addEventListener('mouseenter', handleHoverStart);
    
    // Mouseleave event
    link.addEventListener('mouseleave', handleHoverEnd);
  });
};


function mapRangeTo01(value, x) {
  return (value - 1) / (x - 1);
}
// Function to get a random number between min and max (inclusive)
const getRandomDelay = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Call the function to animate all instances
animateCharacters();
