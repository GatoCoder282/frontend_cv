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
  Avatar,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  TablePagination,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Work,
  ViewModule,
  ViewList,
  OpenInNew,
  Code,
  Star,
  Image as ImageIcon,
} from "@mui/icons-material";
import { projectService } from "@/services/projectService";
import { technologyService } from "@/services/technologyService";
import { workExperienceService } from "@/services/workExperienceService";
import {
  ProjectCreateRequest,
  ProjectResponse,
  ProjectUpdateRequest,
  TechnologyResponse,
  WorkExperienceResponse,
} from "@/types";
import { ProjectCategory } from "@/types/enums";
import { ApiError } from "@/services/api";

const emptyForm: ProjectCreateRequest = {
  title: "",
  category: ProjectCategory.WEB,
  description: "",
  thumbnail_url: "",
  live_url: "",
  repo_url: "",
  featured: false,
  work_experience_id: null,
  technology_ids: [],
  previews: [],
};

const PROJECT_CATEGORIES = Object.values(ProjectCategory);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyResponse[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectCreateRequest>(emptyForm);
  const [validationMessage, setValidationMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectResponse | null>(null);

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const [projectsData, technologiesData, workExperiencesData] = await Promise.all([
        projectService.getMyProjects(),
        technologyService.getMyTechnologies(),
        workExperienceService.getMyWorkExperiences(),
      ]);
      setProjects(projectsData);
      setTechnologies(technologiesData);
      setWorkExperiences(workExperiencesData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProjects = useMemo(() => {
    return projectService.searchProjects(projects, searchTerm);
  }, [projects, searchTerm]);

  const paginatedProjects = useMemo(() => {
    const sorted = projectService.sortByNewest(filteredProjects);
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [filteredProjects, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, viewMode]);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
    setError("");
    setSuccess("");
    setValidationMessage("");
  };

  const handleOpenEdit = (project: ProjectResponse) => {
    setIsEdit(true);
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description ?? "",
      thumbnail_url: project.thumbnail_url ?? "",
      live_url: project.live_url ?? "",
      repo_url: project.repo_url ?? "",
      featured: project.featured,
      work_experience_id: project.work_experience_id,
      technology_ids: project.technology_ids,
      previews: project.previews || [],
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

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event?: SyntheticEvent) => {
    event?.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setValidationMessage("");

    if (titleError || categoryError) {
      setValidationMessage("Corrige los campos marcados antes de guardar");
      setSaving(false);
      return;
    }

    try {
      const payload: ProjectCreateRequest = {
        title: trimmedTitle,
        category: form.category,
        description: trimmedDescription || null,
        thumbnail_url: trimmedThumbnail || null,
        live_url: trimmedLiveUrl || null,
        repo_url: trimmedRepoUrl || null,
        featured: form.featured || false,
        work_experience_id: form.work_experience_id || null,
        technology_ids: form.technology_ids || [],
        previews: form.previews,
      };

      if (isEdit && editingId) {
        const updatePayload: ProjectUpdateRequest = payload;
        const updated = await projectService.updateProject(editingId, updatePayload);
        setProjects((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        setSuccess("Proyecto actualizado correctamente");
      } else {
        const created = await projectService.createProject(payload);
        setProjects((prev) => [created, ...prev]);
        setSuccess("Proyecto creado correctamente");
      }

      setDialogOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo guardar el proyecto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    setDeletingId(projectId);
    setError("");
    setSuccess("");

    try {
      await projectService.deleteProject(projectId);
      setProjects((prev) => prev.filter((item) => item.id !== projectId));
      setSuccess("Proyecto eliminado correctamente");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo eliminar el proyecto");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequestDelete = (project: ProjectResponse) => {
    setDeleteTarget(project);
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const trimmedTitle = form.title.trim();
  const trimmedDescription = form.description?.trim() || "";
  const trimmedThumbnail = form.thumbnail_url?.trim() || "";
  const trimmedLiveUrl = form.live_url?.trim() || "";
  const trimmedRepoUrl = form.repo_url?.trim() || "";

  const titleError = useMemo(() => {
    if (!trimmedTitle) return "El título es obligatorio";
    if (trimmedTitle.length < 3) return "Mínimo 3 caracteres";
    if (trimmedTitle.length > 100) return "Máximo 100 caracteres";
    return "";
  }, [trimmedTitle]);

  const categoryError = useMemo(() => {
    if (!form.category) return "La categoría es obligatoria";
    return "";
  }, [form.category]);

  const urlError = useMemo(() => {
    const urls = [trimmedThumbnail, trimmedLiveUrl, trimmedRepoUrl].filter(Boolean);
    for (const url of urls) {
      if (!/^https?:\/\//i.test(url)) return "Las URLs deben iniciar con https:// o http://";
      if (url.length > 500) return "URL muy larga (máximo 500 caracteres)";
    }
    return "";
  }, [trimmedThumbnail, trimmedLiveUrl, trimmedRepoUrl]);

  const getTechName = (techId: number) => {
    return technologies.find((t) => t.id === techId)?.name || `Tech #${techId}`;
  };

  const getWorkExperienceName = (weId: number | null) => {
    if (!weId) return "-";
    return workExperiences.find((we) => we.id === weId)?.job_title || "-";
  };

  const getCategoryColor = (category: ProjectCategory) => {
    const colors: Record<ProjectCategory, string> = {
      [ProjectCategory.WEB]: "#00e5ff",
      [ProjectCategory.MOBILE]: "#ff9800",
      [ProjectCategory.DESKTOP]: "#9c27b0",
      [ProjectCategory.API]: "#2196f3",
      [ProjectCategory.DATA_SCIENCE]: "#4caf50",
      [ProjectCategory.MACHINE_LEARNING]: "#f44336",
      [ProjectCategory.BLOCKCHAIN]: "#ffc107",
      [ProjectCategory.IOT]: "#00bcd4",
      [ProjectCategory.GAME]: "#e91e63",
      [ProjectCategory.OTHER]: "#9e9e9e",
    };
    return colors[category] || "#9e9e9e";
  };

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
            <Code sx={{ fontSize: 40, color: "primary.main" }} />
            Proyectos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tu portafolio de proyectos
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap" }}>
          <Chip label={`${filteredProjects.length} proyectos`} color="info" variant="outlined" />
          <TextField
            size="small"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 200 }}
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
            onClick={loadData}
            disabled={loading}
          >
            Recargar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            Nuevo proyecto
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
      ) : filteredProjects.length === 0 ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {searchTerm ? "No se encontraron proyectos" : "No hay proyectos registrados"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "Agrega tus proyectos para mostrar tu portafolio"}
            </Typography>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <TableContainer component={Paper} sx={{ background: "transparent" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Tecnologías</TableCell>
                  <TableCell>Experiencia</TableCell>
                  <TableCell align="center">Destacado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProjects.map((project) => (
                  <TableRow key={project.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {project.thumbnail_url && (
                          <Avatar
                            src={project.thumbnail_url}
                            sx={{ width: 32, height: 32 }}
                          />
                        )}
                        <Typography fontWeight={600}>{project.title}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={project.category}
                        size="small"
                        sx={{
                          bgcolor: `${getCategoryColor(project.category)}20`,
                          color: getCategoryColor(project.category),
                          borderColor: getCategoryColor(project.category),
                          border: "1px solid",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        {project.technology_ids.length > 0 ? (
                          project.technology_ids.map((techId) => (
                            <Chip
                              key={techId}
                              label={getTechName(techId)}
                              size="small"
                              variant="outlined"
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getWorkExperienceName(project.work_experience_id)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {project.featured && (
                        <Tooltip title="Proyecto destacado">
                          <Star sx={{ color: "#ffc107" }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpenEdit(project)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={
                            deletingId === project.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Delete />
                            )
                          }
                          onClick={() => handleRequestDelete(project)}
                          disabled={deletingId === project.id}
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
            count={filteredProjects.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Card>
      ) : (
        <Stack spacing={2}>
          {paginatedProjects.map((project) => (
            <Card
              key={project.id}
              elevation={2}
              sx={{ background: "rgba(26, 26, 26, 0.9)" }}
            >
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Box sx={{ flex: { xs: 1, sm: 0.3 } }}>
                    {project.thumbnail_url ? (
                      <Box
                        component="img"
                        src={project.thumbnail_url}
                        sx={{
                          width: "100%",
                          height: 180,
                          borderRadius: 1,
                          objectFit: "cover",
                          border: "1px solid rgba(0, 229, 255, 0.2)",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: 180,
                          borderRadius: 1,
                          background: "rgba(0, 229, 255, 0.05)",
                          border: "1px dashed rgba(0, 229, 255, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ImageIcon sx={{ color: "primary.main" }} />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: { xs: 1, sm: 1 } }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      justifyContent="space-between"
                      height="100%"
                    >
                      <Box flex={1}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {project.title}
                          </Typography>
                          {project.featured && (
                            <Tooltip title="Proyecto destacado">
                              <Star sx={{ color: "#ffc107", fontSize: 20 }} />
                            </Tooltip>
                          )}
                        </Stack>

                        <Chip
                          label={project.category}
                          size="small"
                          sx={{
                            bgcolor: `${getCategoryColor(project.category)}20`,
                            color: getCategoryColor(project.category),
                            borderColor: getCategoryColor(project.category),
                            border: "1px solid",
                            mb: 1,
                          }}
                        />

                        {project.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1, wordBreak: "break-word" }}
                          >
                            {project.description.substring(0, 150)}
                            {project.description.length > 150 ? "..." : ""}
                          </Typography>
                        )}

                        {project.technology_ids.length > 0 && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} mb={1}>
                            {project.technology_ids.slice(0, 5).map((techId) => (
                              <Chip
                                key={techId}
                                label={getTechName(techId)}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {project.technology_ids.length > 5 && (
                              <Chip
                                label={`+${project.technology_ids.length - 5}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        )}

                        <Stack direction="row" spacing={1}>
                          {project.live_url && (
                            <Button
                              size="small"
                              variant="text"
                              component="a"
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={<OpenInNew />}
                            >
                              Ver en vivo
                            </Button>
                          )}
                          {project.repo_url && (
                            <Button
                              size="small"
                              variant="text"
                              component="a"
                              href={project.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={<Code />}
                            >
                              Repositorio
                            </Button>
                          )}
                        </Stack>
                      </Box>

                      <CardActions sx={{ p: 0, flexDirection: "column", gap: 1 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Edit />}
                          onClick={() => handleOpenEdit(project)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          startIcon={
                            deletingId === project.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Delete />
                            )
                          }
                          onClick={() => handleRequestDelete(project)}
                          disabled={deletingId === project.id}
                        >
                          Eliminar
                        </Button>
                      </CardActions>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
          <TablePagination
            component="div"
            count={filteredProjects.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {isEdit ? "Editar proyecto" : "Nuevo proyecto"}
        </DialogTitle>
        <DialogContent>
          {validationMessage && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validationMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              {/* TITULO Y CATEGORIA */}
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: { xs: 1, md: 2 } }}>
                  <TextField
                    label="Título"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    fullWidth
                    error={Boolean(titleError)}
                    helperText={titleError || "Nombre descriptivo del proyecto"}
                  />
                </Box>
                <Box sx={{ flex: { xs: 1, md: 1 } }}>
                  <FormControl fullWidth error={Boolean(categoryError)}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      label="Categoría"
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    >
                      {PROJECT_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              <TextField
                label="Descripción"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                multiline
                rows={3}
                fullWidth
                helperText="Descripción detallada del proyecto"
              />

              {/* URLs */}
              <Divider>URLs y Enlaces</Divider>
              <TextField
                label="URL de Thumbnail"
                value={form.thumbnail_url}
                onChange={(e) => handleChange("thumbnail_url", e.target.value)}
                fullWidth
                error={Boolean(urlError)}
                helperText={urlError || "https://ejemplo.com/imagen.jpg"}
                placeholder="https://"
              />

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="URL en Vivo"
                    value={form.live_url}
                    onChange={(e) => handleChange("live_url", e.target.value)}
                    fullWidth
                    placeholder="https://"
                    helperText="Enlace al proyecto publicado"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="URL del Repositorio"
                    value={form.repo_url}
                    onChange={(e) => handleChange("repo_url", e.target.value)}
                    fullWidth
                    placeholder="https://github.com/..."
                    helperText="Enlace al código fuente"
                  />
                </Box>
              </Stack>

              {/* TECNOLOGÍAS Y EXPERIENCIA */}
              <Divider>Detalles Adicionales</Divider>

              <Autocomplete
                multiple
                options={technologies}
                getOptionLabel={(option) => option.name}
                value={technologies.filter((t) => form.technology_ids?.includes(t.id) || false)}
                onChange={(_event, value) =>
                  handleChange("technology_ids", value.map((t) => t.id))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tecnologías utilizadas" />
                )}
              />

              <FormControl fullWidth>
                <InputLabel>Experiencia Laboral (Opcional)</InputLabel>
                <Select
                  label="Experiencia Laboral (Opcional)"
                  value={form.work_experience_id || ""}
                  onChange={(e) =>
                    handleChange("work_experience_id", e.target.value || null)
                  }
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {workExperiences.map((we) => (
                    <MenuItem key={we.id} value={we.id}>
                      {we.job_title} - {we.company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.featured || false}
                    onChange={(e) => handleChange("featured", e.target.checked)}
                  />
                }
                label="Destacar este proyecto en el portafolio"
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
              Boolean(titleError) ||
              Boolean(categoryError) ||
              Boolean(urlError)
            }
          >
            {isEdit ? "Guardar cambios" : "Crear proyecto"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget
              ? `Eliminar proyecto "${deleteTarget.title}"? Esta acción no se puede deshacer.`
              : "Eliminar proyecto?"}
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
