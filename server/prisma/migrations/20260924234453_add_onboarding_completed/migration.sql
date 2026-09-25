-- AlterTable
ALTER TABLE "Fundacion" ADD COLUMN     "areasTrabajo" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "cuit" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "mision" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pais" TEXT,
ADD COLUMN     "sitioWeb" TEXT,
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "tipo" TEXT;

-- AlterTable
ALTER TABLE "Voluntario" ADD COLUMN     "acercaDe" TEXT,
ADD COLUMN     "carrera" TEXT,
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "comoSeEntero" TEXT,
ADD COLUMN     "experiencia" TEXT,
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ADD COLUMN     "fotoPerfil" TEXT,
ADD COLUMN     "genero" TEXT,
ADD COLUMN     "habilidades" TEXT,
ADD COLUMN     "horasPorSemana" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pais" TEXT,
ADD COLUMN     "telefono" TEXT,
ALTER COLUMN "intereses" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");
