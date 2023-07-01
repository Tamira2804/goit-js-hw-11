import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';

export async function fetchImages(search, page) {
  const API_KEY = '37970704-9a867c05051ad7b7bfc1fb55a';
  const URL = `${axios.defaults.baseURL}?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(URL);
    const data = await response.data;

    return response.data;
  } catch (err) {
    return console.log(err);
  }
}
