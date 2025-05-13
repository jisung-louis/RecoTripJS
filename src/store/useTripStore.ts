import { create } from 'zustand';

// Place 타입 정의 (LandmarkScreen과 동일하게)
export interface Place {
  name: string;
  address: string;
  rating: number;
  location: { lat: number; lng: number };
  place_id: string;
  photo: string | null;
}

// RouteDay 타입 정의 (autoSchedule.ts와 동일)
export type RouteDay = { day: number; places: string[] };

// Hotel 타입 정의 (LodgingScreen과 동일)
export interface Hotel {
  name: string;
  image: string;
  desc: string;
  rating: number;
  address?: string;
  location?: { lat: number; lng: number };
  place_id?: string;
}

interface TripState {
  // 여행 기본 정보
  tripName: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedCity: string | null;
  selectedLandmarks: Place[];
  selectedPeople: string[];
  selectedKeywords: string[];
  selectedFlight: {
    departure: string;
    arrival: string;
    date: Date | null;
  } | null;
  selectedRoute: {
    start: string;
    end: string;
    transportation: string;
  } | null;
  selectedLodging: { [day: number]: Hotel };
  routes: RouteDay[];

  // 액션들
  setTripName: (name: string) => void;
  setDates: (start: Date | null, end: Date | null) => void;
  setSelectedCity: (city: string | null) => void;
  addLandmark: (place: Place) => void;
  removeLandmark: (place_id: string) => void;
  setSelectedPeople: (people: string[]) => void;
  setSelectedFlight: (flight: TripState['selectedFlight']) => void;
  setSelectedRoute: (route: TripState['selectedRoute']) => void;
  setSelectedLodging: (lodging: { [day: number]: Hotel }) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearKeywords: () => void;
  clearTrip: () => void;
  setRoutes: (routes: RouteDay[]) => void;
}

export const useTripStore = create<TripState>((set) => ({
  // 초기 상태
  tripName: '',
  startDate: null,
  endDate: null,
  selectedCity: null,
  selectedLandmarks: [],
  selectedPeople: [],
  selectedKeywords: ['도심', '쇼핑'],
  selectedFlight: null,
  selectedRoute: null,
  selectedLodging: {},
  routes: [],

  // 액션들
  setTripName: (name) => set({ tripName: name }),
  
  setDates: (start, end) => set({ 
    startDate: start,
    endDate: end 
  }),

  setSelectedCity: (city) => set({ selectedCity: city }),

  addLandmark: (place) => 
    set((state) => ({
      selectedLandmarks: state.selectedLandmarks.some((p) => p.place_id === place.place_id)
        ? state.selectedLandmarks
        : [...state.selectedLandmarks, place]
    })),

  removeLandmark: (place_id) =>
    set((state) => ({
      selectedLandmarks: state.selectedLandmarks.filter((p) => p.place_id !== place_id)
    })),

  setSelectedPeople: (people) => set({ selectedPeople: people }),

  setSelectedFlight: (flight) => set({ selectedFlight: flight }),

  setSelectedRoute: (route) => set({ selectedRoute: route }),

  setSelectedLodging: (lodging) => set({ selectedLodging: lodging }),

  addKeyword: (keyword) => 
    set((state) => ({
      selectedKeywords: state.selectedKeywords.includes(keyword)
        ? state.selectedKeywords
        : [...state.selectedKeywords, keyword]
    })),

  removeKeyword: (keyword) =>
    set((state) => ({
      selectedKeywords: state.selectedKeywords.filter((k) => k !== keyword)
    })),

  clearKeywords: () => set({ selectedKeywords: [] }),

  clearTrip: () => set({
    tripName: '',
    startDate: null,
    endDate: null,
    selectedCity: null,
    selectedLandmarks: [],
    selectedPeople: [],
    selectedKeywords: [],
    selectedFlight: null,
    selectedRoute: null,
    selectedLodging: {},
    routes: [],
  }),

  setRoutes: (routes) => set({ routes }),
})); 