import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReferralCard from '../components/referrals/ReferralCard';
import RewardsCard from '../components/referrals/RewardsCard';
import LeadForm from '../components/leads/LeadForm';
import type { Referral } from '../types/referral';
import type { Lead } from '../types/dashboard';

const calculateSavings = (completedReferrals: number) => {
  const year1Savings = Math.min(completedReferrals, 4) * 30;
  const year2Savings = Math.min(completedReferrals, 4) * 360;
  return { year1Savings, year2Savings };
};

const Referrals: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const completedReferrals = referrals.filter(r => r.stage === 4).length;
  const { year1Savings, year2Savings } = calculateSavings(completedReferrals);

  const handleAddReferral = (data: Partial<Lead>) => {
    if (referrals.length >= 4) {
      alert('Maximum number of referrals reached');
      return;
    }

    const newReferral: Referral = {
      id: crypto.randomUUID(),
      name: data.name!,
      email: data.email!,
      phone: data.phone!,
      stage: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setReferrals(prev => [...prev, newReferral]);
    setShowForm(false);
  };

  const handleEdit = (referral: Referral) => {
    setSelectedReferral(referral);
  };

  const handleDelete = (referral: Referral) => {
    if (window.confirm('Are you sure you want to delete this referral?')) {
      setReferrals(prev => prev.filter(r => r.id !== referral.id));
    }
  };

  const handleUpdateStage = (referralId: string, newStage: number) => {
    setReferrals(prev => 
      prev.map(ref => 
        ref.id === referralId 
          ? { ...ref, stage: newStage, updatedAt: new Date() }
          : ref
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-gray-900"
        >
          Referral Program
        </motion.h1>
        <motion.button
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="btn inline-flex items-center"
          disabled={referrals.length >= 4}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Referral
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <ReferralCard
            key={index}
            index={index}
            referral={referrals[index]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateStage={handleUpdateStage}
          />
        ))}
      </div>

      <RewardsCard
        year1Savings={year1Savings}
        year2Savings={year2Savings}
      />

      <AnimatePresence>
        {showForm && (
          <LeadForm
            onSubmit={handleAddReferral}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Referrals;