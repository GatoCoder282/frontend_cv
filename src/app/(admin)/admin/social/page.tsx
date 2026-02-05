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
  Autocomplete,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Share,
  ViewModule,
  ViewList,
  Link as LinkIcon,
  OpenInNew,
} from "@mui/icons-material";
import { socialService } from "@/services/socialService";
import {
  SocialCreateRequest,
  SocialResponse,
  SocialUpdateRequest,
} from "@/types";
import { ApiError } from "@/services/api";

const emptyForm: SocialCreateRequest = {
  platform: "",
  url: "",
  icon_name: "",
  order: 0,
};

const COMMON_PLATFORMS = [
  "LinkedIn",
  "GitHub",
  "Twitter",
  "Facebook",
  "Instagram",
  "YouTube",
  "Portfolio",
  "Website",
  "Email",
  "WhatsApp",
  "Telegram",
  "Discord",
];

export default function SocialPage() {
  const [socials, setSocials] = useState<SocialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SocialCreateRequest>(emptyForm);
  const [validationMessage, setValidationMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SocialResponse | null>(null);

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const loadSocials = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await socialService.getMySocials();
      setSocials(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudieron cargar las redes sociales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocials();
  }, []);

  const sortedSocials = useMemo(() => {
    return [...socials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [socials]);

  const paginatedSocials = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedSocials.slice(start, start + rowsPerPage);
  }, [sortedSocials, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [socials.length, viewMode]);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
    setError("");
    setSuccess("");
    setValidationMessage("");
  };

  const handleOpenEdit = (social: SocialResponse) => {
    setIsEdit(true);
    setEditingId(social.id);
    setForm({
      platform: social.platform,
      url: social.url,
      icon_name: social.icon_name ?? "",
      order: social.order ?? 0,
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

  const handleChange = (field: keyof SocialCreateRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event?: SyntheticEvent) => {
    event?.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setValidationMessage("");

    if (platformError || urlError || orderError) {
      setValidationMessage("Corrige los campos marcados antes de guardar");
      setSaving(false);
      return;
    }

    try {
      const payload: SocialCreateRequest = {
        platform: trimmedPlatform,
        url: trimmedUrl,
        icon_name: trimmedIconName || null,
        order: form.order ?? 0,
      };

      if (isEdit && editingId) {
        const updatePayload: SocialUpdateRequest = payload;
        const updated = await socialService.updateSocial(editingId, updatePayload);
        setSocials((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        setSuccess("Red social actualizada correctamente");
      } else {
        const created = await socialService.createSocial(payload);
        setSocials((prev) => [created, ...prev]);
        setSuccess("Red social creada correctamente");
      }

      setDialogOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo guardar la red social");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (socialId: number) => {
    setDeletingId(socialId);
    setError("");
    setSuccess("");

    try {
      await socialService.deleteSocial(socialId);
      setSocials((prev) => prev.filter((item) => item.id !== socialId));
      setSuccess("Red social eliminada correctamente");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "No se pudo eliminar la red social");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequestDelete = (social: SocialResponse) => {
    setDeleteTarget(social);
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

  const trimmedPlatform = form.platform.trim();
  const trimmedUrl = form.url.trim();
  const trimmedIconName = form.icon_name?.trim() || "";

  const platformError = useMemo(() => {
    if (!trimmedPlatform) return "La plataforma es obligatoria";
    if (trimmedPlatform.length < 2) return "Minimo 2 caracteres";
    if (trimmedPlatform.length > 50) return "Maximo 50 caracteres";
    return "";
  }, [trimmedPlatform]);

  const urlError = useMemo(() => {
    if (!trimmedUrl) return "La URL es obligatoria";
    if (trimmedUrl.length > 300) return "Maximo 300 caracteres";
    if (!/^https?:\/\//i.test(trimmedUrl)) return "Debe ser una URL valida (https://...)";
    return "";
  }, [trimmedUrl]);

  const orderError = useMemo(() => {
    const orderNum = Number(form.order);
    if (Number.isNaN(orderNum)) return "Debe ser un numero";
    if (orderNum < 0) return "No puede ser negativo";
    if (orderNum > 999) return "Maximo 999";
    return "";
  }, [form.order]);

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
            <Share sx={{ fontSize: 40, color: "primary.main" }} />
            Redes Sociales
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tus conexiones en redes sociales
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={`${socials.length} redes`} color="info" variant="outlined" />
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
            onClick={loadSocials}
            disabled={loading}
          >
            Recargar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            Nueva red
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
      ) : sortedSocials.length === 0 ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              No hay redes sociales registradas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agrega tus redes sociales para que los visitantes puedan contactarte.
            </Typography>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
          <TableContainer component={Paper} sx={{ background: "transparent" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plataforma</TableCell>
                  <TableCell>Icono</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSocials.map((social) => (
                  <TableRow key={social.id} hover>
                    <TableCell>
                      <Chip
                        label={social.order ?? 0}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{social.platform}</Typography>
                    </TableCell>
                    <TableCell>
                      {social.icon_name ? (
                        <Chip size="small" label={social.icon_name} />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {social.url}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          component="a"
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNew fontSize="small" />
                        </Button>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpenEdit(social)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={
                            deletingId === social.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Delete />
                            )
                          }
                          onClick={() => handleRequestDelete(social)}
                          disabled={deletingId === social.id}
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
            count={sortedSocials.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Card>
      ) : (
        <Stack spacing={2}>
          {paginatedSocials.map((social) => (
            <Card
              key={social.id}
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
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "rgba(0, 229, 255, 0.1)",
                        color: "primary.main",
                        border: "1px solid rgba(0, 229, 255, 0.2)",
                      }}
                    >
                      <Share />
                    </Avatar>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight={600}>
                          {social.platform}
                        </Typography>
                        <Chip
                          size="small"
                          label={`Orden: ${social.order ?? 0}`}
                          variant="outlined"
                        />
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LinkIcon fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "underline", cursor: "pointer" }}
                          component="a"
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Abrir enlace
                        </Typography>
                      </Stack>
                      {social.icon_name && (
                        <Chip
                          size="small"
                          label={`Icono: ${social.icon_name}`}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Stack>
                  <CardActions sx={{ p: 0 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleOpenEdit(social)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={
                        deletingId === social.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Delete />
                        )
                      }
                      onClick={() => handleRequestDelete(social)}
                      disabled={deletingId === social.id}
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
            count={sortedSocials.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 10, 20]}
          />
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEdit ? "Editar red social" : "Nueva red social"}
        </DialogTitle>
        <DialogContent>
          {validationMessage && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validationMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <Autocomplete
                freeSolo
                options={COMMON_PLATFORMS}
                value={form.platform}
                onChange={(_event, value) => handleChange("platform", value || "")}
                inputValue={form.platform}
                onInputChange={(_event, value) => handleChange("platform", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Plataforma"
                    required
                    error={Boolean(platformError)}
                    helperText={platformError || "LinkedIn, GitHub, Twitter, etc."}
                  />
                )}
              />
              <TextField
                label="URL"
                value={form.url}
                onChange={(event) => handleChange("url", event.target.value)}
                required
                fullWidth
                error={Boolean(urlError)}
                helperText={urlError || "https://"}
              />
              <TextField
                label="Nombre del icono"
                value={form.icon_name}
                onChange={(event) => handleChange("icon_name", event.target.value)}
                fullWidth
                placeholder="FaLinkedin, FaGithub, etc."
                helperText="Opcional. Nombre del icono de react-icons"
              />

              <Divider />

              <TextField
                label="Orden"
                type="number"
                value={form.order ?? 0}
                onChange={(event) => handleChange("order", Number(event.target.value))}
                fullWidth
                error={Boolean(orderError)}
                helperText={orderError || "Orden de visualizacion (0-999)"}
                inputProps={{ min: 0, max: 999 }}
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
              Boolean(platformError) ||
              Boolean(urlError) ||
              Boolean(orderError)
            }
          >
            {isEdit ? "Guardar cambios" : "Crear red"}
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
              ? `Eliminar red social "${deleteTarget.platform}"? Esta accion no se puede deshacer.`
              : "Eliminar red social?"}
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
