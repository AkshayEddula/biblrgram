import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        // Warm up the android browser to improve UX
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};