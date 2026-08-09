import { EditShiftScreen } from "../../../components/EditShiftScreen";

export default async function LegacyEditShiftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditShiftScreen shiftId={id} />;
}
