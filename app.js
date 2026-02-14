// 1. Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 3. Media Loaders (Photo and Video)
const textureLoader = new THREE.TextureLoader();
const photoTexture = textureLoader.load('1001191122.jpg'); // Page 1 photo

// Get the video element from HTML and create a VideoTexture
const videoElement = document.getElementById('parkVideo');
const videoTexture = new THREE.VideoTexture(videoElement);

// 4. The Book Pages
const pageGeometry = new THREE.PlaneGeometry(3, 4);

// Left Page starts with the Photo
const leftPageMaterial = new THREE.MeshBasicMaterial({ map: photoTexture, side: THREE.DoubleSide });
const leftPage = new THREE.Mesh(pageGeometry, leftPageMaterial);
leftPage.position.set(-1.5, 0, 0);
leftPage.rotation.y = Math.PI / 8;

// Right Page (The Map Base)
const rightPageMaterial = new THREE.MeshBasicMaterial({ color: 0xeaf6ff, side: THREE.DoubleSide });
const rightPage = new THREE.Mesh(pageGeometry, rightPageMaterial);
rightPage.position.set(1.5, 0, 0);
rightPage.rotation.y = -Math.PI / 8;

scene.add(leftPage);
scene.add(rightPage);

// 5. The Routes
// Route 1: Rametsane to Shorobe St
const pointsRoute1 = [
    new THREE.Vector3(0.5, -1.5, 0.2), 
    new THREE.Vector3(1.5, 0, 0.5),    
    new THREE.Vector3(2.5, 1.5, 0.2)   
];

// Route 2: Shorobe St to FNB Park
const pointsRoute2 = [
    new THREE.Vector3(2.5, 1.5, 0.2),  // Starts where we left off
    new THREE.Vector3(1.0, 1.0, 0.6),  // Different curve
    new THREE.Vector3(0.5, 1.8, 0.2)   // Ends at FNB Park
];

let currentCurve = new THREE.CatmullRomCurve3(pointsRoute1);
const routeGeometry = new THREE.BufferGeometry().setFromPoints(currentCurve.getPoints(50));
const routeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
const routeLine = new THREE.Line(routeGeometry, routeMaterial);
scene.add(routeLine);

// 6. The 3D Car
const carGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.2);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const car = new THREE.Mesh(carGeometry, carMaterial);
scene.add(car);

camera.position.z = 6;
camera.position.y = 1;

// 7. Page Turn Logic (The Button Click)
document.getElementById('nextPageBtn').addEventListener('click', () => {
    // Swap the texture from photo to video
    leftPage.material.map = videoTexture;
    leftPage.material.needsUpdate = true;
    
    // Play the video! (Browsers require a user click to play media, which is why this works perfectly)
    videoElement.play();

    // Change the car's route
    currentCurve = new THREE.CatmullRomCurve3(pointsRoute2);
    routeGeometry.setFromPoints(currentCurve.getPoints(50));
    
    // Reset car position
    fraction = 0; 
});

// 8. Animation Loop
let fraction = 0;

function animate() {
    requestAnimationFrame(animate);

    leftPage.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;
    rightPage.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;

    fraction += 0.005;
    if (fraction > 1) fraction = 0;

    const carPosition = currentCurve.getPoint(fraction);
    car.position.copy(carPosition);

    renderer.render(scene, camera);
}

animate();
