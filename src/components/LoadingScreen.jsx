import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';
import './LoadingScreen.css';

export const LoadingScreen = () => {
    const { progress, active } = useProgress();
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    useEffect(() => {
        if (progress === 100) {
            // Keep the screen visible for a moment even after 100% to feel smooth
            const timer = setTimeout(() => {
                setFadeOut(true);
                // Mark initial load as complete after the transition
                setTimeout(() => setInitialLoadComplete(true), 800);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            // Only reset fadeOut if we haven't finished the initial load yet
            if (!initialLoadComplete) {
                setFadeOut(false);
            }
        }
    }, [progress, initialLoadComplete]);

    // Once initial load is done, force isVisible to false regardless of new 'active' states
    // This prevents the screen from showing up again when switching shapes/models
    const isVisible = !initialLoadComplete && (active || progress < 100 || !fadeOut);

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
