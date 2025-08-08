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
import { addToast } from "@heroui/toast";

import { deleteCompetitor } from "../actions/competitors";

import { Competitor } from "@/interfaces/competitor";

export default function CompetitorConfirmDelete({
  competitor,
  onDeleteEvent,
  onCloseEvent,
}: {
  competitor: Competitor | undefined;
  onDeleteEvent: () => void;
  onCloseEvent: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onConfirm = async (onClose: () => void) => {
    try {
      await deleteCompetitor(competitor!);
      onDeleteEvent();
      onClose();
    } catch (error: any) {
      addToast({
        title: error.message || "Cancellazione partecipante fallita",
        color: "danger",
      });
    }
  };

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
            <ModalHeader>Conferma</ModalHeader>
            <ModalBody>
              Sei sicuro di voler eliminare il partecipante?
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Annulla
              </Button>
              <Button color="danger" onPress={() => onConfirm(onClose)}>
                Conferma
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
