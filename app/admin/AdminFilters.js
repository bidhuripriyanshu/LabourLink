"use client";

export default function AdminFilters({ roleFilter, cityFilter }) {
    return (
        <form className="flex flex-wrap items-end gap-4">
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                <select
                    name="role"
                    defaultValue={roleFilter}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
                <input
                    name="city"
                    defaultValue={cityFilter}
                    placeholder="Filter by city…"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
        </form>
    );
}
