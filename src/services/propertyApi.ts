import { Heart, Star, MapPin, Coffee, Wifi, Shield, Zap } from 'lucide-react';
import { apiGet } from './apiClient';

export interface Amenity {
  name: string;
  icon: string;
  desc: string;
}

export interface Nearby {
  name: string;
  distance: string;
  image: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  category: string;
  amenities: string[];
  fullAmenities?: Amenity[];
  nearby?: Nearby[];
  images?: string[];
  description?: string;
  tiers?: { name: string; price: string; availability: string }[];
}

class PropertyService {
  private static instance: PropertyService;

  private mapHotelToProperty(hotel: any): Property {
    const imageList = Array.isArray(hotel.images) ? hotel.images : [];
    const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

    return {
      id: String(hotel.id),
      name: hotel.name ?? 'StayEase Property',
      location: hotel.location ?? 'Unknown location',
      rating: Number(hotel.rating ?? 4.2),
      reviews: 100,
      price: Number(hotel.price ?? 100),
      image: imageList[0] ?? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      category: 'Premium',
      amenities,
      description: hotel.description ?? 'Comfortable stay with modern amenities.',
      images: imageList.length ? imageList : undefined
    };
  }
  
  private properties: Property[] = [
    {
      id: '1',
      name: 'The Azure Sanctuary',
      location: 'Maldives, Indian Ocean',
      rating: 4.9,
      reviews: 128,
      price: 1250,
      image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80',
      category: 'Tropical',
      amenities: ['Gigabit WiFi', 'Full AC', 'Private Pool'],
      description: 'A masterwork of architectural serenity. The Azure Sanctuary offers unparalleled privacy in the heart of the Maldives, where the horizon meets your doorstep in a blur of turquoise and obsidian.',
      images: [
        'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1556912170-4537da39fe0e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      ],
      nearby: [
        { name: 'Crystal Lagoon', distance: '2 min walk', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' },
        { name: 'Coral Reef Center', distance: '5 min boat', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80' }
      ],
      tiers: [
        { name: 'Ocean Villa', price: '₹95,000', availability: '2 LEFT' },
        { name: 'Overwater Suite', price: '₹1,45,000', availability: 'SOLO ONLY' },
        { name: 'Grand Pavilion', price: '₹2,80,000', availability: 'LIMITED' }
      ]
    },
    {
      id: '2',
      name: 'Obsidian Peak Resort',
      location: 'Zermatt, Switzerland',
      rating: 4.8,
      reviews: 96,
      price: 850,
      image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
      category: 'Mountain',
      amenities: ['Ski-in/Ski-out', 'Sauna', 'Fireplace'],
      description: 'Nested in the jagged shadows of the Matterhorn, Obsidian Peak redefined alpine luxury with charcoal-slate interiors and panoramic glass that brings the mountains into your bedroom.',
      images: [
        'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544015759-137fb939308e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551882547-ff43c63efe81?auto=format&fit=crop&w=800&q=80'
      ],
      tiers: [
        { name: 'Alpine Loft', price: '₹65,000', availability: '3 LEFT' },
        { name: 'Matterhorn Suite', price: '₹92,000', availability: 'LIMITED' }
      ]
    }
  ];

  private constructor() {}

  public static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  public async getProperties(): Promise<Property[]> {
    try {
      const data = await apiGet<{ items: any[] }>('/hotels?limit=50');
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) return this.properties;
      return items.map((item) => this.mapHotelToProperty(item));
    } catch {
      return this.properties;
    }
  }

  public async getPropertyById(id: string): Promise<Property | undefined> {
    try {
      const data = await apiGet<any>(`/hotels/${id}`);
      if (!data) return this.properties.find(p => p.id === id);
      return this.mapHotelToProperty(data);
    } catch {
      return this.properties.find(p => p.id === id);
    }
  }

  public async searchProperties(query: string): Promise<Property[]> {
    if (!query.trim()) return this.getProperties();

    try {
      const data = await apiGet<{ items: any[] }>(`/hotels?location=${encodeURIComponent(query)}&limit=50`);
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) return [];
      return items.map((item) => this.mapHotelToProperty(item));
    } catch {
      return this.properties.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
}

export const propertyApi = PropertyService.getInstance();
