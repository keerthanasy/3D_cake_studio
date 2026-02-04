import { useEffect, useState } from 'react';
import { useCakeStore } from '../store/useCakeStore';
import { TOPPING_CATEGORIES } from '../utils/toppingConfig';
import './Interface.css';

const STEPS = [
    { id: 'structure', label: 'Structure' },
    { id: 'flavor', label: 'Flavor & Color' },
    { id: 'decor', label: 'Toppings' },
    { id: 'finish', label: 'Finalize' }
];

export const Interface = () => {
    const {
        cakeConfig,
        setShape,
        setSize,
        setBaseColor,
        setFlavor,
        toggleTopping,
        setText,
        getPrice,
        requestScreenshot,
        screenshotData,
        setScreenshotData,
        addLayer,
        removeLayer,
        setLayerHeight,
        getWeight,
    } = useCakeStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [activeCategory, setActiveCategory] = useState('Fruits');
    const layers = cakeConfig.layers || [];

    // Real-time stats
    const totalWeight = getWeight();
    const activeLayerIndex = layers.length - 1;
    const currentLayerHeight = layers[activeLayerIndex]?.height || 1;

    // Currency conversion (Approximate USD to INR for display consistency)
    const priceUSD = getPrice();
    const priceINR = Math.round(priceUSD * 82); // Assuming 1 USD = 82 INR roughly, or just scaling

    useEffect(() => {
        if (screenshotData) {
            if (screenshotData !== 'error') {
                submitOrder(screenshotData);
            } else {
                alert("Failed to capture cake snapshot.");
            }
            setScreenshotData(null);
        }
    }, [screenshotData, setScreenshotData]);

    const handleOrder = () => {
        requestScreenshot();
    };

    // Mock order submission for frontend-only version
    const submitOrder = async (snapshotUrl) => {
        const orderData = {
            cakeConfig,
            totalPrice: priceINR,
            snapshot: snapshotUrl,
            customer: {
                name: "Demo User",
                email: "demo@example.com"
            }
        };

        console.log("Processing Order...", orderData);

        // Simulate network delay
        setTimeout(() => {
            console.log("Order Placed Successfully:", orderData);
            alert(`Order Placed Successfully!\n\nTotal: ₹${priceINR.toLocaleString('en-IN')}\n(This is a demo, no actual order was sent)`);
        }, 1500);
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Structure
                return (
                    <>
                        <div className="control-section" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                            <div className="control-title">Metrics</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', color: 'var(--text-light)' }}>
                                <span>Weight: <strong>{totalWeight}</strong></span>
                                <span>Layers: <strong>{layers.length}</strong></span>
                            </div>
                        </div>

                        <div className="control-section">
                            <div className="control-title">Shape</div>
                            <div className="option-group">
                                {['round', 'square'].map(s => (
                                    <button
                                        key={s}
                                        className={`btn-option ${cakeConfig.shape === s ? 'active' : ''}`}
                                        onClick={() => setShape(s)}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="control-section">
                            <div className="control-title">Size</div>
                            <div className="option-group">
                                {['small', 'medium', 'large'].map(s => {
                                    const weightMap = { small: '1 kg', medium: '2 kg', large: '3 kg' };
                                    return (
                                        <button
                                            key={s}
                                            className={`btn-option ${cakeConfig.size === s ? 'active' : ''}`}
                                            onClick={() => setSize(s)}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                            <div style={{ fontSize: '0.7em', opacity: 0.7 }}>{weightMap[s]}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="control-section">
                            <div className="control-title">Layers</div>
                            <div className="layer-controls" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <button className="btn-option" onClick={removeLayer} disabled={layers.length <= 1} style={{ width: '40px' }}>-</button>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: 'var(--accent-gold)' }}>{layers.length}</span>
                                <button className="btn-option" onClick={addLayer} disabled={layers.length >= 3} style={{ width: '40px' }}>+</button>
                            </div>

                            <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', opacity: 0.8, marginBottom: '8px', display: 'block' }}>
                                Top Layer Height: {currentLayerHeight}x
                            </label>
                            <input
                                type="range"
                                min="0.2"
                                max="2.0"
                                step="0.1"
                                value={currentLayerHeight}
                                onChange={(e) => setLayerHeight(activeLayerIndex, e.target.value)}
                                style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                            />
                        </div>
                    </>
                );

            case 1: // Flavor
                return (
                    <>
                        <div className="control-section">
                            <div className="control-title">Flavor</div>
                            <div className="option-group">
                                {['vanilla', 'chocolate', 'red_velvet', 'matcha'].map(f => (
                                    <button
                                        key={f}
                                        className={`btn-option ${cakeConfig.flavor === f ? 'active' : ''}`}
                                        onClick={() => setFlavor(f)}>
                                        {f.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="control-section">
                            <div className="control-title">Icing Color</div>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    value={cakeConfig.baseColor}
                                    onChange={(e) => setBaseColor(e.target.value)}
                                    className="color-picker"
                                />
                                <span style={{ fontWeight: 600, color: 'var(--text-light)', marginLeft: '10px' }}>{cakeConfig.baseColor}</span>
                            </div>
                        </div>
                    </>
                );

            case 2: // Toppings
                return (
                    <div className="control-section">
                        <div className="control-title">Select Toppings</div>
                        <div className="category-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
                            {Object.keys(TOPPING_CATEGORIES).map(cat => (
                                <button
                                    key={cat}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        border: `1px solid ${activeCategory === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
                                        background: activeCategory === cat ? 'var(--accent-gold)' : 'transparent',
                                        color: activeCategory === cat ? 'var(--primary-navy)' : 'var(--text-light)',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.3s ease',
                                        fontWeight: 600
                                    }}
                                    onClick={() => setActiveCategory(cat)}>
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="topping-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                            {TOPPING_CATEGORIES[activeCategory].map(item => (
                                <button
                                    key={item.id}
                                    className={`btn-option ${cakeConfig.toppings.includes(item.id) ? 'active' : ''}`}
                                    onClick={() => toggleTopping(item.id)}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', height: 'auto' }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: item.color === 'multi' ? 'linear-gradient(45deg, #ff0000, #0000ff)' : item.color,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3: // Finish
                return (
                    <>
                        <div className="control-section">
                            <div className="control-title">Custom Message</div>
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Happy Birthday!"
                                value={cakeConfig.text}
                                onChange={(e) => setText(e.target.value)}
                                maxLength={20}
                                style={{ textAlign: 'center', fontSize: '1.2rem', padding: '1rem' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', opacity: 0.6, marginTop: '5px', textAlign: 'center' }}>
                                (Appears on the cake board)
                            </p>
                        </div>

                        <div className="price-card" style={{ marginTop: '2rem' }}>
                            <div className="price-label">Estimated Total</div>
                            <div className="price-value">₹{priceINR.toLocaleString('en-IN')}</div>
                        </div>
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="controls-panel" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Step Indicator */}
            <div className="steps-indicator" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', position: 'relative' }}>
                <div className="progress-bar-bg" style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
                <div className="progress-bar-fill" style={{ position: 'absolute', top: '50%', left: '0', width: `${(currentStep / (STEPS.length - 1)) * 100}%`, height: '2px', background: 'var(--accent-gold)', zIndex: 0, transition: 'width 0.3s ease' }}></div>

                {STEPS.map((step, index) => (
                    <div key={step.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: index <= currentStep ? 'var(--accent-gold)' : 'var(--secondary-navy)',
                            border: `2px solid ${index <= currentStep ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'}`,
                            color: index <= currentStep ? 'var(--primary-navy)' : 'var(--text-light)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', fontSize: '0.9rem',
                            transition: 'all 0.3s ease'
                        }}>
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '1.1rem' }}>
                {STEPS[currentStep].label}
            </div>

            {/* Content Area - Scrollable if needed, but flex grow */}
            <div className="step-content" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {renderStepContent()}
            </div>

            {/* Navigation Footer */}
            <div className="navigation-footer" style={{ marginTop: 'auto', paddingTop: '10px', paddingBottom: '10px', flexShrink: 0, display: 'flex', gap: '15px' }}>
                <button
                    className="btn-option"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    style={{ flex: 1, opacity: currentStep === 0 ? 0.5 : 1 }}>
                    ← Back
                </button>

                {currentStep === STEPS.length - 1 ? (
                    <button className="btn-order" onClick={handleOrder} style={{ flex: 2 }}>
                        Place Order →
                    </button>
                ) : (
                    <button className="btn-order" onClick={nextStep} style={{ flex: 2 }}>
                        Next Step →
                    </button>
                )}
            </div>
        </div>
    );
}
