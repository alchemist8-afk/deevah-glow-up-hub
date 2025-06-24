
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';

export interface Referral {
  id: string;
  referredUserId: string;
  referredUserName: string;
  status: 'pending' | 'completed';
  rewardAmount: number;
  dateReferred: string;
  dateCompleted?: string;
}

interface ReferralContextType {
  referrals: Referral[];
  totalEarnings: number;
  addReferral: (referredUserName: string) => void;
  completeReferral: (referralId: string) => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export function ReferralProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addGlowCoins } = useWallet();
  
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: '1',
      referredUserId: 'user123',
      referredUserName: 'Jessica Smith',
      status: 'completed',
      rewardAmount: 25,
      dateReferred: '2024-01-15',
      dateCompleted: '2024-01-16'
    },
    {
      id: '2',
      referredUserId: 'user456',
      referredUserName: 'Amina Hassan',
      status: 'pending',
      rewardAmount: 25,
      dateReferred: '2024-01-20'
    }
  ]);

  const totalEarnings = referrals
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  const addReferral = (referredUserName: string) => {
    const newReferral: Referral = {
      id: Date.now().toString(),
      referredUserId: `user${Date.now()}`,
      referredUserName,
      status: 'pending',
      rewardAmount: 25,
      dateReferred: new Date().toISOString().split('T')[0]
    };

    setReferrals(prev => [newReferral, ...prev]);
  };

  const completeReferral = (referralId: string) => {
    setReferrals(prev => prev.map(ref => 
      ref.id === referralId 
        ? { ...ref, status: 'completed' as const, dateCompleted: new Date().toISOString().split('T')[0] }
        : ref
    ));

    const referral = referrals.find(r => r.id === referralId);
    if (referral) {
      addGlowCoins(referral.rewardAmount, `Referral reward: ${referral.referredUserName}`);
    }
  };

  return (
    <ReferralContext.Provider value={{
      referrals,
      totalEarnings,
      addReferral,
      completeReferral
    }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
}
