import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));

  usePageView();

  return (
    <>
      <Seo title="Error: Error de sevidor" />
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          py: '80px',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 6,
            }}
          >
            <Box
              alt="Internal server error"
              component="img"
              src="/assets/errors/error-500.png"
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 400,
              }}
            />
          </Box>
          <Typography
            align="center"
            variant={mdUp ? 'h1' : 'h4'}
          >
            500: Error Interno del Servidor
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Parece que intentaste acceder a una ruta incorrecta o te encontraste aquí por error. En
            cualquier caso, intenta navegar usando el menú.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Button
              component={RouterLink}
              href={paths.index}
            >
              Ir al inicio
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
