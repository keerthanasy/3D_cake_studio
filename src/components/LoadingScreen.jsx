import './LoadingScreen.css';

export const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="cake-loader">
                    <div className="cake-layer layer-1"></div>
                    <div className="cake-layer layer-2"></div>
                    <div className="cake-layer layer-3"></div>
                    <div className="candle"></div>
                </div>
                <h2 className="loading-title">Cake Studio 3D</h2>
                <p className="loading-text">Preparing your cake designer...</p>
                <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div>
            </div>
        </div>
    );
};
