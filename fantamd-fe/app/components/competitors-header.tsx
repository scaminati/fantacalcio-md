import { Button } from "@heroui/button";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/input";
import React from "react";

import { Competitor } from "@/interfaces/competitor";

export default function CompetitorsHeader({
  applyFilterChange,
  setModalCompetitor,
}: {
  applyFilterChange: (value: string) => void;
  setModalCompetitor: (value: Competitor) => void;
}) {
  const [filterValue, setFilterValue] = React.useState("");
  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  return (
    <div className="flex justify-between gap-3 items-end pb-4">
      <div className="flex gap-2 w-full sm:max-w-[40%]">
        <Button
          isIconOnly
          color="primary"
          size="sm"
          onPress={() => applyFilterChange(filterValue)}
        >
          <MagnifyingGlassIcon className="size-4" />
        </Button>
        <Input
          isClearable
          classNames={{
            inputWrapper: "border-1",
          }}
          placeholder="Cerca..."
          size="sm"
          value={filterValue}
          variant="bordered"
          onClear={() => applyFilterChange("")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applyFilterChange(filterValue);
            }
          }}
          onValueChange={onSearchChange}
        />
      </div>
      <div className="flex gap-3">
        <Button
          color="primary"
          endContent={<PlusIcon className="size-4" />}
          size="sm"
          onPress={() => setModalCompetitor({} as Competitor)}
        >
          Aggiungi
        </Button>
      </div>
    </div>
  );
}
