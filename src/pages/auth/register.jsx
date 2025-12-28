import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useRef, useState } from 'react';
import { authApi } from 'src/api/auth/authService';

const initialValues = {
  name: '',
  lastname: '',
  dni: '',
  phone: '',
  address: '',
  email: '',
  password: '',
  policy: false,
  submit: null,
};

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z]+$/, 'El nombre solo puede contener letras')
    .max(255)
    .required('Se requiere nombre'),
  lastname: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Los apellidos solo pueden contener letras')
    .max(255)
    .required('Se requiere apellido completo'),
  dni: Yup.string()
    .matches(/^[0-9]+$/, 'Solo se permiten números')
    .max(255)
    .required('Se requiere documento de identidad'),
  phone: Yup.string().max(255).required('Se requiere un número telefónico'),
  address: Yup.string().max(255),
  email: Yup.string()
    .email('Debe ser un correo electrónico válido')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Debe ser un correo electrónico válido')
    .max(255)
    .required('Correo electrónico es requerido'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255)
    .required('Se requiere contraseña')
    .test('has-uppercase', 'La contraseña debe contener al menos una letra mayúscula', (value) =>
      /[A-Z]/.test(value)
    )
    .test('has-digit', 'La contraseña debe contener al menos un número', (value) =>
      /\d/.test(value)
    )
    .test(
      'has-special-char',
      'La contraseña debe contener al menos un carácter especial',
      (value) => /[!@#$%^&*()_+]/.test(value)
    ),
  policy: Yup.boolean().oneOf([true], 'Este campo debe ser marcado'),
});

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const lastFetchedDniRef = useRef('');
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const isMounted = useMounted();
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await authApi.signUp(values);
        if (isMounted()) {
          router.push(paths.auth.emailSent + '/' + formik.values.email);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDniChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    formik.setFieldValue('dni', onlyDigits.slice(0, 8));
  };

  return (
    <>
      <Seo title="Registro" />
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography
                color="text.secondary"
                variant="body2"
              >
                ¿Ya tienes una cuenta? &nbsp;
                <Link
                  component={RouterLink}
                  href={paths.index}
                  underline="hover"
                  variant="subtitle2"
                >
                  Iniciar sesión
                </Link>
              </Typography>
            }
            sx={{ pb: 0 }}
            title="Registro"
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  size={{ sm: 12 }}
                >
                  <TextField
                    error={!!(formik.touched.dni && formik.errors.dni)}
                    fullWidth
                    helperText={(formik.touched.dni && formik.errors.dni) || apiError || ''}
                    label="Documento de identidad"
                    name="dni"
                    onBlur={formik.handleBlur}
                    onChange={handleDniChange}
                    value={formik.values.dni}
                  />
                </Grid>
                <Grid
                  item
                  size={{ xs: 12, sm: 6 }}
                >
                  <TextField
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    label="Nombre"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                </Grid>
                <Grid
                  item
                  size={{ xs: 12, sm: 6 }}
                >
                  <TextField
                    error={!!(formik.touched.lastname && formik.errors.lastname)}
                    fullWidth
                    helperText={formik.touched.lastname && formik.errors.lastname}
                    label="Apellidos"
                    name="lastname"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.lastname}
                  />
                </Grid>

                <Grid
                  item
                  size={{ xs: 12, sm: 6 }}
                >
                  <TextField
                    error={!!(formik.touched.phone && formik.errors.phone)}
                    fullWidth
                    helperText={formik.touched.phone && formik.errors.phone}
                    label="Teléfono"
                    name="phone"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                </Grid>
                <Grid
                  item
                  size={{ xs: 12, sm: 6 }}
                >
                  <TextField
                    error={!!(formik.touched.address && formik.errors.address)}
                    fullWidth
                    helperText={formik.touched.address && formik.errors.address}
                    label="Dirección"
                    name="address"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.address}
                  />
                </Grid>

                <Grid
                  item
                  size={{ sm: 12 }}
                >
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Correo electrónico"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                </Grid>
                <Grid
                  item
                  size={{ sm: 12 }}
                >
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Contraseña"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            arial-label="Alternar visibilidad de contraseña"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  ml: -1,
                  mt: 1,
                }}
              >
                <Checkbox
                  checked={formik.values.policy}
                  name="policy"
                  onChange={formik.handleChange}
                />
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  He leído los{' '}
                  <Link
                    component="a"
                    href="#"
                  >
                    Términos y Condiciones
                  </Link>
                </Typography>
              </Box>
              {!!(formik.touched.policy && formik.errors.policy) && (
                <FormHelperText error>{formik.errors.policy}</FormHelperText>
              )}
              {formik.errors.submit && (
                <FormHelperText
                  error
                  sx={{ mt: 3 }}
                >
                  {formik.errors.submit}
                </FormHelperText>
              )}
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                Registrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
