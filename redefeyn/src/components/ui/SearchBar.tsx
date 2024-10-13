"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-sm mx-auto mt-2"
    >
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10 rounded-full bg-background border-primary"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 rounded-full bg-transparent hover:bg-transparent"
        >
          <Search className="h-4 w-4 text-primary" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
