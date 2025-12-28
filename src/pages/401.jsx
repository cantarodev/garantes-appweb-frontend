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
      <Seo title="Error: Autorización requerida" />
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
              alt="Not authorized"
              component="img"
              src="/assets/errors/error-401.png"
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
            401: Autorización requerida
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Intentaste acceder a una ruta no permitida o llegaste aquí por error. Sea cual sea el
            caso, intenta usar la navegación.
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
