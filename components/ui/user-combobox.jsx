// components/ui/user-combobox.jsx
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UserAPI } from '@/lib/api-client';

export function UserCombobox({ value, onValueChange, onUserSelect, placeholder = "Pilih pengguna..." }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Load users on mount
  React.useEffect(() => {
    loadUsers();
  }, []);

  // Search users when search term changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        searchUsers(search);
      } else {
        loadUsers();
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [search]);

  const loadUsers = async () => {
    setLoading(true);
    const result = await UserAPI.getAll();
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const searchUsers = async (query) => {
    setLoading(true);
    const result = await UserAPI.search(query);
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const handleSelect = (user) => {
    onValueChange(user.name); // Set form value to user name
    if (onUserSelect) {
      onUserSelect(user); // Pass full user object if needed
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Cari nama atau email..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Mencari...</span>
              </div>
            ) : (
              'Tidak ada pengguna ditemukan.'
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={user.name}
                onSelect={() => handleSelect(user)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === user.name ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// IMPORTANT: Install shadcn components first:
// npx shadcn@latest add command
// npx shadcn@latest add popover