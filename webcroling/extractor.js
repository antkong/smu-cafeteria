async function fetchImages() {
    const response = await fetch('https://www.smu.ac.kr/kor/life/restaurantView3.do');
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const images = doc.querySelectorAll('img');
    const imageContainer = document.getElementById('images');

    images.forEach(img => {
        const src = img.src.startsWith('http') ? img.src : `https://www.smu.ac.kr${img.src}`;
        const imgElement = document.createElement('img');
        imgElement.src = src;
        imageContainer.appendChild(imgElement);
    });
}

fetchImages();
