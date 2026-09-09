import { Building2, UserRound } from "lucide-react";
import type { AccountRole } from "../../lib/api";

type RoleSelectorProps = { value: AccountRole; onChange: (role: AccountRole) => void };

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return <div className="role-selector" aria-label="Tipo de cuenta">
    <button type="button" className={value === "volunteer" ? "is-selected" : ""} onClick={() => onChange("volunteer")}><UserRound size={18} aria-hidden="true" />Soy voluntario/a</button>
    <button type="button" className={value === "organization" ? "is-selected" : ""} onClick={() => onChange("organization")}><Building2 size={18} aria-hidden="true" />Soy una organizacion</button>
  </div>;
}
