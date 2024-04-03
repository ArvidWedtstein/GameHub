import { useEffect, useRef } from "react";

// Custom hook by Dan Abramov
export const useInterval = (callback: Function, delay: number) => {
    const savedCallback = useRef<Function>();

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        function tick() {
            if (savedCallback && savedCallback?.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [delay]);
};
