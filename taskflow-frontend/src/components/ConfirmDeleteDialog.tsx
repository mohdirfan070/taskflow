import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  taskTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function ConfirmDeleteDialog({
  isOpen,
  taskTitle,
  onClose,
  onConfirm,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontFamily="heading">Delete task</AlertDialogHeader>
          <AlertDialogBody>
            Delete &ldquo;{taskTitle}&rdquo;? This can&apos;t be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3} isLoading={isDeleting}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
