import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface IPhotos {
  photos: IPhoto[];
  originValue: IPhoto[];
  updatedValue: IPhoto[];
}

const initialState: IPhotos = {
  photos: [],
  originValue: [],
  updatedValue:[]
};

export const fetchPhotos = createAsyncThunk(
  "photos/fetchPhotos",
  async (page: number, { dispatch }) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
    );
    const data: IPhoto[] = await response.json();
    dispatch(updatedValue(data))
    dispatch(originValue(data))
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
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPhotos.fulfilled, (state, action) => {
      state.photos.push(...action.payload);
    });

  },
});

export const { originValue,updatedValue,onChangeValue, confirmValue } = photosSlice.actions;

const { reducer } = photosSlice;

export default reducer;
