import axios from 'axios';

axios.defaults.baseURL = 'https://';

export async function fetchImages(search, page) {
  const API_KEY = '37970704-9a867c05051ad7b7bfc1fb55a';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(URL);
    const data = await response.data;
    if (response.status !== 200 || response.status === '') {
      throw new Error(response.status);
    } else {
      return data;
    }
  } catch (err) {
    return console.log(err);
  }
}
