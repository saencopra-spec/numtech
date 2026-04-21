 let current = 0;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
const total = 3;

function goTo(index) {
  current = index;
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

function moveNext() {
  goTo((current + 1) % total);
}

function movePrev() {
  goTo((current - 1 + total) % total);
}