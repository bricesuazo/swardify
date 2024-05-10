import Link from "next/link";

import { Button } from "@swardify/ui/button";

export default function Dashboard() {
  return (
    <div>
      <Button variant="outline">
        <Link href="/dashboard/words">Go to Words Dashboard</Link>
      </Button>
      <Button variant="outline">
        <Link href="/dashboard/phrases">Go to Phrases Dashboard</Link>
      </Button>
    </div>
  );
}
