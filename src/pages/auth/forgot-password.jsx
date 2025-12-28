import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/hooks/use-router';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import { forgotPassword } from 'src/api/auth/authApi';
import { FormHelperText } from '@mui/material';

const initialValues = {
  email: '',
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Debe ser un correo electrónico válido')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Debe ser un correo electrónico válido')
    .max(255)
    .required('Correo electronico es requerido'),
});

const Page = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      const redirectUrl = `${import.meta.env.VITE_FRONT_URL}/auth/reset-password`;
      const email = formik.values.email;
      const { status, message } = await forgotPassword(email, redirectUrl);

      if (status != 'success') {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: message });
        helpers.setSubmitting(false);
        return;
      }

      router.push(paths.index + `?email=${email}&error=${false}&resp=${message}`);
    },
  });

  return (
    <>
      <Seo title="Recuperar Contraseña" />
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
            title="¿Olvidó su contraseña?"
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <small>
                Introduce tu dirección de correo electrónico para recibir instrucciones para crear
                una contraseña nueva.
              </small>
              <TextField
                autoFocus
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Correo electrónico"
                name="email"
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
                sx={{ mt: 2 }}
              />
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
                Enviar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
