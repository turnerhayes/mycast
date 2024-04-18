'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/redux/store';
import { addPodcast } from '@/lib/redux/slices/podcast';
import { parseFeed } from './podcast-parser';
import { Podcast } from './podcast';
import { getPodcasts } from '@/lib/redux/selectors';


export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        const store = makeStore();

        const __setPodcasts = () => {
          const url = "https://feeds.npr.org/344098539/podcast.xml";
          parseFeed(url).then((podcastWithoutId) => {
            const podcast: Podcast = {
              id: getPodcasts(store.getState()).length,
              ...podcastWithoutId,
            }
            store.dispatch(addPodcast(podcast));
          });
        };
        
        if (typeof window !== "undefined") {
          (window as any).__setPodcasts = __setPodcasts;
        }

        const setInitialStateIfNeeded = () => {
          const state = store.getState();
          if (state.podcast.items.length === 0) {
            __setPodcasts();
          }
        };

        // const subscribeHandler = () => {
          setInitialStateIfNeeded();
          // unsubscribe();
        // };
        
        // const unsubscribe = store.subscribe(subscribeHandler);
        storeRef.current = store;
    }

    return (
    <Provider store={storeRef.current}>
        {children}
    </Provider>
    );
}