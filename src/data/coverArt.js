export const coverArt = {
  'the-mediocres': {
    poster: '/media/posters/the-mediocres.jpg',
  },
};

export const coverFor = (id) => coverArt[id] ?? null;
