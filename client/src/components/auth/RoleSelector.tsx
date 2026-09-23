import { Building2, UserRound } from "lucide-react";
import type { AccountRole } from "../../lib/api";

type RoleSelectorProps = { value: AccountRole; onChange: (role: AccountRole) => void };

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return <div className="role-selector" aria-label="Account type">
    <button type="button" className={value === "volunteer" ? "is-selected" : ""} onClick={() => onChange("volunteer")}><UserRound size={18} aria-hidden="true" />I'm a volunteer</button>
    <button type="button" className={value === "organization" ? "is-selected" : ""} onClick={() => onChange("organization")}><Building2 size={18} aria-hidden="true" />I'm an organization</button>
  </div>;
}