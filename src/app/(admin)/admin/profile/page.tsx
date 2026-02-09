'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import {
  Save,
  Person,
  Refresh,
  Image as ImageIcon,
  PictureAsPdf,
} from '@mui/icons-material';
import { profileService } from '@/services/profileService';
import { cloudinaryService } from '@/services/cloudinaryService';
import { ProfileCreateRequest, ProfileResponse, ProfileUpdateRequest } from '@/types';
import { ApiError } from '@/services/api';

const emptyForm: ProfileCreateRequest = {
  name: '',
  last_name: '',
  current_title: '',
  bio_summary: '',
  location: 'Cochabamba, Bolivia',
  phone: '',
  photo_url: '',
  profile: '',
  cv_url: '',
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [form, setForm] = useState<ProfileCreateRequest>(emptyForm);
  const [uploadingCV, setUploadingCV] = useState(false);

  const hasPhoto = useMemo(() => !!form.photo_url?.trim(), [form.photo_url]);
  const hasCV = useMemo(() => !!form.cv_url?.trim(), [form.cv_url]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
      setForm({
        name: data.name,
        last_name: data.last_name,
        current_title: data.current_title ?? '',
        bio_summary: data.bio_summary ?? '',
        location: data.location ?? '',
        phone: data.phone ?? '',
        photo_url: data.photo_url ?? '',
        profile: data.profile ?? '',
        cv_url: data.cv_url ?? '',
      });
      setIsNew(false);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 404) {
        setIsNew(true);
        setProfile(null);
        setForm(emptyForm);
      } else {
        setError(apiError.message || 'No se pudo cargar el perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field: keyof ProfileCreateRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Normalizar payload: convertir strings vacíos a null para ambos casos (crear y actualizar)
      const payload: ProfileCreateRequest | ProfileUpdateRequest = {
        name: form.name,
        last_name: form.last_name,
        current_title: form.current_title || null,
        bio_summary: form.bio_summary || null,
        location: form.location || null,
        phone: form.phone || null,
        photo_url: form.photo_url || null,
        profile: form.profile || null,
        cv_url: form.cv_url || null,
      };

      if (isNew) {
        const created = await profileService.createProfile(payload as ProfileCreateRequest);
        setProfile(created);
        setIsNew(false);
        setSuccess('Perfil creado correctamente');
      } else {
        const updated = await profileService.updateMyProfile(payload as ProfileUpdateRequest);
        setProfile(updated);
        setSuccess('Perfil actualizado correctamente');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'No se pudo guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = async (file?: File) => {
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await cloudinaryService.uploadImage(file, 'profile');
      setForm((prev) => ({ ...prev, photo_url: result.url }));
      setSuccess('Imagen subida correctamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadCV = async (file?: File) => {
    if (!file) return;

    setUploadingCV(true);
    setError('');
    setSuccess('');

    try {
      const result = await cloudinaryService.uploadPDF(file, 'cv');
      setForm((prev) => ({ ...prev, cv_url: result.url }));
      setSuccess('CV subido correctamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'No se pudo subir el CV');
    } finally {
      setUploadingCV(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #00e5ff 0%, #00bcd4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Person sx={{ fontSize: 40, color: 'primary.main' }} />
            Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona la información principal de tu portfolio
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={isNew ? 'Sin perfil' : 'Perfil activo'}
            color={isNew ? 'warning' : 'success'}
            variant="outlined"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadProfile}
            disabled={loading}
          >
            Recargar
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card elevation={3} sx={{ background: 'rgba(26, 26, 26, 0.9)' }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
                <Box sx={{ minWidth: 180, textAlign: 'center' }}>
                  <Avatar
                    src={hasPhoto ? form.photo_url || undefined : undefined}
                    sx={{
                      width: 140,
                      height: 140,
                      margin: '0 auto 16px',
                      bgcolor: 'rgba(0, 229, 255, 0.1)',
                      color: 'primary.main',
                      border: '1px solid rgba(0, 229, 255, 0.2)',
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48 }} />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Imagen de perfil
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    startIcon={uploading ? <CircularProgress size={16} /> : <ImageIcon />}
                    disabled={uploading}
                  >
                    {uploading ? 'Subiendo...' : 'Subir foto'}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadPhoto(e.target.files?.[0])}
                    />
                  </Button>
                </Box>

                <Stack direction="column" spacing={2} sx={{ flex: 1 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={form.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      required
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    label="Título Actual"
                    value={form.current_title}
                    onChange={(e) => handleChange('current_title', e.target.value)}
                    placeholder="Backend Developer, Full Stack, etc."
                  />

                  <TextField
                    fullWidth
                    label="Ubicación"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </Stack>
              </Stack>

              <Stack direction="column" spacing={2}>
                <TextField
                  fullWidth
                  label="Biografía"
                  value={form.bio_summary}
                  onChange={(e) => handleChange('bio_summary', e.target.value)}
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${form.bio_summary?.length || 0}/500 caracteres`}
                />

                <TextField
                  fullWidth
                  label="Resumen de Perfil"
                  value={form.profile}
                  onChange={(e) => handleChange('profile', e.target.value)}
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 2000 }}
                  helperText={`${form.profile?.length || 0}/2000 caracteres - Resumen de lo que haces`}
                />

                <Box sx={{ 
                  p: 3, 
                  border: '1px solid rgba(0, 229, 255, 0.2)', 
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 229, 255, 0.05)'
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PictureAsPdf sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Curriculum Vitae (PDF)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {hasCV ? (
                          <a 
                            href={form.cv_url || ''} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#00e5ff', textDecoration: 'underline' }}
                          >
                            Ver CV actual
                          </a>
                        ) : (
                          'No hay CV cargado'
                        )}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={uploadingCV ? <CircularProgress size={16} /> : <PictureAsPdf />}
                      disabled={uploadingCV}
                    >
                      {uploadingCV ? 'Subiendo...' : 'Subir CV'}
                      <input
                        hidden
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(e) => handleUploadCV(e.target.files?.[0])}
                      />
                    </Button>
                  </Stack>
                </Box>
              </Stack>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  disabled={saving}
                >
                  {isNew ? 'Crear Perfil' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
