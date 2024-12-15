import { useRef, useEffect } from 'react';

interface LazyImageProps {
    className?: string;
    src: string;
    alt: string;
}

export default function LazyImage({ 
    className,
    src, 
    alt 
}: LazyImageProps) {
    const elementRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!elementRef.current)
            return;

        const onLoadError = () => {
            if (!elementRef.current)
                return;

            elementRef.current.src = 'https://tr.rbxcdn.com/3e86507fbb9beb6431c5747e5596b06d/768/432/Image/Webp';
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!elementRef.current)
                    return;
                
                if (entry.isIntersecting) {
                    elementRef.current.src = src;
                } else {
                    elementRef.current.src = '';
                }
            },
            { threshold: 0.1 }
        );

        elementRef.current.addEventListener('error', onLoadError);

        observer.observe(elementRef.current);

        return () => {
            observer.disconnect();

            elementRef.current?.removeEventListener('error', onLoadError);
        };
    }, [src]);

    return <img ref={elementRef} className={className} alt={alt} />;
}   