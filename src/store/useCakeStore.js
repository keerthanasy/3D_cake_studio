import { create } from "zustand";

export const useCakeStore = create((set, get) => ({
  cakeConfig: {
    shape: "round",
    size: "medium", // small, medium, large
    baseColor: "#f8cada", // default pinkish
    // Layers support
    layers: [{ id: 1, color: "#f8cada", scale: 1, height: 1 }],
    flavor: "vanilla",
    toppings: [],
    text: "",
    textColor: "#ffffff",
    fruitColor: "#d63031", // default cherry red
  },
  screenshotTrigger: 0,
  screenshotData: null,

  // Cake Actions
  addLayer: () =>
    set((state) => {
      const layers = state.cakeConfig.layers;
      if (layers.length >= 2) return state; // Limit to 2 layers
      const prevLayer = layers[layers.length - 1];
      const newLayer = {
        id: Date.now(),
        color: prevLayer.color, // Inherit color
        scale: Math.max(0.4, prevLayer.scale * 0.8), // Reduce scale
        height: 1, // Default height
      };
      return {
        cakeConfig: {
          ...state.cakeConfig,
          layers: [...layers, newLayer],
        },
      };
    }),

  removeLayer: () =>
    set((state) => {
      if (state.cakeConfig.layers.length <= 1) return state;
      const newLayers = state.cakeConfig.layers.slice(0, -1);
      return {
        cakeConfig: {
          ...state.cakeConfig,
          layers: newLayers,
        },
      };
    }),

  setLayerHeight: (index, height) =>
    set((state) => {
      const newLayers = [...state.cakeConfig.layers];
      if (newLayers[index]) {
        newLayers[index] = { ...newLayers[index], height: parseFloat(height) };
      }
      return {
        cakeConfig: { ...state.cakeConfig, layers: newLayers },
      };
    }),

  setShape: (shape) =>
    set((state) => ({ cakeConfig: { ...state.cakeConfig, shape } })),
  setSize: (size) =>
    set((state) => ({ cakeConfig: { ...state.cakeConfig, size } })),
  requestScreenshot: () =>
    set((state) => ({ screenshotTrigger: Date.now(), screenshotData: null })),
  setScreenshotData: (data) => set(() => ({ screenshotData: data })),
  setBaseColor: (color) =>
    set((state) => {
      // Update the top layer's color
      const layers = [...state.cakeConfig.layers];
      if (layers.length > 0) {
        layers[layers.length - 1].color = color;
      }
      return {
        cakeConfig: {
          ...state.cakeConfig,
          baseColor: color, // Keep root sync for UI
          layers,
        },
      };
    }),
  setFruitColor: (color) =>
    set((state) => ({
      cakeConfig: { ...state.cakeConfig, fruitColor: color },
    })),
  setFlavor: (flavor) => {
    const flavorColors = {
      vanilla: "#f8cada",
      chocolate: "#5d4037",
      red_velvet: "#c0392b",
      matcha: "#b8e994",
    };
    const newColor = flavorColors[flavor] || state.cakeConfig.baseColor;

    // Update all layers for flavor change? or just top?
    // Usually flavor applies to the whole cake.
    set((state) => {
      const layers = state.cakeConfig.layers.map((l) => ({
        ...l,
        color: newColor,
      }));
      return {
        cakeConfig: {
          ...state.cakeConfig,
          flavor,
          baseColor: newColor,
          layers,
        },
      };
    });
  },
  toggleTopping: (topping) =>
    set((state) => {
      const toppings = state.cakeConfig.toppings.includes(topping)
        ? state.cakeConfig.toppings.filter((t) => t !== topping)
        : [...state.cakeConfig.toppings, topping];
      return { cakeConfig: { ...state.cakeConfig, toppings } };
    }),
  setText: (text) =>
    set((state) => ({ cakeConfig: { ...state.cakeConfig, text } })),
  setTextColor: (color) =>
    set((state) => ({ cakeConfig: { ...state.cakeConfig, textColor: color } })),

  getWeight: () => {
    const { layers, size } = get().cakeConfig;
    // Base volume unit per layer (approx) * scale^2 * height
    // Small/Medium/Large multiplier
    const sizeMult = { small: 0.8, medium: 1, large: 1.2 }[size];

    let totalVolume = 0;
    layers.forEach((l) => {
      totalVolume += (l.scale * sizeMult) ** 2 * (l.height || 1);
    });

    // 1 unit volume = 0.5 kg approx
    return (totalVolume * 0.8).toFixed(1) + " kg";
  },

  getTotalHeight: () => {
    const { layers, size } = get().cakeConfig;
    const sizeMult = { small: 0.8, medium: 1, large: 1.2 }[size];
    // Base height unit = 5cm
    const totalUnits = layers.reduce((acc, l) => acc + (l.height || 1), 0);
    return (totalUnits * 5 * sizeMult).toFixed(1) + " cm";
  },

  getPrice: () => {
    const { size, toppings, text, layers } = get().cakeConfig;
    let price = 20;

    // Price based on volume/layers
    // Base cost per layer unit
    layers.forEach((l) => {
      price += 10 * (l.scale || 1) * (l.height || 1);
    });

    if (size === "medium") price *= 1.2;
    if (size === "large") price *= 1.5;

    price += toppings.length * 5;
    if (text) price += 5;
    return price;
  },
}));
