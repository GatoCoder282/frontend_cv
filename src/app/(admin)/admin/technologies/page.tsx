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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Divider,
	ToggleButton,
	ToggleButtonGroup,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TablePagination,
	Paper,
} from "@mui/material";
import {
	Add,
	Edit,
	Delete,
	Refresh,
	Code,
	ViewModule,
	ViewList,
	Image as ImageIcon,
} from "@mui/icons-material";
import { technologyService } from "@/services/technologyService";
import { cloudinaryService } from "@/services/cloudinaryService";
import {
	TechnologyCategory,
	TechnologyCreateRequest,
	TechnologyResponse,
	TechnologyUpdateRequest,
} from "@/types";
import { ApiError } from "@/services/api";

const emptyForm: TechnologyCreateRequest = {
	name: "",
	category: TechnologyCategory.FRONTEND,
	icon_url: "",
};

const categoryLabels: Record<TechnologyCategory, string> = {
	[TechnologyCategory.FRONTEND]: "Frontend",
	[TechnologyCategory.BACKEND]: "Backend",
	[TechnologyCategory.DATABASE]: "Base de Datos",
	[TechnologyCategory.DEVOPS]: "DevOps",
	[TechnologyCategory.MOBILE]: "Mobile",
	[TechnologyCategory.TOOL]: "Herramientas",
	[TechnologyCategory.OTHER]: "Otro",
};

const getCategoryColor = (category: TechnologyCategory) => {
	switch (category) {
		case TechnologyCategory.FRONTEND:
			return "info";
		case TechnologyCategory.BACKEND:
			return "primary";
		case TechnologyCategory.DATABASE:
			return "success";
		case TechnologyCategory.DEVOPS:
			return "warning";
		case TechnologyCategory.MOBILE:
			return "secondary";
		case TechnologyCategory.TOOL:
			return "default";
		case TechnologyCategory.OTHER:
		default:
			return "default";
	}
};

