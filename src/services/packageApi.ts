import { apiGet } from './apiClient';

export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  description?: string;
  price: number;
  inclusions?: string[] | Record<string, unknown>;
  images?: string[];
  durationDays?: number;
  rating?: number;
  reviewCount?: number;
  theme?: string;
  startPoint?: string;
  transportMode?: string;
}

class PackageService {
  private static instance: PackageService;

  private mapPackage(raw: any): TourPackage {
    const inclusions = Array.isArray(raw.inclusions) ? raw.inclusions : raw.inclusions ?? undefined;
    const images = Array.isArray(raw.images) ? raw.images.filter((image: unknown) => typeof image === 'string') : undefined;

    return {
      id: String(raw.id),
      name: raw.name ?? 'Tour Package',
      destination: raw.destination ?? 'Curated route',
      description: raw.description ?? undefined,
      price: Number(raw.price ?? 0),
      inclusions,
      images,
      durationDays: Number.isFinite(Number(raw.durationDays)) ? Number(raw.durationDays) : Number.isFinite(Number(raw.duration_days)) ? Number(raw.duration_days) : undefined,
      rating: Number.isFinite(Number(raw.rating)) ? Number(raw.rating) : undefined,
      reviewCount: Number.isFinite(Number(raw.reviewCount)) ? Number(raw.reviewCount) : Number.isFinite(Number(raw.review_count)) ? Number(raw.review_count) : undefined,
      theme: typeof raw.theme === 'string' ? raw.theme : undefined,
      startPoint: typeof raw.startPoint === 'string' ? raw.startPoint : typeof raw.start_point === 'string' ? raw.start_point : undefined,
      transportMode: typeof raw.transportMode === 'string' ? raw.transportMode : typeof raw.transport_mode === 'string' ? raw.transport_mode : undefined
    };
  }

  public static getInstance(): PackageService {
    if (!PackageService.instance) {
      PackageService.instance = new PackageService();
    }
    return PackageService.instance;
  }

  public async listPackages(): Promise<TourPackage[]> {
    const data = await apiGet<TourPackage[]>('/packages');
    return Array.isArray(data) ? data.map((item) => this.mapPackage(item)) : [];
  }

  public async getPackageById(id: string): Promise<TourPackage | undefined> {
    const data = await apiGet<TourPackage>(`/packages/${id}`);
    return data ? this.mapPackage(data) : undefined;
  }
}

export const packageApi = PackageService.getInstance();