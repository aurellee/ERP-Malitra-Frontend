import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  invoiceNumber: number;
  car: string;
  sales: string;
  mechanic: string;
  itemCount: number;
  isSelected: boolean;
  onSelect: () => void;
};

export default function PendingInvoiceCard({
  invoiceNumber,
  car,
  sales,
  mechanic,
  itemCount,
  isSelected,
  onSelect,
}: Props) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border bg-white dark:bg-[#121212] cursor-pointer transition-all',
        isSelected && 'bg-primary text-white'
      )}
      onClick={onSelect}
    >
      <div className="font-semibold text-sm">Invoice #{invoiceNumber}</div>
      <div className="text-xs mt-2 space-y-1">
        <div>Car: {car}</div>
        <div>Sales: {sales || "—"}</div>
        <div>Mechanic: {mechanic || "—"}</div>
      </div>
      <Button
        variant="ghost"
        className={cn(
          'mt-3 w-full text-sm',
          isSelected ? 'text-white' : 'text-primary'
        )}
      >
        {itemCount} Items
      </Button>
    </div>
  );
}