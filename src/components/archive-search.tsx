import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ArchiveSearch({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" method="get" role="search" className="mt-7 flex max-w-2xl gap-2">
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search the archive"
          aria-label="Search the archive"
          className="h-11 rounded-none border-foreground/40 pl-10 shadow-none focus-visible:ring-foreground"
        />
      </div>
      <Button type="submit" className="h-11 rounded-none px-5">
        Search
      </Button>
    </form>
  );
}