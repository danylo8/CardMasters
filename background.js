const totalImages = 44;
const cols = 18;
const rows = 10;
const container = document.getElementById('bg-grid');

for (let i = 0; i < cols * rows; i++) {
    const img = document.createElement('img');
    const num = String(Math.floor(Math.random() * totalImages) + 1).padStart(2, '0');
    img.src = `card-background-images/Image${num}.png`;
    container.appendChild(img);
}
