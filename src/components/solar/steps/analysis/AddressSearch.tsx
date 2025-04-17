import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AddressSearchProps {
  onSubmit: (address: string) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onSubmit }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSubmit(address);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address in Puerto Rico..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      <button
        type="submit"
        disabled={!address.trim()}
        className="mt-2 btn w-full"
      >
        Analyze Solar Potential
      </button>
    </form>
  );
};

export default AddressSearch;