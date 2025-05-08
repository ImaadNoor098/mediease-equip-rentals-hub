import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Oxygen Concentrator",
    description: "Portable oxygen concentrator for home and travel use. Provides continuous flow of oxygen for patients with respiratory conditions.",
    category: "Respiratory",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop",
    rentPrice: 3500,
    buyPrice: 45000,
    available: true,
    featured: true
  },
  {
    id: "2",
    name: "Hospital Bed",
    description: "Fully adjustable electric hospital bed with remote control. Includes adjustable height, back, and leg positions for patient comfort.",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1595913333314-2e80fdc9b69c?q=80&w=2079&auto=format&fit=crop",
    rentPrice: 4500,
    buyPrice: 68000,
    available: true,
    featured: true
  },
  {
    id: "3",
    name: "Wheelchair",
    description: "Lightweight folding wheelchair with padded armrests and adjustable footrests. Easy to transport and store.",
    category: "Mobility",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
    rentPrice: 1200,
    buyPrice: 15000,
    available: true,
    featured: false
  },
  {
    id: "4",
    name: "CPAP Machine",
    description: "Continuous Positive Airway Pressure machine for sleep apnea treatment. Quiet operation with humidity control.",
    category: "Respiratory",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2080&auto=format&fit=crop",
    rentPrice: 2500,
    buyPrice: 32000,
    available: true,
    featured: true
  },
  {
    id: "5",
    name: "Patient Lift",
    description: "Hydraulic patient lift with adjustable base width. Safe and easy transfer for patients with limited mobility.",
    category: "Transfer",
    image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=1932&auto=format&fit=crop",
    rentPrice: 3800,
    buyPrice: 58000,
    available: true,
    featured: false
  },
  {
    id: "6",
    name: "Nebulizer",
    description: "Compact nebulizer system for medication delivery. Effective treatment for asthma and other respiratory conditions.",
    category: "Respiratory",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    rentPrice: 800,
    buyPrice: 8500,
    available: true,
    featured: false
  },
  {
    id: "7",
    name: "Walker with Wheels",
    description: "Folding walker with front wheels for increased mobility. Includes ergonomic hand grips and adjustable height.",
    category: "Mobility",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop",
    rentPrice: 900,
    buyPrice: 7800,
    available: true,
    featured: true
  },
  {
    id: "8",
    name: "Blood Pressure Monitor",
    description: "Digital blood pressure monitor with large display. Accurate readings and memory storage for multiple users.",
    category: "Monitoring",
    image: "https://images.unsplash.com/photo-1581595219315-a187dd41f529?q=80&w=2074&auto=format&fit=crop",
    rentPrice: 700,
    buyPrice: 4500,
    available: true,
    featured: false
  },
  {
    id: "9",
    name: "Shower Chair",
    description: "Height-adjustable shower chair with non-slip feet. Provides safety and comfort during bathing.",
    category: "Bathroom",
    image: "https://images.unsplash.com/photo-1637539604451-91ddcd02bd83?q=80&w=2070&auto=format&fit=crop",
    rentPrice: 550,
    buyPrice: 3800,
    available: true,
    featured: false
  },
  {
    id: "10",
    name: "Knee Scooter",
    description: "Steerable knee walker for foot or ankle injuries. Alternative to crutches with better mobility and comfort.",
    category: "Mobility",
    image: "https://images.unsplash.com/photo-1538822989282-8c2e14c31607?q=80&w=2071&auto=format&fit=crop",
    rentPrice: 1800,
    buyPrice: 14900,
    available: true,
    featured: false
  },
  {
    id: "11",
    name: "Commode Chair",
    description: "Portable bedside commode with removable bucket. Can also be used as a toilet safety frame.",
    category: "Bathroom",
    image: "https://images.unsplash.com/photo-1624284559128-e94b28adc125?q=80&w=2078&auto=format&fit=crop",
    rentPrice: 1100,
    buyPrice: 9500,
    available: true,
    featured: false
  },
  {
    id: "12",
    name: "Infusion Pump",
    description: "Programmable infusion pump for controlled medication delivery. Suitable for home care settings.",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1596023830651-9464e86b9901?q=80&w=2070&auto=format&fit=crop",
    rentPrice: 3200,
    buyPrice: 42000,
    available: true,
    featured: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(products.map(product => product.category)));
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};
