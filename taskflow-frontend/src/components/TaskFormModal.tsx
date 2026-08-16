import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Button,
  Stack,
} from "@chakra-ui/react";
import type { Column, Priority, Task } from "../types";
import { PRIORITIES } from "../types";

interface TaskFormValues {
  title: string;
  description: string;
  priority: Priority;
  columnId: number;
}

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  task?: Task;
  defaultColumnId?: number;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

const emptyValues = (columnId: number): TaskFormValues => ({
  title: "",
  description: "",
  priority: "Medium",
  columnId,
});

export default function TaskFormModal({
  isOpen,
  onClose,
  columns,
  task,
  defaultColumnId,
  onSubmit,
}: TaskFormModalProps) {
  const isEditing = Boolean(task);
  const [values, setValues] = useState<TaskFormValues>(
    emptyValues(defaultColumnId ?? columns[0]?.id ?? 0),
  );
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (task) {
      setValues({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        columnId: task.column_id,
      });
    } else {
      setValues(emptyValues(defaultColumnId ?? columns[0]?.id ?? 0));
    }
    setTitleError(null);
    setSubmitError(null);
  }, [isOpen, task, defaultColumnId, columns]);

  const handleSubmit = async () => {
    if (values.title.trim().length === 0) {
      setTitleError("Give this task a title before saving.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not save this task.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="heading">
          {isEditing ? "Edit task" : "New task"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={Boolean(titleError)}>
              <FormLabel>Title</FormLabel>
              <Input
                autoFocus
                placeholder="e.g. Write the release notes"
                value={values.title}
                onChange={(e) => {
                  setValues((v) => ({ ...v, title: e.target.value }));
                  if (titleError) setTitleError(null);
                }}
              />
              {titleError && <FormErrorMessage>{titleError}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Optional details"
                value={values.description}
                onChange={(e) =>
                  setValues((v) => ({ ...v, description: e.target.value }))
                }
                rows={3}
              />
            </FormControl>

            <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={values.priority}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      priority: e.target.value as Priority,
                    }))
                  }
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {!isEditing && (
                <FormControl>
                  <FormLabel>Column</FormLabel>
                  <Select
                    value={values.columnId}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        columnId: Number(e.target.value),
                      }))
                    }
                  >
                    {columns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>

            {submitError && (
              <FormControl isInvalid>
                <FormErrorMessage>{submitError}</FormErrorMessage>
              </FormControl>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={submitting}
          >
            {isEditing ? "Save changes" : "Create task"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
