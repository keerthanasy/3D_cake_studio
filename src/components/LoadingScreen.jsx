import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';
import './LoadingScreen.css';

export const LoadingScreen = () => {
    const { progress, active } = useProgress();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (progress === 100) {
            // Keep the screen visible for a moment even after 100% to feel smooth
            const timer = setTimeout(() => setFadeOut(true), 800);
            return () => clearTimeout(timer);
        } else {
            setFadeOut(false);
        }
    }, [progress]);

    // Force show if active, otherwise respect fadeOut state
    // We only hide when fadeOut becomes true (after 100% + delay)
    // Note: 'active' can be flaky initially, so we also rely on progress
    const isVisible = active || progress < 100 || !fadeOut;

    return (
        <div className={`loading-screen ${!isVisible ? 'hidden' : ''}`}>
            <div className="loading-content">
                <h2 className="loading-title">Cake Studio 3D</h2>
                <div className="loading-bar-container">
                    <div
                        className="loading-bar-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="loading-percentage">{Math.round(progress)}%</div>
            </div>
        </div>
    );
};
