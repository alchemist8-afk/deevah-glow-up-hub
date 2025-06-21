
import React, { createContext, useContext, useState } from 'react';

export interface BookingItem {
  id: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  serviceType: 'service' | 'product' | 'food';
  serviceName: string;
  price: number;
  date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  duration?: string;
  location?: string;
}

interface BookingContextType {
  bookings: BookingItem[];
  addBooking: (booking: Omit<BookingItem, 'id'>) => void;
  updateBookingStatus: (bookingId: string, status: BookingItem['status']) => void;
  getUserBookings: (userId: string, userRole: 'client' | 'provider') => BookingItem[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: '1',
      clientId: '1',
      clientName: 'Sarah Williams',
      providerId: 'artist1',
      providerName: 'Maya Johnson',
      serviceType: 'service',
      serviceName: 'Box Braids Installation',
      price: 150,
      date: 'Today, 2:00 PM',
      status: 'pending',
      duration: '4 hours',
      location: "Client's Home"
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Angela Davis',
      providerId: 'artist1',
      providerName: 'Maya Johnson',
      serviceType: 'service',
      serviceName: 'Cornrow Styling',
      price: 80,
      date: 'Tomorrow, 10:00 AM',
      status: 'pending',
      duration: '2 hours',
      location: 'Your Salon'
    }
  ]);

  const addBooking = (booking: Omit<BookingItem, 'id'>) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (bookingId: string, status: BookingItem['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  const getUserBookings = (userId: string, userRole: 'client' | 'provider') => {
    return bookings.filter(booking => 
      userRole === 'client' ? booking.clientId === userId : booking.providerId === userId
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      updateBookingStatus,
      getUserBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
