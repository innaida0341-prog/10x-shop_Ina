import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { AddressBook } from "@/components/checkout/AddressBook";
import { Panel } from "@/components/ui/Panel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AddressesPage(): ReactElement {
  useDocumentTitle("Addresses");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/profile" className="text-sm font-semibold text-brand transition hocus:underline">← Profile</Link>
          <h1 className="mt-2 font-display text-3xl font-bold">Address book</h1>
          <p className="mt-1 text-sm text-muted">Saved locally and reused at checkout. No address is sent to a server.</p>
        </div>
      </header>
      <Panel>
        <AddressBook mode="manage" />
      </Panel>
    </div>
  );
}