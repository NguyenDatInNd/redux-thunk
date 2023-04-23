import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  time: number;
}

interface IPhotos {
  photos: IPhoto[];
  originValue: IPhoto[];
  updatedValue: IPhoto[];
  isLoading: boolean;
}

const initialState: IPhotos = {
  photos: [],
  originValue: [],
  updatedValue: [],
  isLoading: false,
};

export const fetchPhotos = createAsyncThunk(
  "photos/fetchPhotos",
  async (page: number, { dispatch }) => {
    dispatch(toggleLoading(true))
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
    );
    const data: IPhoto[] = await response.json();
    const formatData = data.map((item) => ({
      ...item,
      time: Date.now(),
    }));
    dispatch(updatedValue(formatData));
    dispatch(originValue(formatData));
    dispatch(toggleLoading(false));
    return data;
  }
);

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    originValue: (state, action: PayloadAction<IPhoto[]>) => {
      state.originValue.push(...action.payload);
    },
    updatedValue: (state, action: PayloadAction<IPhoto[]>) => {
      state.updatedValue.push(...action.payload);
    },
    onChangeValue: (state, action: PayloadAction<IPhoto[]>) => {
      state.updatedValue = action.payload;
    },
    confirmValue: (state, action: PayloadAction<IPhoto[]>) => {
      state.originValue = action.payload;
    },
    toggleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPhotos.fulfilled, (state, action) => {
      state.photos.push(...action.payload);
    });
  },
});

export const {
  originValue,
  updatedValue,
  onChangeValue,
  toggleLoading,
  confirmValue,
} = photosSlice.actions;

const { reducer } = photosSlice;

export default reducer;
