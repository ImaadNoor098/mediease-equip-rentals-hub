
import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Oxygen Concentrator",
    description: "Portable oxygen concentrator for home and travel use. Provides continuous flow of oxygen for patients with respiratory conditions.",
    category: "Respiratory",
    image: "/products/oxygen-concentratr.jpg",
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
    image: "/products/hospital-bed.jpg",
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
    image: "/products/wheelchair.jpg",
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
    image: "/products/cpap-machine.jpg",
    rentPrice: 2500,
    buyPrice: 32000,
    available: true,
    featured: true
  },
  {
    id: "5",
    name: "Nebulizer",
    description: "Compact nebulizer system for medication delivery. Effective treatment for asthma and other respiratory conditions.",
    category: "Respiratory",
    image: "/products/nebulizer.jpg",
    rentPrice: 800,
    buyPrice: 8500,
    available: true,
    featured: false
  },
  {
    id: "6",
    name: "Walker with Wheels",
    description: "Folding walker with front wheels for increased mobility. Includes ergonomic hand grips and adjustable height.",
    category: "Mobility",
    image: "/products/walker-with-wheels.jpg",
    rentPrice: 900,
    buyPrice: 7800,
    available: true,
    featured: true
  },
  {
    id: "7",
    name: "Blood Pressure Monitor",
    description: "Digital blood pressure monitor with large display. Accurate readings and memory storage for multiple users.",
    category: "Monitoring",
    image: "/products/blood-pressure-meter.jpg",
    rentPrice: 700,
    buyPrice: 4500,
    available: true,
    featured: false
  },
  {
    id: "8",
    name: "Shower Chair",
    description: "Height-adjustable shower chair with non-slip feet. Provides safety and comfort during bathing.",
    category: "Bathroom",
    image: "/products/shower-chair.jpg",
    rentPrice: 550,
    buyPrice: 3800,
    available: true,
    featured: false
  },
  {
    id: "9",
    name: "Knee Scooter",
    description: "Steerable knee walker for foot or ankle injuries. Alternative to crutches with better mobility and comfort.",
    category: "Mobility",
    image: "/products/knee-scooter.jpg",
    rentPrice: 1800,
    buyPrice: 14900,
    available: true,
    featured: false
  },
  {
    id: "10",
    name: "Commode Chair",
    description: "Portable bedside commode with removable bucket. Can also be used as a toilet safety frame.",
    category: "Bathroom",
    image: "/products/commode-chair.jpg",
    rentPrice: 1100,
    buyPrice: 9500,
    available: true,
    featured: false
  },
  {
    id: "11",
    name: "Infusion Pump",
    description: "Programmable infusion pump for controlled medication delivery. Suitable for home care settings.",
    category: "Medical",
    image: "/products/infusion-pump.jpg",
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
