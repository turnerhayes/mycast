import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import {PodcastSliceState, podcastReducer} from "./slices/podcast";
import {PlaylistSliceState, playlistReducer} from "./slices/playlist";


interface RootReducerState {
  podcast: PodcastSliceState;
  playlist: PlaylistSliceState;
}

const persistedReducer = persistReducer<RootReducerState>({
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
}, combineReducers({
  podcast: podcastReducer,
  playlist: playlistReducer,
}));

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
          ],
        },
      });
    },
  });
};

export const makeStoreWithPersistor = () => {
  const store = makeStore();
  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];