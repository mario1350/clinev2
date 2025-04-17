import React from 'react';
import { motion } from 'framer-motion';
import type { ReferralStage } from '../../types/referral';

interface StageProgressProps {
  stages: ReferralStage[];
  currentStage: number;
}

const StageProgress: React.FC<StageProgressProps> = ({ stages, currentStage }) => {
  return (
    <div className="relative">
      <motion.div
        className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStage / stages.length) * 100}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>
      <div className="relative flex justify-between">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                index <= currentStage - 1
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 bg-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={index <= currentStage - 1 ? 'text-white' : 'text-gray-500'}>
                {stage.id}
              </span>
            </motion.div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-gray-900">{stage.name}</p>
              <p className="mt-1 text-xs text-gray-500">{stage.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StageProgress;