"use client"
import React, { useState } from 'react'

interface FormData {
  donorId: string | number | readonly string[] | undefined;
  address: string | number | readonly string[] | undefined;
  name: string;
  mediumName: string;
  phone: string;
  mediumPhone?: string;
}

export default function Page() {
      const [formData, setFormData] = useState<FormData>({
    address: '',
    name: '',
    mediumName: '',
    phone: '',
    donorId: '',
    mediumPhone: ''
  });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className='text-center text-4xl p-2 my-2'>Provide donor information</div>
        <form onSubmit={handleSubmit}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Type here..."
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
            Phone number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="+88 017XXXXXXXXX"
            pattern="^\+88\s[0-9]{11}$"
            required
          />
        </div>
        <div>
          <label htmlFor="mediumName" className="block mb-2 text-sm font-medium text-gray-900">
            Medium Name
          </label>
          <input
            type="text"
            id="mediumName"
            name="mediumName"
            value={formData.mediumName}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Type here..."
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
            Medium Phone number
          </label>
          <input
            type="tel"
            id="mediumPhone"
            name="mediumPhone"
            value={formData.mediumPhone}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="+88 017XXXXXXXXX"
            pattern="^\+88\s[0-9]{11}$"
            required
          />
        </div>
       
        <div>
          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="123 Main St, City, Country"
            required
          />
        </div>
        <div>
          <label htmlFor="donorId" className="block mb-2 text-sm font-medium text-gray-900">
            Donor ID
          </label>
          <input
            type="text"
            id="donorId"
            name="donorId"
            value={formData.donorId}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder=""
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add Donor
      </button>
    </form>
    </div>
  )
}
