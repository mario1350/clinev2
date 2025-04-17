import React from 'react';
import { Gift, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface RewardsCardProps {
  year1Savings: number;
  year2Savings: number;
}

const RewardsCard: React.FC<RewardsCardProps> = ({ year1Savings, year2Savings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 overflow-hidden relative"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Gift className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-medium text-gray-900">Your Rewards</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h3 className="text-sm font-medium text-gray-900">Year 1 Savings</h3>
          <motion.p
            className="mt-2 text-3xl font-bold text-green-600"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ${year1Savings}
          </motion.p>
          <p className="mt-1 text-sm text-gray-500">Monthly payment reduction</p>
          <motion.div
            className="absolute -right-4 top-0 text-green-200"
            animate={{
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <TrendingUp size={48} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <h3 className="text-sm font-medium text-gray-900">Year 2 Savings</h3>
          <motion.p
            className="mt-2 text-3xl font-bold text-green-600"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            ${year2Savings}
          </motion.p>
          <p className="mt-1 text-sm text-gray-500">Total annual savings</p>
          <motion.div
            className="absolute -right-4 top-0 text-green-200"
            animate={{
              rotate: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <TrendingUp size={48} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default RewardsCard;