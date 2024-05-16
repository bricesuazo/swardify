import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";

import { Button } from "@swardify/ui/button";

import Contributions from "../_components/contributions";
import SignOutButton from "../_components/signout-button";

export default function Dashboard() {
  return (
    <main className="space-y-4">
      <header className="flex items-center justify-between border-b p-4">
        <Button asChild size="sm" variant="link" className="p-0">
          <Link href="/">Swardify</Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href="/dashboard/words">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Words Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/phrases">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Phrases Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <SignOutButton />
        </div>
      </header>

      <div className="p-4">
        <h4 className="text-lg font-semibold">Contributions</h4>

        <Contributions />
      </div>
    </main>
  );
}
