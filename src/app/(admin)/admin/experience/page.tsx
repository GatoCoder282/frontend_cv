"use client";

import { useEffect, useMemo, useState, ChangeEvent, SyntheticEvent } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Work,
  CalendarMonth,
  ViewModule,
  ViewList,
} from "@mui/icons-material";
import { workExperienceService } from "@/services/workExperienceService";
import {
  WorkExperienceCreateRequest,
  WorkExperienceResponse,
  WorkExperienceUpdateRequest,
} from "@/types";
import { ApiError } from "@/services/api";

const emptyForm: WorkExperienceCreateRequest = {
  job_title: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
};

const formatDate = (value?: string | null) => {
  if (!value) return "Presente";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "short",
  });
};

export default function WorkExperiencePage() {
  const [experiences, setExperiences] = useState<WorkExperienceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<WorkExperienceCreateRequest>(emptyForm);
  const [validationMessage, setValidationMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<WorkExperienceResponse | null>(null);

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const loadExperiences = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await workExperienceService.getMyWorkExperiences();
      setExperiences(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudieron cargar las experiencias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      if (a.start_date === b.start_date) return b.id - a.id;
      return a.start_date < b.start_date ? 1 : -1;
    });
  }, [experiences]);

  const paginatedExperiences = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedExperiences.slice(start, start + rowsPerPage);
  }, [sortedExperiences, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [experiences.length, viewMode]);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
    setError("");
    setSuccess("");
    setValidationMessage("");
  };

  const handleOpenEdit = (experience: WorkExperienceResponse) => {
    setIsEdit(true);
    setEditingId(experience.id);
    setForm({
      job_title: experience.job_title,
      company: experience.company,
      location: experience.location ?? "",
      start_date: experience.start_date,
      end_date: experience.end_date ?? "",
      description: experience.description ?? "",
    });
    setDialogOpen(true);
    setError("");
    setSuccess("");
    setValidationMessage("");
  };

  const handleCloseDialog = () => {
    if (saving) return;
    setDialogOpen(false);
  };

  const handleChange = (
    field: keyof WorkExperienceCreateRequest,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event?: SyntheticEvent) => {
    event?.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setValidationMessage("");

    if (jobTitleError || companyError || startDateError || endDateError || descriptionError || locationError) {
      setValidationMessage("Corrige los campos marcados antes de guardar");
      setSaving(false);
      return;
    }

    try {
      const payload: WorkExperienceCreateRequest = {
        job_title: trimmedJobTitle,
        company: trimmedCompany,
        location: trimmedLocation || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        description: trimmedDescription || null,
      };

      if (isEdit && editingId) {
        const updatePayload: WorkExperienceUpdateRequest = payload;
        const updated = await workExperienceService.updateWorkExperience(
          editingId,
          updatePayload
        );
        setExperiences((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        setSuccess("Experiencia actualizada correctamente");
      } else {
        const created = await workExperienceService.createWorkExperience(payload);
        setExperiences((prev) => [created, ...prev]);
        setSuccess("Experiencia creada correctamente");
      }

      setDialogOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo guardar la experiencia");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (experienceId: number) => {
    setDeletingId(experienceId);
    setError("");
    setSuccess("");

    try {
      await workExperienceService.deleteWorkExperience(experienceId);
      setExperiences((prev) => prev.filter((item) => item.id !== experienceId));
      setSuccess("Experiencia eliminada correctamente");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo eliminar la experiencia");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequestDelete = (experience: WorkExperienceResponse) => {
    setDeleteTarget(experience);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deletingId) return;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget.id);
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleChangeDate = (
    field: "start_date" | "end_date",
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChange(field, event.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const trimmedJobTitle = form.job_title.trim();
  const trimmedCompany = form.company.trim();
  const trimmedLocation = form.location?.trim() || "";
  const trimmedDescription = form.description?.trim() || "";

  const jobTitleError = useMemo(() => {
    if (!trimmedJobTitle) return "El cargo es obligatorio";
    if (trimmedJobTitle.length < 2) return "Minimo 2 caracteres";
    if (trimmedJobTitle.length > 60) return "Maximo 60 caracteres";
    return "";
  }, [trimmedJobTitle]);

  const companyError = useMemo(() => {
    if (!trimmedCompany) return "La empresa es obligatoria";
    if (trimmedCompany.length < 2) return "Minimo 2 caracteres";
    if (trimmedCompany.length > 80) return "Maximo 80 caracteres";
    return "";
  }, [trimmedCompany]);

  const locationError = useMemo(() => {
    if (!trimmedLocation) return "";
    if (trimmedLocation.length > 120) return "Maximo 120 caracteres";
    return "";
  }, [trimmedLocation]);

  const descriptionError = useMemo(() => {
    if (!trimmedDescription) return "";
    if (trimmedDescription.length > 600) return "Maximo 600 caracteres";
    return "";
  }, [trimmedDescription]);

  const startDateError = useMemo(() => {
    if (!form.start_date) return "La fecha de inicio es obligatoria";
    return "";
  }, [form.start_date]);

  const endDateError = useMemo(() => {
    if (!form.end_date) return "";
    if (!form.start_date) return "";
    if (form.end_date < form.start_date) {
      return "La fecha de fin no puede ser menor a la de inicio";
    }
    return "";
  }, [form.start_date, form.end_date]);

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Work sx={{ fontSize: 40, color: "primary.main" }} />
            Experiencia Laboral
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tu historial de trabajo y roles clave
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={`${experiences.length} experiencias`}
            color="info"
            variant="outlined"
          />
          <ToggleButtonGroup
            exclusive
            value={viewMode}
            onChange={(_event, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="cards" aria-label="vista tarjetas">
              <ViewModule fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table" aria-label="vista tabla">
              <ViewList fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadExperiences}
            disabled={loading}
          >
            Recargar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            Nueva experiencia
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : sortedExperiences.length === 0 ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              No hay experiencias registradas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agrega tu primera experiencia laboral para comenzar.
            </Typography>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <TableContainer component={Paper} sx={{ background: "transparent" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Ubicacion</TableCell>
                  <TableCell>Fechas</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedExperiences.map((experience) => (
                  <TableRow key={experience.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {experience.job_title}
                      </Typography>
                      {experience.description && (
                        <Typography variant="caption" color="text.secondary">
                          {experience.description.substring(0, 50)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{experience.company}</TableCell>
                    <TableCell>{experience.location || "-"}</TableCell>
                    <TableCell>
                      <Typography variant="body2" whiteSpace="nowrap">
                        {formatDate(experience.start_date)} -{" "}
                        {formatDate(experience.end_date)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpenEdit(experience)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={
                            deletingId === experience.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Delete />
                            )
                          }
                          onClick={() => handleRequestDelete(experience)}
                          disabled={deletingId === experience.id}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedExperiences.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Card>
      ) : (
        <Stack spacing={2}>
          {paginatedExperiences.map((experience) => (
            <Card
              key={experience.id}
              elevation={2}
              sx={{ background: "rgba(26, 26, 26, 0.9)" }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                >
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {experience.job_title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {experience.company}
                      {experience.location
                        ? ` • ${experience.location}`
                        : ""}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonth fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(experience.start_date)} -
                        {` ${formatDate(experience.end_date)}`}
                      </Typography>
                    </Stack>
                    {experience.description && (
                      <Typography variant="body2" color="text.secondary">
                        {experience.description}
                      </Typography>
                    )}
                  </Stack>
                  <CardActions sx={{ p: 0 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleOpenEdit(experience)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={
                        deletingId === experience.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Delete />
                        )
                      }
                      onClick={() => handleRequestDelete(experience)}
                      disabled={deletingId === experience.id}
                    >
                      Eliminar
                    </Button>
                  </CardActions>
                </Stack>
              </CardContent>
            </Card>
          ))}
          <TablePagination
            component="div"
            count={sortedExperiences.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Stack>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEdit ? "Editar experiencia" : "Nueva experiencia"}
        </DialogTitle>
        <DialogContent>
          {validationMessage && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validationMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Cargo"
                value={form.job_title}
                onChange={(event) => handleChange("job_title", event.target.value)}
                required
                fullWidth
                error={Boolean(jobTitleError)}
                helperText={jobTitleError || "2 a 60 caracteres"}
              />
              <TextField
                label="Empresa"
                value={form.company}
                onChange={(event) => handleChange("company", event.target.value)}
                required
                fullWidth
                error={Boolean(companyError)}
                helperText={companyError || "2 a 80 caracteres"}
              />
              <TextField
                label="Ubicacion"
                value={form.location}
                onChange={(event) => handleChange("location", event.target.value)}
                fullWidth
                error={Boolean(locationError)}
                helperText={locationError || "Opcional"}
              />
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Fecha inicio"
                  type="date"
                  value={form.start_date}
                  onChange={(event) => handleChangeDate("start_date", event)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(startDateError)}
                  helperText={startDateError || ""}
                  required
                />
                <TextField
                  label="Fecha fin"
                  type="date"
                  value={form.end_date}
                  onChange={(event) => handleChangeDate("end_date", event)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(endDateError)}
                  helperText={endDateError || "Deja vacio si es actual"}
                />
              </Stack>
              <Divider />
              <TextField
                label="Descripcion"
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                fullWidth
                multiline
                rows={4}
                inputProps={{ maxLength: 600 }}
                error={Boolean(descriptionError)}
                helperText={
                  descriptionError ||
                  `${trimmedDescription.length}/600 caracteres`
                }
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            startIcon={saving ? <CircularProgress size={18} /> : <Add />}
            disabled={
              saving ||
              Boolean(jobTitleError) ||
              Boolean(companyError) ||
              Boolean(startDateError) ||
              Boolean(endDateError) ||
              Boolean(descriptionError) ||
              Boolean(locationError)
            }
          >
            {isEdit ? "Guardar cambios" : "Crear experiencia"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar eliminacion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget
              ? `Eliminar experiencia en "${deleteTarget.company}"? Esta accion no se puede deshacer.`
              : "Eliminar experiencia?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={Boolean(deletingId)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={Boolean(deletingId)}
            startIcon={deletingId ? <CircularProgress size={16} /> : <Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
