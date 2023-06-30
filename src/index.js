import { fetchImages } from './js/pixabay-api.js';
import { createGalleryCard } from './js/create-gallerycard.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const inputSearchQueryRef = document.querySelector('[name="searchQuery"]');
const galleryRef = document.querySelector('.gallery');
const formSearchRef = document.querySelector('.search-form');
const buttonLoadMoreRef = document.querySelector('.load-more');

let currentSearch = '';
let currentPage = 1;
const lightbox = new SimpleLightbox('.gallery a');

inputSearchQueryRef.addEventListener('input', onInputSearchQuery);
formSearchRef.addEventListener('submit', onButtonSearchSubmit);
buttonLoadMoreRef.addEventListener('click', onButtonLoadMoreClick);

function onInputSearchQuery(event) {
  currentSearch = event.target.value.trim();
}

async function onButtonSearchSubmit(event) {
  event.preventDefault();

  currentPage = 1;
  galleryRef.innerHTML = '';
  buttonLoadMoreRef.style.visibility = 'hidden';

  if (currentSearch === '') {
    return;
  }

  await fetchImages(currentSearch)
    .then(images => {
      const photos = images.hits;
      const totalCard = images.totalHits;

      buttonLoadMoreRef.style.visibility = 'visible';

      if (photos.length === 0) {
        if (currentPage === 1) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          buttonLoadMoreRef.style.visibility = 'hidden';
        } else {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          buttonLoadMoreRef.style.visibility = 'hidden';
        }
        return;
      }

      Notiflix.Notify.success(`Hooray! We found ${totalCard} images.`);

      galleryRef.insertAdjacentHTML('afterbegin', createGalleryCard(photos));

      lightbox.refresh();
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
}

async function onButtonLoadMoreClick() {
  currentPage += 1;
  await fetchImages(currentSearch, currentPage)
    .then(images => {
      const photos = images.hits;

      galleryRef.insertAdjacentHTML('beforeend', createGalleryCard(photos));
      lightbox.refresh();
      scrollGallery();
    })
    .catch(() => {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      buttonLoadMoreRef.style.visibility = 'hidden';
    });
}

function scrollGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
