"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import React from "react";

import { Competitor } from "@/interfaces/competitor";

export default function CompetitorsModal({
  competitor,
  onCloseEvent,
}: {
  competitor: Competitor | undefined;
  onCloseEvent: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  React.useEffect(() => {
    if (competitor) {
      onOpen();
    }
  }, [competitor]);

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onClose={onCloseEvent}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {competitor?.id ? "Modifica" : "Aggiungi"}
            </ModalHeader>
            <ModalBody>{competitor?.fullname}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Chiudi
              </Button>
              <Button color="primary" onPress={onClose}>
                Salva
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
