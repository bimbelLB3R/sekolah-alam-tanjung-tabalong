import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div>
        <Button>Profile</Button>
      </div>
    </div>
  );
}
