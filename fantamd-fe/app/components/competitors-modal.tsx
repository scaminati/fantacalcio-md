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
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { Checkbox } from "@heroui/checkbox";
import { useForm } from "react-hook-form";
import React from "react";

import { saveCompetitor } from "../actions/competitors";

import { Competitor } from "@/interfaces/interfaces";

export default function CompetitorsModal({
  competitor,
  onSavedEvent,
  onCloseEvent,
}: {
  competitor: Competitor | undefined;
  onSavedEvent: (savedCompetitor: Competitor) => void;
  onCloseEvent: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Competitor>();

  const onSubmit = async (data: Competitor, onClose: () => void) => {
    try {
      const result = await saveCompetitor(data);

      if (result?.error || !result.data) {
        addToast({
          title: result?.error || "Salvataggio partecipante fallito",
          color: "danger",
        });
      } else {
        onSavedEvent(result.data);
        onClose();
      }
    } catch (_: any) {
      addToast({
        title: "Errore nella comunicazione",
        color: "danger",
      });
    }
  };

  React.useEffect(() => {
    if (competitor) {
      if (competitor.id) {
        reset(competitor);
      } else {
        reset({
          id: undefined,
          fullname: "",
          email: "",
          phone: "",
          paid: "",
          added_into_app: false,
          created_at: undefined,
        });
      }
      onOpen();
    }
  }, [competitor, reset, onOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseEvent} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <Form onSubmit={handleSubmit((data) => onSubmit(data, onClose))}>
            <ModalHeader className="w-full flex flex-col gap-1">
              {competitor?.id ? "Modifica" : "Aggiungi"}
            </ModalHeader>
            <ModalBody className="w-full">
              <Input
                isRequired
                isDisabled={isSubmitting}
                label="Nome"
                placeholder="Inserisci il nome"
                type="text"
                variant="bordered"
                {...register("fullname", { required: true })}
              />
              <Input
                isRequired
                endContent={<EnvelopeIcon className="size-4" />}
                isDisabled={isSubmitting}
                label="Email"
                placeholder="Inserisci l'email"
                type="email"
                variant="bordered"
                {...register("email", { required: true })}
              />
              <Input
                isRequired
                endContent={<DevicePhoneMobileIcon className="size-4" />}
                isDisabled={isSubmitting}
                label="Telefono"
                placeholder="Inserisci il telefono"
                type="text"
                variant="bordered"
                {...register("phone", { required: true })}
              />
              <Input
                isRequired
                isDisabled={isSubmitting}
                label="Pagato"
                placeholder="Inserisci se ha pagato"
                type="text"
                variant="bordered"
                {...register("paid", { required: true })}
              />
              <div className="flex py-2 px-1 justify-between">
                <Checkbox
                  isDisabled={isSubmitting}
                  {...register("added_into_app")}
                >
                  Aggiunto in APP
                </Checkbox>
              </div>
            </ModalBody>
            <ModalFooter className="w-full">
              <Button color="danger" variant="flat" onPress={onClose}>
                Chiudi
              </Button>
              <Button color="primary" isLoading={isSubmitting} type="submit">
                Salva
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
