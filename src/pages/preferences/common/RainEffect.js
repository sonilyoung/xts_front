import React, { useEffect } from 'react';
import './CommonRain.css'; // Import the CSS file with animation styles

const RainEffect = () => {
    useEffect(() => {
        // Create raindrops dynamically
        const createRaindrop = () => {
            const raindrop = document.createElement('div');
            raindrop.classList.add('raindrop');
            raindrop.style.left = `${Math.random() * 100}%`;
            document.body.appendChild(raindrop);

            // Animate raindrop falling
            const animationDuration = Math.random() * 2 + 1; // Randomize animation duration (1-3 seconds)
            raindrop.style.animation = `raindropAnimation ${animationDuration}s linear infinite`;

            // Remove raindrop from DOM after animation ends
            raindrop.addEventListener('animationiteration', () => {
                raindrop.remove();
                createRaindrop(); // Recreate the raindrop at the top
            });
        };

        // Create initial raindrops
        for (let i = 0; i < 100; i++) {
            createRaindrop();
        }
    }, []);

    return null; // No need to render anything in this component
};

export default RainEffect;
