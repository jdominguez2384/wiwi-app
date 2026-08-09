"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EditShiftScreen } from "../../components/EditShiftScreen";

function EditShiftFromQuery() {
  const searchParams = useSearchParams();
  const shiftId = searchParams.get("id") || undefined;

  return <EditShiftScreen shiftId={shiftId} />;
}

export default function EditShiftPage() {
  return (
    <Suspense fallback={null}>
      <EditShiftFromQuery />
    </Suspense>
  );
}
