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

export default function DonorList() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  // Fetch donors
  const fetchDonors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("donor")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setDonors(data as Donor[]);
      setError(null);
    }
    setLoading(false);
  };

  // Fetch on mount
  useEffect(() => {
    fetchDonors();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("donor_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "donor",
        },
        (payload) => {
          console.log("Donor change detected:", payload);
          switch (payload.eventType) {
            case "INSERT":
              setDonors((current) => [payload.new as Donor, ...current]);
              break;
            case "UPDATE":
              setDonors((current) =>
                current.map((d) =>
                  d.id === payload.new.id ? (payload.new as Donor) : d
                )
              );
              break;
            case "DELETE":
              setDonors((current) =>
                current.filter((d) => d.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setConnectionStatus("connected");
        else setConnectionStatus("disconnected");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        <p>Error loading donors: {error}</p>
        <button
          onClick={fetchDonors}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredDonors = donors.filter((donor) => {
  const query = searchQuery.toLowerCase();
  return (
    donor.name.toLowerCase().includes(query) ||
    donor.donor_id?.toString().toLowerCase().includes(query)
  );
});


  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Donor List ({donors.length})</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={`ml-2 w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-600 capitalize">
              {connectionStatus}
            </span>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Real-time
          </span>
          <button
            onClick={fetchDonors}
            disabled={loading}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {loading && donors.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading donors...</p>
        </div>
      ) : filteredDonors.length === 0  ? (
        <div className="text-center py-8 text-gray-500">
        <p>No donors match your search.</p>
      </div>
      ) : (
        <div className="space-y-3">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Donor ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring focus:border-green-600"
            />
          </div>

          {
          filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900">{donor.name}</h3>
                  <p className="text-sm text-gray-900">Phone: {donor.number}</p>
                  <p className="text-sm text-gray-900">
                    Medium: {donor.medium_name} ({donor.medium_number})
                  </p>
                  <p className="text-sm text-gray-900">
                    Address: {donor.address}
                  </p>
                  <p className="text-sm text-gray-900">
                    Donor ID:{" "}
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {donor.donor_id}
                    </span>
                  </p>
                  {donor.promised_amount !== null && (
                    <p className="text-sm text-gray-900">
                      Promised Amount:{" "}
                      <span className="font-bold text-green-700">
                        ৳ {(donor.promised_amount ?? 0).toLocaleString()}
                      </span>
                    </p>
                  )}

                  {donor.created_at && (
                    <p className="text-sm text-gray-900 mt-1">
                      Added: {new Date(donor.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
