import React from 'react';
import { Users, Edit2, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';
import type { Referral } from '../../types/referral';
import { motion } from 'framer-motion';

interface ReferralCardProps {
  index: number;
  referral?: Referral;
  onEdit?: (referral: Referral) => void;
  onDelete?: (referral: Referral) => void;
  onUpdateStage?: (referralId: string, newStage: number) => void;
}

const stages = [
  { id: 1, name: 'Contact Made', description: 'Initial contact and validation' },
  { id: 2, name: 'Qualification', description: 'Client qualification process' },
  { id: 3, name: 'Offer Sent', description: 'Offer delivered to referral' },
  { id: 4, name: 'Completed', description: 'Client on-boarded, referral bonus assigned' }
];

const ReferralCard: React.FC<ReferralCardProps> = ({
  index,
  referral,
  onEdit,
  onDelete,
  onUpdateStage
}) => {
  const handleStageChange = (direction: 'prev' | 'next') => {
    if (!referral || !onUpdateStage) return;
    
    const currentStageIndex = stages.findIndex(s => s.id === referral.stage);
    const newStageIndex = direction === 'next' ? currentStageIndex + 1 : currentStageIndex - 1;
    
    if (newStageIndex >= 0 && newStageIndex < stages.length) {
      onUpdateStage(referral.id, stages[newStageIndex].id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx(
        'p-6 rounded-lg border group hover:shadow-lg transition-all duration-300',
        referral ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 border-dashed'
      )}
    >
      {referral ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">{referral.name}</h3>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-blue-500"
                onClick={() => onEdit?.(referral)}
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-red-500"
                onClick={() => onDelete?.(referral)}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>{referral.email}</p>
            <p>{referral.phone}</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => handleStageChange('prev')}
                disabled={referral.stage === 1}
                className={clsx(
                  'p-1 rounded-full',
                  referral.stage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-900">
                {stages.find(s => s.id === referral.stage)?.name}
              </span>
              <button
                onClick={() => handleStageChange('next')}
                disabled={referral.stage === 4}
                className={clsx(
                  'p-1 rounded-full',
                  referral.stage === 4 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <motion.div
              className="relative h-2 bg-gray-100 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${(referral.stage / stages.length) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
            
            <p className="mt-2 text-xs text-gray-500">
              {stages.find(s => s.id === referral.stage)?.description}
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          className="text-center py-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Referral Slot {index + 1}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add a new referral to start earning rewards
          </p>
          <motion.div
            className="mt-4 w-2 h-2 bg-blue-500 rounded-full mx-auto"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReferralCard;