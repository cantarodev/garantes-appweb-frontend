import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { verifyAccount } from 'src/api/auth/authApi';
import { CircularProgress } from '@mui/material';

const Page = () => {
  const { user_id, token } = useParams();
  const [message, setMessage] = useState('Esperando respuesta');
  const [success, setSuccess] = useState(false);
  const [respVerifyLink, setRespVerifyLink] = useState({ status: '', message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const response = await verifyAccount(user_id, token);
      if (response) {
        setMessage(response.message);
        if (response.status == 'SUCCESS') {
          setSuccess(true);
        }
      }
      setLoading(false);
    };
    verify();
  }, [user_id, token]);

  return (
    <>
      <Seo title="Verificar" />
      {!loading ? (
        <div>
          <Box sx={{ mb: 2 }}>
            <Link
              color="text.primary"
              component={RouterLink}
              href={success ? paths.index : paths.auth.register}
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
              }}
              underline="hover"
            >
              <SvgIcon sx={{ mr: 1 }}>
                <ArrowLeftIcon />
              </SvgIcon>
              <Typography variant="subtitle2">
                {success ? 'Inicio de sesión' : 'Registro'}
              </Typography>
            </Link>
          </Box>
          <Card elevation={16}>
            <CardHeader
              sx={{ pb: 0 }}
              title="Verificación de Cuenta"
            />
            <CardContent>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <SvgIcon sx={{ mr: 1, fontSize: 60 }}>
                  {success ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                </SvgIcon>
              </Box>
              <Typography color="text.secondary">{message}</Typography>
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
