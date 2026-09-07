"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import type { Tenant } from "@/types";
import { buildQrDestination } from "@/lib/utils/constants";
import Button from "@/components/ui/Button";

export default function QRCodeCard({ tenant }: { tenant: Tenant }) {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const destination = buildQrDestination(tenant.qrId);
  const filename = `${tenant.slug || "restaurant"}-feedback-qr.png`;

  function createCardCanvas(): HTMLCanvasElement | null {
    const qrCanvas = canvasWrapperRef.current?.querySelector("canvas");
    if (!qrCanvas) {
      toast.error("QR code isn't ready yet. Please try again.");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1_000;
    canvas.height = 1_400;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#f7f1e6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.roundRect(40, 40, 920, 1_320, 28);
    context.fill();

    context.fillStyle = "#1f2937";
    context.font = "600 46px Arial, sans-serif";
    context.textAlign = "center";
    drawCenteredLines(context, tenant.name, 500, 145, 54, 820);
    context.fillStyle = "#6b7280";
    context.font = "28px Arial, sans-serif";
    context.fillText("Scan to leave feedback", 500, 245);

    context.imageSmoothingEnabled = false;
    context.drawImage(qrCanvas, 70, 320, 860, 860);
    context.imageSmoothingEnabled = true;

    context.fillStyle = "#6b7280";
    context.font = "26px Arial, sans-serif";
    context.fillText("Point your camera at the code", 500, 1_245);
    context.fillStyle = "#1f2937";
    context.font = "600 30px Arial, sans-serif";
    context.fillText("Thank you for your feedback", 500, 1_310);

    return canvas;
  }

  function downloadCard(canvas: HTMLCanvasElement) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handleDownload() {
    const canvas = createCardCanvas();
    if (!canvas) return;
    downloadCard(canvas);
    toast.success("QR card downloaded");
  }

  function handlePrint() {
    const cardCanvas = createCardCanvas();
    if (!cardCanvas) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Allow pop-ups to print the QR card.");
      return;
    }

    printWindow.opener = null;
    printWindow.document.title = `${tenant.name} feedback QR`;
    printWindow.document.body.style.margin = "0";
    const image = printWindow.document.createElement("img");
    image.src = cardCanvas.toDataURL("image/png");
    image.alt = `${tenant.name} feedback QR card`;
    image.style.display = "block";
    image.style.width = "100%";
    image.style.maxWidth = "1000px";
    image.style.margin = "0 auto";
    image.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
    printWindow.document.body.append(image);
  }

  async function handleWhatsAppShare() {
    const cardCanvas = createCardCanvas();
    if (!cardCanvas) return;

    const blob = await new Promise<Blob | null>((resolve) => cardCanvas.toBlob(resolve, "image/png"));
    if (!blob) {
      toast.error("Couldn't create the QR card image.");
      return;
    }

    const file = new File([blob], filename, { type: "image/png" });
    const shareData = {
      title: `${tenant.name} feedback QR`,
      text: `Feedback QR code for ${tenant.name}`,
      files: [file],
    };

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share(shareData);
        toast.success("QR card ready to share on WhatsApp");
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          toast.error("Couldn't open the share menu.");
        }
      }
      return;
    }

    downloadCard(cardCanvas);
    toast("QR card downloaded. Attach the image in WhatsApp to share it.");
  }

  return (
    <div className="ticket-card mx-auto max-w-sm p-6 text-center print:shadow-none">
      <div>
        <p className="font-display text-lg text-ink">{tenant.name}</p>
        <p className="mb-5 text-xs text-ink-muted">Scan to leave feedback</p>

        <div
          ref={canvasWrapperRef}
          className="mx-auto flex w-fit items-center justify-center rounded-ticket border border-ink/10 bg-white p-4"
        >
          <QRCodeCanvas value={destination} size={200} level="M" includeMargin />
        </div>

        <p className="mt-3 break-all text-xs text-ink-muted">{destination}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 print:hidden sm:grid-cols-2">
        <Button variant="outline" onClick={handleDownload}>
          <Icon icon="mdi:download" width={18} height={18} />
          Download QR Code
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Icon icon="mdi:printer-outline" width={18} height={18} />
          Print card
        </Button>
      </div>

      <div className="mt-2 print:hidden">
        <Button fullWidth variant="secondary" onClick={handleWhatsAppShare}>
          <Icon icon="mdi:whatsapp" width={18} height={18} />
          Share QR image on WhatsApp
        </Button>
      </div>
    </div>
  );
}

function drawCenteredLines(
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  firstLineY: number,
  lineHeight: number,
  maxWidth: number
): void {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (line && context.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  }
  if (line) lines.push(line);

  const startY = firstLineY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((lineText, index) => context.fillText(lineText, centerX, startY + index * lineHeight));
}
