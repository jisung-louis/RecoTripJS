import { create } from 'zustand';

interface TripState {
  // 여행 기본 정보
  tripName: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedCity: string | null;
  selectedLandmarks: string[];
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
  selectedLodging: {
    name: string;
    address: string;
    checkIn: Date | null;
    checkOut: Date | null;
  } | null;

  // 액션들
  setTripName: (name: string) => void;
  setDates: (start: Date | null, end: Date | null) => void;
  setSelectedCity: (city: string | null) => void;
  addLandmark: (landmark: string) => void;
  removeLandmark: (landmark: string) => void;
  setSelectedPeople: (people: string[]) => void;
  setSelectedFlight: (flight: TripState['selectedFlight']) => void;
  setSelectedRoute: (route: TripState['selectedRoute']) => void;
  setSelectedLodging: (lodging: TripState['selectedLodging']) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearKeywords: () => void;
  clearTrip: () => void;
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
  selectedLodging: null,

  // 액션들
  setTripName: (name) => set({ tripName: name }),
  
  setDates: (start, end) => set({ 
    startDate: start,
    endDate: end 
  }),

  setSelectedCity: (city) => set({ selectedCity: city }),

  addLandmark: (landmark) => 
    set((state) => ({
      selectedLandmarks: state.selectedLandmarks.includes(landmark)
        ? state.selectedLandmarks
        : [...state.selectedLandmarks, landmark]
    })),

  removeLandmark: (landmark) =>
    set((state) => ({
      selectedLandmarks: state.selectedLandmarks.filter((l) => l !== landmark)
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
    selectedLodging: null
  })
})); 