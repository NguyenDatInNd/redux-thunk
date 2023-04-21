import ReactDOM from 'react-dom/client'; 
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import photosReducer from './reduxToolkit/reducer';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    dataPhotos:  photosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);