"use client";

import { X } from "lucide-react";
import EmergencyChatPanel from "@/components/emergency/EmergencyChatPanel";
import type { Pet } from "@/lib/planner-api";

interface PlannerEmergencyModalProps {
  open: boolean;
  onClose: () => void;
  pet: Pet;
  region: string;
  latitude?: number;
  longitude?: number;
}

export default function PlannerEmergencyModal({
  open,
  onClose,
  pet,
  region,
  latitude,
  longitude,
}: PlannerEmergencyModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5"
      style={{ background: "rgba(8, 10, 18, 0.55)" }}
      role="dialog"
      aria-modal
      aria-labelledby="emergency-modal-title"
    >
      <EmergencyChatPanel
        pet={pet}
        region={region}
        latitude={latitude}
        longitude={longitude}
        active={open}
        layout="modal"
        titleId="emergency-modal-title"
        headerAction={
          <button
            type="button"
            onClick={onClose}
            className="pw-btn-icon"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        }
      />
    </div>
  );
}
