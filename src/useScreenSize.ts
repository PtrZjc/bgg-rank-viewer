import {atom, useAtom, useAtomValue} from 'jotai';
import {useEffect} from "react";

const windowWidthAtom = atom(typeof window !== 'undefined' ? window.innerWidth : 0);

const screenSizeAtom = atom((get) => {
    const width = get(windowWidthAtom);
    return {
        // consistent with tailwind breakpoints
        isSm: width >= 640,
        isMd: width >= 768,
        isLg: width >= 1024,
        isXl: width >= 1280,
        is2Xl: width >= 1536,
        // additional
        isSmAndDown: width < 640,
        isMdAndDown: width < 768,
        isLgAndDown: width < 1024,
    };
});

export const useScreenSize = () => {
    const [_width, setWidth] = useAtom(windowWidthAtom);
    const screenSize = useAtomValue(screenSizeAtom);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            console.log('Resized to:', window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [setWidth]);

    return screenSize;
};
