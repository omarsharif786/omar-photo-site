const filterButtons = document.querySelectorAll('.filter');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const closeLightbox = lightbox.querySelector('.lightbox-close');

document.getElementById('year').textContent = new Date().getFullYear();

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    galleryItems.forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const image = item.querySelector('img');
    const caption = item.querySelector('figcaption')?.textContent || '';
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function hideLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

closeLightbox.addEventListener('click', hideLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) hideLightbox();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hideLightbox();
});
