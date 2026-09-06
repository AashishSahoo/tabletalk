"use client";

import { useCallback, useState } from "react";
import { logError } from "@/lib/utils/errorHandler";

export function useClipboard(resetAfterMs = 2500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for non-secure contexts / older browsers.
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), resetAfterMs);
        return true;
      } catch (error) {
        logError("useClipboard", error);
        return false;
      }
    },
    [resetAfterMs]
  );

  return { copied, copy };
}
