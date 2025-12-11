"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
  BanknotesIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { Skeleton } from "@heroui/skeleton";

import { listColors } from "@/lib/utils";
import { Competitor } from "@/interfaces/interfaces";

type Props = {
  competitor: Competitor;
  listIndex: number | undefined;
  setModalCompetitor: (competitor: Competitor) => void;
  setDeleteCompetitor: (competitor: Competitor) => void;
};
export default function CompetitorCard({
  competitor,
  listIndex,
  setModalCompetitor,
  setDeleteCompetitor,
}: Props) {
  return (
    <Card key={competitor.id} data-testid="competitor-card">
      <CardHeader className="justify-between">
        <User
          avatarProps={{
            name: competitor.fullname[0].toUpperCase(),
            radius: "full",
            size: "sm",
            color: listColors[listIndex ? listIndex % listColors.length : 0],
            showFallback: true,
          }}
          classNames={{
            description: "text-default-500",
          }}
          data-testid="user"
          description={competitor.email}
          name={competitor.fullname}
        />

        <div className="flex items-center gap-1">
          <Chip
            color={competitor.added_into_app ? "success" : "danger"}
            data-testid="added-chip"
            size="sm"
            variant="flat"
          >
            {competitor.added_into_app ? "Aggiunto" : "Non Aggiunto"}
          </Chip>

          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  data-testid="actions-btn"
                  radius="full"
                  size="sm"
                  variant="light"
                >
                  <EllipsisVerticalIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="edit"
                  data-testid="edit-btn"
                  onPress={() => setModalCompetitor(competitor)}
                >
                  Modifica
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  data-testid="delete-btn"
                  onPress={() => setDeleteCompetitor(competitor)}
                >
                  Elimina
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="px-3 py-1 text-xs text-tiny text-default-500">
        <div className="flex items-center justify-between gap-1 p-1">
          <div className="flex items-center gap-1">
            <PhoneIcon className="h-3 w-3" />
            <span>Telefono</span>
          </div>
          <div>{competitor.phone}</div>
        </div>
        <div className="flex items-center justify-between gap-1 p-1">
          <div className="flex items-center gap-1">
            <BanknotesIcon className="h-3 w-3" />
            <span>Pagato</span>
          </div>
          <div>{competitor.paid}</div>
        </div>
      </CardBody>
    </Card>
  );
}

export function CompetitorCardSkeleton() {
  return (
    <Card data-testid="user-skeleton">
      <CardHeader className="justify-between">
        <Skeleton className="flex rounded-full w-8 h-8 mr-3" />
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-2/5 rounded-lg" />
          <Skeleton className="h-2 w-1/5 rounded-lg" />
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="px-3 py-1">
        {Array.from({ length: 2 }, (_, y) => (
          <div
            key={y}
            className="w-full flex items-center justify-between gap-1 py-2 px-1"
          >
            <div className="w-full">
              <Skeleton className="h-2 w-1/5 rounded-lg" />
            </div>
            <div className="w-full flex justify-end">
              <Skeleton className="h-2 w-1/5 rounded-lg" />
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
