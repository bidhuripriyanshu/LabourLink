"use client";

export default function AdminFilters({ roleFilter, cityFilter }) {
    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20";

    return (
        <form className="flex flex-wrap items-end gap-4">
            <div className="min-w-[140px] space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    Role
                </label>
                <select
                    name="role"
                    defaultValue={roleFilter}
                    className={inputClass}
                    onChange={(e) => {
                        const url = new URL(window.location);
                        url.searchParams.set("role", e.target.value);
                        if (cityFilter) url.searchParams.set("city", cityFilter);
                        window.location.href = url.toString();
                    }}
                >
                    <option value="ALL">All Roles</option>
                    <option value="LABOUR">Labour</option>
                    <option value="CONTRACTOR">Contractor</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>
            <div className="min-w-[180px] space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    City
                </label>
                <input
                    name="city"
                    defaultValue={cityFilter}
                    placeholder="Filter by city…"
                    className={inputClass}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            const url = new URL(window.location);
                            url.searchParams.set("city", e.target.value);
                            if (roleFilter !== "ALL") url.searchParams.set("role", roleFilter);
                            window.location.href = url.toString();
                        }
                    }}
                />
            </div>
            {(roleFilter !== "ALL" || cityFilter) && (
                <a
                    href="/admin"
                    className="rounded-lg px-3 py-2.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
                >
                    Clear filters
                </a>
            )}
        </form>
    );
}
