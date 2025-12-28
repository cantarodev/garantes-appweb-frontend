import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CircularProgress, FormHelperText, IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useRouter } from 'src/hooks/use-router';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { resetPassword, verifyLink } from 'src/api/auth/authApi';

const initialValues = {
  password: '',
  passwordConfirm: '',
};

const validationSchema = Yup.object({
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
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Se requiere confirmar contraseña'),
});

const Page = () => {
  const [respVerifyLink, setRespVerifyLink] = useState({ status: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { user_id, token } = useParams();
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      const response = await resetPassword(user_id, token, formik.values.passwordConfirm);
      console.log(response);

      if (response.status != 'success') {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: response.message });
        helpers.setSubmitting(false);
        return;
      }

      router.push(
        paths.index + `?error=${false}&resp=${response.message}&email=${response.data.email}`
      );
    },
  });

  const handleTogglePassowrdVisibility = (opt) => {
    if (opt == 'show-pass') setShowPassword(!showPassword);
    if (opt == 'show-pass-confirm') setShowPasswordConfirm(!showPasswordConfirm);
  };

  useEffect(() => {
    const verifyLinkReset = async (user_id, token) => {
      try {
        const response = await verifyLink(user_id, token);
        setRespVerifyLink(response);
      } catch (error) {
        router.push(paths.index + `?error=${true}&resp=${error.message}`);
      }
    };
    verifyLinkReset(user_id, token);
  }, []);

  return (
    <>
      <Seo title="Restablecer Contraseña" />
      {respVerifyLink.status == 'success' ? (
        <div>
          <Box sx={{ mb: 2 }}>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.index}
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
              }}
              underline="hover"
            >
              <SvgIcon sx={{ mr: 1 }}>
                <ArrowLeftIcon />
              </SvgIcon>
              <Typography variant="subtitle2">Inicio de sesión</Typography>
            </Link>
          </Box>
          <Card elevation={16}>
            <CardHeader
              sx={{ pb: 0 }}
              title="Restablecer la contraseña"
            />
            <CardContent>
              {respVerifyLink.status == 'success' ? (
                <form
                  noValidate
                  onSubmit={formik.handleSubmit}
                >
                  <Stack spacing={3}>
                    <TextField
                      error={!!(formik.touched.password && formik.errors.password)}
                      fullWidth
                      helperText={formik.touched.password && formik.errors.password}
                      label="Contraseña nueva"
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
                              onClick={() => handleTogglePassowrdVisibility('show-pass')}
                              edge="end"
                            >
                              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      error={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)}
                      fullWidth
                      helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                      label="Contraseña nueva (Confirmar)"
                      name="passwordConfirm"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type={showPasswordConfirm ? 'text' : 'password'}
                      value={formik.values.passwordConfirm}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              arial-label="Alternar visibilidad de contraseña"
                              onClick={() => handleTogglePassowrdVisibility('show-pass-confirm')}
                              edge="end"
                            >
                              {showPasswordConfirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                    Restablecer
                  </Button>
                </form>
              ) : (
                <Typography color="text.secondary">{respVerifyLink.message}</Typography>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default Page;
