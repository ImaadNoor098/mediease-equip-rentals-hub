
import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Oxygen Concentrator",
    description: "Portable oxygen concentrator for home and travel use. Provides continuous flow of oxygen for patients with respiratory conditions.",
    category: "Respiratory",
    image: "/placeholder.svg",
    rentPrice: 75,
    buyPrice: 899,
    available: true,
    featured: true
  },
  {
    id: "2",
    name: "Hospital Bed",
    description: "Fully adjustable electric hospital bed with remote control. Includes adjustable height, back, and leg positions for patient comfort.",
    category: "Furniture",
    image: "/placeholder.svg",
    rentPrice: 120,
    buyPrice: 1499,
    available: true,
    featured: true
  },
  {
    id: "3",
    name: "Wheelchair",
    description: "Lightweight folding wheelchair with padded armrests and adjustable footrests. Easy to transport and store.",
    category: "Mobility",
    image: "/placeholder.svg",
    rentPrice: 35,
    buyPrice: 299,
    available: true,
    featured: false
  },
  {
    id: "4",
    name: "CPAP Machine",
    description: "Continuous Positive Airway Pressure machine for sleep apnea treatment. Quiet operation with humidity control.",
    category: "Respiratory",
    image: "/placeholder.svg",
    rentPrice: 65,
    buyPrice: 799,
    available: true,
    featured: true
  },
  {
    id: "5",
    name: "Patient Lift",
    description: "Hydraulic patient lift with adjustable base width. Safe and easy transfer for patients with limited mobility.",
    category: "Transfer",
    image: "/placeholder.svg",
    rentPrice: 95,
    buyPrice: 1299,
    available: true,
    featured: false
  },
  {
    id: "6",
    name: "Nebulizer",
    description: "Compact nebulizer system for medication delivery. Effective treatment for asthma and other respiratory conditions.",
    category: "Respiratory",
    image: "/placeholder.svg",
    rentPrice: 25,
    buyPrice: 199,
    available: true,
    featured: false
  },
  {
    id: "7",
    name: "Walker with Wheels",
    description: "Folding walker with front wheels for increased mobility. Includes ergonomic hand grips and adjustable height.",
    category: "Mobility",
    image: "/placeholder.svg",
    rentPrice: 20,
    buyPrice: 129,
    available: true,
    featured: true
  },
  {
    id: "8",
    name: "Blood Pressure Monitor",
    description: "Digital blood pressure monitor with large display. Accurate readings and memory storage for multiple users.",
    category: "Monitoring",
    image: "/placeholder.svg",
    rentPrice: 15,
    buyPrice: 89,
    available: true,
    featured: false
  },
  {
    id: "9",
    name: "Shower Chair",
    description: "Height-adjustable shower chair with non-slip feet. Provides safety and comfort during bathing.",
    category: "Bathroom",
    image: "/placeholder.svg",
    rentPrice: 18,
    buyPrice: 79,
    available: true,
    featured: false
  },
  {
    id: "10",
    name: "Knee Scooter",
    description: "Steerable knee walker for foot or ankle injuries. Alternative to crutches with better mobility and comfort.",
    category: "Mobility",
    image: "/placeholder.svg",
    rentPrice: 45,
    buyPrice: 249,
    available: true,
    featured: false
  },
  {
    id: "11",
    name: "Commode Chair",
    description: "Portable bedside commode with removable bucket. Can also be used as a toilet safety frame.",
    category: "Bathroom",
    image: "/placeholder.svg",
    rentPrice: 25,
    buyPrice: 149,
    available: true,
    featured: false
  },
  {
    id: "12",
    name: "Infusion Pump",
    description: "Programmable infusion pump for controlled medication delivery. Suitable for home care settings.",
    category: "Medical",
    image: "/placeholder.svg",
    rentPrice: 89,
    buyPrice: 1199,
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
