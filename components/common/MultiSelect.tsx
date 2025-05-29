import React from 'react'
type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
};
export default function MultiSelect({ options }: MultiSelectProps) {
  return (
    <div className='border border-gray-300 rounded-lg bg-white shadow-md'>
      <div>
        <div></div>
        <input className='py-2 px-4 w-full outline-amber-600' type="text" placeholder='search' />
      </div>
      <div>
        {}
      </div>
    </div>
  )
}
