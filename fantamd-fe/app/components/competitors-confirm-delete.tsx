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
import React, { useState } from "react";
import { addToast } from "@heroui/toast";

import { deleteCompetitor } from "../actions/competitors";

import { Competitor } from "@/interfaces/interfaces";

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
  const [isSaving, setIsSaving] = useState(false);

  const onConfirm = async (onClose: () => void) => {
    try {
      setIsSaving(true);
      const result = await deleteCompetitor(competitor!);

      if (result?.error) {
        addToast({
          title: result?.error,
          color: "danger",
        });
      } else {
        onDeleteEvent();
        onClose();
      }
    } catch (_: any) {
      setIsSaving(false);
      addToast({
        title: "Errore nella comunicazione",
        color: "danger",
      });
    }
  };

  React.useEffect(() => {
    if (competitor) {
      setIsSaving(false);
      onOpen();
    }
  }, [competitor]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseEvent} onOpenChange={onOpenChange}>
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
              <Button
                color="danger"
                isLoading={isSaving}
                onPress={() => onConfirm(onClose)}
              >
                Conferma
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
