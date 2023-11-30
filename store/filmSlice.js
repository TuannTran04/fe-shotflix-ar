import { createSlice } from "@reduxjs/toolkit";

const filmSlice = createSlice({
  name: "film",
  initialState: {
    isFetching: false,
    movies: {},
    favoriteFilm: [],
    watchLaterFilm: [],
  },
  reducers: {
    fetchFilmStart: (state) => {
      state.isFetching = true;
    },
    fetchFilmFailed: (state) => {
      state.isFetching = false;
    },
    addArrFavorite: (state, action) => {
      // console.log(action.payload);
      state.favoriteFilm = action.payload;
    },
    addArrWatchLater: (state, action) => {
      state.watchLaterFilm = action.payload;
    },
    addDataMovies: (state, action) => {
      // console.log("payload", action.payload);
      state.movies = action.payload;
      state.isFetching = false;
    },

    deleteSuccess: (state) => {
      // state.favoriteFilm = [];
      // state.watchLaterFilm = [];
      state.movies = {};
    },
    deleteSuccess_user: (state) => {
      state.favoriteFilm = [];
      state.watchLaterFilm = [];
    },
  },
});

export const {
  fetchFilmStart,
  fetchFilmFailed,
  addArrFavorite,
  addArrWatchLater,
  addDataMovies,
  deleteSuccess,
  deleteSuccess_user,
} = filmSlice.actions;

export default filmSlice.reducer;
