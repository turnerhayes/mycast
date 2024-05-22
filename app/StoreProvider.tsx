'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore, makeStoreWithPersistor } from '../lib/redux/store';
import { addPodcast } from '@/lib/redux/slices/podcast';
import { parseFeed } from './podcast-parser';
import { Podcast } from './podcast';
import { getPodcasts } from '@/lib/redux/selectors';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';


export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>();
    const persistorRef = useRef<Persistor>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        const {store, persistor} = makeStoreWithPersistor();
        storeRef.current = store;
        persistorRef.current = persistor;

        const __addPodcast = (url: string) => {
          parseFeed(url).then((podcastWithoutId) => {
            const podcasts = getPodcasts(store.getState());
            const exists = podcasts.findIndex(
              (podcast) => podcast.title === podcastWithoutId.title
            ) >= 0;
            if (!exists) {
              const podcast: Podcast = {
                // id: "" + podcasts.length,
                id: url,
                ...podcastWithoutId,
              }
              store.dispatch(addPodcast(podcast));
            }
          });
        };

        const setInitialStateIfNeeded = (podcasts: Podcast[]) => {
          const urls = [
            "https://feeds.npr.org/344098539/podcast.xml",
            "https://www.patreon.com/rss/qanonanonymous?auth=_JuW9d71rN4ESHfw7sKhdBsJCfupplPy",
            "https://www.dimsdale.co.uk/rss/tubt",
          ];

          if (podcasts.length < urls.length) {
            for (const url of urls) {
              __addPodcast(url);
            }
          }
        };

        const subscribeHandler = () => {
          if (store.getState()._persist.rehydrated) {
            const podcasts = getPodcasts(store.getState());
            setInitialStateIfNeeded(podcasts);
          }
          unsubscribe();
        };
        
        const unsubscribe = store.subscribe(subscribeHandler);
    }

    return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        {children}
      </PersistGate>
    </Provider>
    );
}