// Import the CSS file for styling
import "./style.css";

// Get a reference to the canvas element and set its dimensions
const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Define the radius of the circles and export it
const circleRadius = 12; // Radius of the circles (can be adjusted)
const blockingRadius = circleRadius * 2; // Minimum distance for blocking interaction
const savedistance = circleRadius * 2; // Minimum distance between dots
let mouseX = 0; // Horizontal position of the mouse
let mouseY = 0; // Vertical position of the mouse

// Update mouseX and mouseY when the mouse moves over the canvas
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
canvas.style.background = "#000000"
// Create an array to store the dots and their positions
const dots: { x: number; y: number; vx: number; vy: number; color: string; radius: number }[] = [];

// Function to create a new dot on the canvas
function makedot() {
    // Generate random coordinates for the dot within the canvas size
    const randomCoordinates = getRandomCoordinates();
    const { x, y } = randomCoordinates;
    const size = circleRadius + Math.random() * 3

    // Generate random velocity for the dot
    const { vx, vy } = getRandomVelocity();

    // Get a random color for the dot   
    const color = getRandomHexColor();

    let isok = true;

    // Calculate the distance from the dot to the cursor 
    const distanceToCursor = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);

    // Check if the dot is too close to other dots or the cursor
    for (const dot of dots) {
        // Calculate the distance between the new dot and existing dots
        const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);

        // Check if the new dot is too close to others or the cursor
        if (distance < savedistance || distanceToCursor < blockingRadius) {
            isok = false;
            break;
        }
    }

    // If the dot is not too close to others or the cursor, add it to the array
    if (isok) {
        dots.push({ x, y, vx, vy, color, radius: size });
    }
}

// Function to generate random x and y coordinates within the canvas size
function getRandomCoordinates() {
    const safeborder = circleRadius * 2;
    const x = Math.random() * (width - safeborder * 2) + safeborder;
    const y = Math.random() * (height - safeborder * 2) + safeborder;
    return { x, y };
}

// Function to generate random velocity for the dots
function getRandomVelocity() {
    const minSpeed = 5; // Minimum speed
    const maxSpeed = 20; // Maximum speed
    const vx = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);
    const vy = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);
    return { vx, vy };
}

// Function to generate a random hex color
function getRandomHexColor(): string {
    let randomcolor = "#"; // Initialize the hex color string
    let letters = "0123456789ABCDEF"; // Hexadecimal characters

    // Generate a random 6-character hex color code
    for (let i = 0; i < 6; i++) {
        randomcolor += letters[Math.floor(Math.random() * 16)]; // Add a random character
    }
    return randomcolor; // Return the random hex color code
}

// Function to move the dots on the canvas
function moveDots() {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Update the position and velocity of each dot
    dots.forEach((dot, index) => {
        // Calculate the distance between the dot and the mouse
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        let click: { x: number; y: number; vx: number; vy: number; color: string; radius: number } | null = null;
        function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
            return Math.sqrt((x1 - x2) ** 2 + (y1 + y2) ** 2)
        }
        canvas.addEventListener("click", handleClick);

        function handleClick(event: MouseEvent) {
            let x = event.clientX - canvas.getBoundingClientRect().left;
            let y = event.clientY - canvas.getBoundingClientRect().top;

            for (const dot of dots) {// check if the click is within the dot 
                let distance = calculateDistance(x, y, dot.x, dot.y);
                if (distance <= dot.radius) {
                    click = dot;
                    click.radius = Math.random() * 50 + 15
                    break;
                }
            }
        }

        // Calculate the new velocity based on the distance to the mouse
        const speed = 2; // Adjust this value to control the speed of the interaction
        dot.vx = (dx / distanceToMouse) * speed;
        dot.vy = (dy / distanceToMouse) * speed;

        // Update the dot's position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Check if the dot is outside the canvas boundaries and reverse its velocity if needed
        if (dot.x - circleRadius < 0 || dot.x + circleRadius > width) {
            dot.vx *= -1;
        }
        if (dot.y - circleRadius < 0 || dot.y + circleRadius > height) {
            dot.vy *= -1;
            ;
        }
        // Remove dots that have moved outside the canvas
        if (dot.x < 0 || dot.x > width || dot.y < 0 || dot.y > height) {
            dots.splice(index, 1);
        }
    });
    
    // Draw each dot on the canvas
    dots.forEach((dot) => {
        ctx.beginPath();
        ctx.globalAlpha = 0.4 //change the number for change the opacity

        for (let i = 0; i < 3; i++) {
            ctx.arc(dot.x, dot.y, dot.radius * i, 0, Math.PI * 2); // Draw a filled circle
        }

        const radgrad = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 20);
        radgrad.addColorStop(0, "transparent");
        radgrad.addColorStop(0.3, " red")
        radgrad.addColorStop(0.5, " transparent")
        radgrad.addColorStop(0.7, "white"); // You can change 'color' to another color if needed
        ctx.fillStyle = radgrad
        ctx.fill()
        ctx.closePath()

    });


    // Request the next animation frame
    requestAnimationFrame(moveDots);
}
canvas.addEventListener("click", makedot);
//Start the animation loop
moveDots();
