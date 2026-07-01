# Plan de Implementación Validado
## Feature: Profiles – Family Support Network

**Bounded Context:** Profiles  
**Segmento objetivo:** Family Support Network  
**Estado:** Validado  
**Fecha de validación:** 30 de junio de 2026  
**Versión del plan:** 1.0

---

## 1. Contexto y Justificación

Después de completar el Bounded Context de **IAM**, el siguiente paso natural es implementar las funcionalidades del **Profiles Service**, enfocándonos exclusivamente en el segmento **Family Support Network**.

Este plan ha sido validado considerando:
- La documentación real del `profiles-service` en el repositorio de microservicios.
- Los endpoints que efectivamente están expuestos y documentados.
- El alcance explícito solicitado (solo Family Support Network).
- La coherencia con la arquitectura DDD ya aplicada en IAM.

---

## 2. Objetivo del Feature

Permitir que los familiares (**Family Support Network**) puedan:

- Crear y gestionar su propio perfil de familiar.
- Vincularse a un paciente.
- Visualizar información del paciente y del médico tratante.
- Navegar por las secciones relevantes de la aplicación a través de un sidebar específico para su rol.

---

## 3. Alcance del Plan

### 3.1 Incluido

- Creación de perfil de familiar (`POST /family-members`)
- Consulta de perfil de familiar (`GET /family-members/{id}`)
- Vinculación de familiar a paciente (`POST /patients/{patientId}/family-members/{familyMemberId}`)
- Consulta de perfil del paciente vinculado (`GET /patients/{patientId}`)
- Consulta de perfil del doctor del paciente (`GET /doctors/{doctorId}`)
- Sidebar con secciones específicas para familiares
- Guards de ruta basados en rol
- Soporte de i18n (es/en)

### 3.2 Excluido (por ahora)

- Gestión completa de pacientes (crear/editar)
- Gestión de doctores
- Endpoints internos de validación cruzada
- Funcionalidades de Care Staff
- Citas, medicación y monitoreo (pendientes de otros BCs)

---

## 4. Endpoints del Profiles Service (Reales)

| Método | Endpoint | Descripción | Prioridad |
|--------|----------|-------------|---------|
| POST   | `/api/v1/profiles/family-members` | Crear perfil de familiar | Alta |
| GET    | `/api/v1/profiles/family-members/{id}` | Obtener perfil del familiar | Alta |
| POST   | `/api/v1/profiles/patients/{patientId}/family-members/{familyMemberId}` | Vincular familiar a paciente | Alta |
| GET    | `/api/v1/profiles/patients/{patientId}` | Ver perfil del paciente | Alta |
| GET    | `/api/v1/profiles/doctors/{doctorId}` | Ver perfil del doctor del paciente | Media |

---

## 5. Estructura de Carpetas (DDD)

```
src/app/features/profiles/
├── domain/
│   ├── models/
│   │   ├── family-member.model.ts
│   │   ├── patient.model.ts
│   │   └── doctor.model.ts
│   ├── enums/
│   └── index.ts
├── application/
│   ├── facades/
│   │   └── profiles.facade.ts
│   ├── use-cases/
│   │   ├── create-family-member.use-case.ts
│   │   ├── link-family-to-patient.use-case.ts
│   │   ├── get-patient.use-case.ts
│   │   └── get-doctor.use-case.ts
│   └── index.ts
├── infrastructure/
│   ├── api/
│   │   └── profiles-api.service.ts
│   ├── mappers/
│   └── index.ts
├── presentation/
│   ├── pages/
│   │   ├── family-profile-page/
│   │   ├── patient-view-page/
│   │   └── doctor-view-page/
│   ├── components/
│   └── profiles.routes.ts
├── ui/
└── index.ts
```

---

## 6. Fases de Implementación

### Fase 1: Domain Layer
- Definir interfaces de dominio (`FamilyMember`, `Patient`, `Doctor`)
- Crear enums si es necesario

### Fase 2: Infrastructure Layer
- Implementar `ProfilesApiService` con los 5 endpoints
- Crear mappers (si aplica)

### Fase 3: Application Layer
- Crear Use Cases
- Crear `ProfilesFacade`

### Fase 4: Presentation Layer
- Crear páginas y componentes de formulario/visualización

### Fase 5: Routing & Guards
- Definir rutas hijas
- Implementar guards por rol

### Fase 6: Sidebar & Layout
- Crear sidebar específico para Family Support Network
- Integrar con layout protegido

### Fase 7: i18n
- Agregar claves de traducción

### Fase 8: Verificación
- Build y pruebas manuales

---

## 7. Commits Atómicos Sugeridos

1. `feat(profiles): add domain models for Family Support Network`
2. `feat(profiles): implement ProfilesApiService`
3. `feat(profiles): add use cases and ProfilesFacade`
4. `feat(profiles): create FamilyProfilePage and form`
5. `feat(profiles): add PatientViewPage and DoctorViewPage`
6. `feat(profiles): implement role-based sidebar and guards`
7. `feat(profiles): add i18n support for Profiles`
8. `fix(profiles): final build verification`

---

## 8. Secciones del Sidebar (Family Support Network)

```
Dashboard
Mi Perfil
Mi Paciente
Citas
Medicación
Monitoreo
Mensajes
Reportes
Pagos
Configuración
```

---

## 9. Validación del Plan

**Estado:** Validado  
**Criterios de validación cumplidos:**
- Alcance correctamente limitado a Family Support Network
- Endpoints reales del `profiles-service` confirmados
- Coherencia con arquitectura DDD de IAM
- Fases atómicas y orden lógico
- Inclusión de sidebar y guards por rol

---

**Documento generado:** 30 de junio de 2026  
**Autor:** Arquitectura Frontend – MediBridge
