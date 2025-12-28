import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import { useParams } from 'react-router';

const initialValues = {
  code: '',
};

const validationSchema = Yup.object({
  code: Yup.string().min(6).max(6).required('Code is required'),
});

const Page = () => {
  const { email } = useParams();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {},
  });

  return (
    <>
      <Seo title="Correo Enviado" />
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
            title="Confirmación de Cuenta"
          />
          <CardContent>
            <Typography color="text.secondary">
              Le enviamos un correo electrónico con su enlace de confirmación a: <b>{email}</b>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
