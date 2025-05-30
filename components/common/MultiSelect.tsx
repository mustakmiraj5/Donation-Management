"use client"
import { IoCloseSharp } from "react-icons/io5";
import React, { useEffect, useState } from 'react'
type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  heading: string,
  onChange: (selected: string[]) => void;
};
export default function MultiSelect({ options, heading, onChange }: MultiSelectProps) {
  const [searchText, setSearchText] = useState("")
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const setOptions = (value: string) => {
    if(selectedOptions.includes(value)){
      const opts = selectedOptions.filter(item => item != value);
      setSelectedOptions([...opts]);
      onChange([...opts]);
    }else{
      setSelectedOptions([...selectedOptions, value]);
      onChange([...selectedOptions, value]);
    }
  }

  useEffect(() => {
    const match = options.filter(item => item.value.toLowerCase().includes(searchText?.toLocaleLowerCase()));
    if(match){
      setFilteredOptions(match);
    }else{
      setFilteredOptions(options);
    }
  }, [searchText, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='border border-gray-300 rounded-lg bg-white shadow-md p-3 max-w-[350px]' ref={selectRef}>
      <div className="font-bold py-1">{heading}</div>
      <div>
        <div className='flex flex-wrap gap-2 mb-2'>{
          selectedOptions.map((option) => (
            <span key={option} className='inline-block bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900'>
              <span className="flex items-center gap-1">
                <span>
                  {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                  </span>
                  <span className="cursor-pointer" onClick={() => setOptions(option)}>
                    <IoCloseSharp />
                  </span>
                  </span>
            </span>
          ))
        }</div>
        <input onClick={() => setActive(!active)} onKeyUp={(e) => setSearchText((e.target as HTMLInputElement).value)} className='py-2 px-4 w-full outline-amber-600 border border-gray-600 rounded-lg' type="text" placeholder='search' />
      </div>
      {
        active && <div className='max-h-60 overflow-y-auto mt-2 flex flex-col gap-2'>
        {
          filteredOptions.map((option) => (
            <div key={option.value} onClick={() => setOptions(option.value)} className='flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer'>
              <input type="checkbox" id={option.value} value={option.value} onChange={() => setOptions(option.value)} checked={selectedOptions.includes(option.value)} />
              <label htmlFor={option.value}>{option.label}</label>
            </div>
          ))
        }
      </div>
      }
    </div>
  )
}
