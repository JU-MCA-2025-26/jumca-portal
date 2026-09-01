import { useState } from "react";
import { useSendConnectRequest } from "../api/alumni.ts";

interface ConnectRequestModalProps {
  alumniId: string;
  alumniName: string;
  onClose: () => void;
}

export default function ConnectRequestModal({
  alumniId,
  alumniName,
  onClose,
}: ConnectRequestModalProps) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutateAsync, isPending, error: mutationError } = useSendConnectRequest(alumniId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await mutateAsync(message);
      setSuccess(true);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to send request");
    }
  };

  const isSubmitting = isPending;
  const error = localError || (mutationError ? mutationError.message : null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-5 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="py-4 text-center">
            <p className="text-sm font-bold text-success">Request sent</p>
            <p className="mt-1 text-xs text-text-muted">
              {alumniName} will be notified and can approve your request from their side.
            </p>
            <button type="button" onClick={onClose} className="mt-4 tag-base tag-primary">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="section-label mb-1">Connect Request</p>
            <h2 className="text-lg font-bold text-text">Message {alumniName}</h2>
            <p className="mt-1 text-xs text-text-muted">
              {alumniName} will review your request and can approve it before you're connected.
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and let them know why you'd like to connect..."
              rows={4}
              maxLength={500}
              className="input-base mt-4 resize-none"
              required
            />

            {error && <p className="mt-2 text-xs text-danger">{error}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-border2 px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-text-inverse transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
