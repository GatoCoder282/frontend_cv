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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  People,
  Image as ImageIcon,
  Link as LinkIcon,
  ViewModule,
  ViewList,
} from "@mui/icons-material";
import { clientService } from "@/services/clientService";
import { cloudinaryService } from "@/services/cloudinaryService";
import {
  ClientCreateRequest,
  ClientResponse,
  ClientUpdateRequest,
} from "@/types";
import { ApiError } from "@/services/api";

const emptyForm: ClientCreateRequest = {
  name: "",
  company: "",
  feedback: "",
  client_photo_url: "",
  project_link: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientCreateRequest>(emptyForm);
  const [validationMessage, setValidationMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClientResponse | null>(null);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const loadClients = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await clientService.getMyClients();
      setClients(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter((client) => {
      if (!term) return true;
      const nameMatch = client.name.toLowerCase().includes(term);
      const companyMatch = client.company
        ? client.company.toLowerCase().includes(term)
        : false;
      return nameMatch || companyMatch;
    });
  }, [clients, search]);

  const paginatedClients = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredClients.slice(start, start + rowsPerPage);
  }, [filteredClients, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [search, clients.length, viewMode]);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
    setError("");
    setSuccess("");
    setValidationMessage("");
  };

  const handleOpenEdit = (client: ClientResponse) => {
    setIsEdit(true);
    setEditingId(client.id);
    setForm({
      name: client.name,
      company: client.company ?? "",
      feedback: client.feedback ?? "",
      client_photo_url: client.client_photo_url ?? "",
      project_link: client.project_link ?? "",
    });
    setDialogOpen(true);
    setError("");
    setSuccess("");
    setValidationMessage("");
  };

  const handleCloseDialog = () => {
    if (saving || uploading) return;
    setDialogOpen(false);
  };

  const handleChange = (field: keyof ClientCreateRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event?: SyntheticEvent) => {
    event?.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setValidationMessage("");

    if (nameError || companyError || feedbackError || photoUrlError || projectUrlError) {
      setValidationMessage("Corrige los campos marcados antes de guardar");
      setSaving(false);
      return;
    }

    try {
      const payload: ClientCreateRequest = {
        name: trimmedName,
        company: trimmedCompany || null,
        feedback: trimmedFeedback || null,
        client_photo_url: trimmedPhotoUrl || null,
        project_link: trimmedProjectUrl || null,
      };

      if (isEdit && editingId) {
        const updatePayload: ClientUpdateRequest = payload;
        const updated = await clientService.updateClient(editingId, updatePayload);
        setClients((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        setSuccess("Cliente actualizado correctamente");
      } else {
        const created = await clientService.createClient(payload);
        setClients((prev) => [created, ...prev]);
        setSuccess("Cliente creado correctamente");
      }

      setDialogOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo guardar el cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (clientId: number) => {
    setDeletingId(clientId);
    setError("");
    setSuccess("");

    try {
      await clientService.deleteClient(clientId);
      setClients((prev) => prev.filter((item) => item.id !== clientId));
      setSuccess("Cliente eliminado correctamente");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo eliminar el cliente");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequestDelete = (client: ClientResponse) => {
    setDeleteTarget(client);
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

  const handleUploadPhoto = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const result = await cloudinaryService.uploadImage(file, "clients");
      setForm((prev) => ({ ...prev, client_photo_url: result.url }));
      setSuccess("Foto subida correctamente");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
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

  const trimmedName = form.name.trim();
  const trimmedCompany = form.company?.trim() || "";
  const trimmedFeedback = form.feedback?.trim() || "";
  const trimmedPhotoUrl = form.client_photo_url?.trim() || "";
  const trimmedProjectUrl = form.project_link?.trim() || "";

  const nameError = useMemo(() => {
    if (!trimmedName) return "El nombre es obligatorio";
    if (trimmedName.length < 2) return "Minimo 2 caracteres";
    if (trimmedName.length > 80) return "Maximo 80 caracteres";
    return "";
  }, [trimmedName]);

  const companyError = useMemo(() => {
    if (!trimmedCompany) return "";
    if (trimmedCompany.length > 100) return "Maximo 100 caracteres";
    return "";
  }, [trimmedCompany]);

  const feedbackError = useMemo(() => {
    if (!trimmedFeedback) return "";
    if (trimmedFeedback.length > 400) return "Maximo 400 caracteres";
    return "";
  }, [trimmedFeedback]);

  const photoUrlError = useMemo(() => {
    if (!trimmedPhotoUrl) return "";
    if (trimmedPhotoUrl.length > 300) return "Maximo 300 caracteres";
    if (!/^https?:\/\//i.test(trimmedPhotoUrl)) return "Debe ser una URL valida";
    return "";
  }, [trimmedPhotoUrl]);

  const projectUrlError = useMemo(() => {
    if (!trimmedProjectUrl) return "";
    if (trimmedProjectUrl.length > 300) return "Maximo 300 caracteres";
    if (!/^https?:\/\//i.test(trimmedProjectUrl)) return "Debe ser una URL valida";
    return "";
  }, [trimmedProjectUrl]);

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
            <People sx={{ fontSize: 40, color: "primary.main" }} />
            Clientes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra testimonios y proyectos asociados
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={`${clients.length} clientes`} color="info" variant="outlined" />
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
            onClick={loadClients}
            disabled={loading}
          >
            Recargar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            Nuevo cliente
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

      <Card elevation={2} sx={{ mb: 3, background: "rgba(26, 26, 26, 0.9)" }}>
        <CardContent>
          <TextField
            fullWidth
            label="Buscar cliente"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredClients.length === 0 ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              No hay clientes registrados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agrega tu primer cliente para comenzar a mostrar testimonios.
            </Typography>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <TableContainer component={Paper} sx={{ background: "transparent" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Foto</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Avatar
                        src={client.client_photo_url || undefined}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "rgba(0, 229, 255, 0.1)",
                          color: "primary.main",
                          border: "1px solid rgba(0, 229, 255, 0.2)",
                        }}
                      >
                        <People fontSize="small" />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{client.name}</Typography>
                    </TableCell>
                    <TableCell>{client.company || "-"}</TableCell>
                    <TableCell>
                      {client.feedback ? (
                        <Chip size="small" label="Configurado" variant="outlined" />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpenEdit(client)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={
                            deletingId === client.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Delete />
                            )
                          }
                          onClick={() => handleRequestDelete(client)}
                          disabled={deletingId === client.id}
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
            count={filteredClients.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Card>
      ) : (
        <Stack spacing={2}>
          {paginatedClients.map((client) => (
            <Card
              key={client.id}
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
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={client.client_photo_url || undefined}
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "rgba(0, 229, 255, 0.1)",
                        color: "primary.main",
                        border: "1px solid rgba(0, 229, 255, 0.2)",
                      }}
                    >
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {client.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.company || "Empresa no especificada"}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {client.project_link && (
                          <Chip
                            size="small"
                            icon={<LinkIcon />}
                            label="Proyecto"
                            variant="outlined"
                          />
                        )}
                        {client.feedback && (
                          <Chip size="small" label="Feedback" variant="outlined" />
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                  <CardActions sx={{ p: 0 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleOpenEdit(client)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={
                        deletingId === client.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Delete />
                        )
                      }
                      onClick={() => handleRequestDelete(client)}
                      disabled={deletingId === client.id}
                    >
                      Eliminar
                    </Button>
                  </CardActions>
                </Stack>
                {client.feedback && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    {client.feedback}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
          <TablePagination
            component="div"
            count={filteredClients.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
        <DialogContent>
          {validationMessage && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validationMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                required
                fullWidth
                error={Boolean(nameError)}
                helperText={nameError || "2 a 80 caracteres"}
              />
              <TextField
                label="Empresa"
                value={form.company}
                onChange={(event) => handleChange("company", event.target.value)}
                fullWidth
                error={Boolean(companyError)}
                helperText={companyError || "Opcional"}
              />
              <TextField
                label="Feedback"
                value={form.feedback}
                onChange={(event) => handleChange("feedback", event.target.value)}
                fullWidth
                multiline
                rows={3}
                inputProps={{ maxLength: 400 }}
                error={Boolean(feedbackError)}
                helperText={feedbackError || `${trimmedFeedback.length}/400 caracteres`}
              />

              <Divider />

              <TextField
                label="URL del proyecto"
                value={form.project_link}
                onChange={(event) => handleChange("project_link", event.target.value)}
                fullWidth
                error={Boolean(projectUrlError)}
                helperText={projectUrlError || "Opcional. https://..."}
              />
              <TextField
                label="URL de foto"
                value={form.client_photo_url}
                onChange={(event) => handleChange("client_photo_url", event.target.value)}
                fullWidth
                error={Boolean(photoUrlError)}
                helperText={photoUrlError || "Opcional. https://..."}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={uploading ? <CircularProgress size={16} /> : <ImageIcon />}
                  disabled={uploading}
                >
                  {uploading ? "Subiendo..." : "Subir foto"}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleUploadPhoto(event.target.files?.[0])}
                  />
                </Button>
                <Avatar
                  src={form.client_photo_url || undefined}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "rgba(0, 229, 255, 0.1)",
                    color: "primary.main",
                    border: "1px solid rgba(0, 229, 255, 0.2)",
                  }}
                >
                  <People fontSize="small" />
                </Avatar>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} disabled={saving || uploading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            startIcon={saving ? <CircularProgress size={18} /> : <Add />}
            disabled={
              saving ||
              uploading ||
              Boolean(nameError) ||
              Boolean(companyError) ||
              Boolean(feedbackError) ||
              Boolean(photoUrlError) ||
              Boolean(projectUrlError)
            }
          >
            {isEdit ? "Guardar cambios" : "Crear cliente"}
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
              ? `Eliminar cliente "${deleteTarget.name}"? Esta accion no se puede deshacer.`
              : "Eliminar cliente?"}
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