export default function TechnologiesPage() {
	const [technologies, setTechnologies] = useState<TechnologyResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [dialogOpen, setDialogOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<TechnologyCreateRequest>(emptyForm);
	const [validationMessage, setValidationMessage] = useState("");

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] =
		useState<TechnologyResponse | null>(null);

	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<
		TechnologyCategory | "ALL"
	>("ALL");
	const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(6);

	const loadTechnologies = async () => {
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			const data = await technologyService.getMyTechnologies();
			setTechnologies(data);
		} catch (err) {
			const apiError = err as ApiError;
			setError(apiError.message || "No se pudieron cargar las tecnologias");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTechnologies();
	}, []);

	const filteredTechnologies = useMemo(() => {
		const term = search.trim().toLowerCase();
		return technologies.filter((tech) => {
			const matchesSearch = term
				? tech.name.toLowerCase().includes(term)
				: true;
			const matchesCategory =
				categoryFilter === "ALL" ? true : tech.category === categoryFilter;
			return matchesSearch && matchesCategory;
		});
	}, [technologies, search, categoryFilter]);

	const paginatedTechnologies = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredTechnologies.slice(start, start + rowsPerPage);
	}, [filteredTechnologies, page, rowsPerPage]);

	useEffect(() => {
		setPage(0);
	}, [search, categoryFilter, technologies.length]);

	const trimmedName = form.name.trim();
	const isDuplicateName = useMemo(() => {
		if (!trimmedName) return false;
		return technologies.some((tech) => {
			const sameName = tech.name.trim().toLowerCase() ===
				trimmedName.toLowerCase();
			const isSameItem = editingId ? tech.id === editingId : false;
			return sameName && !isSameItem;
		});
	}, [technologies, trimmedName, editingId]);

	const nameError = useMemo(() => {
		if (!trimmedName) return "El nombre es obligatorio";
		if (trimmedName.length < 2) return "Minimo 2 caracteres";
		if (trimmedName.length > 50) return "Maximo 50 caracteres";
		if (isDuplicateName) return "Ya existe una tecnologia con ese nombre";
		return "";
	}, [trimmedName, isDuplicateName]);

	const trimmedIconUrl = form.icon_url?.trim() || "";
	const iconUrlError = useMemo(() => {
		if (!trimmedIconUrl) return "";
		if (trimmedIconUrl.length > 300) return "Maximo 300 caracteres";
		if (!/^https?:\/\//i.test(trimmedIconUrl)) {
			return "Debe ser una URL valida";
		}
		return "";
	}, [trimmedIconUrl]);

	const handleOpenCreate = () => {
		setIsEdit(false);
		setEditingId(null);
		setForm(emptyForm);
		setDialogOpen(true);
		setError("");
		setSuccess("");
		setValidationMessage("");
	};

	const handleOpenEdit = (tech: TechnologyResponse) => {
		setIsEdit(true);
		setEditingId(tech.id);
		setForm({
			name: tech.name,
			category: tech.category,
			icon_url: tech.icon_url ?? "",
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

	const handleChange = (
		field: keyof TechnologyCreateRequest,
		value: string
	) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleCategoryChange = (value: TechnologyCategory) => {
		setForm((prev) => ({ ...prev, category: value }));
	};

	const handleSubmit = async (event?: SyntheticEvent) => {
		event?.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");
		setValidationMessage("");

		if (nameError || iconUrlError) {
			setValidationMessage("Corrige los campos marcados antes de guardar");
			setSaving(false);
			return;
		}

		try {
			const payload: TechnologyCreateRequest = {
				name: trimmedName,
				category: form.category,
				icon_url: trimmedIconUrl || null,
			};

			if (isEdit && editingId) {
				const updatePayload: TechnologyUpdateRequest = payload;
				const updated = await technologyService.updateTechnology(
					editingId,
					updatePayload
				);
				setTechnologies((prev) =>
					prev.map((tech) => (tech.id === updated.id ? updated : tech))
				);
				setSuccess("Tecnologia actualizada correctamente");
			} else {
				const created = await technologyService.createTechnology(payload);
				setTechnologies((prev) => [created, ...prev]);
				setSuccess("Tecnologia creada correctamente");
			}

			setDialogOpen(false);
		} catch (err) {
			const apiError = err as ApiError;
			setError(apiError.message || "No se pudo guardar la tecnologia");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (techId: number) => {
		setDeletingId(techId);
		setError("");
		setSuccess("");

		try {
			await technologyService.deleteTechnology(techId);
			setTechnologies((prev) => prev.filter((tech) => tech.id !== techId));
			setSuccess("Tecnologia eliminada correctamente");
		} catch (err) {
			const apiError = err as ApiError;
			setError(apiError.message || "No se pudo eliminar la tecnologia");
		} finally {
			setDeletingId(null);
		}
	};

	const handleRequestDelete = (tech: TechnologyResponse) => {
		setDeleteTarget(tech);
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

	const handleUploadIcon = async (file?: File) => {
		if (!file) return;
		setUploading(true);
		setError("");
		setSuccess("");

		try {
			const result = await cloudinaryService.uploadImage(file, "technology");
			setForm((prev) => ({ ...prev, icon_url: result.url }));
			setSuccess("Icono subido correctamente");
		} catch (err) {
			const apiError = err as ApiError;
			setError(apiError.message || "No se pudo subir el icono");
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
						Tecnologias
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Administra tu stack tecnico y su iconografia
					</Typography>
				</Box>

				<Stack direction="row" spacing={2} alignItems="center">
					<Chip
						label={`${technologies.length} tecnologias`}
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
						onClick={loadTechnologies}
						disabled={loading}
					>
						Recargar
					</Button>
					<Button
						variant="contained"
						startIcon={<Add />}
						onClick={handleOpenCreate}
					>
						Nueva tecnologia
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
					<Stack direction={{ xs: "column", md: "row" }} spacing={2}>
						<TextField
							fullWidth
							label="Buscar tecnologia"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<FormControl sx={{ minWidth: 200 }}>
							<InputLabel>Categoria</InputLabel>
							<Select
								value={categoryFilter}
								label="Categoria"
								onChange={(event) =>
									setCategoryFilter(
										event.target.value as TechnologyCategory | "ALL"
									)
								}
							>
								<MenuItem value="ALL">Todas</MenuItem>
								{Object.values(TechnologyCategory).map((category) => (
									<MenuItem key={category} value={category}>
										{categoryLabels[category]}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</CardContent>
			</Card>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			) : filteredTechnologies.length === 0 ? (
				<Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							No hay tecnologias registradas
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Crea una tecnologia para comenzar a mostrar tu stack.
						</Typography>
					</CardContent>
				</Card>
			) : viewMode === "table" ? (
				<Card elevation={2} sx={{ background: "rgba(26, 26, 26, 0.9)" }}>
					<TableContainer component={Paper} sx={{ background: "transparent" }}>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Icono</TableCell>
									<TableCell>Nombre</TableCell>
									<TableCell>Categoria</TableCell>
									<TableCell align="right">Acciones</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedTechnologies.map((tech) => (
									<TableRow key={tech.id} hover>
										<TableCell>
											<Avatar
												src={tech.icon_url || undefined}
												sx={{
													width: 40,
													height: 40,
													bgcolor: "rgba(0, 229, 255, 0.1)",
													color: "primary.main",
													border: "1px solid rgba(0, 229, 255, 0.2)",
												}}
											>
												<Code fontSize="small" />
											</Avatar>
										</TableCell>
										<TableCell>
											<Typography fontWeight={600}>
												{tech.name}
											</Typography>
											{tech.icon_url && (
												<Typography variant="caption" color="text.secondary">
													Icono configurado
												</Typography>
											)}
										</TableCell>
										<TableCell>
											<Chip
												size="small"
												color={getCategoryColor(tech.category)}
												label={categoryLabels[tech.category]}
												variant="outlined"
											/>
										</TableCell>
										<TableCell align="right">
											<Stack direction="row" spacing={1} justifyContent="flex-end">
												<Button
													variant="outlined"
													size="small"
													startIcon={<Edit />}
													onClick={() => handleOpenEdit(tech)}
												>
													Editar
												</Button>
												<Button
													variant="outlined"
													size="small"
													color="error"
													startIcon={
														deletingId === tech.id ? (
															<CircularProgress size={16} />
														) : (
															<Delete />
														)
													}
													onClick={() => handleRequestDelete(tech)}
													disabled={deletingId === tech.id}
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
						count={filteredTechnologies.length}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[6, 10, 20]}
					/>
				</Card>
			) : (
				<Stack spacing={2}>
					{paginatedTechnologies.map((tech) => (
						<Card
							key={tech.id}
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
											src={tech.icon_url || undefined}
											sx={{
												width: 56,
												height: 56,
												bgcolor: "rgba(0, 229, 255, 0.1)",
												color: "primary.main",
												border: "1px solid rgba(0, 229, 255, 0.2)",
											}}
										>
											<Code />
										</Avatar>
										<Box>
											<Typography variant="h6" fontWeight={600}>
												{tech.name}
											</Typography>
											<Stack direction="row" spacing={1} alignItems="center">
												<Chip
													size="small"
													color={getCategoryColor(tech.category)}
													label={categoryLabels[tech.category]}
													variant="outlined"
												/>
												{tech.icon_url && (
													<Chip
														size="small"
														label="Icono"
														variant="outlined"
													/>
												)}
											</Stack>
										</Box>
									</Stack>
									<CardActions sx={{ p: 0 }}>
										<Button
											variant="outlined"
											startIcon={<Edit />}
											onClick={() => handleOpenEdit(tech)}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="error"
											startIcon={
												deletingId === tech.id ? (
													<CircularProgress size={16} />
												) : (
													<Delete />
												)
											}
											onClick={() => handleRequestDelete(tech)}
											disabled={deletingId === tech.id}
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
						count={filteredTechnologies.length}
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
					{isEdit ? "Editar tecnologia" : "Nueva tecnologia"}
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
								label="Nombre"
								value={form.name}
								onChange={(event) => handleChange("name", event.target.value)}
								required
								fullWidth
								error={Boolean(nameError)}
								helperText={nameError || "2 a 50 caracteres"}
							/>
							<FormControl fullWidth>
								<InputLabel>Categoria</InputLabel>
								<Select
									value={form.category}
									label="Categoria"
									onChange={(event) =>
										handleCategoryChange(
											event.target.value as TechnologyCategory
										)
									}
								>
									{Object.values(TechnologyCategory).map((category) => (
										<MenuItem key={category} value={category}>
											{categoryLabels[category]}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Divider />

							<Stack spacing={1}>
								<TextField
									label="URL del icono"
									value={form.icon_url}
									onChange={(event) =>
										handleChange("icon_url", event.target.value)
									}
									fullWidth
									error={Boolean(iconUrlError)}
									helperText={iconUrlError || "Opcional. https://..."}
								/>
								<Stack direction="row" spacing={2} alignItems="center">
									<Button
										variant="outlined"
										component="label"
										startIcon={
											uploading ? <CircularProgress size={16} /> : <ImageIcon />
										}
										disabled={uploading}
									>
										{uploading ? "Subiendo..." : "Subir icono"}
										<input
											hidden
											type="file"
											accept="image/*"
											onChange={(event) =>
												handleUploadIcon(event.target.files?.[0])
											}
										/>
									</Button>
									<Avatar
										src={form.icon_url || undefined}
										sx={{
											width: 44,
											height: 44,
											bgcolor: "rgba(0, 229, 255, 0.1)",
											color: "primary.main",
											border: "1px solid rgba(0, 229, 255, 0.2)",
										}}
									>
										<Code fontSize="small" />
									</Avatar>
								</Stack>
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
						disabled={saving || Boolean(nameError) || Boolean(iconUrlError)}
					>
						{isEdit ? "Guardar cambios" : "Crear tecnologia"}
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
							? `Eliminar tecnologia "${deleteTarget.name}"? Esta accion no se puede deshacer.`
							: "Eliminar tecnologia?"}
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
						startIcon={
							deletingId ? <CircularProgress size={16} /> : <Delete />
						}
					>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
