"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Donor = {
  id: string;
  name: string;
  number: string;
  address: string;
  medium_name: string;
  medium_number: string;
  donor_id?: string | number;
  promised_amount?: number;
  created_at?: string;
};

type Donation = {
  donor_id: string;
  month: string;
  amount: number;
};

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push(i.toString());
  }
  return years;
};

export default function DonationDisplayPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  // Fetch donors on mount
  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("donor")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setDonors(data as Donor[]);
      setLoading(false);
    };

    fetchDonors();
  }, []);

  // Fetch donations on year or donor change
  useEffect(() => {
    const fetchDonations = async () => {
      const { data, error } = await supabase
        .from("donation")
        .select("donor_id, month, amount")
        .eq("year", selectedYear);

      if (!error && data) setDonations(data);
    };

    fetchDonations();
  }, [selectedYear]);

  const filteredDonors = donors.filter((donor) => {
    const query = searchQuery.toLowerCase();
    return (
      donor.name.toLowerCase().includes(query) ||
      donor.donor_id?.toString().toLowerCase().includes(query)
    );
  });
  const totalYearlyDonation = donations.reduce(
    (sum, d) => sum + (d.amount ?? 0),
    0
  );

  return (
  <div className="flex flex-col items-center mt-10 px-4">
    <h2 className="text-2xl font-bold mb-4 text-center">Donations ({selectedYear})</h2>

    {/* Year and Search */}
    <div className="w-full max-w-4xl mb-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full sm:w-auto"
        >
          {generateYearOptions().map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by Donor ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-green-300 rounded-md w-full sm:w-[60%] focus:outline-none focus:ring focus:border-green-600"
        />
      </div>
    </div>

    {/* Loading and Empty State */}
    {loading && donors.length === 0 ? (
      <p className="text-center py-8 text-gray-500">Loading donors...</p>
    ) : filteredDonors.length === 0 ? (
      <p className="text-center py-8 text-gray-500">No donors match your search.</p>
    ) : (
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-xl font-bold">Donor List ({filteredDonors.length})</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">
              Total Donation in {selectedYear}:
            </p>
            <p className="text-lg font-bold text-green-700">
              ৳ {totalYearlyDonation.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Donor Cards */}
        {filteredDonors.map((donor) => {
          const donorDonations = donations.filter((d) => d.donor_id === donor.id);
          const totalDonation = donorDonations.reduce((sum, d) => sum + (d.amount ?? 0), 0);

          return (
            <div
              key={donor.id}
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                {/* Donor Info */}
                <div className="flex-1 min-w-[250px] space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">{donor.name}</h3>
                  <p className="text-sm text-gray-900">Phone: {donor.number}</p>
                  <p className="text-sm text-gray-900">
                    Medium: {donor.medium_name} ({donor.medium_number})
                  </p>
                  <p className="text-sm text-gray-900">Address: {donor.address}</p>
                  <p className="text-sm text-gray-900">
                    Donor ID:{" "}
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {donor.donor_id}
                    </span>
                  </p>
                  {donor.promised_amount && (
                    <p className="text-sm text-gray-900">
                      Promised:{" "}
                      <span className="text-green-700 font-bold">
                        ৳ {donor.promised_amount.toLocaleString()}
                      </span>
                    </p>
                  )}
                  {donor.created_at && (
                    <p className="text-sm text-gray-900">
                      Added: {new Date(donor.created_at).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Donation Info */}
                {donorDonations.length > 0 && (
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-semibold text-gray-900 mb-1">
                      Donations in {selectedYear}:
                    </p>
                    <ul className="list-disc ml-6 text-sm text-gray-800 font-bold space-y-1">
                      {donorDonations.map((d, i) => (
                        <li key={i}>
                          {d.month.charAt(0).toUpperCase() + d.month.slice(1)}: ৳{" "}
                          {d.amount.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-green-700 font-semibold mt-2">
                      Total Donation: ৳ {totalDonation.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

}
