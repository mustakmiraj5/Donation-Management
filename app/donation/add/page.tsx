"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MultiSelect from "@/components/common/MultiSelect";
import { useRouter } from "next/navigation";

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push(i.toString());
  }
  return years;
};


const allMonthOptions = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];

type Donor = {
  id: string;
  name: string;
};

export default function AddDonationPage() {
  const currentYear = new Date().getFullYear().toString();
  const currentMonthName = allMonthOptions[new Date().getMonth()].value;

  const [form, setForm] = useState({
    donor_id: "",
    year: currentYear,
    amount: "",
    months: [currentMonthName],
  });

  const [donors, setDonors] = useState<Donor[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabledMonths, setDisabledMonths] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchDonors() {
      const { data, error } = await supabase
        .from("donor")
        .select("id, name")
        .order("created_at", { ascending: false });
      if (!error && data) setDonors(data);
    }
    fetchDonors();
  }, []);
  useEffect(() => {
    async function fetchDisabledMonths() {
      if (!form.donor_id || !form.year) return;

      const { data, error } = await supabase
        .from("donation")
        .select("month")
        .eq("donor_id", form.donor_id)
        .eq("year", form.year);

      if (data) {
        const months = data.map((d) => d.month);
        setDisabledMonths(months);
      }
    }

    fetchDisabledMonths();
  }, [form.donor_id, form.year]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMonthChange = (months: string[]) => {
    setForm((prev) => ({ ...prev, months }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { donor_id, year, amount, months } = form;

    if (!donor_id || !year || !amount || months.length === 0) {
      setError("Please fill all fields and select at least one month.");
      setLoading(false);
      return;
    }

    // Check for duplicates
    const { data: existing } = await supabase
      .from("donation")
      .select("month")
      .eq("donor_id", donor_id)
      .eq("year", year)
      .in("month", months);

    const existingMonths = existing?.map((d) => d.month) || [];
    const newMonths = months.filter((m) => !existingMonths.includes(m));

    if (newMonths.length === 0) {
      setError("Donations for these months already exist for this donor.");
      setLoading(false);
      return;
    }

    const entries = newMonths.map((month) => ({
      donor_id,
      year,
      month,
      amount: parseFloat(amount),
    }));

    const { error: insertError } = await supabase
      .from("donation")
      .insert(entries);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  // Filter donor dropdown by keyword
  const filteredDonors = donors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Donation</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Donor Dropdown with search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Donor
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search donor by name..."
            className="w-full px-3 py-2 border rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Donor
          </label>
          <select
            name="donor_id"
            value={form.donor_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md border-gray-300"
          >
            <option value="">-- Choose donor --</option>
            {filteredDonors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Input */}
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Select Year
  </label>
  <select
    name="year"
    value={form.year}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md border-gray-300"
  >
    <option value="">-- Choose year --</option>
    {generateYearOptions().map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>


        {/* Month Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Months
          </label>
          <MultiSelect
            options={allMonthOptions.map((option) => ({
              ...option,
              isDisabled: disabledMonths.includes(option.value),
            }))}
            heading="Select Months"
            onChange={handleMonthChange}
            defaultValue={form.months}
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (BDT)
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-white border-gray-300"
            placeholder="e.g. 500.00"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Add Donation(s)"}
        </button>
      </form>
    </div>
  );
}
