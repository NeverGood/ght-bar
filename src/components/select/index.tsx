/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { SelectHTMLAttributes } from "react";

type SelectOption = {
    label: string;
    value: string;
};

const Select: React.FC<
    {
        label?: string;
        error?: string;
        options: SelectOption[];
        placeholder?: string;
    } & SelectHTMLAttributes<HTMLSelectElement>
> = React.forwardRef(
    ({ label, error, options, placeholder, ...rest }, ref) => {
        return (
            <div className="min-w-0">
                <label
                    className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500"
                    htmlFor={rest.name}
                >
                    {label}
                </label>
                <select
                    //@ts-ignore
                    ref={ref}
                    className="relative block h-11 w-full appearance-none rounded-xl border border-white/8 bg-[#0d1118] px-3.5 py-2 text-sm text-stone-100 outline-none transition focus:border-[#d5a25c]/45 focus:ring-2 focus:ring-[#d5a25c]/15"
                    {...rest}
                >
                    <option value="">{placeholder || "All"}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pt-1.5 text-xs text-rose-400">{error}</div>
            </div>
        );
    }
);

export default Select;
