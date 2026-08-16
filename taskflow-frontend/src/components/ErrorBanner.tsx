import { Alert, AlertIcon, AlertDescription, Button, HStack } from '@chakra-ui/react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <Alert status="error" borderRadius="lg" variant="left-accent">
      <AlertIcon />
      <HStack justify="space-between" flex="1">
        <AlertDescription>{message}</AlertDescription>
        <Button size="sm" onClick={onRetry} colorScheme="red" variant="outline">
          Try again
        </Button>
      </HStack>
    </Alert>
  );
}
