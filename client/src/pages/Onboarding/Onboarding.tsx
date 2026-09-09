import React, { useState } from "react";
import AuthShell from "../../components/auth/AuthShell";
import SocialAuth from "../../components/auth/SocialAuth";
import RoleSelector from "../../components/auth/RoleSelector";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";

export default function Onboarding() {
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tu lógica para guardar los datos adicionales de MatchVol
  };

  return (
    <AuthShell 
      title="Complete your profile" 
      subtitle="Just a few more details to find your perfect match"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField 
          id="onboarding-phone" 
          label="Phone number" 
          type="tel" 
          placeholder="+1 (555) 000-0000" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
        
        <TextField 
          id="onboarding-city" 
          label="City / Location" 
          type="text" 
          placeholder="New York, NY" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          required 
        />

        <Button type="submit" className="mt-2">
          Save and continue
        </Button>
      </form>
    </AuthShell>
  );
}
