// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { hostVisitApi } from "../features/hostVisit/hostVisitApi";
import { resourceVisitApi } from "../features/resourceVisit/resourceVisitApi";

export const store = configureStore({
  reducer: {
    [hostVisitApi.reducerPath]: hostVisitApi.reducer,
    [resourceVisitApi.reducerPath]: resourceVisitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      hostVisitApi.middleware,
      resourceVisitApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
