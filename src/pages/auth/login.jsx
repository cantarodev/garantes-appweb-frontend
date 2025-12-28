import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useAuth } from 'src/hooks/use-auth';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { paths } from 'src/paths';
import { Alert, IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { CheckCircleOutline } from '@mui/icons-material';

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Debe ser un correo electrónico válido')
    .max(255)
    .required('Correo electrónico es requerido'),
  password: Yup.string().max(255).required('Se requiere contraseña'),
});

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchValue, setSearchValue] = useState({ error: false, resp: '', email: '' });
  const [color, setColor] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = useLocation();
  const returnTo = searchParams.get('returnTo');
  const { issuer, signIn } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.email, values.password);

        if (isMounted()) {
          router.push(returnTo || paths.dashboard.analytics.seace);
        }
      } catch (err) {
        console.error(err.message);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  const handleTogglePassowrdVisibility = () => {
    setShowPassword(!showPassword);
  };

  const updateUrl = () => {
    if (searchParams.size > 0) {
      const errorValue = searchParams.get('error') === 'false' ? false : true;
      const respValue = searchParams.get('resp');
      const emailValue = searchParams.get('email');
      formik.setFieldValue('email', emailValue);
      setSearchValue({ error: errorValue, resp: respValue, email: emailValue || '' });
      setColor(errorValue ? 'error' : 'success');
    }
  };

  useEffect(() => {
    updateUrl();
  }, []);

  useEffect(() => {
    const newUrl = `${window.location.origin}${location.pathname}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

  useEffect(() => {
    if (searchValue.resp) {
      setShowAlert(true);
      const timeoutId = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [searchValue.resp]);

  return (
    <>
      <Seo title="Acceso" />
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography
                color="text.secondary"
                variant="body2"
              >
                ¿No tienes una cuenta? &nbsp;
                <Link
                  component={RouterLink}
                  href={paths.auth.register}
                  underline="hover"
                  variant="subtitle2"
                >
                  Registrar
                </Link>
              </Typography>
            }
            sx={{ pb: 0 }}
            title="Inicio de sesión"
          />
          <CardContent>
            {showAlert && (
              <Alert
                icon={<CheckCircleOutline fontSize="inherit" />}
                variant="filled"
                severity={color}
                sx={{ mb: 3 }}
              >
                {searchValue.resp}
              </Alert>
            )}
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo electrónico"
                  name="email"
                  onBlur={formik.handleBlur}
                  type="email"
                  value={formik.values.email || searchValue.email}
                  onChange={formik.handleChange}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Contraseña"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password || ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          arial-label="Alternar visibilidad de contraseña"
                          onClick={handleTogglePassowrdVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
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
                Iniciar sesión
              </Button>
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{ mt: 2, textAlign: 'center' }}
              >
                o &nbsp;
                <Link
                  component={RouterLink}
                  href={paths.auth.forgotPassword}
                  underline="hover"
                  variant="subtitle2"
                >
                  He olvidado la contraseña
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
